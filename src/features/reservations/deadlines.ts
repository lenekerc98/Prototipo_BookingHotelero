import type { MyReservation } from "./types";

export const RESPONSE_WINDOW_MS = 24 * 60 * 60 * 1000;
export const ATTENTION_TARGET_MS = 2 * 60 * 60 * 1000;
export const HOTEL_TIME_ZONE = "America/Guayaquil";

export function creationTimestamp(reservation: MyReservation): number | null {
  const value = reservation.createdAt;
  if (!value || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?(Z|[+-]\d{2}:\d{2})$/.test(value)) return null;
  const timestamp = Date.parse(value);
  const calendar = new Date(`${value.slice(0, 10)}T00:00:00Z`);
  return Number.isFinite(timestamp) && Number.isFinite(calendar.getTime()) && calendar.toISOString().slice(0, 10) === value.slice(0, 10)
    ? timestamp : null;
}

export function responseDeadline(reservation: MyReservation): number | null {
  const created = creationTimestamp(reservation);
  return created === null ? null : created + RESPONSE_WINDOW_MS;
}

export function isRequestExpired(reservation: MyReservation, now = Date.now()): boolean {
  const deadline = responseDeadline(reservation);
  return reservation.status === "pending" && reservation.paymentStatus !== "paid" && !reservation.payment &&
    deadline !== null && now >= deadline;
}

export function validArrivalTime(value: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

export function portalRequestEligibility(checkIn: string, arrivalTime: string | null, now = Date.now()) {
  if (!arrivalTime || !validArrivalTime(arrivalTime)) {
    return { allowed: false, arrivalAt: null, message: "El hotel aún no ha configurado su hora de llegada. Solicita atención directa al hotel; no se apartará cupo desde el portal." };
  }
  const calendar = new Date(`${checkIn}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(checkIn) || !Number.isFinite(calendar.getTime()) || calendar.toISOString().slice(0, 10) !== checkIn) {
    return { allowed: false, arrivalAt: null, message: "Revisa las fechas de entrada y salida." };
  }
  const arrivalAt = `${checkIn}T${arrivalTime}:00-05:00`;
  if (Date.parse(arrivalAt) - now < RESPONSE_WINDOW_MS) {
    return { allowed: false, arrivalAt, message: "Para llegadas con menos de 24 horas de anticipación, solicita atención directa al hotel. El portal no genera una solicitud ni aparta cupo." };
  }
  return { allowed: true, arrivalAt, message: "El hotel tiene 24 horas para responder. El objetivo de atención es de 2 horas; superarlo no vence la solicitud." };
}
