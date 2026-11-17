import { useState } from "react";
import { useI18n } from "../../i18n";
import { useGuestReservations } from "../../app/useGuestReservations";
import { ReservationDialog } from "../reservations/ReservationDialog";
import { ReservationSummary } from "../reservations/ReservationSummary";
import { HotelReceiptForm, PaymentForm } from "./ReceptionForms";
import { hasRecordedFullPayment } from "./receipts";

export function ReceptionModal({ hotelId, reservationId, operator, onClose }: {
  hotelId: string; reservationId: string; operator: string; onClose: () => void;
}) {
  const tx = useI18n();
  const reservation = useGuestReservations().find(item => item.id === reservationId && item.hotelId === hotelId);
  const [tab, setTab] = useState<"voucher" | "reception">("reception");
  const [feedback, setFeedback] = useState("");
  return <ReservationDialog title={tx("Gestión en recepción")} onClose={onClose}>
    {!reservation ? <p className="p-5">{tx("No se encontró la reserva en este establecimiento.")}</p> : <>
      <div data-print-ui className="border-b border-border">
        <div className="px-5 pt-4 text-sm"><p className="font-semibold">{reservation.guestName} · {reservation.hotel}</p><p className="text-xs font-mono break-all text-muted-foreground mt-1">{reservation.id}</p></div>
        <div role="tablist" aria-label={tx("Detalle de recepción")} className="flex gap-4 px-5 pt-3">
          {([['voucher', 'Resumen de reserva'], ['reception', 'Cobro y comprobante']] as const).map(([key, label]) => <button key={key} type="button" role="tab" aria-selected={tab === key} className={`border-b-2 px-1 py-3 text-sm font-semibold ${tab === key ? 'border-amber-500 text-primary' : 'border-transparent text-muted-foreground'}`} onClick={() => setTab(key)}>{tx(label)}</button>)}
        </div>
      </div>
      <div role="tabpanel" aria-label={tx("Resumen de reserva")} className={`reservation-print-content p-4 sm:p-5 ${tab === "voucher" ? "" : "hidden"}`}><ReservationSummary reservation={reservation} /></div>
      {tab === "reception" && <div role="tabpanel" aria-label={tx("Cobro y comprobante")} data-print-ui className="p-4 sm:p-5 space-y-5">
        {feedback && <p role="status" className="rounded-lg bg-secondary p-3 text-sm">{feedback}</p>}
        {hasRecordedFullPayment(reservation) ? <div className="rounded-xl border border-emerald-600/40 bg-emerald-600/10 p-4 space-y-1">
          <h3 className="font-semibold">{tx("Pago registrado")}</h3><p className="text-xl font-bold">US${reservation.payment!.amount.toFixed(2)}</p>
          <p className="text-sm">{tx("Saldo pendiente")}: US$0.00</p>
          <p className="text-xs">{tx(reservation.payment!.method)} · {reservation.payment!.reference || tx("Sin referencia")}</p>
          <p className="text-xs">{tx("Registrado por")}: {reservation.payment!.recordedBy} · {reservation.payment!.recordedAt}</p>
        </div> : <PaymentForm reservation={reservation} operator={operator} onSaved={() => setFeedback(tx("Cobro registrado. Puedes vincular el comprobante del hotel."))} />}
        <HotelReceiptForm key={reservation.id} reservation={reservation} operator={operator} />
      </div>}
      <div data-print-ui className="border-t border-border p-4 text-right"><button type="button" className="rounded-lg border border-border px-4 py-2 text-sm font-semibold" onClick={() => window.print()}>{tx("Imprimir / guardar PDF")}</button></div>
    </>}
  </ReservationDialog>;
}
