import { validArrivalTime } from "../features/reservations/deadlines";

export const arrivalTimeKey = (hotelId: string) => `hoteldirekt.${hotelId}.arrival_time`;

export function getArrivalTime(hotelId: string): string | null {
  try {
    const value = localStorage.getItem(arrivalTimeKey(hotelId));
    return value && validArrivalTime(value) ? value : null;
  } catch {
    return null;
  }
}

export function saveArrivalTime(hotelId: string, value: string) {
  if (!hotelId || !validArrivalTime(value)) throw new Error("Indica una hora de llegada válida para este hotel.");
  try {
    localStorage.setItem(arrivalTimeKey(hotelId), value);
  } catch {
    throw new Error("No se pudo guardar la hora de llegada. Revisa el almacenamiento del navegador.");
  }
}
