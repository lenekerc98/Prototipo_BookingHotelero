import type { MyReservation, ReservationStatus } from "./types";
import { isRequestExpired } from "./deadlines";

export function getReservationStatus(reservation: MyReservation, now = Date.now()): ReservationStatus {
  if (isRequestExpired(reservation, now)) return "expired";
  return reservation.status === "upcoming" ? "confirmed" : reservation.status;
}

export function canCancelReservation(reservation: MyReservation, now = Date.now()): boolean {
  return getReservationStatus(reservation, now) === "pending" || reservation.status === "upcoming";
}

export const reservationStatusLabels: Record<ReservationStatus, string> = {
  pending: "Pendiente de aceptación",
  confirmed: "Confirmada",
  validated: "Validada en recepción",
  completed: "Completada",
  cancelled: "Cancelada",
  rejected: "Rechazada",
  expired: "Vencida",
};

export function getPaymentLabel(reservation: Pick<MyReservation, "paymentStatus">): string {
  if (reservation.paymentStatus === "paid") return "Pago registrado";
  if (reservation.paymentStatus === "pending") return "Pago pendiente";
  return "Pago no verificado";
}

export function getReservationStyle(reservation: MyReservation) {
  const status = getReservationStatus(reservation);
  const warning = status === "pending";
  const inactive = status === "cancelled" || status === "rejected" || status === "expired";
  return {
    bg: warning ? "#fef3c7" : inactive ? "#fef2f2" : "#eff6ff",
    color: warning ? "#92400e" : inactive ? "#b91c1c" : "#1d4ed8",
    label: reservationStatusLabels[status],
  };
}
