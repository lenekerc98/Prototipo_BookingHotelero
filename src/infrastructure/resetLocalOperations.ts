import { GUEST_RESERVATIONS_KEY } from "./localGuestReservationRepository";

export const OPERATIONS_BACKUP_KEY = "alojamanta_operations_backup";
export const APPLIED_RESET_KEY = "alojamanta.applied_local_reset";

export function resetLocalOperations(storage: Storage = localStorage, approvedResetId?: string) {
  const keys = [GUEST_RESERVATIONS_KEY, "hoteldirekt_guest_reservations", "alojamanta_room_availability", "hoteldirekt_room_availability", "alojamanta.audit_logs"];
  if (approvedResetId) keys.push(APPLIED_RESET_KEY);
  for (let index = 0; index < storage.length; index++) {
    const key = storage.key(index);
    if (key && /^hoteldirekt\..+\.(reservations|guests|invoices|payments)$/.test(key)) keys.push(key);
  }
  const previous = Object.fromEntries([...new Set(keys)].map(key => [key, storage.getItem(key)]));
  // Save before clearing anything. This snapshot stays on this browser only.
  storage.setItem(OPERATIONS_BACKUP_KEY, JSON.stringify({ savedAt: new Date().toISOString(), values: previous }));
  try {
    for (const key of Object.keys(previous)) storage.removeItem(key);
    storage.setItem(GUEST_RESERVATIONS_KEY, "[]");
    if (approvedResetId) storage.setItem(APPLIED_RESET_KEY, approvedResetId);
  } catch (error) {
    for (const [key, value] of Object.entries(previous)) {
      if (value !== null) storage.setItem(key, value);
      else storage.removeItem(key);
    }
    throw error;
  }
}

// Only called by the local development bootstrap with an explicitly configured approval id.
export function applyApprovedLocalResetOnce(resetId: string, storage: Storage = localStorage) {
  if (!resetId || storage.getItem(APPLIED_RESET_KEY) === resetId) return false;
  resetLocalOperations(storage, resetId);
  return true;
}
