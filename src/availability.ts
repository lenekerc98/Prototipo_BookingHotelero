import type { RoomOffer } from "./mantaHotels";

// Disponibilidad de habitaciones compartida entre el portal y el panel del hotel (prototipo).
// Guarda solo los valores que cambiaron; si no hay registro, se usa room.available del catálogo.
const AVAILABILITY_KEY = "alojamanta_room_availability";

type AvailabilityMap = Record<string, number>;

function readMap(): AvailabilityMap {
  try {
    const raw = localStorage.getItem(AVAILABILITY_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeMap(map: AvailabilityMap) {
  try {
    localStorage.setItem(AVAILABILITY_KEY, JSON.stringify(map));
  } catch {
    // Sin almacenamiento disponible: la disponibilidad vuelve al valor del catálogo.
  }
}

function keyFor(hotelId: string, roomId: string) {
  return `${hotelId}::${roomId}`;
}

export function getRoomAvailability(hotelId: string, room: RoomOffer): number {
  const value = readMap()[keyFor(hotelId, room.id)];
  return typeof value === "number" ? value : room.available;
}

export function consumeRoomAvailability(hotelId: string, room: RoomOffer, qty = 1): number {
  const map = readMap();
  const key = keyFor(hotelId, room.id);
  const current = typeof map[key] === "number" ? map[key] : room.available;
  const next = Math.max(0, current - qty);
  map[key] = next;
  writeMap(map);
  return next;
}

export function releaseRoomAvailability(hotelId: string, room: RoomOffer, qty = 1): number {
  const map = readMap();
  const key = keyFor(hotelId, room.id);
  const current = typeof map[key] === "number" ? map[key] : room.available;
  const next = current + qty;
  map[key] = next;
  writeMap(map);
  return next;
}