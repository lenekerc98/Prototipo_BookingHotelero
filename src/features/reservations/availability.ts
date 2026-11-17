import type { RoomAvailabilityRepository } from "./repositories";
import type { AvailabilityRoom } from "./types";

export function createRoomAvailabilityService(repository: RoomAvailabilityRepository) {
  function getRoomAvailability(hotelId: string, room: AvailabilityRoom): number {
    return repository.get(hotelId, room.id) ?? room.available;
  }

  function consumeRoomAvailability(hotelId: string, room: AvailabilityRoom, qty = 1): number {
    validateQuantity(qty);
    const next = Math.max(0, getRoomAvailability(hotelId, room) - qty);
    repository.set(hotelId, room.id, next);
    return next;
  }

  function releaseRoomAvailability(hotelId: string, room: AvailabilityRoom, qty = 1): number {
    validateQuantity(qty);
    const next = getRoomAvailability(hotelId, room) + qty;
    repository.set(hotelId, room.id, next);
    return next;
  }

  return { getRoomAvailability, consumeRoomAvailability, releaseRoomAvailability };
}

function validateQuantity(qty: number): void {
  if (!Number.isSafeInteger(qty) || qty <= 0) {
    throw new RangeError("La cantidad debe ser un entero positivo seguro.");
  }
}
