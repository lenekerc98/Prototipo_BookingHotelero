import type { MyReservation } from "./types";

export interface GuestReservationRepository {
  read(): MyReservation[] | null;
  save(reservations: MyReservation[]): boolean;
}

export interface RoomAvailabilityRepository {
  get(hotelId: string, roomId: string): number | undefined;
  set(hotelId: string, roomId: string, available: number): void;
}
