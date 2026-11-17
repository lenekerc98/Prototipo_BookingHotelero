import type { GuestReservationRepository } from "./repositories";
import type { AvailabilityRoom, MyReservation, ReservationRequest, ReservationStay, ReservationStatus } from "./types";
import { canCancelReservation, getReservationStatus } from "./status";
import { isRequestExpired, portalRequestEligibility, responseDeadline } from "./deadlines";
import { currentHotelReceipt, hasRecordedFullPayment, validateReceiptInput, type HotelReceiptInput } from "../payments/receipts";

export function stayNights(stay: ReservationStay): number {
  const dates = [stay.checkIn, stay.checkOut].map(value => {
    const timestamp = Date.parse(`${value}T00:00:00Z`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(timestamp) ||
      new Date(timestamp).toISOString().slice(0, 10) !== value) {
      throw new Error("Revisa las fechas de entrada y salida.");
    }
    return timestamp;
  });
  const nights = (dates[1] - dates[0]) / 86400000;
  if (nights <= 0) throw new Error("La salida debe ser posterior a la entrada.");
  return nights;
}

export function countHeldRooms(reservations: MyReservation[], hotelId: string, roomId: string, stay: ReservationStay, now = Date.now()): number {
  stayNights(stay);
  const changes = new Map<string, number>();
  for (const reservation of reservations) {
    if (reservation.inventoryMode !== "nightly" || reservation.hotelId !== hotelId || reservation.roomId !== roomId ||
      !["pending", "confirmed", "validated"].includes(getReservationStatus(reservation, now)) ||
      reservation.checkIn >= stay.checkOut || reservation.checkOut <= stay.checkIn) continue;
    const start = reservation.checkIn > stay.checkIn ? reservation.checkIn : stay.checkIn;
    const end = reservation.checkOut < stay.checkOut ? reservation.checkOut : stay.checkOut;
    changes.set(start, (changes.get(start) ?? 0) + 1);
    changes.set(end, (changes.get(end) ?? 0) - 1);
  }
  let held = 0;
  let peak = 0;
  for (const [, change] of [...changes].sort(([left], [right]) => left.localeCompare(right))) {
    held += change;
    peak = Math.max(peak, held);
  }
  return peak;
}

