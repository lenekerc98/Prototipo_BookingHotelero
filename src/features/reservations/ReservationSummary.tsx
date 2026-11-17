import { useI18n } from "../../i18n";
import { getPaymentLabel, getReservationStatus, reservationStatusLabels } from "./status";
import type { MyReservation } from "./types";
import { currentHotelReceipt, hasRecordedFullPayment } from "../payments/receipts";
import { ReservationDialog } from "./ReservationDialog";
import { useGuestReservations } from "../../app/useGuestReservations";
import { RequestDeadline } from "./RequestDeadline";

export function ReservationSummary({ reservation }: { reservation: MyReservation }) {
  const tx = useI18n();
  const status = getReservationStatus(reservation);
  const receipt = currentHotelReceipt(reservation);
  return (
    <section className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border)" }} aria-label={tx("Resumen de reserva")}>
      <div className="px-5 py-4 bg-slate-900 text-white">
        <h3 className="font-bold text-lg text-amber-400">{reservation.hotel}</h3>
        <p className="font-mono text-sm mt-1 break-all">{reservation.id}</p>
        <p className="text-sm mt-2" role="status">{tx(reservationStatusLabels[status])}</p>
      </div>
      <div className="p-5 space-y-3 text-sm text-foreground bg-card">
        <p className="break-words"><strong>{reservation.guestName}</strong> · {reservation.guestEmail}</p>
        <p>{tx(reservation.room)}</p>
        <p>{reservation.checkIn} → {reservation.checkOut} · {reservation.nights} {tx("noches")}</p>
        <div className="flex justify-between border-t pt-3" style={{ borderColor: "var(--border)" }}>
          <span>{tx("Importe de la reserva")}</span>
          <strong>US${reservation.total.toFixed(2)}</strong>
        </div>
        <p className="font-semibold">{tx(getPaymentLabel(reservation))}</p>
        <RequestDeadline reservation={reservation} />
        {reservation.payment && <div className="space-y-1 text-xs">
          <p>{tx("Registro local de prueba")}: US${reservation.payment.amount.toFixed(2)} · {tx(reservation.payment.method)} · {reservation.payment.recordedAt.slice(0, 10)}</p>
          <p>{tx("Referencia del cobro")}: {reservation.payment.reference || tx("Sin referencia")}</p>
          {hasRecordedFullPayment(reservation) && <p>{tx("Saldo pendiente")}: US$0.00</p>}
        </div>}
        {receipt && <div className="border-t border-border pt-3 space-y-1">
          <h4 className="font-semibold">{tx("Comprobante registrado por el hotel")}</h4>
          <p className="break-all">{tx(receipt.kind === "invoice" ? "Factura del hotel" : "Recibo del hotel")}: {receipt.number}</p>
          <p className="text-xs">{tx("Fecha de emisión")}: {receipt.issuedOn}</p>
          <p className="text-xs text-muted-foreground">{tx("Número informado por recepción. AlojaManta no emite ni valida este documento.")}</p>
        </div>}
        {status === "pending" && <p>{tx("El hotel debe aceptar tu solicitud. Todavía no es una reserva confirmada y no se ha realizado ningún cobro.")}</p>}
        {status === "confirmed" && <p>{tx("El hotel aceptó tu solicitud. La confirmación de la reserva no acredita el pago.")}</p>}
        {status === "validated" && <p>{tx("La reserva fue validada en recepción. Esto no confirma un cobro ni completa la estancia.")}</p>}
        <p className="text-xs text-muted-foreground">{tx("Demostración local. Este resumen no es una factura ni un comprobante de pago. No se envían correos reales.")}</p>
      </div>
    </section>
  );
}

export function ReservationVoucherModal({ res, onClose }: { res: MyReservation; onClose: () => void }) {
  const tx = useI18n();
  const current = useGuestReservations().find(item => item.id === res.id && item.hotelId === res.hotelId);
  return (
    <ReservationDialog title={tx("Resumen de reserva")} onClose={onClose}>
      <div className="reservation-print-content p-4">
        {current ? <ReservationSummary reservation={current} /> : <p>{tx("No se encontró la reserva en este establecimiento.")}</p>}
      </div>
      <div data-print-ui className="border-t border-border p-4 text-right">
        <button type="button" disabled={!current} onClick={() => window.print()} className="rounded-lg bg-amber-500 text-slate-950 px-4 py-2 text-sm font-bold disabled:opacity-50">{tx("Imprimir / guardar PDF")}</button>
      </div>
    </ReservationDialog>
  );
}
