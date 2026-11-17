import { useState } from "react";
import { tx } from "../../i18n";
import { updateArrivalTime, useArrivalPolicy } from "../../app/arrivalPolicy";

export function ArrivalTimeSettings({ hotelId, canEdit }: { hotelId: string; canEdit: boolean }) {
  const { arrivalTime } = useArrivalPolicy(hotelId, "");
  const [draft, setDraft] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  return <details className="rounded-xl border border-border bg-card text-foreground p-4">
    <summary className="cursor-pointer text-sm font-semibold">{tx("Hora de llegada del hotel")}: {arrivalTime ?? tx("Sin configurar")} · {tx("hora de Manta")}</summary>
    <p className="text-sm text-muted-foreground mt-3">{tx("Define la hora de llegada de este establecimiento para calcular las 24 horas de anticipación del portal. Zona: America/Guayaquil (UTC−05:00).")}</p>
    {canEdit ? <form className="mt-3 flex flex-wrap items-end gap-3" onSubmit={event => {
      event.preventDefault();
      try {
        updateArrivalTime(hotelId, draft ?? arrivalTime ?? "");
        setDraft(null);
        setFeedback("Hora de llegada guardada para este hotel.");
      } catch (error) { setFeedback(error instanceof Error ? error.message : "No se pudo guardar el cambio."); }
    }}>
      <label className="text-sm space-y-1"><span className="block">{tx("Hora de llegada")}</span><input type="time" required value={draft ?? arrivalTime ?? ""} onChange={event => setDraft(event.target.value)} className="rounded-lg border border-border bg-background text-foreground px-3 py-2" /></label>
      <button className="rounded-lg border border-border px-3 py-2 text-sm font-semibold hover:bg-secondary">{tx("Guardar horario")}</button>
    </form> : <p className="mt-3 text-sm text-muted-foreground">{tx("La administración del hotel configura este horario.")}</p>}
    {feedback && <p role="status" className="mt-3 text-sm">{tx(feedback)}</p>}
  </details>;
}
