import type { HotelReceipt } from "../payments/receipts";

export type ReservationStatus = "pending" | "confirmed" | "validated" | "completed" | "cancelled" | "rejected" | "expired";

export interface MyReservation {
  id: string;
  hotel: string;
  hotelId: string;
  city: string;
  room: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  total: number;
  status: ReservationStatus | "upcoming";
  paymentStatus?: "pending" | "paid";
  roomId?: string;
  inventoryMode?: "nightly";
  createdAt?: string;
  expiredAt?: string;
  arrivalAt?: string;
  acceptedAt?: string;
  validatedAt?: string;
  adults?: number;
  children?: number;
  notes?: string;
  image: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  payMethod?: string;
  guestDocumentType?: string;
  guestDocument?: string;
  guestCity?: string;
  guestCountry?: string;
  guestAddress?: string;
  receiptHistory?: HotelReceipt[];
  payment?: {
    amount: number;
    method: "Efectivo" | "Transferencia externa" | "Tarjeta externa";
    reference: string;
    recordedAt: string;
    recordedBy: string;
  };
}

export interface ReservationStay {
  checkIn: string;
  checkOut: string;
}

export type ReservationRequest = Pick<MyReservation,
  "id" | "hotel" | "hotelId" | "city" | "room" | "checkIn" | "checkOut" |
  "total" | "image" | "guestName" | "guestEmail" | "guestPhone" | "adults" | "children" | "notes" |
  "guestDocumentType" | "guestDocument" | "guestCity" | "guestCountry" | "guestAddress"
>;

export interface AvailabilityRoom {
  id: string;
  available: number;
}
