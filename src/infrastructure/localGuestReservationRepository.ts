import type { GuestReservationRepository } from "../features/reservations/repositories";
import type { MyReservation } from "../features/reservations/types";
import { INITIAL_DEMO_RESERVATIONS, MANTA_HOTELS } from "../mantaHotels";

export const GUEST_RESERVATIONS_KEY = "alojamanta_guest_reservations";
const LEGACY_GUEST_RESERVATIONS_KEY = "hoteldirekt_guest_reservations";

type StorageProvider = () => Pick<Storage, "getItem" | "setItem">;

// Known examples from the original panel; never filter by name or code alone.
const panelExamples = [
  ["RES-001", "cmendez@gmail.com", "2026-08-15", 210],
  ["RES-002", "lfernandez@hotmail.com", "2026-08-15", 55],
  ["RES-003", "jrodriguez@yahoo.com", "2026-08-16", 440],
  ["RES-004", "mtorres@empresa.ec", "2026-08-17", 140],
  ["RES-005", "agomez@gmail.com", "2026-08-18", 165],
  ["RES-006", "rsilva@gmail.com", "2026-08-14", 70],
  ["RES-007", "pruiz@hotmail.com", "2026-08-19", 330],
  ["RES-008", "dcastro@outlook.com", "2026-08-20", 165],
];

function isExample(item: MyReservation) {
  return INITIAL_DEMO_RESERVATIONS.some(seed => seed.id === item.id && seed.hotelId === item.hotelId &&
    seed.guestEmail === item.guestEmail && seed.checkIn === item.checkIn && seed.checkOut === item.checkOut && seed.total === item.total);
}

export function readGuestReservationsRaw(getStorage: StorageProvider = () => localStorage): string | null {
  const storage = getStorage();
  return storage.getItem(GUEST_RESERVATIONS_KEY) ?? storage.getItem(LEGACY_GUEST_RESERVATIONS_KEY);
}

export function createLocalGuestReservationRepository(
  getStorage: StorageProvider = () => localStorage,
): GuestReservationRepository {
  return {
    read() {
      try {
        const storage = getStorage();
        const raw = readGuestReservationsRaw(getStorage);
        const parsed: unknown = raw ? JSON.parse(raw) : null;
        const rows: MyReservation[] = Array.isArray(parsed) ? parsed.filter(item => !isExample(item)) : [];
        const ids = new Set(rows.map(item => item.id));
        for (const hotel of MANTA_HOTELS) {
          let legacy;
          try { legacy = JSON.parse(storage.getItem(`hoteldirekt.${hotel.id}.reservations`) ?? "[]"); }
          catch { continue; }
          if (!Array.isArray(legacy)) continue;
          for (const item of legacy) {
            if (!item || ids.has(item.id) || item.source === "Portal AlojaManta" ||
              panelExamples.some(([id, email, date, total]) => item.id === id && item.guestEmail === email && item.checkIn === date && item.total === total) ||
              !item.id || !item.guestEmail || !item.checkIn || !item.checkOut || !Number.isFinite(item.total)) continue;
            const room = hotel.rooms.find(offer => offer.type === item.roomType);
            rows.push({
              id: item.id, hotelId: hotel.id, hotel: hotel.name, city: hotel.city, image: hotel.image,
              room: item.roomType, roomId: room?.id, ...(room ? { inventoryMode: "nightly" as const } : {}),
              guestName: item.guestName, guestEmail: item.guestEmail, checkIn: item.checkIn, checkOut: item.checkOut,
              nights: item.nights, total: item.total,
              createdAt: item.createdAt,
              status: item.status === "checkin" ? "validated" : item.status === "checkout" ? "completed" : item.status,
              adults: item.adults, children: item.children, notes: item.notes,
            });
            ids.add(item.id);
          }
        }
        return Array.isArray(parsed) || rows.length ? rows : null;
      } catch {
        return null;
      }
    },
    save(reservations) {
      try {
        getStorage().setItem(GUEST_RESERVATIONS_KEY, JSON.stringify(reservations));
        return true;
      } catch {
        return false;
      }
    },
  };
}
