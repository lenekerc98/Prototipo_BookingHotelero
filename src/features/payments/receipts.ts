import type { MyReservation } from "../reservations/types";

export interface HotelReceipt {
  kind: "receipt" | "invoice";
  number: string;
  issuedOn: string;
  recordedAt: string;
  recordedBy: string;
  revision: number;
}

export type HotelReceiptInput = Pick<HotelReceipt, "kind" | "number" | "issuedOn" | "recordedBy">;

export function currentHotelReceipt(reservation: MyReservation) {
  const history = reservation.receiptHistory ?? [];
  return history[history.length - 1];
}

export function hasRecordedFullPayment(reservation: MyReservation): boolean {
  return reservation.paymentStatus === "paid" && !!reservation.payment &&
    Number.isFinite(reservation.total) && reservation.total > 0 &&
    reservation.payment.amount === reservation.total;
}

export function validateReceiptInput(input: HotelReceiptInput) {
  const timestamp = Date.parse(`${input.issuedOn}T00:00:00Z`);
  if (!["receipt", "invoice"].includes(input.kind) || !input.number.trim() || input.number.trim().length > 80 ||
    !input.recordedBy.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(input.issuedOn) || !Number.isFinite(timestamp) ||
    new Date(timestamp).toISOString().slice(0, 10) !== input.issuedOn) {
    throw new Error("Revisa el tipo, número, fecha y responsable del comprobante.");
  }
}
