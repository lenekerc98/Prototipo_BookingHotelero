// Clave única para las reservas hechas por huéspedes en el portal web.
// El portal (GuestPage) escribe aquí y el panel del hotel (App) lee de aquí.
export const GUEST_RESERVATIONS_KEY = "alojamanta_guest_reservations";

// Clave usada en versiones anteriores; se lee solo como respaldo.
const LEGACY_GUEST_RESERVATIONS_KEY = "hoteldirekt_guest_reservations";

export function readGuestReservationsRaw(): string | null {
  return localStorage.getItem(GUEST_RESERVATIONS_KEY) ?? localStorage.getItem(LEGACY_GUEST_RESERVATIONS_KEY);
}
