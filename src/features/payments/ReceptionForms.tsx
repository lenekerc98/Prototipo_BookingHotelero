import { useState } from "react";
import { useI18n } from "../../i18n";
import { reservationWorkflow } from "../../app/reservations";
import { addAuditLog } from "../../hotelData";
import { localDate } from "../reservations/operations";
import { getReservationStatus } from "../reservations/status";
import type { MyReservation } from "../reservations/types";
import { currentHotelReceipt, hasRecordedFullPayment, type HotelReceiptInput } from "./receipts";

const field = "mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground";
const submit = "rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-amber-400";
const secondary = "rounded-lg border border-border px-4 py-2 text-sm hover:bg-secondary";

export function PaymentForm({ reservation, operator, onSaved, onCancel }: {
  reservation: MyReservation; operator: string; onSaved: () => void; onCancel?: () => void;
}) {
  const tx = useI18n();
  const [method, setMethod] = useState<"Efectivo" | "Tarjeta externa">("Efectivo");
  const [reference, setReference] = useState("");
  const [error, setError] = useState("");
  if (reservation.payment || reservation.paymentStatus === "paid") return <p>{tx("Esta reserva ya tiene un pago registrado.")}</p>;
  if (getReservationStatus(reservation) !== "validated") return <p>{tx("Valida la reserva en recepción antes de registrar el cobro.")}</p>;
  return <form className="space-y-4" onSubmit={event => {
    event.preventDefault(); setError("");
    try {
      const saved = reservationWorkflow.recordPayment(reservation.hotelId, reservation.id, { method, reference, recordedBy: operator });
      addAuditLog({ usuario: operator, rol: "Recepción", modulo: "Cobros", accion: "REGISTRAR_COBRO_LOCAL", detalle: `${saved.id} · ${method} · US$${saved.total.toFixed(2)}`, hotelId: saved.hotelId, hotelName: saved.hotel });
      onSaved();
    } catch (caught) { setError(caught instanceof Error ? tx(caught.message) : tx("No se pudo guardar el cambio.")); }
  }}>
    <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4">
      <h3 className="font-semibold">{tx("Cobro completo en recepción")}</h3>
      <p className="text-2xl font-bold mt-1">US${reservation.total.toFixed(2)}</p>
      <p className="text-xs mt-1">{tx("Registro de demostración. No se mueve dinero ni se procesa una tarjeta.")}</p>
    </div>
    <label className="block text-sm">{tx("Método de cobro")}
      <select className={field} value={method} onChange={event => { setMethod(event.target.value as typeof method); setReference(""); }}>
        <option value="Efectivo">{tx("Efectivo")}</option><option value="Tarjeta externa">{tx("Tarjeta externa")}</option>
      </select>
    </label>
    {method === "Tarjeta externa" && <div className="rounded-lg border border-border bg-secondary p-3 text-xs space-y-2">
      <p>{tx("La pasarela está pendiente. Este registro representa un cobro externo de prueba; no ingreses datos de tarjeta.")}</p>
      <button type="button" disabled className="rounded border border-border px-3 py-2 opacity-60">{tx("Enlace de pago no disponible")}</button>
    </div>}
    <label className="block text-sm">{tx("Referencia del cobro")}
      <input className={field} value={reference} onChange={event => setReference(event.target.value)} required={method !== "Efectivo"} maxLength={120} />
    </label>
    <p className="text-xs text-muted-foreground">{tx("Responsable")}: {operator}</p>
    {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
    <div className="flex flex-wrap gap-2"><button className={submit}>{tx("Confirmar registro de prueba")}</button>{onCancel && <button type="button" className={secondary} onClick={onCancel}>{tx("Cancelar")}</button>}</div>
  </form>;
}

export function HotelReceiptForm({ reservation, operator }: { reservation: MyReservation; operator: string }) {
  const tx = useI18n();
  const receipt = currentHotelReceipt(reservation);
  const [editing, setEditing] = useState(!receipt);
  const [kind, setKind] = useState<HotelReceiptInput["kind"]>(receipt?.kind ?? "receipt");
  const [number, setNumber] = useState(receipt?.number ?? "");
  const [issuedOn, setIssuedOn] = useState(receipt?.issuedOn ?? localDate());
  const [revision, setRevision] = useState(receipt?.revision ?? 0);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  if (!hasRecordedFullPayment(reservation)) return <p className="text-sm text-muted-foreground">{tx("Registra el cobro completo antes de vincular el comprobante del hotel.")}</p>;

  function startEditing() {
    setKind(receipt?.kind ?? "receipt"); setNumber(receipt?.number ?? ""); setIssuedOn(receipt?.issuedOn ?? localDate());
    setRevision(receipt?.revision ?? 0); setFeedback(""); setError(""); setEditing(true);
  }

  return <div className="space-y-4">
    <h3 className="text-lg">{tx("Comprobante del hotel")}</h3>
    <p className="text-xs text-muted-foreground">{tx("Registra el número del documento del hotel. La aplicación no genera ni autoriza una factura tributaria.")}</p>
    {receipt && <div role="region" aria-label={tx("Comprobante vigente")} className="rounded-lg border border-border bg-secondary p-3 text-sm space-y-1">
      <p className="font-semibold break-all">{tx(receipt.kind === "invoice" ? "Factura del hotel" : "Recibo del hotel")}: {receipt.number}</p>
      <p>{tx("Fecha de emisión")}: {receipt.issuedOn}</p>
      <p className="text-xs">{tx("Registrado por")}: {receipt.recordedBy} · {receipt.recordedAt}</p>
    </div>}
    {!editing && <button type="button" className={secondary} onClick={startEditing}>{tx(receipt ? "Corregir comprobante" : "Registrar comprobante")}</button>}
    {feedback && <p role="status" className="text-sm">{feedback}</p>}
    {editing && <form className="space-y-3" onSubmit={event => {
      event.preventDefault(); setError(""); setFeedback("");
      try {
        const saved = reservationWorkflow.registerHotelReceipt(reservation.hotelId, reservation.id, { kind, number, issuedOn, recordedBy: operator }, revision);
        addAuditLog({ usuario: operator, rol: "Recepción", modulo: "Comprobantes", accion: revision ? "CORREGIR_COMPROBANTE" : "REGISTRAR_COMPROBANTE", detalle: `${saved.id} · ${number.trim()}`, hotelId: saved.hotelId, hotelName: saved.hotel });
        setEditing(false); setFeedback(tx("Comprobante vinculado a la reserva."));
      } catch (caught) { setError(caught instanceof Error ? tx(caught.message) : tx("No se pudo guardar el cambio.")); }
    }}>
      <label className="block text-sm">{tx("Tipo de comprobante")}<select className={field} value={kind} onChange={event => setKind(event.target.value as typeof kind)}><option value="receipt">{tx("Recibo del hotel")}</option><option value="invoice">{tx("Factura del hotel")}</option></select></label>
      <label className="block text-sm">{tx("Número de recibo o factura del hotel")}<input className={field} value={number} onChange={event => setNumber(event.target.value)} maxLength={80} required /></label>
      <label className="block text-sm">{tx("Fecha de emisión")}<input className={field} type="date" value={issuedOn} onChange={event => setIssuedOn(event.target.value)} required /></label>
      {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      <div className="flex flex-wrap gap-2"><button className={submit}>{tx("Guardar comprobante")}</button><button type="button" className={secondary} onClick={() => { setEditing(false); setError(""); }}>{tx("Cancelar edición")}</button></div>
    </form>}
    {(reservation.receiptHistory?.length ?? 0) > 0 && <details className="border-t border-border pt-3 text-xs">
      <summary className="cursor-pointer font-semibold">{tx("Historial del comprobante")}</summary>
      <ol className="space-y-2 mt-3">{reservation.receiptHistory!.map(entry => <li key={entry.revision} className="rounded-lg bg-secondary p-3 break-words">
        <p>{tx(entry.kind === "invoice" ? "Factura del hotel" : "Recibo del hotel")}: {entry.number}</p>
        <p>{tx("Fecha de emisión")}: {entry.issuedOn}</p><p>{entry.recordedBy} · {entry.recordedAt}</p>
      </li>)}</ol>
    </details>}
  </div>;
}
