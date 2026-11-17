import type { RoomAvailabilityRepository } from "../features/reservations/repositories";

const AVAILABILITY_KEY = "alojamanta_room_availability";
type AvailabilityMap = Record<string, number>;
type StorageProvider = () => Pick<Storage, "getItem" | "setItem">;

export function createLocalRoomAvailabilityRepository(
  getStorage: StorageProvider = () => localStorage,
): RoomAvailabilityRepository {
  function readMap(): AvailabilityMap {
    try {
      const raw = getStorage().getItem(AVAILABILITY_KEY);
      const parsed: unknown = raw ? JSON.parse(raw) : {};
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
      return Object.fromEntries(
        Object.entries(parsed).filter(([, value]) =>
          typeof value === "number" && Number.isSafeInteger(value) && value >= 0
        )
      );
    } catch {
      return {};
    }
  }

  return {
    get(hotelId, roomId) {
      return readMap()[`${hotelId}::${roomId}`];
    },
    set(hotelId, roomId, available) {
      const map = readMap();
      map[`${hotelId}::${roomId}`] = available;
      try {
        getStorage().setItem(AVAILABILITY_KEY, JSON.stringify(map));
      } catch {}
    },
  };
}
