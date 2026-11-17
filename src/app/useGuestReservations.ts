import { useEffect, useState } from "react";
import { reservationWorkflow, RESERVATIONS_CHANGED_EVENT } from "./reservations";
import { responseDeadline } from "../features/reservations/deadlines";

export function useReservationSnapshot() {
  const [reservations, setReservations] = useState(reservationWorkflow.list);
  const [syncError, setSyncError] = useState("");
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const refresh = () => {
      clearTimeout(timer);
      try {
        reservationWorkflow.expirePending(false);
        setSyncError("");
      } catch {
        setSyncError("No se pudo guardar el vencimiento. Se muestra el plazo cumplido; se reintentará guardar al consultar la aplicación.");
      }
      const current = reservationWorkflow.list();
      setReservations(current);
      const deadlines = current.filter(item => item.status === "pending").map(responseDeadline).filter((value): value is number => value !== null && value > Date.now());
      timer = setTimeout(refresh, Math.max(1, Math.min(60000, ...deadlines.map(value => value - Date.now()))));
    };
    window.addEventListener(RESERVATIONS_CHANGED_EVENT, refresh);
    window.addEventListener("storage", refresh);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    refresh();
    return () => {
      clearTimeout(timer);
      window.removeEventListener(RESERVATIONS_CHANGED_EVENT, refresh);
      window.removeEventListener("storage", refresh);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);
  return { reservations, syncError };
}

export function useGuestReservations() {
  return useReservationSnapshot().reservations;
}
