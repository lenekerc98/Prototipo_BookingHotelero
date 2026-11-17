import { getReservationStatus } from "./status";
import type { MyReservation } from "./types";

export function localDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function hotelMetrics(reservations: MyReservation[], hotelId: string, date = localDate()) {
  const rows = reservations.filter(item => item.hotelId === hotelId);
  const active = rows.filter(item => ["pending", "confirmed", "validated"].includes(getReservationStatus(item)));
  const payments = rows.filter(item => item.payment && item.paymentStatus === "paid");
  const sum = (items: MyReservation[]) => Math.round(items.reduce((total, item) => total + (item.payment?.amount ?? 0), 0) * 100) / 100;
  return {
    reservations: rows.length,
    pending: rows.filter(item => getReservationStatus(item) === "pending").length,
    heldToday: active.filter(item => item.checkIn <= date && item.checkOut > date).length,
    arrivals: active.filter(item => item.checkIn === date && getReservationStatus(item) === "confirmed").length,
    totalCollected: sum(payments),
    monthCollected: sum(payments.filter(item => item.payment!.recordedAt.slice(0, 7) === date.slice(0, 7))),
    outstanding: Math.round(active.filter(item => item.paymentStatus !== "paid").reduce((total, item) => total + item.total, 0) * 100) / 100,
  };
}

export function guestDirectory(reservations: MyReservation[], hotelId: string) {
  const grouped = new Map<string, MyReservation[]>();
  for (const reservation of reservations.filter(item => item.hotelId === hotelId)) {
    const key = reservation.guestEmail.trim().toLowerCase();
    grouped.set(key, [...(grouped.get(key) ?? []), reservation]);
  }
  return [...grouped.entries()].map(([email, rows]) => {
    const history = [...rows].sort((a, b) => (b.createdAt ?? b.checkIn).localeCompare(a.createdAt ?? a.checkIn));
    return {
      email, latest: history[0], history,
      totalPaid: history.reduce((sum, item) => sum + (item.payment?.amount ?? 0), 0),
      completed: history.filter(item => getReservationStatus(item) === "completed").length,
    };
  });
}
