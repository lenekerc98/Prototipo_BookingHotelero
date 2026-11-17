import { useEffect, useState } from "react";
import { getArrivalTime, saveArrivalTime } from "../infrastructure/localArrivalTimeRepository";
import { portalRequestEligibility } from "../features/reservations/deadlines";

export const ARRIVAL_TIME_CHANGED_EVENT = "alojamanta-arrival-time-changed";

export function updateArrivalTime(hotelId: string, value: string) {
  saveArrivalTime(hotelId, value);
  window.dispatchEvent(new Event(ARRIVAL_TIME_CHANGED_EVENT));
}

export function useArrivalPolicy(hotelId: string, checkIn: string) {
  const [, refresh] = useState(0);
  const arrivalTime = getArrivalTime(hotelId);
  const eligibility = portalRequestEligibility(checkIn, arrivalTime);
  useEffect(() => {
    const update = () => refresh(revision => revision + 1);
    const remaining = eligibility.arrivalAt ? Date.parse(eligibility.arrivalAt) - Date.now() - 86400000 + 1 : 60000;
    const timer = window.setTimeout(update, Math.max(1, Math.min(60000, remaining > 0 ? remaining : 60000)));
    window.addEventListener(ARRIVAL_TIME_CHANGED_EVENT, update);
    window.addEventListener("storage", update);
    window.addEventListener("focus", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      clearTimeout(timer);
      window.removeEventListener(ARRIVAL_TIME_CHANGED_EVENT, update);
      window.removeEventListener("storage", update);
      window.removeEventListener("focus", update);
      document.removeEventListener("visibilitychange", update);
    };
  });
  return { arrivalTime, ...eligibility };
}
