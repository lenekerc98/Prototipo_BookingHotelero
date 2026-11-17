import { useState, type ReactNode } from "react";
import { tx } from "../../i18n";
import { useGuestReservations, useReservationSnapshot } from "../../app/useGuestReservations";
import { ArrivalTimeSettings } from "./ArrivalTimeSettings";
import { RequestDeadline } from "./RequestDeadline";
import { getRoomAvailability, reservationWorkflow, RESERVATIONS_CHANGED_EVENT } from "../../app/reservations";
import { getRoomOffers, saveRoomOffers, useRoomCatalogRevision } from "../../app/roomCatalog";
import { MANTA_HOTELS, type RoomOffer } from "../../mantaHotels";
import { addAuditLog, getActiveIvaPercent } from "../../hotelData";
import { resetLocalOperations } from "../../infrastructure/resetLocalOperations";
import { guestDirectory, hotelMetrics, localDate } from "./operations";
import { getPaymentLabel, getReservationStatus, reservationStatusLabels } from "./status";
import { ReservationVoucherModal } from "./ReservationSummary";
import { stayNights } from "./workflow";
import { ReceptionModal } from "../payments/ReceptionModal";
import { PaymentForm } from "../payments/ReceptionForms";
import { currentHotelReceipt } from "../payments/receipts";

const money = (value: number) => `US$${value.toFixed(2)}`;
const button = "rounded-lg border border-border px-3 py-2 text-sm font-semibold hover:bg-secondary cursor-pointer disabled:opacity-50 disabled:cursor-default";
const input = "w-full rounded-lg border border-border bg-background text-foreground px-3 py-2 text-sm";
const errorMessage = (error: unknown) => error instanceof Error ? error.message : "No se pudo guardar el cambio.";

function Box({ children }: { children: ReactNode }) {
  return <section className="rounded-xl border border-border bg-card text-foreground p-4 space-y-3">{children}</section>;
}
function Title({ title, detail }: { title: string; detail?: string }) {
  return <div><h1 className="text-2xl text-foreground">{tx(title)}</h1>{detail && <p className="text-sm text-muted-foreground mt-1">{tx(detail)}</p>}</div>;
}
function Stat({ label, value }: { label: string; value: string | number }) {
  return <Box><p className="text-sm text-muted-foreground">{tx(label)}</p><p className="text-2xl font-semibold" data-testid={label}>{value}</p></Box>;
}
function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block space-y-1 text-sm"><span>{tx(label)}</span>{children}</label>;
}

