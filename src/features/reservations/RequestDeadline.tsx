import { useI18n, useLang } from "../../i18n";
import { ATTENTION_TARGET_MS, creationTimestamp, HOTEL_TIME_ZONE, responseDeadline } from "./deadlines";
import { getReservationStatus } from "./status";
import type { MyReservation } from "./types";

export function RequestDeadline({ reservation }: { reservation: MyReservation }) {
  const tx = useI18n();
  const lang = useLang();
  const status = getReservationStatus(reservation);
  if (status !== "pending" && status !== "expired") return null;
  if (reservation.payment || reservation.paymentStatus === "paid") {
    return <p className="text-xs text-muted-foreground">{tx("Solicitud con pago previo: requiere revisión manual del hotel.")}</p>;
  }
  const deadline = responseDeadline(reservation);
  if (deadline === null) {
    return <p className="text-xs text-muted-foreground">{tx("Solicitud antigua sin fecha de creación válida: requiere revisión manual del hotel. No se aplica vencimiento automático.")}</p>;
  }
  const formatted = new Intl.DateTimeFormat(lang === "en" ? "en-GB" : "es-EC", {
    timeZone: HOTEL_TIME_ZONE, dateStyle: "short", timeStyle: "medium", hour12: false,
  }).format(deadline);
  return <div className="space-y-1 text-xs text-muted-foreground">
    <p>{tx(status === "expired" ? "Venció el" : "Límite de respuesta")}: <time dateTime={new Date(deadline).toISOString()}>{formatted}</time> · {tx("hora de Manta")}</p>
    {status === "pending" && <p>{tx(Date.now() - creationTimestamp(reservation)! >= ATTENTION_TARGET_MS
      ? "Objetivo de 2 horas superado. La solicitud sigue pendiente hasta completar las 24 horas."
      : "Objetivo de atención: 2 horas. Plazo de respuesta: 24 horas.")}</p>}
    {status === "expired" && <p>{tx("La solicitud venció y su cupo fue liberado. Para reservar, crea otra solicitud sujeta a disponibilidad.")}</p>}
  </div>;
}