export function createReservationWorkflow(options: {
  repository: GuestReservationRepository;
  getBaseAvailability: (hotelId: string, room: AvailabilityRoom) => number;
  initialReservations?: MyReservation[];
  onChange?: () => void;
  onLegacyCancel?: (reservation: MyReservation) => void;
  now?: () => string;
  getArrivalTime?: (hotelId: string) => string | null;
}) {
  const now = options.now ?? (() => new Date().toISOString());

  function read(): MyReservation[] {
    return options.repository.read() ?? options.initialReservations ?? [];
  }

  function expire(reservations: MyReservation[], timestamp: number): MyReservation[] {
    return reservations.map(reservation => isRequestExpired(reservation, timestamp)
      ? { ...reservation, status: "expired", expiredAt: new Date(responseDeadline(reservation)!).toISOString() }
      : reservation);
  }

  function list(): MyReservation[] {
    return expire(read(), Date.parse(now()));
  }

  function expirePending(notify = true) {
    const stored = read();
    const updated = expire(stored, Date.parse(now()));
    if (updated.some((reservation, index) => reservation !== stored[index])) {
      persist(updated);
      if (notify) options.onChange?.();
    }
  }

  function persist(reservations: MyReservation[]) {
    if (!options.repository.save(reservations)) {
      throw new Error("No se pudo guardar el cambio. Revisa el almacenamiento del navegador e inténtalo de nuevo.");
    }
  }

  function getAvailability(hotelId: string, room: AvailabilityRoom, stay: ReservationStay): number {
    try {
      return Math.max(0, options.getBaseAvailability(hotelId, room) - countHeldRooms(list(), hotelId, room.id, stay, Date.parse(now())));
    } catch {
      return 0;
    }
  }

  function submit(request: ReservationRequest, room: AvailabilityRoom, fromPortal = false): MyReservation {
    const nights = stayNights(request);
    if (!request.id || !request.hotelId || !room.id || !request.guestName.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(request.guestEmail) || !Number.isFinite(request.total) || request.total < 0) {
      throw new Error("Completa el nombre, correo y los datos de la solicitud.");
    }
    const createdAt = now();
    const eligibility = fromPortal ? portalRequestEligibility(request.checkIn, options.getArrivalTime?.(request.hotelId) ?? null, Date.parse(createdAt)) : null;
    expirePending();
    const reservations = list();
    const existing = reservations.find(reservation => reservation.id === request.id);
    if (existing) {
      if (existing.inventoryMode === "nightly" && existing.hotelId === request.hotelId && existing.roomId === room.id &&
        existing.checkIn === request.checkIn && existing.checkOut === request.checkOut &&
        existing.guestEmail === request.guestEmail && existing.total === request.total) return existing;
      throw new Error("El código de solicitud ya existe. Vuelve a abrir la reserva.");
    }
    if (eligibility && !eligibility.allowed) throw new Error(eligibility.message);
    const available = options.getBaseAvailability(request.hotelId, room) - countHeldRooms(reservations, request.hotelId, room.id, request, Date.parse(createdAt));
    if (!Number.isSafeInteger(available) || available < 1) throw new Error("No quedan cupos para esas fechas. Elige otra habitación o estancia.");
    const reservation: MyReservation = {
      ...request,
      nights,
      roomId: room.id,
      inventoryMode: "nightly",
      status: "pending",
      paymentStatus: "pending",
      createdAt,
      ...(eligibility?.arrivalAt ? { arrivalAt: eligibility.arrivalAt } : {}),
    };
    persist([reservation, ...reservations]);
    options.onChange?.();
    return reservation;
  }

  function transition(id: string, hotelId: string | null, target: ReservationStatus): MyReservation {
    expirePending();
    const reservations = list();
    const reservation = reservations.find(item => item.id === id && (hotelId === null || item.hotelId === hotelId));
    if (!reservation) throw new Error("No se encontró la reserva en este establecimiento.");
    const status = getReservationStatus(reservation, Date.parse(now()));
    if (status === "expired") throw new Error("La solicitud venció. Crea otra solicitud sujeta a disponibilidad; ya no puede aceptarse ni modificarse.");
    if (status === target) return reservation;
    const allowed = target === "cancelled" ? canCancelReservation(reservation, Date.parse(now())) :
      target === "validated" ? status === "confirmed" :
      (target === "confirmed" || target === "rejected") && status === "pending";
    if (!allowed) throw new Error("El estado actual no permite esta operación. Actualiza la lista y revisa la reserva.");
    const updated: MyReservation = {
      ...reservation,
      status: target,
      ...(target === "confirmed" ? { acceptedAt: now() } : {}),
      ...(target === "validated" ? { validatedAt: now() } : {}),
    };
    persist(reservations.map(item => item.id === id ? updated : item));
    if (target === "cancelled" && reservation.inventoryMode !== "nightly") options.onLegacyCancel?.(reservation);
    options.onChange?.();
    return updated;
  }

  // docs/CONTINUIDAD_ALOJAMANTA.md §4: métodos efectivo/tarjeta, pago completo y registro desde la reserva.
  function recordPayment(hotelId: string, id: string, details: Pick<NonNullable<MyReservation["payment"]>, "method" | "reference" | "recordedBy">) {
    const reservations = list();
    const reservation = reservations.find(item => item.id === id && item.hotelId === hotelId);
    if (!reservation || getReservationStatus(reservation) !== "validated") {
      throw new Error("Valida la reserva en recepción antes de registrar el cobro.");
    }
    if (reservation.payment || reservation.paymentStatus === "paid") throw new Error("Esta reserva ya tiene un pago registrado.");
    if (!["Efectivo", "Tarjeta externa"].includes(details.method) ||
      !details.recordedBy.trim() || (details.method !== "Efectivo" && !details.reference.trim()) ||
      !Number.isFinite(reservation.total) || reservation.total <= 0) {
      throw new Error("Revisa el importe, el operador y la referencia del cobro.");
    }
    const updated: MyReservation = {
      ...reservation, paymentStatus: "paid", payMethod: details.method,
      payment: { method: details.method, recordedBy: details.recordedBy.trim(), reference: details.reference.trim(), amount: reservation.total, recordedAt: now() },
    };
    persist(reservations.map(item => item.id === id ? updated : item));
    options.onChange?.();
    return updated;
  }

  // §4, Recorrido del hotel, paso 7: vincular el documento emitido por el hotel al cobro existente.
  // Registration/corrections share the reservation write; no fiscal document is issued here.
  function registerHotelReceipt(hotelId: string, id: string, details: HotelReceiptInput, expectedRevision: number) {
    const reservations = list();
    const reservation = reservations.find(item => item.id === id && item.hotelId === hotelId);
    if (!reservation) throw new Error("No se encontró la reserva en este establecimiento.");
    if (!hasRecordedFullPayment(reservation)) throw new Error("Registra el cobro completo antes de vincular el comprobante del hotel.");
    validateReceiptInput(details);
    const previous = currentHotelReceipt(reservation);
    const number = details.number.trim();
    if (previous && previous.kind === details.kind && previous.number === number && previous.issuedOn === details.issuedOn) return reservation;
    if (!Number.isSafeInteger(expectedRevision) || expectedRevision < 0 || expectedRevision !== (previous?.revision ?? 0)) {
      throw new Error("El comprobante cambió en otra vista. Cancela la edición y vuelve a abrirla antes de guardar.");
    }
    const updated: MyReservation = {
      ...reservation,
      receiptHistory: [...(reservation.receiptHistory ?? []), {
        kind: details.kind, number, issuedOn: details.issuedOn, recordedBy: details.recordedBy.trim(),
        recordedAt: now(), revision: expectedRevision + 1,
      }],
    };
    persist(reservations.map(item => item.id === id ? updated : item));
    options.onChange?.();
    return updated;
  }

  return {
    list, submit, expirePending, getAvailability, recordPayment, registerHotelReceipt,
    submitPortal: (request: ReservationRequest, room: AvailabilityRoom) => submit(request, room, true),
    accept: (hotelId: string, id: string) => transition(id, hotelId, "confirmed"),
    reject: (hotelId: string, id: string) => transition(id, hotelId, "rejected"),
    validate: (hotelId: string, id: string) => transition(id, hotelId, "validated"),
    cancel: (id: string) => transition(id, null, "cancelled"),
  };
}