export function ReservationsView({ hotelId, hotelName, operator, canManagePayments = false, canConfigureArrival = false }: { hotelId: string; hotelName: string; operator: string; canManagePayments?: boolean; canConfigureArrival?: boolean }) {
  const snapshot = useReservationSnapshot();
  const reservations = snapshot.reservations.filter(item => item.hotelId === hotelId);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [code, setCode] = useState("");
  const [feedback, setFeedback] = useState("");
  const [voucherId, setVoucherId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [receptionId, setReceptionId] = useState<string | null>(null);
  const voucher = reservations.find(item => item.id === voucherId);
  function action(id: string, name: "accept" | "reject" | "validate") {
    try {
      const updated = reservationWorkflow[name](hotelId, id);
      setFeedback(`${updated.id}: ${tx(reservationStatusLabels[getReservationStatus(updated)])}. ${tx(getPaymentLabel(updated))}.`);
      addAuditLog({ usuario: operator, rol: "Operador", modulo: "Reservas", accion: name, detalle: `${hotelId} · ${id}`, hotelId, hotelName });
    } catch (error) { setFeedback(errorMessage(error)); }
  }
  const rows = reservations.filter(item => (filter === "all" || getReservationStatus(item) === filter) &&
    `${item.id} ${item.guestName} ${item.guestEmail} ${item.room}`.toLowerCase().includes(search.toLowerCase()));
  return <div className="space-y-5">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <Title title="Bandeja de Reservas" detail={`Establecimiento de esta bandeja: ${hotelName}`} />
      <button className={button} onClick={() => setCreating(true)}>{tx("+ Nueva Reserva")}</button>
    </div>
    <ArrivalTimeSettings hotelId={hotelId} canEdit={canConfigureArrival} />
    {snapshot.syncError && <p role="alert" className="text-sm text-destructive">{tx(snapshot.syncError)}</p>}
    <Box><form className="flex flex-wrap gap-2 items-end" onSubmit={event => { event.preventDefault(); action(code.trim().toUpperCase(), "validate"); }}>
      <Field label="Validar reserva por código de confirmación"><input className={input} placeholder="Ej: RES-003..." value={code} onChange={event => setCode(event.target.value)} required /></Field>
      <button className={button}>{tx("Validar")}</button>
    </form><p className="text-xs text-muted-foreground">{tx("Solo se puede validar una reserva aceptada por el hotel.")}</p></Box>
    {feedback && <p role="status" className="rounded-lg bg-secondary text-foreground p-3 text-sm">{feedback}</p>}
    <div className="flex flex-wrap gap-3">
      <input className={`${input} max-w-md`} aria-label="Buscar reservas" placeholder={tx("Buscar por huésped, tipo de habitación, código RES...")} value={search} onChange={event => setSearch(event.target.value)} />
      <select className={`${input} max-w-xs`} aria-label="Estado de reserva" value={filter} onChange={event => setFilter(event.target.value)}>
        <option value="all">{tx("Todas")}</option>{Object.entries(reservationStatusLabels).map(([key, label]) => <option key={key} value={key}>{tx(label)}</option>)}
      </select>
    </div>
    <Box><div className="overflow-x-auto"><table className="w-full text-sm text-left"><thead><tr>{["Código", "Huésped", "Tipo de Habitación", "Estancia", "Total", "Estado", "Acciones"].map(label => <th key={label} className="p-3 border-b border-border">{tx(label)}</th>)}</tr></thead>
      <tbody>{rows.map(item => <tr key={item.id} className="border-b border-border">
        <td className="p-3 font-mono text-xs break-all max-w-48">{item.id}</td>
        <td className="p-3"><p>{item.guestName}</p><p className="text-xs text-muted-foreground">{item.guestEmail}</p></td>
        <td className="p-3">{tx(item.room)}</td><td className="p-3 whitespace-nowrap">{item.checkIn} → {item.checkOut}</td><td className="p-3">{money(item.total)}</td>
        <td className="p-3"><p>{tx(reservationStatusLabels[getReservationStatus(item)])}</p><p className="text-xs text-muted-foreground">{tx(getPaymentLabel(item))}</p><RequestDeadline reservation={item} /></td>
        <td className="p-3"><div className="flex flex-wrap gap-2">
          {getReservationStatus(item) === "pending" && <><button className={button} onClick={() => action(item.id, "accept")}>{tx("Aceptar solicitud")}</button><button className={button} onClick={() => action(item.id, "reject")}>{tx("Rechazar solicitud")}</button></>}
          {getReservationStatus(item) === "confirmed" && <button className={button} title={tx("Validar reserva")} onClick={() => action(item.id, "validate")}>{tx("Validar")}</button>}
          <button className={button} onClick={() => setVoucherId(item.id)}>{tx("Voucher")}</button>
          {canManagePayments && (getReservationStatus(item) === "validated" || item.payment) && <button className={button} onClick={() => setReceptionId(item.id)}>{tx(item.payment || item.paymentStatus === "paid" ? "Cobro y comprobante" : "Cobrar")}</button>}
        </div></td>
      </tr>)}</tbody></table></div>{rows.length === 0 && <p className="py-6 text-muted-foreground">{tx("No se encontraron reservas con ese filtro")}. {tx("Las solicitudes que ingreses aparecerán aquí.")}</p>}</Box>
    {voucher && <ReservationVoucherModal res={voucher} onClose={() => setVoucherId(null)} />}
    {creating && <NewReservation hotelId={hotelId} onClose={() => setCreating(false)} />}
    {canManagePayments && receptionId && <ReceptionModal hotelId={hotelId} reservationId={receptionId} operator={operator} onClose={() => setReceptionId(null)} />}
  </div>;
}

function NewReservation({ hotelId, onClose }: { hotelId: string; onClose: () => void }) {
  const hotel = MANTA_HOTELS.find(item => item.id === hotelId);
  const rooms = getRoomOffers(hotelId);
  const [roomId, setRoomId] = useState(rooms[0]?.id ?? "");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [checkIn, setCheckIn] = useState(localDate());
  const [checkOut, setCheckOut] = useState("");
  const [error, setError] = useState("");
  const room = rooms.find(item => item.id === roomId);
  let total = 0;
  try {
    const base = Number((stayNights({ checkIn, checkOut }) * (room?.pricePerNight ?? 0)).toFixed(2));
    const tax = Number((base * getActiveIvaPercent(hotelId) / 100).toFixed(2));
    const service = hotel?.gravaServicio10 ? Number((base * 0.1).toFixed(2)) : 0;
    total = Number((base + tax + service).toFixed(2));
  } catch { /* Incomplete dates. */ }
  return <div className="fixed inset-0 z-50 bg-black/60 p-4 flex items-center justify-center"><form role="dialog" aria-label="Nueva reserva" className="bg-card text-foreground rounded-xl p-6 w-full max-w-lg space-y-3" onSubmit={event => {
    event.preventDefault();
    try {
      if (!hotel || !room) throw new Error("Configura primero las habitaciones de este hotel.");
      reservationWorkflow.submit({ id: `RES-${crypto.randomUUID().toUpperCase()}`, hotelId, hotel: hotel.name, city: hotel.city, image: room.image,
        room: room.type, guestName: name.trim(), guestEmail: email.trim(), checkIn, checkOut, total, adults: 1, children: 0 }, room);
      onClose();
    } catch (caught) { setError(errorMessage(caught)); }
  }}>
    <h2 className="text-xl">{tx("Nueva reserva")}</h2><p className="text-xs text-muted-foreground">Solicitud pendiente de aceptación. El importe incluye los impuestos configurados.</p>
    <Field label="Nombre del huésped"><input className={input} value={name} onChange={event => setName(event.target.value)} required /></Field>
    <Field label="Email"><input className={input} type="email" value={email} onChange={event => setEmail(event.target.value)} required /></Field>
    <Field label="Tipo de Habitación"><select className={input} value={roomId} onChange={event => setRoomId(event.target.value)} required>{rooms.map(offer => <option key={offer.id} value={offer.id}>{offer.type}</option>)}</select></Field>
    <Field label="Fecha de Entrada"><input className={input} type="date" value={checkIn} onChange={event => setCheckIn(event.target.value)} required /></Field>
    <Field label="Fecha de Salida"><input className={input} type="date" value={checkOut} min={checkIn} onChange={event => setCheckOut(event.target.value)} required /></Field>
    <p>{tx("Total")}: {money(total)}</p>{error && <p role="alert">{error}</p>}
    <div className="flex gap-2"><button type="button" className={button} onClick={onClose}>{tx("Cancelar")}</button><button className={button}>{tx("Guardar reserva")}</button></div>
  </form></div>;
}

export function RoomsView({ hotelId, onGoToGuestWeb, operator, canManagePayments = false }: { hotelId: string; onGoToGuestWeb?: () => void; operator: string; canManagePayments?: boolean }) {
  useRoomCatalogRevision();
  const reservations = useGuestReservations();
  const hotel = MANTA_HOTELS.find(item => item.id === hotelId);
  const rooms = getRoomOffers(hotelId);
  const [tab, setTab] = useState("reservations");
  const [checkIn, setCheckIn] = useState(localDate());
  const [checkOut, setCheckOut] = useState(localDate(new Date(Date.now() + 86400000)));
  const [editing, setEditing] = useState<RoomOffer | null>(null);
  const [error, setError] = useState("");
  return <div className="space-y-5"><Title title="Tipos de Habitación & Cupos Disponibles" detail={hotel?.name} />
    <div className="flex flex-wrap gap-2"><button className={button} onClick={() => setTab("reservations")}>Habitaciones reservadas</button><button className={button} onClick={() => setTab("inventory")}>Inventario en venta web</button><button className={button} onClick={onGoToGuestWeb}>Ver vista pública del huésped</button></div>
    {tab === "reservations" ? <ReservationsView hotelId={hotelId} hotelName={hotel?.name ?? hotelId} operator={operator} canManagePayments={canManagePayments} /> : <>
      <p className="text-sm text-muted-foreground">Capacidad de prueba configurable. Los cupos apartados se calculan con las solicitudes y reservas activas para las fechas elegidas; no representan habitaciones físicamente ocupadas.</p>
      <div className="flex flex-wrap gap-3"><Field label="Entrada para consultar cupos"><input className={input} type="date" value={checkIn} onChange={event => setCheckIn(event.target.value)} /></Field><Field label="Salida para consultar cupos"><input className={input} type="date" value={checkOut} min={checkIn} onChange={event => setCheckOut(event.target.value)} /></Field></div>
      {checkOut <= checkIn && <p role="alert">La salida debe ser posterior a la entrada.</p>}
      <div className="grid md:grid-cols-2 gap-4">{rooms.map(room => <Box key={room.id}>
        <h2 className="text-lg">{room.type}</h2><p>{money(room.pricePerNight)} / noche · {room.capacity} personas</p>
        <p>Cupo total configurado: {room.available}</p><p>Disponibles en estas fechas: {getRoomAvailability(hotelId, room, { checkIn, checkOut })}</p>
        <button className={button} onClick={() => { setEditing({ ...room }); setError(""); }}>Editar inventario</button>
      </Box>)}</div>
      {rooms.length === 0 && <Box>No hay tipos de habitación configurados para este establecimiento.</Box>}
      {editing && <Box><form className="space-y-3" onSubmit={event => { event.preventDefault(); try { saveRoomOffers(hotelId, rooms.map(room => room.id === editing.id ? editing : room), reservations); setEditing(null); } catch (caught) { setError(errorMessage(caught)); } }}>
        <h2 className="text-lg">Editar inventario: {editing.type}</h2>
        <Field label="Cupo total"><input type="number" min="0" step="1" className={input} value={editing.available} onChange={event => setEditing({ ...editing, available: Number(event.target.value) })} required /></Field>
        <Field label="Precio por noche"><input type="number" min="0" step="0.01" className={input} value={editing.pricePerNight} onChange={event => setEditing({ ...editing, pricePerNight: Number(event.target.value), originalPrice: undefined })} required /></Field>
        {error && <p role="alert">{error}</p>}<div className="flex gap-2"><button className={button}>Guardar inventario</button><button className={button} type="button" onClick={() => setEditing(null)}>Cancelar</button></div>
      </form></Box>}
    </>}
  </div>;
}

export function Dashboard({ hotelId, canReset = false }: { hotelId: string; canReset?: boolean }) {
  const reservations = useGuestReservations();
  const metrics = hotelMetrics(reservations, hotelId);
  const [resetOpen, setResetOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [feedback, setFeedback] = useState("");
  return <div className="space-y-5"><Title title="Panel de control" detail="Indicadores de las operaciones guardadas en este navegador y establecimiento." />
    <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3"><Stat label="Reservas registradas" value={metrics.reservations} /><Stat label="Solicitudes pendientes" value={metrics.pending} /><Stat label="Cobros registrados" value={money(metrics.totalCollected)} /><Stat label="Cupos apartados hoy" value={metrics.heldToday} /></div>
    <Box><p>Llegadas confirmadas de hoy: {metrics.arrivals}</p><p>Importe pendiente de reservas activas: {money(metrics.outstanding)}</p><p className="text-sm text-muted-foreground">Aceptar o validar una reserva no registra un pago. Las solicitudes pendientes apartan cupo para sus fechas.</p></Box>
    {canReset && <Box><h2 className="text-lg">Pruebas locales</h2><p className="text-sm">Puedes reiniciar reservas, fichas derivadas, vouchers, cobros e indicadores de todos los hoteles de este navegador. Se conserva el catálogo, el inventario configurado, los perfiles y los accesos.</p>
      <button className={button} onClick={() => setResetOpen(true)}>Reiniciar operaciones de prueba</button>
      {resetOpen && <form className="space-y-3" onSubmit={event => { event.preventDefault(); try { resetLocalOperations(); window.dispatchEvent(new Event(RESERVATIONS_CHANGED_EVENT)); window.dispatchEvent(new Event("alojamanta-audit-change")); setResetOpen(false); setConfirmation(""); setFeedback("Operaciones reiniciadas. Se guardó una copia local previa en este navegador."); } catch { setFeedback("No se pudo reiniciar. Revisa el almacenamiento del navegador."); } }}>
        <Field label="Escribe BORRAR para confirmar el reinicio de todos los hoteles"><input className={input} value={confirmation} onChange={event => setConfirmation(event.target.value)} /></Field>
        <button className={button} disabled={confirmation !== "BORRAR"}>Confirmar reinicio</button> <button type="button" className={button} onClick={() => setResetOpen(false)}>Cancelar</button>
      </form>}{feedback && <p role="status">{feedback}</p>}
    </Box>}
  </div>;
}

export function GuestsView({ hotelId }: { hotelId: string }) {
  const guests = guestDirectory(useGuestReservations(), hotelId);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const guest = guests.find(item => item.email === selected);
  return <div className="space-y-5"><Title title="Directorio de huéspedes" detail="Una ficha por correo y hotel, creada a partir de sus reservas. Solo se muestran datos ingresados." />
    <input className={input} aria-label="Buscar huéspedes" placeholder="Buscar por nombre o correo" value={search} onChange={event => setSearch(event.target.value)} />
    <div className="grid md:grid-cols-2 gap-4">{guests.filter(item => `${item.latest.guestName} ${item.email}`.toLowerCase().includes(search.toLowerCase())).map(item => <Box key={item.email}>
      <h2 className="text-lg">{item.latest.guestName}</h2><p>{item.email}</p><p>{item.history.length} reservas · {money(item.totalPaid)} con cobro registrado</p><button className={button} onClick={() => setSelected(item.email)}>Ver ficha</button>
    </Box>)}</div>{guests.length === 0 && <Box>No hay huéspedes registrados en este hotel. Crea una solicitud para comenzar.</Box>}
    {guest && <Box><div className="flex justify-between"><h2 className="text-xl">Ficha de {guest.latest.guestName}</h2><button className={button} onClick={() => setSelected(null)}>Cerrar ficha</button></div>
      <p>Teléfono: {guest.latest.guestPhone || "No registrado"}</p><p>Documento: {guest.latest.guestDocument ? `${guest.latest.guestDocumentType ?? ""} ${guest.latest.guestDocument}` : "No registrado"}</p>
      <p>Ciudad / país: {[guest.latest.guestCity, guest.latest.guestCountry].filter(Boolean).join(", ") || "No registrado"}</p><p>Dirección: {guest.latest.guestAddress || "No registrada"}</p>
      <p>Estancias completadas: {guest.completed}</p><h3>Historial de reservas</h3>{guest.history.map(item => <div className="border-t border-border py-2" key={item.id}><p className="break-all">{item.id} · {item.checkIn} → {item.checkOut}</p><p>{tx(reservationStatusLabels[getReservationStatus(item)])} · {tx(getPaymentLabel(item))}</p>{item.notes && <p>{item.notes}</p>}</div>)}
    </Box>}
  </div>;
}

export function BillingView({ hotelId, operator }: { hotelId: string; operator: string }) {
  const rows = useGuestReservations().filter(item => item.hotelId === hotelId);
  const [selected, setSelected] = useState<string | null>(null);
  const voucher = rows.find(item => item.id === selected);
  const [receptionId, setReceptionId] = useState<string | null>(null);
  return <div className="space-y-5"><Title title="Vouchers de reservas" detail="Cada resumen corresponde a una reserva ingresada. No se emiten facturas ni comprobantes tributarios en esta demostración." />
    {rows.length === 0 && <Box>No hay vouchers. Aparecerán al crear reservas.</Box>}
    {rows.map(item => <Box key={item.id}>
      <p className="break-all">{item.id} · {item.guestName}</p><p>{tx(reservationStatusLabels[getReservationStatus(item)])} · {money(item.total)} · {tx(getPaymentLabel(item))}</p>
      <p className="text-xs break-all">{currentHotelReceipt(item) ? `${tx("Comprobante del hotel")}: ${currentHotelReceipt(item)!.number}` : tx("Sin comprobante del hotel registrado")}</p>
      <div className="flex flex-wrap gap-2"><button className={button} onClick={() => setSelected(item.id)}>{tx("Ver voucher")}</button>
        {(item.payment || getReservationStatus(item) === "validated") && <button className={button} onClick={() => setReceptionId(item.id)}>{tx("Cobro y comprobante")}</button>}
      </div>
    </Box>)}
    {voucher && <ReservationVoucherModal res={voucher} onClose={() => setSelected(null)} />}
    {receptionId && <ReceptionModal hotelId={hotelId} reservationId={receptionId} operator={operator} onClose={() => setReceptionId(null)} />}
  </div>;
}

export function PaymentsView({ hotelId, operator }: { hotelId: string; operator: string }) {
  const rows = useGuestReservations().filter(item => item.hotelId === hotelId);
  const [selected, setSelected] = useState<string | null>(null);
  const [receptionId, setReceptionId] = useState<string | null>(null);
  const pending = rows.filter(item => getReservationStatus(item) === "validated" && item.paymentStatus !== "paid");
  const paid = rows.filter(item => item.payment);
  const target = pending.find(item => item.id === selected);
  return <div className="space-y-5"><Title title="Pasarela y cobros" detail="Registro manual de prueba. No mueve dinero ni genera enlaces de pago. La pasarela todavía no está conectada." />
    <Stat label="Total registrado" value={money(paid.reduce((sum, item) => sum + item.payment!.amount, 0))} />
    <Box><h2 className="text-lg">{tx("Reservas validadas pendientes de cobro")}</h2>{pending.length === 0 && <p>{tx("No hay reservas validadas pendientes de cobro.")}</p>}
      {pending.map(item => <div key={item.id} className="border-t border-border py-3 space-y-2"><p className="break-all">{item.id} · {item.guestName} · {money(item.total)}</p><button className={button} onClick={() => setSelected(item.id)}>{tx("Registrar cobro de prueba")}</button></div>)}
    </Box>
    {target && <Box><PaymentForm key={target.id} reservation={target} operator={operator} onSaved={() => setSelected(null)} onCancel={() => setSelected(null)} /></Box>}
    <Box><h2 className="text-lg">{tx("Cobros registrados")}</h2>{paid.length === 0 && <p>{tx("No hay cobros registrados.")}</p>}
      {paid.map(item => <div key={item.id} className="border-t border-border py-3 space-y-1"><p className="break-all">{item.id} · {item.guestName}</p><p>{money(item.payment!.amount)} · {tx(item.payment!.method)}</p><p className="text-xs text-muted-foreground">{item.payment!.recordedAt} · {item.payment!.recordedBy} · {item.payment!.reference || tx("Sin referencia")}</p>
        <button className={button} onClick={() => setReceptionId(item.id)}>{tx("Cobro y comprobante")}</button>
      </div>)}
    </Box>
    {receptionId && <ReceptionModal hotelId={hotelId} reservationId={receptionId} operator={operator} onClose={() => setReceptionId(null)} />}
  </div>;
}

export function RevenueView({ hotelId }: { hotelId: string }) {
  const rows = useGuestReservations().filter(item => item.hotelId === hotelId);
  const metrics = hotelMetrics(rows, hotelId);
  const months = new Map<string, number>();
  for (const row of rows) if (row.payment) { const month = row.payment.recordedAt.slice(0, 7); months.set(month, (months.get(month) ?? 0) + row.payment.amount); }
  const max = Math.max(1, ...months.values());
  return <div className="space-y-5"><Title title="Métricas del hotel" detail="Cobros por fecha de registro. Los importes de reservas pendientes no se cuentan como ingresos." />
    <div className="grid sm:grid-cols-3 gap-3"><Stat label="Reservas registradas" value={metrics.reservations} /><Stat label="Cobros registrados" value={money(metrics.totalCollected)} /><Stat label="Cobros del mes" value={money(metrics.monthCollected)} /></div>
    <Box><h2 className="text-lg">Cobros por mes</h2>{months.size === 0 && <p>No hay cobros para graficar.</p>}
      {[...months].sort(([a], [b]) => a.localeCompare(b)).map(([month, amount]) => <div key={month}><div className="flex justify-between text-sm"><span>{month}</span><span>{money(amount)}</span></div><div className="h-3 rounded bg-secondary mt-1"><div className="h-3 rounded bg-primary" style={{ width: `${amount / max * 100}%` }} /></div></div>)}
    </Box>
  </div>;
}
