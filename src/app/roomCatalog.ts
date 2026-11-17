import { useEffect, useState } from "react";
import { MANTA_HOTELS, type RoomOffer } from "../mantaHotels";
import { countHeldRooms } from "../features/reservations/workflow";
import type { MyReservation } from "../features/reservations/types";

export const CATALOG_CHANGED = "alojamanta-catalog-changed";
export const roomOffersKey = (hotelId: string) => `hoteldirekt.${hotelId}.room_offers`;

export function getRoomOffers(hotelId: string): RoomOffer[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(roomOffersKey(hotelId)) ?? "null");
    if (Array.isArray(saved) && saved.every(room => typeof room.id === "string" && typeof room.type === "string" &&
      Number.isSafeInteger(room.available) && room.available >= 0 && Number.isFinite(room.pricePerNight) && room.pricePerNight >= 0)) return saved;
  } catch { /* Fall back to the catalog configuration, never to another hotel. */ }
  return MANTA_HOTELS.find(hotel => hotel.id === hotelId)?.rooms ?? [];
}

export function getPublicHotels() {
  return MANTA_HOTELS.map(hotel => {
    const rooms = getRoomOffers(hotel.id);
    return { ...hotel, rooms, priceFrom: rooms.length ? Math.min(...rooms.map(room => room.pricePerNight)) : 0 };
  });
}

export function saveRoomOffers(hotelId: string, rooms: RoomOffer[], reservations: MyReservation[]) {
  const ids = new Set<string>();
  for (const room of rooms) {
    if (!room.id || ids.has(room.id) || !room.type.trim() || !Number.isSafeInteger(room.available) || room.available < 0 ||
      !Number.isFinite(room.pricePerNight) || room.pricePerNight < 0 || !Number.isSafeInteger(room.capacity) || room.capacity < 1) {
      throw new Error("Revisa el tipo, el cupo, el precio y la capacidad de la habitación.");
    }
    ids.add(room.id);
    const held = countHeldRooms(reservations, hotelId, room.id, { checkIn: "2000-01-01", checkOut: "9999-12-31" });
    if (room.available < held) throw new Error("El cupo total no puede ser menor que los cupos apartados. Revisa las reservas activas.");
  }
  try { localStorage.setItem(roomOffersKey(hotelId), JSON.stringify(rooms)); }
  catch { throw new Error("No se pudo guardar el inventario."); }
  window.dispatchEvent(new Event(CATALOG_CHANGED));
}

export function useRoomCatalogRevision() {
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const refresh = () => setRevision(value => value + 1);
    window.addEventListener(CATALOG_CHANGED, refresh);
    window.addEventListener("storage", refresh);
    return () => { window.removeEventListener(CATALOG_CHANGED, refresh); window.removeEventListener("storage", refresh); };
  }, []);
  return revision;
}
