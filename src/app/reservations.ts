import { createRoomAvailabilityService } from "../features/reservations/availability";
import { createLocalGuestReservationRepository } from "../infrastructure/localGuestReservationRepository";
import { createLocalRoomAvailabilityRepository } from "../infrastructure/localRoomAvailabilityRepository";
import { createReservationWorkflow } from "../features/reservations/workflow";
import type { AvailabilityRoom, ReservationStay } from "../features/reservations/types";
import { MANTA_HOTELS } from "../mantaHotels";
import { getRoomOffers, roomOffersKey } from "./roomCatalog";
import { getArrivalTime } from "../infrastructure/localArrivalTimeRepository";

export const guestReservationRepository = createLocalGuestReservationRepository();

const availability = createRoomAvailabilityService(createLocalRoomAvailabilityRepository());
export const { consumeRoomAvailability, releaseRoomAvailability } = availability;
export const RESERVATIONS_CHANGED_EVENT = "alojamanta-reservations-changed";

export const reservationWorkflow = createReservationWorkflow({
  repository: guestReservationRepository,
  getArrivalTime,
  getBaseAvailability: (hotelId, room) => {
    const configured = getRoomOffers(hotelId).find(item => item.id === room.id);
    return configured && localStorage.getItem(roomOffersKey(hotelId)) !== null
      ? configured.available : availability.getRoomAvailability(hotelId, configured ?? room);
  },
  onChange: () => window.dispatchEvent(new Event(RESERVATIONS_CHANGED_EVENT)),
  onLegacyCancel: reservation => {
    const hotel = MANTA_HOTELS.find(item => item.id === reservation.hotelId);
    const room = hotel?.rooms.find(item => item.type === reservation.room);
    if (hotel && room) availability.releaseRoomAvailability(hotel.id, room);
  },
});

export function getRoomAvailability(hotelId: string, room: AvailabilityRoom, stay?: ReservationStay): number {
  return stay ? reservationWorkflow.getAvailability(hotelId, room, stay) : availability.getRoomAvailability(hotelId, room);
}
