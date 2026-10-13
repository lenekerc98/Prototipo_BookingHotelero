import { useState, useMemo, useEffect } from "react";
import GuestPage, { InvoiceModal } from "./GuestPage";
import AuthPage, { type AdminRole, type AdminUser, type GuestUser } from "./AuthPage";
import SriInvoiceModal from "./SriInvoiceModal";
import PaymentLinkModal, { type NewPaymentLinkData } from "./PaymentLinkModal";
import {
  MANTA_HOTELS,
  INITIAL_DEMO_RESERVATIONS,
  type RoomOffer,
  type MyReservation,
} from "./mantaHotels";
import {
  DEFAULT_HOTEL_RATES,
  HOTEL_SRI_INFO,
  getHotelInitialInvoices,
  getHotelInitialPayments,
  fmtUsd,
  type HotelRatesConfig,
  type RoomRateInfo,
  type SeasonInfo,
  type HotelInvoice,
  type HotelPayment,
} from "./hotelData";

// ─── Types ────────────────────────────────────────────────────────────────────

type View = "hotels" | "users" | "dashboard" | "reservations" | "rooms" | "revenue" | "guests" | "billing" | "payments" | "rates";

type ReservationStatus =
  | "confirmed"
  | "pending"
  | "checkin"
  | "checkout"
  | "cancelled";

type RoomStatus = "available" | "occupied" | "maintenance" | "cleaning";

interface Reservation {
  id: string;
  guestName: string;
  guestEmail: string;
  roomNumber: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  status: ReservationStatus;
  total: number;
  adults: number;
  children: number;
  source: string;
  notes?: string;
}

interface Room {
  number: string;
  type: string;
  floor: number;
  status: RoomStatus;
  pricePerNight: number;
  capacity: number;
  amenities: string[];
  guestName?: string;
  checkOut?: string;
}

interface GuestRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string;
  country: string;
  notes: string;
  visits: number;
  totalSpend: number;
  lastVisit: string;
  source: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const RESERVATIONS: Reservation[] = [
  {
    id: "RES-001",
    guestName: "Carlos Méndez",
    guestEmail: "cmendez@gmail.com",
    roomNumber: "101",
    roomType: "Doble Estándar",
    checkIn: "2026-08-15",
    checkOut: "2026-08-18",
    nights: 3,
    status: "checkin",
    total: 210,
    adults: 2,
    children: 0,
    source: "Booking.com",
  },
  {
    id: "RES-002",
    guestName: "Laura Fernández",
    guestEmail: "lfernandez@hotmail.com",
    roomNumber: "205",
    roomType: "Simple",
    checkIn: "2026-08-15",
    checkOut: "2026-08-16",
    nights: 1,
    status: "checkout",
    total: 55,
    adults: 1,
    children: 0,
    source: "Directo",
  },
  {
    id: "RES-003",
    guestName: "Familia Rodríguez",
    guestEmail: "jrodriguez@yahoo.com",
    roomNumber: "302",
    roomType: "Triple",
    checkIn: "2026-08-16",
    checkOut: "2026-08-20",
    nights: 4,
    status: "confirmed",
    total: 440,
    adults: 2,
    children: 1,
    source: "Expedia",
    notes: "Cama adicional para niño solicitada",
  },
  {
    id: "RES-004",
    guestName: "Miguel Torres",
    guestEmail: "mtorres@empresa.com",
    roomNumber: "110",
    roomType: "Doble Estándar",
    checkIn: "2026-08-17",
    checkOut: "2026-08-19",
    nights: 2,
    status: "confirmed",
    total: 140,
    adults: 1,
    children: 0,
    source: "Directo",
    notes: "Factura a nombre de empresa",
  },
  {
    id: "RES-005",
    guestName: "Ana Gómez",
    guestEmail: "agomez@gmail.com",
    roomNumber: "208",
    roomType: "Simple",
    checkIn: "2026-08-18",
    checkOut: "2026-08-21",
    nights: 3,
    status: "pending",
    total: 165,
    adults: 1,
    children: 0,
    source: "Airbnb",
  },
  {
    id: "RES-006",
    guestName: "Roberto Silva",
    guestEmail: "rsilva@gmail.com",
    roomNumber: "104",
    roomType: "Doble Estándar",
    checkIn: "2026-08-14",
    checkOut: "2026-08-15",
    nights: 1,
    status: "checkout",
    total: 70,
    adults: 2,
    children: 0,
    source: "Booking.com",
  },
  {
    id: "RES-007",
    guestName: "Patricia Ruiz",
    guestEmail: "pruiz@hotmail.com",
    roomNumber: "301",
    roomType: "Triple",
    checkIn: "2026-08-19",
    checkOut: "2026-08-22",
    nights: 3,
    status: "confirmed",
    total: 330,
    adults: 2,
    children: 2,
    source: "Directo",
  },
  {
    id: "RES-008",
    guestName: "Daniel Castro",
    guestEmail: "dcastro@outlook.com",
    roomNumber: "203",
    roomType: "Simple",
    checkIn: "2026-08-20",
    checkOut: "2026-08-23",
    nights: 3,
    status: "pending",
    total: 165,
    adults: 1,
    children: 0,
    source: "Booking.com",
  },
];

const ROOMS: Room[] = [
  {
    number: "101",
    type: "Doble Estándar",
    floor: 1,
    status: "occupied",
    pricePerNight: 70,
    capacity: 2,
    amenities: ["WiFi", "TV", "A/C"],
    guestName: "Carlos Méndez",
    checkOut: "2026-08-18",
  },
  {
    number: "102",
    type: "Simple",
    floor: 1,
    status: "available",
    pricePerNight: 55,
    capacity: 1,
    amenities: ["WiFi", "TV"],
  },
  {
    number: "103",
    type: "Simple",
    floor: 1,
    status: "cleaning",
    pricePerNight: 55,
    capacity: 1,
    amenities: ["WiFi", "TV"],
  },
  {
    number: "104",
    type: "Doble Estándar",
    floor: 1,
    status: "cleaning",
    pricePerNight: 70,
    capacity: 2,
    amenities: ["WiFi", "TV", "A/C"],
  },
  {
    number: "105",
    type: "Doble Estándar",
    floor: 1,
    status: "available",
    pricePerNight: 70,
    capacity: 2,
    amenities: ["WiFi", "TV", "A/C"],
  },
  {
    number: "106",
    type: "Simple",
    floor: 1,
    status: "maintenance",
    pricePerNight: 55,
    capacity: 1,
    amenities: ["WiFi", "TV"],
  },
  {
    number: "107",
    type: "Simple",
    floor: 1,
    status: "available",
    pricePerNight: 55,
    capacity: 1,
    amenities: ["WiFi", "TV"],
  },
  {
    number: "108",
    type: "Doble Estándar",
    floor: 1,
    status: "available",
    pricePerNight: 70,
    capacity: 2,
    amenities: ["WiFi", "TV", "A/C"],
  },
  {
    number: "110",
    type: "Doble Estándar",
    floor: 1,
    status: "available",
    pricePerNight: 70,
    capacity: 2,
    amenities: ["WiFi", "TV", "A/C"],
  },
  {
    number: "201",
    type: "Doble Superior",
    floor: 2,
    status: "available",
    pricePerNight: 85,
    capacity: 2,
    amenities: ["WiFi", "TV", "A/C", "Minibar"],
  },
  {
    number: "203",
    type: "Simple",
    floor: 2,
    status: "available",
    pricePerNight: 55,
    capacity: 1,
    amenities: ["WiFi", "TV"],
  },
  {
    number: "205",
    type: "Simple",
    floor: 2,
    status: "cleaning",
    pricePerNight: 55,
    capacity: 1,
    amenities: ["WiFi", "TV"],
    guestName: "Laura Fernández",
  },
  {
    number: "207",
    type: "Doble Superior",
    floor: 2,
    status: "occupied",
    pricePerNight: 85,
    capacity: 2,
    amenities: ["WiFi", "TV", "A/C", "Minibar"],
    guestName: "Invitado",
    checkOut: "2026-08-17",
  },
  {
    number: "208",
    type: "Simple",
    floor: 2,
    status: "available",
    pricePerNight: 55,
    capacity: 1,
    amenities: ["WiFi", "TV"],
  },
  {
    number: "210",
    type: "Doble Superior",
    floor: 2,
    status: "available",
    pricePerNight: 85,
    capacity: 2,
    amenities: ["WiFi", "TV", "A/C", "Minibar"],
  },
  {
    number: "301",
    type: "Triple",
    floor: 3,
    status: "available",
    pricePerNight: 110,
    capacity: 3,
    amenities: ["WiFi", "TV", "A/C", "Bañera"],
  },
  {
    number: "302",
    type: "Triple",
    floor: 3,
    status: "available",
    pricePerNight: 110,
    capacity: 3,
    amenities: ["WiFi", "TV", "A/C", "Bañera"],
  },
  {
    number: "303",
    type: "Suite",
    floor: 3,
    status: "occupied",
    pricePerNight: 150,
    capacity: 4,
    amenities: ["WiFi", "TV", "A/C", "Jacuzzi", "Minibar", "Vista al mar"],
    guestName: "VIP Guest",
    checkOut: "2026-08-19",
  },
  {
    number: "304",
    type: "Suite",
    floor: 3,
    status: "available",
    pricePerNight: 150,
    capacity: 4,
    amenities: ["WiFi", "TV", "A/C", "Jacuzzi", "Minibar", "Vista al mar"],
  },
];

const MONTHLY_REVENUE = [
  { month: "Mar", revenue: 14200, occupancy: 58, reservations: 89 },
  { month: "Abr", revenue: 16800, occupancy: 65, reservations: 104 },
  { month: "May", revenue: 19400, occupancy: 72, reservations: 121 },
  { month: "Jun", revenue: 23100, occupancy: 81, reservations: 148 },
  { month: "Jul", revenue: 28400, occupancy: 91, reservations: 176 },
  { month: "Ago", revenue: 21600, occupancy: 78, reservations: 134 },
];

const SOURCE_DATA = [
  { name: "Booking.com", value: 42, color: "#3b82f6" },
  { name: "Directo", value: 28, color: "#f59e0b" },
  { name: "Expedia", value: 16, color: "#8b5cf6" },
  { name: "Airbnb", value: 9, color: "#ec4899" },
  { name: "Otros", value: 5, color: "#6b7280" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const statusLabel: Record<ReservationStatus, string> = {
  confirmed: "Confirmada",
  pending: "Pendiente",
  checkin: "Check-in hoy",
  checkout: "Check-out hoy",
  cancelled: "Cancelada",
};

const roomStatusLabel: Record<RoomStatus, string> = {
  available: "Disponible",
  occupied: "Ocupada",
  maintenance: "Mantenimiento",
  cleaning: "Limpieza",
};

function fmt(amount: number) {
  return new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount);
}

function fmtDate(d: string) {
  return new Date(d + "T12:00:00").toLocaleDateString("es-EC", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({
  status,
  type = "reservation",
}: {
  status: string;
  type?: "reservation" | "room";
}) {
  const cls =
    type === "reservation"
      ? `badge-${status}`
      : `badge-${status}`;
  const label =
    type === "reservation"
      ? statusLabel[status as ReservationStatus]
      : roomStatusLabel[status as RoomStatus];
  return (
    <span
      className={`mono text-[10px] font-medium px-2 py-0.5 rounded uppercase tracking-wide ${cls}`}
    >
      {label}
    </span>
  );
}

function KpiCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div
      className="rounded-md p-4 border"
      style={{
        background: "var(--card)",
        borderColor: accent ? "var(--primary)" : "var(--border)",
      }}
    >
      <p
        className="text-xs uppercase tracking-widest mb-1"
        style={{ color: "var(--muted-foreground)" }}
      >
        {label}
      </p>
      <p
        className="mono text-2xl font-semibold leading-none"
        style={{ color: accent ? "var(--primary)" : "var(--foreground)" }}
      >
        {value}
      </p>
      {sub && (
        <p className="text-xs mt-1.5" style={{ color: "var(--muted-foreground)" }}>
          {sub}
        </p>
      )}
    </div>
  );
}

// ─── Revenue mini bar chart ───────────────────────────────────────────────────

function BarChart() {
  const max = Math.max(...MONTHLY_REVENUE.map((m) => m.revenue));
  return (
    <div className="flex items-end gap-2 h-28 w-full mt-3">
      {MONTHLY_REVENUE.map((m, i) => {
        const h = Math.round((m.revenue / max) * 100);
        const isLast = i === MONTHLY_REVENUE.length - 1;
        return (
          <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
            <span
              className="mono text-[9px]"
              style={{ color: isLast ? "var(--primary)" : "var(--muted-foreground)" }}
            >
              {fmt(m.revenue / 1000)}k
            </span>
            <div className="w-full relative rounded-sm overflow-hidden" style={{ height: `${h}%`, minHeight: 4, background: "var(--muted)" }}>
              <div
                className="w-full h-full rounded-sm transition-all duration-500"
                style={{
                  background: isLast
                    ? "var(--primary)"
                    : "var(--secondary)",
                }}
              />
            </div>
            <span
              className="mono text-[9px]"
              style={{ color: isLast ? "var(--primary)" : "var(--muted-foreground)" }}
            >
              {m.month}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Occupancy donut ──────────────────────────────────────────────────────────

function OccupancyRing({ pct }: { pct: number }) {
  const r = 36;
  const c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;
  return (
    <svg width="96" height="96" viewBox="0 0 96 96">
      <circle cx="48" cy="48" r={r} fill="none" stroke="var(--border)" strokeWidth="10" />
      <circle
        cx="48"
        cy="48"
        r={r}
        fill="none"
        stroke="var(--primary)"
        strokeWidth="10"
        strokeDasharray={`${dash} ${c - dash}`}
        strokeDashoffset={c / 4}
        strokeLinecap="round"
      />
      <text x="48" y="52" textAnchor="middle" fill="var(--foreground)" fontSize="14" fontFamily="JetBrains Mono" fontWeight="600">
        {pct}%
      </text>
    </svg>
  );
}

// ─── Source pie-like bar ──────────────────────────────────────────────────────

function SourceBar() {
  return (
    <div className="space-y-2 mt-3">
      {SOURCE_DATA.map((s) => (
        <div key={s.name} className="flex items-center gap-2">
          <span
            className="mono text-xs w-24 truncate"
            style={{ color: "var(--muted-foreground)" }}
          >
            {s.name}
          </span>
          <div className="flex-1 h-1.5 rounded-full" style={{ background: "var(--muted)" }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${s.value}%`, background: s.color }}
            />
          </div>
          <span className="mono text-xs w-8 text-right" style={{ color: s.color }}>
            {s.value}%
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── New Booking Modal ────────────────────────────────────────────────────────

function NewBookingModal({ onClose }: { onClose: () => void }) {
  const availableRooms = ROOMS.filter((r) => r.status === "available");
  const [form, setForm] = useState({
    guestName: "",
    guestEmail: "",
    room: "",
    checkIn: "",
    checkOut: "",
    adults: "1",
    children: "0",
    source: "Directo",
    notes: "",
  });

  function nights() {
    if (!form.checkIn || !form.checkOut) return 0;
    return Math.max(
      0,
      Math.round(
        (new Date(form.checkOut).getTime() - new Date(form.checkIn).getTime()) /
          86400000
      )
    );
  }

  const selectedRoom = availableRooms.find((r) => r.number === form.room);
  const total = selectedRoom ? selectedRoom.pricePerNight * nights() : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-xl rounded-lg border overflow-hidden"
        style={{ background: "var(--card)", borderColor: "var(--border)" }}
      >
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: "var(--border)" }}
        >
          <h2 className="text-lg" style={{ color: "var(--foreground)" }}>
            Nueva Reserva
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded flex items-center justify-center text-sm transition-colors"
            style={{ color: "var(--muted-foreground)", background: "var(--muted)" }}
          >
            ✕
          </button>
        </div>
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs mb-1" style={{ color: "var(--muted-foreground)" }}>
                Nombre del huésped *
              </label>
              <input
                className="w-full px-3 py-2 rounded text-sm border outline-none transition-colors"
                style={{
                  background: "var(--muted)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
                value={form.guestName}
                onChange={(e) => setForm({ ...form, guestName: e.target.value })}
                placeholder="Nombre completo"
              />
            </div>
            <div>
              <label className="block text-xs mb-1" style={{ color: "var(--muted-foreground)" }}>
                Email
              </label>
              <input
                className="w-full px-3 py-2 rounded text-sm border outline-none"
                style={{
                  background: "var(--muted)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
                value={form.guestEmail}
                onChange={(e) => setForm({ ...form, guestEmail: e.target.value })}
                placeholder="correo@ejemplo.com"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs mb-1" style={{ color: "var(--muted-foreground)" }}>
                Check-in *
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 rounded text-sm border outline-none"
                style={{
                  background: "var(--muted)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                  colorScheme: "dark",
                }}
                value={form.checkIn}
                onChange={(e) => setForm({ ...form, checkIn: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs mb-1" style={{ color: "var(--muted-foreground)" }}>
                Check-out *
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 rounded text-sm border outline-none"
                style={{
                  background: "var(--muted)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                  colorScheme: "dark",
                }}
                value={form.checkOut}
                onChange={(e) => setForm({ ...form, checkOut: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs mb-1" style={{ color: "var(--muted-foreground)" }}>
              Habitación *
            </label>
            <select
              className="w-full px-3 py-2 rounded text-sm border outline-none"
              style={{
                background: "var(--muted)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
              value={form.room}
              onChange={(e) => setForm({ ...form, room: e.target.value })}
            >
              <option value="">Seleccionar habitación...</option>
              {availableRooms.map((r) => (
                <option key={r.number} value={r.number}>
                  {r.number} — {r.type} ({fmt(r.pricePerNight)}/noche)
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs mb-1" style={{ color: "var(--muted-foreground)" }}>
                Adultos
              </label>
              <select
                className="w-full px-3 py-2 rounded text-sm border outline-none"
                style={{
                  background: "var(--muted)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
                value={form.adults}
                onChange={(e) => setForm({ ...form, adults: e.target.value })}
              >
                {[1, 2, 3, 4].map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs mb-1" style={{ color: "var(--muted-foreground)" }}>
                Niños
              </label>
              <select
                className="w-full px-3 py-2 rounded text-sm border outline-none"
                style={{
                  background: "var(--muted)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
                value={form.children}
                onChange={(e) => setForm({ ...form, children: e.target.value })}
              >
                {[0, 1, 2, 3].map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs mb-1" style={{ color: "var(--muted-foreground)" }}>
                Canal
              </label>
              <select
                className="w-full px-3 py-2 rounded text-sm border outline-none"
                style={{
                  background: "var(--muted)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value })}
              >
                {["Directo", "Booking.com", "Expedia", "Airbnb", "Teléfono"].map(
                  (s) => (
                    <option key={s}>{s}</option>
                  )
                )}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs mb-1" style={{ color: "var(--muted-foreground)" }}>
              Notas
            </label>
            <textarea
              className="w-full px-3 py-2 rounded text-sm border outline-none resize-none"
              style={{
                background: "var(--muted)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
              rows={2}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Peticiones especiales, alergias, etc."
            />
          </div>
          {total > 0 && (
            <div
              className="flex items-center justify-between rounded p-3"
              style={{ background: "var(--secondary)" }}
            >
              <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                {nights()} noches × {selectedRoom && fmt(selectedRoom.pricePerNight)}
              </span>
              <span className="mono font-semibold" style={{ color: "var(--primary)" }}>
                {fmt(total)}
              </span>
            </div>
          )}
        </div>
        <div
          className="flex gap-3 px-5 py-4 border-t"
          style={{ borderColor: "var(--border)" }}
        >
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded text-sm font-medium transition-colors"
            style={{
              background: "var(--muted)",
              color: "var(--muted-foreground)",
            }}
          >
            Cancelar
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded text-sm font-semibold transition-colors"
            style={{
              background: "var(--primary)",
              color: "var(--primary-foreground)",
            }}
          >
            Confirmar Reserva
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Views ────────────────────────────────────────────────────────────────────

function Dashboard({ onNewBooking }: { onNewBooking: () => void }) {
  const todayArrivals = RESERVATIONS.filter((r) => r.status === "checkin");
  const todayDepartures = RESERVATIONS.filter((r) => r.status === "checkout");
  const occupied = ROOMS.filter((r) => r.status === "occupied").length;
  const occupancyPct = Math.round((occupied / ROOMS.length) * 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl leading-tight" style={{ color: "var(--foreground)" }}>
            Panel de Control
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--muted-foreground)" }}>
            Viernes, 15 de agosto de 2026
          </p>
        </div>
        <button
          onClick={onNewBooking}
          className="px-4 py-2 rounded text-sm font-semibold transition-all hover:opacity-90"
          style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
        >
          + Nueva Reserva
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard
          label="Ocupación hoy"
          value={`${occupancyPct}%`}
          sub={`${occupied} de ${ROOMS.length} habitaciones`}
          accent
        />
        <KpiCard
          label="Revenue (Ago)"
          value={fmt(21600)}
          sub="↑ 8.4% vs julio"
        />
        <KpiCard
          label="Check-ins hoy"
          value={String(todayArrivals.length)}
          sub="pendientes de llegada"
        />
        <KpiCard
          label="Check-outs hoy"
          value={String(todayDepartures.length)}
          sub="salidas programadas"
        />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue chart */}
        <div
          className="lg:col-span-2 rounded-md p-4 border"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>
              Revenue mensual
            </p>
            <span className="mono text-xs px-2 py-0.5 rounded" style={{ background: "var(--muted)", color: "var(--primary)" }}>
              Últimos 6 meses
            </span>
          </div>
          <BarChart />
        </div>

        {/* Occupancy + sources */}
        <div className="space-y-4">
          <div
            className="rounded-md p-4 border flex items-center gap-4"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}
          >
            <OccupancyRing pct={occupancyPct} />
            <div>
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--muted-foreground)" }}>
                Ocupación
              </p>
              <p className="text-sm" style={{ color: "var(--foreground)" }}>
                {occupied} ocupadas
              </p>
              <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                {ROOMS.filter((r) => r.status === "available").length} disponibles ·{" "}
                {ROOMS.filter((r) => r.status === "cleaning").length} limpieza
              </p>
            </div>
          </div>
          <div
            className="rounded-md p-4 border"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}
          >
            <p className="text-xs uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>
              Canal de reserva
            </p>
            <SourceBar />
          </div>
        </div>
      </div>

      {/* Today activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Arrivals */}
        <div
          className="rounded-md border overflow-hidden"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          <div
            className="px-4 py-3 border-b flex items-center justify-between"
            style={{ borderColor: "var(--border)" }}
          >
            <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
              Llegadas de hoy
            </p>
            <span className="mono text-xs" style={{ color: "var(--primary)" }}>
              {todayArrivals.length} reservas
            </span>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {todayArrivals.length === 0 ? (
              <p className="px-4 py-6 text-sm text-center" style={{ color: "var(--muted-foreground)" }}>
                No hay llegadas programadas
              </p>
            ) : (
              todayArrivals.map((r) => (
                <div key={r.id} className="px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                      {r.guestName}
                    </p>
                    <p className="mono text-xs" style={{ color: "var(--muted-foreground)" }}>
                      Hab. {r.roomNumber} · {r.nights}n · {r.adults}ad
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="mono text-sm font-semibold" style={{ color: "var(--primary)" }}>
                      {fmt(r.total)}
                    </p>
                    <StatusBadge status={r.status} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Departures */}
        <div
          className="rounded-md border overflow-hidden"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          <div
            className="px-4 py-3 border-b flex items-center justify-between"
            style={{ borderColor: "var(--border)" }}
          >
            <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
              Salidas de hoy
            </p>
            <span className="mono text-xs" style={{ color: "#d8b4fe" }}>
              {todayDepartures.length} reservas
            </span>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {todayDepartures.map((r) => (
              <div key={r.id} className="px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                    {r.guestName}
                  </p>
                  <p className="mono text-xs" style={{ color: "var(--muted-foreground)" }}>
                    Hab. {r.roomNumber} · {r.source}
                  </p>
                </div>
                <div className="text-right">
                  <p className="mono text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                    {fmt(r.total)}
                  </p>
                  <StatusBadge status={r.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ReservationsView({ hotelId }: { hotelId: string }) {
  const [reservations, setReservations] = usePersistentState<Reservation[]>(`hoteldirekt.${hotelId}.reservations`, RESERVATIONS);
  const [filter, setFilter] = useState<ReservationStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Reservation | null>(null);

  const filtered = useMemo(
    () =>
      reservations.filter(
        (r) =>
          (filter === "all" || r.status === filter) &&
          (search === "" ||
            r.guestName.toLowerCase().includes(search.toLowerCase()) ||
            r.roomNumber.includes(search) ||
            r.id.toLowerCase().includes(search.toLowerCase()))
      ),
    [filter, search, reservations]
  );

  const tabs: { key: ReservationStatus | "all"; label: string }[] = [
    { key: "all", label: "Todas" },
    { key: "checkin", label: "Check-in hoy" },
    { key: "checkout", label: "Check-out hoy" },
    { key: "confirmed", label: "Confirmadas" },
    { key: "pending", label: "Pendientes" },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl" style={{ color: "var(--foreground)" }}>
          Reservas
        </h1>
        <button
          onClick={() => setEditing({ id: "", guestName: "", guestEmail: "", roomNumber: "", roomType: "Doble Estándar", checkIn: "", checkOut: "", nights: 1, status: "pending", total: 0, adults: 1, children: 0, source: "Directo", notes: "" })}
          className="px-4 py-2 rounded text-sm font-semibold hover:opacity-90 transition-opacity"
          style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
        >
          + Nueva Reserva
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <input
          className="px-3 py-1.5 rounded text-sm border outline-none"
          style={{
            background: "var(--card)",
            borderColor: "var(--border)",
            color: "var(--foreground)",
            minWidth: 200,
          }}
          placeholder="Buscar por huésped, habitación, ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className="px-3 py-1.5 rounded text-xs font-medium transition-colors"
              style={{
                background: filter === t.key ? "var(--primary)" : "var(--card)",
                color:
                  filter === t.key
                    ? "var(--primary-foreground)"
                    : "var(--muted-foreground)",
                border: `1px solid ${filter === t.key ? "transparent" : "var(--border)"}`,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div
        className="rounded-md border overflow-hidden"
        style={{ background: "var(--card)", borderColor: "var(--border)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["ID", "Huésped", "Hab.", "Check-in", "Check-out", "Noches", "Canal", "Total", "Estado", "Acciones"].map(
                  (h) => (
                    <th
                      key={h}
                      className="mono text-left px-4 py-3 text-[10px] uppercase tracking-widest font-medium"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr
                  key={r.id}
                  className="transition-colors hover:bg-[var(--secondary)]"
                  style={{
                    borderBottom:
                      i < filtered.length - 1 ? "1px solid var(--border)" : "none",
                  }}
                >
                  <td className="px-4 py-3">
                    <span className="mono text-xs" style={{ color: "var(--muted-foreground)" }}>
                      {r.id}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium" style={{ color: "var(--foreground)" }}>
                      {r.guestName}
                    </p>
                    <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                      {r.guestEmail}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="mono font-medium" style={{ color: "var(--foreground)" }}>
                      {r.roomNumber}
                    </span>
                    <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                      {r.roomType}
                    </p>
                  </td>
                  <td className="px-4 py-3 mono text-xs whitespace-nowrap" style={{ color: "var(--foreground)" }}>
                    {fmtDate(r.checkIn)}
                  </td>
                  <td className="px-4 py-3 mono text-xs whitespace-nowrap" style={{ color: "var(--foreground)" }}>
                    {fmtDate(r.checkOut)}
                  </td>
                  <td className="px-4 py-3 mono text-center" style={{ color: "var(--muted-foreground)" }}>
                    {r.nights}
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: "var(--muted-foreground)" }}>
                    {r.source}
                  </td>
                  <td className="px-4 py-3">
                    <span className="mono font-semibold" style={{ color: "var(--primary)" }}>
                      {fmt(r.total)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => setEditing({ ...r })} className="text-xs px-2 py-1 rounded transition-colors" style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}>Editar</button>
                      <button onClick={() => { if (confirm(`¿Eliminar ${r.id}?`)) setReservations(items => items.filter(item => item.id !== r.id)); }} className="text-xs px-2 py-1 rounded border" style={{ borderColor: "#7f1d1d", color: "#fca5a5" }}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="text-center py-10 text-sm" style={{ color: "var(--muted-foreground)" }}>
            No se encontraron reservas
          </p>
        )}
      </div>
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(3,7,18,.78)" }}>
          <form onSubmit={event => {
            event.preventDefault();
            const nights = editing.checkIn && editing.checkOut ? Math.max(1, Math.round((new Date(editing.checkOut).getTime() - new Date(editing.checkIn).getTime()) / 86400000)) : editing.nights;
            const saved = { ...editing, nights, id: editing.id || `RES-${Date.now().toString().slice(-5)}` };
            setReservations(items => items.some(item => item.id === saved.id) ? items.map(item => item.id === saved.id ? saved : item) : [saved, ...items]);
            setEditing(null);
          }} className="w-full max-w-2xl rounded-xl border p-6" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <div className="flex items-start justify-between mb-5"><div><p className="mono text-[10px] uppercase tracking-widest" style={{ color: "var(--primary)" }}>Reserva</p><h2 className="text-xl">{editing.id ? "Editar reserva" : "Nueva reserva"}</h2></div><button type="button" onClick={() => setEditing(null)} style={{ color: "var(--muted-foreground)" }}>×</button></div>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Nombre del huésped" value={editing.guestName} onChange={guestName => setEditing({ ...editing, guestName })} required />
              <Field label="Email" type="email" value={editing.guestEmail} onChange={guestEmail => setEditing({ ...editing, guestEmail })} required />
              <Field label="Habitación" value={editing.roomNumber} onChange={roomNumber => setEditing({ ...editing, roomNumber })} required />
              <Field label="Tipo" value={editing.roomType} onChange={roomType => setEditing({ ...editing, roomType })} />
              <Field label="Check-in" type="date" value={editing.checkIn} onChange={checkIn => setEditing({ ...editing, checkIn })} required />
              <Field label="Check-out" type="date" value={editing.checkOut} onChange={checkOut => setEditing({ ...editing, checkOut })} required />
              <Field label="Total ($ USD)" type="number" value={String(editing.total)} onChange={total => setEditing({ ...editing, total: Number(total) })} />
              <Field label="Canal" value={editing.source} onChange={source => setEditing({ ...editing, source })} />
              <div><label className="block text-xs mb-1" style={{ color: "var(--muted-foreground)" }}>Estado</label><select value={editing.status} onChange={event => setEditing({ ...editing, status: event.target.value as ReservationStatus })} className="w-full rounded border px-3 py-2.5 text-sm" style={{ background: "var(--muted)", borderColor: "var(--border)" }}>{Object.entries(statusLabel).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
              <Field label="Adultos" type="number" value={String(editing.adults)} onChange={adults => setEditing({ ...editing, adults: Number(adults) })} />
            </div>
            <div className="flex justify-end gap-2 mt-6"><button type="button" onClick={() => setEditing(null)} className="px-4 py-2 text-sm" style={{ color: "var(--muted-foreground)" }}>Cancelar</button><button type="submit" className="px-5 py-2 rounded text-sm font-semibold" style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>Guardar reserva</button></div>
          </form>
        </div>
      )}
    </div>
  );
}

function RoomsView({
  hotelId,
  hotel,
  allHotels,
  onSelectHotel,
  onGoToGuestWeb,
}: {
  hotelId: string;
  hotel?: PlatformHotel;
  allHotels?: PlatformHotel[];
  onSelectHotel?: (id: string) => void;
  onGoToGuestWeb?: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"client_choices" | "offered_rooms" | "hotels_catalog">("client_choices");
  const [filterStatus, setFilterStatus] = useState<"all" | "upcoming" | "completed" | "cancelled">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [voucherRes, setVoucherRes] = useState<MyReservation | null>(null);
  const [editingOffer, setEditingOffer] = useState<RoomOffer | null>(null);

  // Buscar hotel en el catálogo de Manta
  const currentMantaHotel = MANTA_HOTELS.find(h => h.id === hotelId) || MANTA_HOTELS[0];

  // Tipos de habitaciones ofertadas en la plataforma por este hotel
  const [roomOffers, setRoomOffers] = usePersistentState<RoomOffer[]>(
    `hoteldirekt.${hotelId}.room_offers`,
    currentMantaHotel.rooms || []
  );

  // Reservas hechas por clientes en la plataforma (sincronizadas con la vista del huésped)
  const [clientReservations, setClientReservations] = useState<MyReservation[]>(() => {
    try {
      const saved = localStorage.getItem("hoteldirekt_guest_reservations");
      return saved ? JSON.parse(saved) : INITIAL_DEMO_RESERVATIONS;
    } catch {
      return INITIAL_DEMO_RESERVATIONS;
    }
  });

  function handleUpdateStatus(resId: string, newStatus: "upcoming" | "completed" | "cancelled") {
    const updated = clientReservations.map(r => (r.id === resId ? { ...r, status: newStatus } : r));
    setClientReservations(updated);
    try {
      localStorage.setItem("hoteldirekt_guest_reservations", JSON.stringify(updated));
    } catch {}
  }

  function handleAdjustQuota(offerId: string, delta: number) {
    setRoomOffers(prev => prev.map(o => (o.id === offerId ? { ...o, available: Math.max(0, o.available + delta) } : o)));
  }

  // Filtrar reservas que corresponden a este hotel
  const hotelReservations = clientReservations.filter(r =>
    r.hotelId === hotelId ||
    r.hotel.toLowerCase().includes(currentMantaHotel.name.toLowerCase().slice(0, 8))
  );
  const displayedReservations = (hotelReservations.length > 0 ? hotelReservations : clientReservations).filter(r => {
    const matchesStatus = filterStatus === "all" || r.status === filterStatus;
    const matchesSearch =
      r.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.guestEmail && r.guestEmail.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const totalNights = displayedReservations.reduce((acc, r) => acc + (r.nights || 1), 0);
  const totalRevenue = displayedReservations.reduce((acc, r) => acc + (r.total || 0), 0);

  const statusBadges: Record<string, { bg: string; color: string; label: string }> = {
    upcoming: { bg: "rgba(59, 130, 246, 0.15)", color: "#93c5fd", label: "Próxima estancia" },
    completed: { bg: "rgba(16, 185, 129, 0.15)", color: "#6ee7b7", label: "Pagada / Finalizada" },
    cancelled: { bg: "rgba(239, 68, 68, 0.15)", color: "#fca5a5", label: "Cancelada" },
  };

  return (
    <div className="space-y-6">
      {/* Banner de delimitación conceptual (Sistema de reservas vs PMS) */}
      <div
        className="p-4 rounded-xl border flex items-start gap-3"
        style={{ background: "rgba(245, 158, 11, 0.08)", borderColor: "rgba(245, 158, 11, 0.3)" }}
      >
        <span className="text-2xl flex-shrink-0">🏨</span>
        <div className="text-xs leading-relaxed">
          <p className="font-bold text-amber-400 text-sm">
            Portal de Reservas Hoteleras · Manta (Booking / Extranet)
          </p>
          <p className="mt-0.5" style={{ color: "var(--muted-foreground)" }}>
            Este sistema gestiona la intermediación turística, las <strong>opciones de habitación que los clientes escogieron</strong> y el catálogo de habitaciones publicadas en la web. No incluye módulos de aseo de habitaciones ni llaves físicas de mostrador porque <strong>no es un sistema PMS</strong>.
          </p>
        </div>
      </div>

      {/* Cabecera con selector de pestañas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
            Habitaciones y Reservas del Hotel
          </h1>
          <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
            Hotel activo: <strong style={{ color: "var(--primary)" }}>{currentMantaHotel.name}</strong> ({currentMantaHotel.city})
          </p>
        </div>

        {onGoToGuestWeb && (
          <button
            onClick={onGoToGuestWeb}
            className="px-3.5 py-2 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer self-start sm:self-auto"
          >
            <span>🌐</span>
            <span>Ver cómo lo ve el cliente en la web</span>
          </button>
        )}
      </div>

      {/* Tabs principales */}
      <div className="flex border-b" style={{ borderColor: "var(--border)" }}>
        <button
          onClick={() => setActiveTab("client_choices")}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "client_choices"
              ? "border-amber-400 text-amber-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <span>🧳</span>
          <span>Lo que escogió el Cliente</span>
          <span className="mono text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
            {hotelReservations.length || clientReservations.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("offered_rooms")}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "offered_rooms"
              ? "border-amber-400 text-amber-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <span>🏷️</span>
          <span>Habitaciones Ofertadas en el Portal</span>
          <span className="mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
            {roomOffers.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("hotels_catalog")}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "hotels_catalog"
              ? "border-amber-400 text-amber-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <span>🏨</span>
          <span>Solo los Hoteles de Manta</span>
          <span className="mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
            {MANTA_HOTELS.length}
          </span>
        </button>
      </div>

      {/* ─── PESTAÑA 1: LO QUE EL CLIENTE ESCOGIÓ ────────────────────────────── */}
      {activeTab === "client_choices" && (
        <div className="space-y-5">
          {/* KPIs resumen de reservas del cliente */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <KpiCard
              label="Habitaciones Reservadas"
              value={String(displayedReservations.length)}
              sub="contratadas por turistas"
              accent
            />
            <KpiCard
              label="Noches Totales"
              value={String(totalNights)}
              sub="estancias en el hotel"
            />
            <KpiCard
              label="Total Cobrado en Plataforma"
              value={fmtUsd(totalRevenue)}
              sub="vía pasarela digital"
            />
            <KpiCard
              label="Próximas Llegadas"
              value={String(displayedReservations.filter(r => r.status === "upcoming").length)}
              sub="pendientes de arribo"
            />
          </div>

          {/* Filtros y búsqueda */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Buscar por cliente, habitación (ej. Doble), código (ej. RES-4821)..."
                className="w-full px-3 py-2 pl-9 rounded-lg border text-xs outline-none"
                style={{
                  background: "var(--card)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
              />
              <span className="absolute left-3 top-2.5 text-xs text-slate-400">🔍</span>
            </div>

            <div className="flex gap-1.5">
              {[
                { key: "all", label: "Todas" },
                { key: "upcoming", label: "Próximas" },
                { key: "completed", label: "Pagadas / En estancia" },
                { key: "cancelled", label: "Canceladas" },
              ].map(f => (
                <button
                  key={f.key}
                  onClick={() => setFilterStatus(f.key as any)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer"
                  style={{
                    background: filterStatus === f.key ? "var(--primary)" : "var(--card)",
                    color: filterStatus === f.key ? "var(--primary-foreground)" : "var(--muted-foreground)",
                    border: `1px solid ${filterStatus === f.key ? "transparent" : "var(--border)"}`,
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Listado de tarjetas de habitaciones que los clientes escogieron */}
          {displayedReservations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayedReservations.map(res => {
                const badge = statusBadges[res.status] || statusBadges.upcoming;
                return (
                  <div
                    key={res.id}
                    className="rounded-xl border p-4 transition-all hover:border-amber-500/50 flex flex-col justify-between"
                    style={{ background: "var(--card)", borderColor: "var(--border)" }}
                  >
                    <div>
                      {/* Top: Habitación y código */}
                      <div className="flex items-start justify-between gap-3 pb-3 border-b" style={{ borderColor: "var(--border)" }}>
                        <div className="flex items-center gap-3">
                          <img
                            src={res.image || "https://images.unsplash.com/photo-1781004672179-9790a9623a77?w=120&h=90&fit=crop"}
                            alt={res.room}
                            className="w-16 h-14 rounded-lg object-cover flex-shrink-0"
                          />
                          <div>
                            <span className="mono text-[10px] text-amber-400 font-bold tracking-wider">
                              {res.id}
                            </span>
                            <h3 className="font-bold text-sm text-slate-100 leading-snug">
                              {res.room}
                            </h3>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {res.hotel} · {res.city}
                            </p>
                          </div>
                        </div>
                        <span
                          className="mono text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide flex-shrink-0"
                          style={{ background: badge.bg, color: badge.color }}
                        >
                          {badge.label}
                        </span>
                      </div>

                      {/* Info del Cliente y Estancia */}
                      <div className="grid grid-cols-2 gap-3 py-3 text-xs">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
                            Cliente / Huésped
                          </p>
                          <p className="font-semibold text-slate-200 mt-0.5 truncate">
                            👤 {res.guestName}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate">
                            ✉️ {res.guestEmail}
                          </p>
                          {res.guestPhone && (
                            <p className="text-[11px] text-slate-400 truncate">
                              📞 {res.guestPhone}
                            </p>
                          )}
                        </div>

                        <div>
                          <p className="text-[10px] uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
                            Fechas Seleccionadas
                          </p>
                          <p className="font-semibold text-slate-200 mt-0.5">
                            📅 {fmtDate(res.checkIn)} → {fmtDate(res.checkOut)}
                          </p>
                          <p className="text-[11px] text-amber-400">
                            ⏳ {res.nights} noche{res.nights > 1 ? "s" : ""} reservada{res.nights > 1 ? "s" : ""}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            💳 {res.payMethod || "Cobro digital liquidado"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Bottom: Total cobrado y acciones */}
                    <div
                      className="pt-3 border-t flex flex-wrap items-center justify-between gap-2"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <div>
                        <p className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                          Total cobrado por el portal
                        </p>
                        <p className="mono font-bold text-base text-amber-400">
                          {fmtUsd(res.total)}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setVoucherRes(res)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <span>🧾</span>
                          <span>Ver Voucher</span>
                        </button>

                        {res.status === "upcoming" ? (
                          <button
                            onClick={() => handleUpdateStatus(res.id, "completed")}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-medium border text-emerald-400 hover:bg-emerald-500/10 cursor-pointer"
                            style={{ borderColor: "rgba(16, 185, 129, 0.4)" }}
                          >
                            ✓ Llegada
                          </button>
                        ) : res.status === "completed" ? (
                          <button
                            onClick={() => handleUpdateStatus(res.id, "upcoming")}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-medium border text-slate-400 hover:bg-slate-800 cursor-pointer"
                            style={{ borderColor: "var(--border)" }}
                          >
                            ↺ Revertir
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 rounded-xl border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              <span className="text-3xl block mb-2">🔍</span>
              <p className="font-semibold text-slate-300">No hay reservas con ese criterio para este hotel</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                Puedes probar con el buscador web o consultar las reservas precargadas de Manta.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ─── PESTAÑA 2: HABITACIONES OFERTADAS EN EL PORTAL ────────────────────── */}
      {activeTab === "offered_rooms" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>
                Tipos de Habitación en Oferta Web
              </h2>
              <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                Estas son las opciones y cupos disponibles que los turistas pueden seleccionar en la web de <strong>{currentMantaHotel.name}</strong>.
              </p>
            </div>

            <button
              onClick={() => {
                const newId = `room-${Date.now().toString().slice(-4)}`;
                const newOffer: RoomOffer = {
                  id: newId,
                  type: "Nueva Habitación Manta",
                  beds: "1 cama queen",
                  capacity: 2,
                  size: 24,
                  pricePerNight: 55,
                  image: "https://images.unsplash.com/photo-1780126752257-cae35f118114?w=600&h=380&fit=crop",
                  amenities: ["WiFi gratis", "A/C silencioso", "Baño privado"],
                  available: 4,
                };
                setRoomOffers(prev => [newOffer, ...prev]);
              }}
              className="px-3.5 py-2 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <span>+</span>
              <span>Ofertar nuevo tipo de habitación</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roomOffers.map(offer => (
              <div
                key={offer.id}
                className="rounded-xl border overflow-hidden flex flex-col justify-between"
                style={{ background: "var(--card)", borderColor: "var(--border)" }}
              >
                <div>
                  <div className="relative h-44 w-full">
                    <img src={offer.image} alt={offer.type} className="w-full h-full object-cover" />
                    <div className="absolute top-2.5 right-2.5 px-2 py-1 rounded bg-slate-900/85 text-amber-400 font-mono text-xs font-bold">
                      {fmtUsd(offer.pricePerNight)} / noche
                    </div>
                  </div>

                  <div className="p-4 space-y-2.5">
                    <div>
                      <h3 className="font-bold text-sm text-slate-100">{offer.type}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        🛏️ {offer.beds} · 👥 Máx. {offer.capacity} persona{offer.capacity > 1 ? "s" : ""} · 📐 {offer.size} m²
                      </p>
                    </div>

                    {/* Amenidades */}
                    <div className="flex flex-wrap gap-1">
                      {offer.amenities.map(a => (
                        <span
                          key={a}
                          className="text-[10px] px-2 py-0.5 rounded"
                          style={{ background: "var(--secondary)", color: "var(--muted-foreground)" }}
                        >
                          {a}
                        </span>
                      ))}
                    </div>

                    {/* Gestión de Cupo disponible en la web */}
                    <div className="pt-2 border-t flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
                      <div>
                        <p className="text-[10px] uppercase font-bold" style={{ color: "var(--muted-foreground)" }}>
                          Cupos para venta web
                        </p>
                        <p className="font-mono text-xs font-semibold text-slate-200">
                          {offer.available > 0 ? `${offer.available} disponibles` : "Agotado en la web"}
                        </p>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleAdjustQuota(offer.id, -1)}
                          className="w-7 h-7 rounded border flex items-center justify-center text-xs font-bold hover:bg-slate-800 cursor-pointer"
                          style={{ borderColor: "var(--border)" }}
                        >
                          -
                        </button>
                        <span className="mono text-xs px-2 font-bold text-amber-400">
                          {offer.available}
                        </span>
                        <button
                          onClick={() => handleAdjustQuota(offer.id, 1)}
                          className="w-7 h-7 rounded border flex items-center justify-center text-xs font-bold hover:bg-slate-800 cursor-pointer"
                          style={{ borderColor: "var(--border)" }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <button
                    onClick={() => setEditingOffer(offer)}
                    className="w-full py-1.5 rounded-lg border text-xs font-medium hover:bg-slate-800 transition-colors cursor-pointer text-slate-300"
                    style={{ borderColor: "var(--border)" }}
                  >
                    Editar tarifa y detalles
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── PESTAÑA 3: SOLO LOS HOTELES DE MANTA ──────────────────────────────── */}
      {activeTab === "hotels_catalog" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>
                Catálogo de los 22 Hoteles de Manta
              </h2>
              <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                Selecciona cualquier hotel para ver sus habitaciones ofertadas y reservas de clientes.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {MANTA_HOTELS.map(h => {
              const isSelected = h.id === hotelId;
              return (
                <div
                  key={h.id}
                  className={`rounded-xl border p-3.5 flex flex-col justify-between transition-all ${
                    isSelected ? "border-amber-400 ring-1 ring-amber-400" : "hover:border-slate-500"
                  }`}
                  style={{ background: "var(--card)", borderColor: isSelected ? undefined : "var(--border)" }}
                >
                  <div>
                    <img
                      src={h.image}
                      alt={h.name}
                      className="w-full h-32 rounded-lg object-cover mb-2.5"
                    />
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] text-amber-400 font-bold">
                        {"★".repeat(h.stars)} ({h.stars === 1 ? "Pensión" : h.stars === 2 ? "Hostal" : "Hotel"})
                      </span>
                      <span className="mono text-[10px] text-slate-400">
                        ⭐ {h.rating} ({h.reviews})
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-100 mt-1 leading-tight">
                      {h.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">{h.city}</p>

                    <div className="mt-2 text-xs flex items-center justify-between text-slate-300">
                      <span>Habitaciones: <strong>{h.rooms.length} tipos</strong></span>
                      <span className="font-mono text-amber-400 font-bold">Desde ${h.priceFrom}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t" style={{ borderColor: "var(--border)" }}>
                    {isSelected ? (
                      <span className="block text-center text-xs font-bold text-amber-400 py-1">
                        ● Hotel Activo
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          onSelectHotel?.(h.id);
                          setActiveTab("client_choices");
                        }}
                        className="w-full py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
                      >
                        Gestionar este hotel →
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal de edición de oferta de habitación */}
      {editingOffer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
        >
          <div
            className="w-full max-w-md rounded-2xl border p-6 space-y-4"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="mono text-[10px] text-amber-400 uppercase tracking-widest font-bold">
                  Configuración Web
                </span>
                <h3 className="text-lg font-bold text-slate-100">{editingOffer.type}</h3>
              </div>
              <button
                onClick={() => setEditingOffer(null)}
                className="text-2xl text-slate-400 hover:text-white cursor-pointer"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={e => {
                e.preventDefault();
                setRoomOffers(prev => prev.map(o => (o.id === editingOffer.id ? editingOffer : o)));
                setEditingOffer(null);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-xs text-slate-400 mb-1">Nombre del Tipo de Habitación</label>
                <input
                  type="text"
                  value={editingOffer.type}
                  onChange={e => setEditingOffer({ ...editingOffer, type: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border text-xs outline-none"
                  style={{ background: "var(--muted)", borderColor: "var(--border)", color: "var(--foreground)" }}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Tarifa por Noche ($ USD)</label>
                  <input
                    type="number"
                    min="10"
                    value={editingOffer.pricePerNight}
                    onChange={e => setEditingOffer({ ...editingOffer, pricePerNight: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border text-xs font-mono font-bold outline-none"
                    style={{ background: "var(--muted)", borderColor: "var(--border)", color: "var(--foreground)" }}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Cupos Web Asignados</label>
                  <input
                    type="number"
                    min="0"
                    value={editingOffer.available}
                    onChange={e => setEditingOffer({ ...editingOffer, available: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border text-xs font-mono font-bold outline-none"
                    style={{ background: "var(--muted)", borderColor: "var(--border)", color: "var(--foreground)" }}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Configuración de Camas</label>
                <input
                  type="text"
                  value={editingOffer.beds}
                  onChange={e => setEditingOffer({ ...editingOffer, beds: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border text-xs outline-none"
                  style={{ background: "var(--muted)", borderColor: "var(--border)", color: "var(--foreground)" }}
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t" style={{ borderColor: "var(--border)" }}>
                <button
                  type="button"
                  onClick={() => setEditingOffer(null)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors cursor-pointer"
                >
                  Guardar cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Voucher / Comprobante de Cobro */}
      {voucherRes && (
        <InvoiceModal res={voucherRes} onClose={() => setVoucherRes(null)} />
      )}
    </div>
  );
}

function RevenueView() {
  const maxRev = Math.max(...MONTHLY_REVENUE.map((m) => m.revenue));
  const totalRevenue = MONTHLY_REVENUE.reduce((s, m) => s + m.revenue, 0);
  const avgOccupancy = Math.round(
    MONTHLY_REVENUE.reduce((s, m) => s + m.occupancy, 0) / MONTHLY_REVENUE.length
  );

  const roomTypeRevenue = [
    { type: "Doble Estándar", revenue: 8400, pct: 39 },
    { type: "Simple", revenue: 4200, pct: 19 },
    { type: "Triple", revenue: 3800, pct: 18 },
    { type: "Doble Superior", revenue: 3100, pct: 14 },
    { type: "Suite", revenue: 2100, pct: 10 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl" style={{ color: "var(--foreground)" }}>
          Revenue & Análisis
        </h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--muted-foreground)" }}>
          Período: Marzo — Agosto 2026
        </p>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="Revenue total (6m)" value={fmt(totalRevenue)} sub="últimos 6 meses" accent />
        <KpiCard label="Promedio mensual" value={fmt(Math.round(totalRevenue / 6))} sub="por mes" />
        <KpiCard label="Ocupación media" value={`${avgOccupancy}%`} sub="últimos 6 meses" />
        <KpiCard
          label="RevPAR"
          value={fmt(Math.round((21600 / (ROOMS.length * 31)) * 100) / 100)}
          sub="Revenue por hab. disponible"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Monthly detail table */}
        <div
          className="lg:col-span-2 rounded-md border overflow-hidden"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          <div
            className="px-4 py-3 border-b"
            style={{ borderColor: "var(--border)" }}
          >
            <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
              Detalle mensual
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["Mes", "Revenue", "vs mes ant.", "Ocupación", "Reservas", "Ticket medio"].map(
                    (h) => (
                      <th
                        key={h}
                        className="mono text-left px-4 py-3 text-[10px] uppercase tracking-widest font-medium"
                        style={{ color: "var(--muted-foreground)" }}
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {MONTHLY_REVENUE.map((m, i) => {
                  const prev = MONTHLY_REVENUE[i - 1];
                  const delta = prev
                    ? Math.round(((m.revenue - prev.revenue) / prev.revenue) * 100)
                    : null;
                  const isLast = i === MONTHLY_REVENUE.length - 1;
                  return (
                    <tr
                      key={m.month}
                      className="transition-colors hover:bg-[var(--secondary)]"
                      style={{
                        borderBottom:
                          i < MONTHLY_REVENUE.length - 1
                            ? "1px solid var(--border)"
                            : "none",
                        background: isLast ? "var(--secondary)" : undefined,
                      }}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-1.5 rounded-full"
                            style={{
                              width: Math.round((m.revenue / maxRev) * 80) + "px",
                              background: isLast ? "var(--primary)" : "var(--border)",
                            }}
                          />
                          <span
                            className="mono font-medium"
                            style={{ color: isLast ? "var(--primary)" : "var(--foreground)" }}
                          >
                            {m.month}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 mono font-semibold" style={{ color: isLast ? "var(--primary)" : "var(--foreground)" }}>
                        {fmt(m.revenue)}
                      </td>
                      <td className="px-4 py-3 mono text-xs">
                        {delta !== null ? (
                          <span style={{ color: delta >= 0 ? "#6ee7b7" : "#f87171" }}>
                            {delta >= 0 ? "+" : ""}{delta}%
                          </span>
                        ) : (
                          <span style={{ color: "var(--muted-foreground)" }}>—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-1.5 rounded-full"
                            style={{
                              width: m.occupancy * 0.6 + "px",
                              background: isLast ? "var(--primary)" : "#8b5cf6",
                            }}
                          />
                          <span className="mono text-xs" style={{ color: "var(--foreground)" }}>
                            {m.occupancy}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 mono text-xs" style={{ color: "var(--muted-foreground)" }}>
                        {m.reservations}
                      </td>
                      <td className="px-4 py-3 mono text-xs" style={{ color: "var(--muted-foreground)" }}>
                        {fmt(Math.round(m.revenue / m.reservations))}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Revenue by room type */}
        <div
          className="rounded-md border p-4"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          <p
            className="text-xs uppercase tracking-widest mb-4"
            style={{ color: "var(--muted-foreground)" }}
          >
            Revenue por tipo (Ago)
          </p>
          <div className="space-y-3">
            {roomTypeRevenue.map((rt) => (
              <div key={rt.type}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs" style={{ color: "var(--foreground)" }}>
                    {rt.type}
                  </span>
                  <span className="mono text-xs" style={{ color: "var(--primary)" }}>
                    {fmt(rt.revenue)}
                  </span>
                </div>
                <div
                  className="h-1.5 rounded-full overflow-hidden"
                  style={{ background: "var(--muted)" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${rt.pct}%`,
                      background: "var(--primary)",
                      opacity: 0.3 + rt.pct / 100,
                    }}
                  />
                </div>
                <p className="mono text-[10px] mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                  {rt.pct}% del total
                </p>
              </div>
            ))}
          </div>

          <div
            className="mt-5 pt-4 border-t"
            style={{ borderColor: "var(--border)" }}
          >
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "var(--muted-foreground)" }}>
              Por canal (Ago)
            </p>
            <SourceBar />
          </div>
        </div>
      </div>
    </div>
  );
}

function GuestsView({ hotelId }: { hotelId: string }) {
  const initialGuests: GuestRecord[] = RESERVATIONS.map((r) => ({
    id: `guest-${r.id}`,
    name: r.guestName,
    email: r.guestEmail,
    phone: "",
    document: "",
    country: "España",
    notes: "",
    visits: RESERVATIONS.filter((rr) => rr.guestEmail === r.guestEmail).length,
    totalSpend: RESERVATIONS.filter((rr) => rr.guestEmail === r.guestEmail).reduce(
      (s, rr) => s + rr.total,
      0
    ),
    lastVisit: r.checkIn,
    source: r.source,
  })).filter(
    (g, i, arr) => arr.findIndex((gg) => gg.email === g.email) === i
  );
  const [guests, setGuests] = usePersistentState<GuestRecord[]>(`hoteldirekt.${hotelId}.guests`, initialGuests);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<GuestRecord | null>(null);
  const visibleGuests = guests.filter(guest => `${guest.name} ${guest.email} ${guest.document}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl" style={{ color: "var(--foreground)" }}>
          Huéspedes
        </h1>
        <div className="flex gap-3">
          <span className="mono text-xs px-3 py-1.5 rounded" style={{ background: "var(--card)", color: "var(--muted-foreground)", border: "1px solid var(--border)" }}>
            {guests.length} registrados
          </span>
          <button onClick={() => setEditing({ id: "", name: "", email: "", phone: "", document: "", country: "España", notes: "", visits: 0, totalSpend: 0, lastVisit: new Date().toISOString().split("T")[0], source: "Directo" })} className="px-3 py-1.5 rounded text-xs font-semibold" style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>+ Huésped</button>
        </div>
      </div>

      <input value={search} onChange={event => setSearch(event.target.value)} placeholder="Buscar por nombre, email o documento..." className="w-full max-w-sm rounded border px-3 py-2 text-sm outline-none" style={{ background: "var(--card)", borderColor: "var(--border)" }} />

      <div
        className="rounded-md border overflow-hidden"
        style={{ background: "var(--card)", borderColor: "var(--border)" }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              {["Huésped", "Contacto", "Documento", "Visitas", "Gasto total", "Última visita", "Acciones"].map(
                (h) => (
                  <th
                    key={h}
                    className="mono text-left px-4 py-3 text-[10px] uppercase tracking-widest font-medium"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {visibleGuests.map((g, i) => (
              <tr
                key={g.email}
                className="hover:bg-[var(--secondary)] transition-colors"
                style={{
                    borderBottom: i < visibleGuests.length - 1 ? "1px solid var(--border)" : "none",
                }}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                      style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
                    >
                      {g.name.charAt(0)}
                    </div>
                    <span className="font-medium" style={{ color: "var(--foreground)" }}>
                      {g.name}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: "var(--muted-foreground)" }}><p>{g.email}</p><p>{g.phone || "Sin teléfono"}</p></td>
                <td className="px-4 py-3 mono text-xs" style={{ color: "var(--muted-foreground)" }}>{g.document || "Pendiente"}</td>
                <td className="px-4 py-3 mono text-center">
                  <span
                    className="px-2 py-0.5 rounded text-xs font-semibold"
                    style={{
                      background: g.visits > 1 ? "rgba(245, 158, 11, 0.15)" : "var(--muted)",
                      color: g.visits > 1 ? "#d97706" : "var(--muted-foreground)",
                    }}
                  >
                    {g.visits}
                  </span>
                </td>
                <td className="px-4 py-3 mono font-semibold" style={{ color: "var(--primary)" }}>
                  {fmt(g.totalSpend)}
                </td>
                <td className="px-4 py-3 mono text-xs" style={{ color: "var(--muted-foreground)" }}>
                  {fmtDate(g.lastVisit)}
                </td>
                <td className="px-4 py-3"><div className="flex gap-1"><button onClick={() => setEditing({ ...g })} className="px-2 py-1 rounded text-xs" style={{ background: "var(--muted)" }}>Editar</button><button onClick={() => { if (confirm(`¿Eliminar a ${g.name}?`)) setGuests(items => items.filter(item => item.id !== g.id)); }} className="px-2 py-1 rounded border text-xs" style={{ borderColor: "#7f1d1d", color: "#fca5a5" }}>Eliminar</button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(3,7,18,.78)" }}>
          <form onSubmit={event => { event.preventDefault(); const saved = { ...editing, id: editing.id || `guest-${Date.now()}` }; setGuests(items => items.some(item => item.id === saved.id) ? items.map(item => item.id === saved.id ? saved : item) : [saved, ...items]); setEditing(null); }} className="w-full max-w-xl rounded-xl border p-6" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <div className="flex justify-between mb-5"><div><p className="mono text-[10px] uppercase tracking-widest" style={{ color: "var(--primary)" }}>Ficha del huésped</p><h2 className="text-xl">{editing.id ? "Editar huésped" : "Nuevo huésped"}</h2></div><button type="button" onClick={() => setEditing(null)} style={{ color: "var(--muted-foreground)" }}>×</button></div>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Nombre completo" value={editing.name} onChange={name => setEditing({ ...editing, name })} required />
              <Field label="Email" type="email" value={editing.email} onChange={email => setEditing({ ...editing, email })} required />
              <Field label="Teléfono" value={editing.phone} onChange={phone => setEditing({ ...editing, phone })} />
              <Field label="DNI / Pasaporte" value={editing.document} onChange={document => setEditing({ ...editing, document })} />
              <Field label="País" value={editing.country} onChange={country => setEditing({ ...editing, country })} />
              <Field label="Canal preferido" value={editing.source} onChange={source => setEditing({ ...editing, source })} />
              <Field label="Visitas" type="number" value={String(editing.visits)} onChange={visits => setEditing({ ...editing, visits: Number(visits) })} />
              <Field label="Gasto total" type="number" value={String(editing.totalSpend)} onChange={totalSpend => setEditing({ ...editing, totalSpend: Number(totalSpend) })} />
              <div className="sm:col-span-2"><Field label="Notas" value={editing.notes} onChange={notes => setEditing({ ...editing, notes })} /></div>
            </div>
            <div className="flex justify-end gap-2 mt-6"><button type="button" onClick={() => setEditing(null)} className="px-4 py-2 text-sm" style={{ color: "var(--muted-foreground)" }}>Cancelar</button><button type="submit" className="px-5 py-2 rounded text-sm font-semibold" style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>Guardar huésped</button></div>
          </form>
        </div>
      )}
    </div>
  );
}

// ─── Sidebar nav ──────────────────────────────────────────────────────────────

// ─── Billing data ─────────────────────────────────────────────────────────────

type InvoiceStatus = "paid" | "pending" | "overdue" | "refunded";
type InvoiceDeliveryStatus = "issued" | "error" | "returned";

type Invoice = HotelInvoice;

const INVOICE_STYLE: Record<InvoiceStatus, { bg: string; color: string; label: string }> = {
  paid:     { bg: "rgba(16, 185, 129, 0.15)", color: "#059669", label: "Pagada" },
  pending:  { bg: "rgba(245, 158, 11, 0.15)", color: "#d97706", label: "Pendiente" },
  overdue:  { bg: "rgba(239, 68, 68, 0.15)", color: "#dc2626", label: "Vencida" },
  refunded: { bg: "rgba(59, 130, 246, 0.15)", color: "#2563eb", label: "Reembolsada" },
};
const DELIVERY_STYLE: Record<InvoiceDeliveryStatus, { bg: string; color: string; label: string }> = {
  issued: { bg: "rgba(16, 185, 129, 0.15)", color: "#059669", label: "Autorizada SRI" },
  error: { bg: "rgba(239, 68, 68, 0.15)", color: "#dc2626", label: "Error SRI" },
  returned: { bg: "rgba(245, 158, 11, 0.15)", color: "#d97706", label: "Devuelta" },
};

// ─── Billing view (SRI Ecuador) ───────────────────────────────────────────────

function BillingView({ hotelId, hotel }: { hotelId: string; hotel?: PlatformHotel }) {
  const hotelName = hotel?.name || "Hotel Costa Sol";
  const [invoices, setInvoices] = usePersistentState<HotelInvoice[]>(
    `hoteldirekt.${hotelId}.invoices`,
    getHotelInitialInvoices(hotelId, hotelName)
  );
  const [selected, setSelected] = useState<HotelInvoice | null>(null);
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | "all">("all");
  const [showNewInvoiceModal, setShowNewInvoiceModal] = useState(false);
  const [newInvGuest, setNewInvGuest] = useState("");
  const [newInvNights, setNewInvNights] = useState(2);
  const [newInvBase, setNewInvBase] = useState(130);
  const [newInvDoc, setNewInvDoc] = useState("");

  const filtered = statusFilter === "all" ? invoices : invoices.filter(i => i.status === statusFilter);

  const totalPaid = invoices.filter(i => i.status === "paid").reduce((s, i) => s + i.total, 0);
  const totalPending = invoices.filter(i => i.status === "pending" || i.status === "overdue").reduce((s, i) => s + i.total, 0);
  const totalIva = invoices.reduce((s, i) => s + i.iva, 0);

  function fmtDate(d: string) {
    return new Date(d + "T12:00:00").toLocaleDateString("es-EC", { day: "2-digit", month: "short", year: "numeric" });
  }

  function handleCreateQuickInvoice(e: React.FormEvent) {
    e.preventDefault();
    const sri = HOTEL_SRI_INFO[hotelId] || HOTEL_SRI_INFO["costa-sol"];
    const base = Number(newInvBase);
    const iva = Number((base * 0.15).toFixed(2));
    const hasServicio10 = sri.gravaServicio10 ?? true;
    const servicio10 = hasServicio10 ? Number((base * 0.10).toFixed(2)) : 0;
    const total = Number((base + iva + servicio10).toFixed(2));
    const seq = String(invoices.length + 1).padStart(9, "0");

    const newInv: HotelInvoice = {
      id: `${sri.estab}-${sri.ptoEmi}-${seq}`,
      resId: `RES-${Math.floor(100 + Math.random() * 900)}`,
      guest: newInvGuest || "Cliente Huésped",
      hotel: hotelName,
      hotelId,
      checkIn: new Date().toISOString().split("T")[0],
      checkOut: new Date(Date.now() + newInvNights * 86400000).toISOString().split("T")[0],
      nights: newInvNights,
      base,
      iva,
      servicio10,
      total,
      status: "paid",
      issueDate: new Date().toISOString().split("T")[0],
      payMethod: "PayPhone / Tarjeta",
      deliveryStatus: "issued",
      clientDoc: newInvDoc || "1718293847",
      roomType: "Habitación Estándar",
    };

    setInvoices(current => [newInv, ...current]);
    setShowNewInvoiceModal(false);
    setSelected(newInv);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl" style={{ color: "var(--foreground)" }}>Facturación Electrónica</h1>
            <span className="mono text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
              SRI Ecuador (IVA 15%)
            </span>
          </div>
          <p className="text-xs text-amber-500 font-medium mt-0.5">{hotelName} · RUC: {HOTEL_SRI_INFO[hotelId]?.ruc || "1391789456001"}</p>
        </div>
        <button
          onClick={() => setShowNewInvoiceModal(true)}
          className="px-4 py-2 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-md flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <span>+</span> Emitir Factura SRI
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="Cobrado SRI (Ago)" value={fmtUsd(totalPaid)} sub={`${invoices.filter(i => i.status === "paid").length} facturas autorizadas`} accent />
        <KpiCard label="Pendiente de cobro" value={fmtUsd(totalPending)} sub={`${invoices.filter(i => i.status === "pending" || i.status === "overdue").length} facturas`} />
        <KpiCard label="IVA 15% devengado" value={fmtUsd(totalIva)} sub="Tarifa vigente SRI Ecuador" />
        <KpiCard label="Comprobantes SRI" value={String(invoices.length)} sub={`${invoices.filter(i => i.deliveryStatus === "issued").length} autorizados · 0 rechazados`} />
      </div>

      {/* Filters */}
      <div className="flex gap-1.5 flex-wrap">
        {[{ k: "all" as const, l: "Todas" }, { k: "paid" as const, l: "Pagadas" }, { k: "pending" as const, l: "Pendientes" }, { k: "overdue" as const, l: "Vencidas" }].map(f => (
          <button key={f.k} onClick={() => setStatusFilter(f.k)} className="px-3 py-1.5 rounded text-xs font-medium transition-colors border cursor-pointer" style={{ background: statusFilter === f.k ? "var(--primary)" : "var(--card)", color: statusFilter === f.k ? "var(--primary-foreground)" : "var(--muted-foreground)", borderColor: statusFilter === f.k ? "transparent" : "var(--border)" }}>
            {f.l}
          </button>
        ))}
      </div>

      <div className="rounded-md border overflow-hidden" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Nº Factura SRI", "Reserva", "Huésped", "Fecha", "Subtotal", "IVA 15%", "Total USD", "Método", "Cobro", "Estado SRI", ""].map(h => (
                  <th key={h} className="mono text-left px-4 py-3 text-[10px] uppercase tracking-widest font-medium" style={{ color: "var(--muted-foreground)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv, i) => {
                const st = INVOICE_STYLE[inv.status];
                return (
                  <tr key={inv.id} className="transition-colors hover:bg-[var(--secondary)]" style={{ borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none" }}>
                    <td className="px-4 py-3"><span className="mono text-xs font-semibold text-amber-400">{inv.id}</span></td>
                    <td className="px-4 py-3"><span className="mono text-xs" style={{ color: "var(--muted-foreground)" }}>{inv.resId}</span></td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-sm" style={{ color: "var(--foreground)" }}>{inv.guest}</p>
                      <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{inv.nights}n · {fmtDate(inv.checkIn)}</p>
                    </td>
                    <td className="px-4 py-3 mono text-xs" style={{ color: "var(--muted-foreground)" }}>{fmtDate(inv.issueDate)}</td>
                    <td className="px-4 py-3 mono text-xs" style={{ color: "var(--foreground)" }}>{fmtUsd(inv.base)}</td>
                    <td className="px-4 py-3 mono text-xs" style={{ color: "var(--muted-foreground)" }}>{fmtUsd(inv.iva)}</td>
                    <td className="px-4 py-3 mono font-semibold text-amber-400">{fmtUsd(inv.total)}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: "var(--muted-foreground)" }}>{inv.payMethod}</td>
                    <td className="px-4 py-3"><span className="mono text-[10px] font-medium px-2 py-0.5 rounded uppercase tracking-wide" style={{ background: st.bg, color: st.color }}>{st.label}</span></td>
                    <td className="px-4 py-3">{(() => { const audit = DELIVERY_STYLE[inv.deliveryStatus ?? "issued"]; return <span className="mono text-[10px] font-medium px-2 py-0.5 rounded uppercase tracking-wide flex items-center gap-1 w-fit" style={{ background: audit.bg, color: audit.color }}><span>✔</span> {audit.label}</span>; })()}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSelected(inv)} className="text-xs px-2.5 py-1 rounded font-medium bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500 hover:text-slate-950 transition-colors cursor-pointer">
                        Ver RIDE SRI
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SRI Electronic Invoice Modal */}
      {selected && (
        <SriInvoiceModal
          invoice={selected}
          hotelId={hotelId}
          onClose={() => setSelected(null)}
          onMarkPaid={() => {
            const updated = { ...selected, status: "paid" as InvoiceStatus };
            setInvoices(items => items.map(item => item.id === updated.id ? updated : item));
            setSelected(updated);
          }}
          onReissue={() => {
            const updated = { ...selected, deliveryStatus: "issued" as InvoiceDeliveryStatus };
            setInvoices(items => items.map(item => item.id === updated.id ? updated : item));
            setSelected(updated);
          }}
        />
      )}

      {/* Quick create invoice modal */}
      {showNewInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(3, 7, 18, 0.8)", backdropFilter: "blur(4px)" }}>
          <form onSubmit={handleCreateQuickInvoice} className="w-full max-w-md rounded-2xl border p-6 space-y-4" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: "var(--border)" }}>
              <div>
                <h3 className="text-base font-bold" style={{ color: "var(--foreground)" }}>Nueva Factura Electrónica SRI</h3>
                <p className="text-xs text-amber-500 font-medium">{hotelName}</p>
              </div>
              <button type="button" onClick={() => setShowNewInvoiceModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div>
              <label className="block text-xs mb-1 text-slate-400">Razón Social / Nombre del Huésped *</label>
              <input type="text" required value={newInvGuest} onChange={e => setNewInvGuest(e.target.value)} placeholder="Ej: Diana Salazar" className="w-full rounded border px-3 py-2 text-xs outline-none" style={{ background: "var(--muted)", borderColor: "var(--border)", color: "var(--foreground)" }} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs mb-1 text-slate-400">C.I. / RUC (Ecuador) *</label>
                <input type="text" required value={newInvDoc} onChange={e => setNewInvDoc(e.target.value)} placeholder="1718293847" className="w-full rounded border px-3 py-2 text-xs outline-none" style={{ background: "var(--muted)", borderColor: "var(--border)", color: "var(--foreground)" }} />
              </div>
              <div>
                <label className="block text-xs mb-1 text-slate-400">Noches de Estancia</label>
                <input type="number" min="1" value={newInvNights} onChange={e => setNewInvNights(Number(e.target.value))} className="w-full rounded border px-3 py-2 text-xs outline-none" style={{ background: "var(--muted)", borderColor: "var(--border)", color: "var(--foreground)" }} />
              </div>
            </div>
            <div>
              <label className="block text-xs mb-1 text-slate-400">Subtotal Sin Impuestos (USD) *</label>
              <input type="number" step="0.01" min="1" required value={newInvBase} onChange={e => setNewInvBase(Number(e.target.value))} className="w-full rounded border px-3 py-2 text-xs font-mono font-bold outline-none" style={{ background: "var(--muted)", borderColor: "var(--border)", color: "var(--foreground)" }} />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>IVA 15% SRI: {fmtUsd(newInvBase * 0.15)}</span>
                <span className="font-bold text-amber-400">Total: {fmtUsd(newInvBase * 1.15)}</span>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowNewInvoiceModal(false)} className="px-4 py-2 text-xs text-slate-400 hover:text-white">Cancelar</button>
              <button type="submit" className="px-5 py-2 rounded font-bold text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 shadow">Emitir y Autorizar SRI</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

// ─── Payments view ────────────────────────────────────────────────────────────

function PaymentsView({ hotelId, hotel }: { hotelId: string; hotel: PlatformHotel }) {
  const [payments, setPayments] = usePersistentState<HotelPayment[]>(
    `hoteldirekt.${hotelId}.payments`,
    getHotelInitialPayments(hotelId)
  );
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkPreload, setLinkPreload] = useState<{ guest: string; amount: number; concept: string } | null>(null);

  const completedPayments = payments.filter(p => p.status === "completed");
  const pendingPayments = payments.filter(p => p.status === "pending");
  const failedPayments = payments.filter(p => p.status === "failed");

  const totalCollected = completedPayments.reduce((s, p) => s + p.amount, 0);
  const totalPending = pendingPayments.reduce((s, p) => s + p.amount, 0);
  const totalFailed = failedPayments.reduce((s, p) => s + p.amount, 0);
  const avgTicket = completedPayments.length ? Math.round(totalCollected / completedPayments.length) : 0;

  const methods = useMemo(() => {
    const map = new Map<string, { count: number; amount: number; color: string }>();
    const colors: Record<string, string> = {
      "PayPhone": "#3b82f6",
      "Tarjeta": "#3b82f6",
      "Kushki": "#06b6d4",
      "Efectivo": "#f59e0b",
      "Transferencia": "#8b5cf6",
      "DeUna": "#ec4899",
      "Booking": "#6366f1",
      "Datafast": "#10b981",
    };
    for (const p of payments) {
      let key = "Tarjeta de crédito/débito";
      if (p.method.includes("PayPhone")) key = "PayPhone Ecuador";
      else if (p.method.includes("Kushki")) key = "Kushki Pagos";
      else if (p.method.includes("Efectivo")) key = "Efectivo en recepción";
      else if (p.method.includes("DeUna")) key = "Transferencia DeUna / QR";
      else if (p.method.includes("Transferencia")) key = "Transferencia bancaria";
      else if (p.method.includes("Booking")) key = "OTA (Booking / Expedia)";

      const existing = map.get(key) || { count: 0, amount: 0, color: colors[key.split(" ")[0]] || "#64748b" };
      existing.count += 1;
      existing.amount += p.amount;
      map.set(key, existing);
    }
    const totalAll = Array.from(map.values()).reduce((s, v) => s + v.amount, 0) || 1;
    return Array.from(map.entries()).map(([name, data]) => ({
      name,
      count: data.count,
      amount: data.amount,
      pct: Math.round((data.amount / totalAll) * 100),
      color: data.color,
    }));
  }, [payments]);

  const statusStyle: Record<string, { bg: string; color: string; label: string }> = {
    completed: { bg: "rgba(16, 185, 129, 0.15)", color: "#059669", label: "Completado" },
    pending:   { bg: "rgba(245, 158, 11, 0.15)", color: "#d97706", label: "Pendiente" },
    failed:    { bg: "rgba(239, 68, 68, 0.15)", color: "#dc2626", label: "Fallido" },
  };

  const fmtDate = (d: string) => new Date(d + "T12:00:00").toLocaleDateString("es-EC", { day: "2-digit", month: "short" });

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl" style={{ color: "var(--foreground)" }}>Pagos & Cobros</h1>
          <p className="text-xs text-amber-500 font-medium mt-0.5">{hotel.name} · {hotel.city}</p>
        </div>
        <button
          onClick={() => {
            setLinkPreload(null);
            setShowLinkModal(true);
          }}
          className="px-4 py-2.5 rounded-lg font-bold text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-lg shadow-amber-500/20 flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <span>🔗</span> Crear Link de Pago
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="Cobrado (Ago)" value={fmtUsd(totalCollected)} sub={`${completedPayments.length} pagos completados`} accent />
        <KpiCard label="Pendiente de cobro" value={fmtUsd(totalPending)} sub={`${pendingPayments.length} cobros en espera`} />
        <KpiCard label="Cobros fallidos" value={fmtUsd(totalFailed)} sub={`${failedPayments.length} requieren seguimiento`} />
        <KpiCard label="Ticket medio" value={fmtUsd(avgTicket)} sub="por reserva" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Methods breakdown */}
        <div className="rounded-md border p-4" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "var(--muted-foreground)" }}>Métodos de pago (Ago)</p>
          <div className="space-y-3">
            {methods.map(m => (
              <div key={m.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs" style={{ color: "var(--foreground)" }}>{m.name}</span>
                  <div className="flex gap-3">
                    <span className="mono text-xs" style={{ color: "var(--muted-foreground)" }}>{m.count} cobros</span>
                    <span className="mono text-xs font-semibold" style={{ color: "var(--primary)" }}>{fmtUsd(m.amount)}</span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--muted)" }}>
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${m.pct}%`, background: m.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending collections with Quick Link de Pago button */}
        <div className="rounded-md border overflow-hidden" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
            <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Cobros pendientes</p>
            <span className="mono text-xs px-2 py-0.5 rounded font-bold" style={{ background: "rgba(245, 158, 11, 0.15)", color: "#d97706" }}>
              {fmtUsd(totalPending)} pendiente
            </span>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {pendingPayments.map(p => {
              const st = statusStyle[p.status];
              return (
                <div key={p.id} className="flex items-center justify-between px-4 py-3 gap-2">
                  <div>
                    <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{p.guest}</p>
                    <p className="mono text-xs" style={{ color: "var(--muted-foreground)" }}>{p.method} · {fmtDate(p.date)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="mono font-semibold text-sm" style={{ color: "var(--foreground)" }}>{fmtUsd(p.amount)}</span>
                    <span className="mono text-[10px] px-2 py-0.5 rounded uppercase font-medium" style={{ background: st.bg, color: st.color }}>{st.label}</span>
                    <button
                      onClick={() => {
                        setLinkPreload({ guest: p.guest, amount: p.amount, concept: p.concept || `Estancia - ${p.guest}` });
                        setShowLinkModal(true);
                      }}
                      className="px-2 py-1 rounded text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-500 hover:text-slate-950 transition-colors flex items-center gap-1 cursor-pointer"
                      title="Generar link de pago para este cliente"
                    >
                      <span>🔗</span> Link
                    </button>
                  </div>
                </div>
              );
            })}
            {pendingPayments.length === 0 && (
              <div className="p-4 text-center text-xs text-slate-500">No hay cobros pendientes</div>
            )}
          </div>
        </div>
      </div>

      {/* All payments table */}
      <div className="rounded-md border overflow-hidden" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
          <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Todos los movimientos</p>
          <span className="text-xs text-slate-400 mono">{payments.length} transacciones registradas</span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              {["ID Pago", "Huésped", "Importe (USD)", "Método / Pasarela", "Fecha", "Estado", "Acciones"].map(h => (
                <th key={h} className="mono text-left px-4 py-3 text-[10px] uppercase tracking-widest font-medium" style={{ color: "var(--muted-foreground)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {payments.map((p, i) => {
              const st = statusStyle[p.status];
              return (
                <tr key={p.id} className="hover:bg-[var(--secondary)] transition-colors" style={{ borderBottom: i < payments.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <td className="px-4 py-3 mono text-xs" style={{ color: "var(--muted-foreground)" }}>{p.id}</td>
                  <td className="px-4 py-3 font-medium" style={{ color: "var(--foreground)" }}>
                    <p>{p.guest}</p>
                    {p.concept && <p className="text-[11px] text-slate-500">{p.concept}</p>}
                  </td>
                  <td className="px-4 py-3 mono font-semibold text-amber-400">{fmtUsd(p.amount)}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: "var(--muted-foreground)" }}>
                    <span className="flex items-center gap-1.5">
                      {p.method.includes("PayPhone") ? "📱" : p.method.includes("Kushki") ? "💳" : p.method.includes("DeUna") ? "📲" : "🏦"}
                      {p.method}
                    </span>
                  </td>
                  <td className="px-4 py-3 mono text-xs" style={{ color: "var(--muted-foreground)" }}>{fmtDate(p.date)}</td>
                  <td className="px-4 py-3"><span className="mono text-[10px] px-2 py-0.5 rounded uppercase font-medium" style={{ background: st.bg, color: st.color }}>{st.label}</span></td>
                  <td className="px-4 py-3">
                    {p.status === "pending" ? (
                      <button
                        onClick={() => {
                          setLinkPreload({ guest: p.guest, amount: p.amount, concept: p.concept || `Cobro reserva - ${p.guest}` });
                          setShowLinkModal(true);
                        }}
                        className="text-xs px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500 hover:text-slate-950 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span>🔗</span> Enviar Link
                      </button>
                    ) : (
                      <span className="text-[11px] text-emerald-400 font-medium">✓ Pagado</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Payment Link Modal */}
      {showLinkModal && (
        <PaymentLinkModal
          hotelName={hotel.name}
          initialGuest={linkPreload?.guest}
          initialAmount={linkPreload?.amount}
          initialConcept={linkPreload?.concept}
          onClose={() => {
            setShowLinkModal(false);
            setLinkPreload(null);
          }}
          onPaymentCreated={newPay => {
            setPayments(current => [
              {
                id: newPay.id,
                guest: newPay.guest,
                amount: newPay.amount,
                method: newPay.method,
                date: newPay.date,
                status: newPay.status,
                concept: newPay.concept,
                linkUrl: newPay.linkUrl,
                expiresAt: newPay.expiresAt,
              },
              ...current.filter(p => p.id !== newPay.id),
            ]);
          }}
        />
      )}
    </div>
  );
}

// ─── Rates/pricing view (Per-Hotel Dynamic Rates) ─────────────────────────────

function RatesView({ hotelId, hotel }: { hotelId: string; hotel: PlatformHotel }) {
  const [ratesConfig, setRatesConfig] = usePersistentState<HotelRatesConfig>(
    `hoteldirekt.${hotelId}.rates`,
    DEFAULT_HOTEL_RATES[hotelId] || DEFAULT_HOTEL_RATES["costa-sol"]
  );

  const [editingRoom, setEditingRoom] = useState<RoomRateInfo | null>(null);
  const [showNewTariffModal, setShowNewTariffModal] = useState(false);
  const [newRoomType, setNewRoomType] = useState("");
  const [newRoomPrice, setNewRoomPrice] = useState(100);
  const [newRoomIcon, setNewRoomIcon] = useState("🛏️");

  const { seasons, roomTypes, channels } = ratesConfig;

  function handleSaveRoomPrice(newPrice: number) {
    if (!editingRoom) return;
    setRatesConfig(current => ({
      ...current,
      roomTypes: current.roomTypes.map(r => r.type === editingRoom.type ? { ...r, basePrice: newPrice } : r),
    }));
    setEditingRoom(null);
  }

  function handleAddRoom(e: React.FormEvent) {
    e.preventDefault();
    if (!newRoomType) return;
    setRatesConfig(current => ({
      ...current,
      roomTypes: [
        ...current.roomTypes,
        { type: newRoomType, basePrice: newRoomPrice, icon: newRoomIcon || "🛏️" },
      ],
    }));
    setNewRoomType("");
    setShowNewTariffModal(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl" style={{ color: "var(--foreground)" }}>Tarifas & Precios</h1>
            <span className="mono text-xs px-2.5 py-0.5 rounded font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
              {hotel.name}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{hotel.city} · {hotel.rooms} habitaciones · Precios en USD ($)</p>
        </div>
        <button
          onClick={() => setShowNewTariffModal(true)}
          className="px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity bg-amber-500 text-slate-950 shadow self-start sm:self-auto cursor-pointer"
        >
          + Nueva tarifa especial
        </button>
      </div>

      {/* Season multipliers */}
      <div>
        <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "var(--muted-foreground)" }}>Temporadas</p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {seasons.map(s => (
            <div key={s.name} className="rounded-md border p-4" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>{s.name}</p>
                <span className="mono text-xs px-2 py-0.5 rounded font-bold" style={{ background: s.color, color: "#e8edf5" }}>×{s.multiplier}</span>
              </div>
              <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{s.months}</p>
              <div className="mt-3 space-y-1">
                {roomTypes.slice(0, 3).map(r => (
                  <div key={r.type} className="flex justify-between text-xs">
                    <span style={{ color: "var(--muted-foreground)" }}>{r.type}</span>
                    <span className="mono font-medium" style={{ color: "var(--foreground)" }}>{fmtUsd(r.basePrice * s.multiplier)}/noche</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rate matrix */}
      <div>
        <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "var(--muted-foreground)" }}>Matriz de tarifas por temporada</p>
        <div className="rounded-md border overflow-hidden" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                <th className="mono text-left px-4 py-3 text-[10px] uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>Tipo de habitación</th>
                <th className="mono text-left px-4 py-3 text-[10px] uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>Precio base</th>
                {seasons.map(s => <th key={s.name} className="mono text-left px-4 py-3 text-[10px] uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>{s.name}</th>)}
                <th className="mono text-left px-4 py-3 text-[10px] uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {roomTypes.map((r, i) => (
                <tr key={r.type} className="hover:bg-[#1a2540] transition-colors" style={{ borderBottom: i < roomTypes.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <td className="px-4 py-3">
                    <p className="font-medium" style={{ color: "var(--foreground)" }}>{r.icon} {r.type}</p>
                  </td>
                  <td className="px-4 py-3 mono font-semibold" style={{ color: "var(--primary)" }}>{fmtUsd(r.basePrice)}</td>
                  {seasons.map(s => (
                    <td key={s.name} className="px-4 py-3">
                      <div className="mono text-sm font-medium" style={{ color: s.multiplier > 1 ? "#fcd34d" : s.multiplier < 1 ? "#93c5fd" : "#6ee7b7" }}>
                        {fmtUsd(r.basePrice * s.multiplier)}
                      </div>
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setEditingRoom(r)}
                      className="text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Channel commissions */}
      <div>
        <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "var(--muted-foreground)" }}>Comisiones por canal</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {channels.map(ch => (
            <div key={ch.name} className="rounded-md border p-4" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              <p className="text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>{ch.name}</p>
              <div className="flex items-end gap-1">
                <p className="mono text-2xl font-bold leading-none" style={{ color: ch.commission === 0 ? ch.color : "#e8edf5" }}>{ch.commission}%</p>
                <p className="text-xs mb-0.5" style={{ color: "var(--muted-foreground)" }}>comisión</p>
              </div>
              {ch.commission === 0 ? (
                <p className="text-xs mt-1.5 font-semibold" style={{ color: ch.color }}>✓ Sin comisión</p>
              ) : (
                <p className="text-xs mt-1.5" style={{ color: "var(--muted-foreground)" }}>
                  Sobre precio neto. Por $100 → cobras ${100 - ch.commission}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Edit Room Base Price Modal */}
      {editingRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(3, 7, 18, 0.8)", backdropFilter: "blur(4px)" }}>
          <div className="w-full max-w-sm rounded-xl border p-5 space-y-4" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <h3 className="font-bold text-sm" style={{ color: "var(--foreground)" }}>
              Editar Precio Base · {editingRoom.type}
            </h3>
            <p className="text-xs text-amber-500 font-medium">{hotel.name}</p>
            <div>
              <label className="block text-xs mb-1 text-slate-400">Nuevo Precio Base (USD / noche)</label>
              <input
                type="number"
                min="10"
                step="1"
                defaultValue={editingRoom.basePrice}
                id="editPriceInput"
                className="w-full rounded border px-3 py-2 text-sm font-mono font-bold outline-none"
                style={{ background: "var(--muted)", borderColor: "var(--border)", color: "var(--foreground)" }}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setEditingRoom(null)} className="px-3 py-1.5 text-xs text-slate-400 hover:text-white">Cancelar</button>
              <button
                onClick={() => {
                  const input = document.getElementById("editPriceInput") as HTMLInputElement;
                  if (input) handleSaveRoomPrice(Number(input.value));
                }}
                className="px-4 py-1.5 rounded font-bold text-xs bg-amber-500 hover:bg-amber-400 text-slate-950"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Tariff Modal */}
      {showNewTariffModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(3, 7, 18, 0.8)", backdropFilter: "blur(4px)" }}>
          <form onSubmit={handleAddRoom} className="w-full max-w-sm rounded-xl border p-5 space-y-4" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <h3 className="font-bold text-sm" style={{ color: "var(--foreground)" }}>Nueva Tarifa / Habitación</h3>
            <p className="text-xs text-amber-500 font-medium">{hotel.name}</p>
            <div>
              <label className="block text-xs mb-1 text-slate-400">Nombre de la Habitación / Tarifa *</label>
              <input
                type="text"
                required
                value={newRoomType}
                onChange={e => setNewRoomType(e.target.value)}
                placeholder="Ej: Suite Frente al Mar"
                className="w-full rounded border px-3 py-2 text-xs outline-none"
                style={{ background: "var(--muted)", borderColor: "var(--border)", color: "var(--foreground)" }}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs mb-1 text-slate-400">Icono</label>
                <select
                  value={newRoomIcon}
                  onChange={e => setNewRoomIcon(e.target.value)}
                  className="w-full rounded border px-2 py-2 text-xs outline-none"
                  style={{ background: "var(--muted)", borderColor: "var(--border)", color: "var(--foreground)" }}
                >
                  <option value="🛏️">🛏️ Estándar</option>
                  <option value="⭐🛏️">⭐ Superior</option>
                  <option value="👑🛏️">👑 Suite</option>
                  <option value="🏖️👑">🏖️ Villa</option>
                </select>
              </div>
              <div>
                <label className="block text-xs mb-1 text-slate-400">Precio Base (USD) *</label>
                <input
                  type="number"
                  min="10"
                  required
                  value={newRoomPrice}
                  onChange={e => setNewRoomPrice(Number(e.target.value))}
                  className="w-full rounded border px-3 py-2 text-xs font-mono font-bold outline-none"
                  style={{ background: "var(--muted)", borderColor: "var(--border)", color: "var(--foreground)" }}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowNewTariffModal(false)} className="px-3 py-1.5 text-xs text-slate-400 hover:text-white">Cancelar</button>
              <button type="submit" className="px-4 py-1.5 rounded font-bold text-xs bg-amber-500 hover:bg-amber-400 text-slate-950">Agregar Tarifa</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

const ALL_ROLES: AdminRole[] = ["superadmin", "admin", "manager", "receptionist"];
const MANAGEMENT_ROLES: AdminRole[] = ["superadmin", "admin", "manager"];

const NAV_ITEMS: { view: View; label: string; icon: string; divider?: boolean; roles: AdminRole[] }[] = [
  { view: "hotels", label: "Hoteles de la Red", icon: "🏨", roles: ["superadmin", "admin"] },
  { view: "users", label: "Usuarios y accesos", icon: "👤", roles: ["superadmin", "admin"], divider: true },
  { view: "dashboard", label: "Dashboard Reservas", icon: "📊", roles: MANAGEMENT_ROLES, divider: true },
  { view: "rooms", label: "Habitaciones del Cliente", icon: "🛏️", roles: ALL_ROLES },
  { view: "reservations", label: "Listado de Reservas", icon: "📑", roles: ALL_ROLES },
  { view: "guests", label: "Huéspedes", icon: "👥", roles: ALL_ROLES },
  { view: "billing", label: "Liquidaciones al Hotel", icon: "💰", roles: ["superadmin", "admin", "manager"], divider: true },
  { view: "payments", label: "Comprobantes de Pago", icon: "💳", roles: ALL_ROLES },
  { view: "rates", label: "Tarifas por Temporada", icon: "🏷️", roles: ALL_ROLES },
  { view: "revenue", label: "Métricas del Portal", icon: "📈", roles: MANAGEMENT_ROLES },
];

// ─── Platform hotels data ─────────────────────────────────────────────────────

interface PlatformHotel {
  id: string;
  name: string;
  city: string;
  stars: 1 | 2 | 3;
  rooms: number;
  occupancy: number;
  monthRevenue: number;
  rating: number;
  status: "active" | "paused" | "pending";
  gravaServicio10?: boolean;
  address?: string;
  phone?: string;
  taxId?: string;
  description?: string;
  amenities?: string[];
  gallery?: string[];
}

interface StaffUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: AdminRole;
  hotelIds: string[];
  status: "active" | "invited" | "blocked";
  lastAccess: string;
}

const DEFAULT_HOTELS: PlatformHotel[] = MANTA_HOTELS.map((h, idx) => ({
  id: h.id,
  name: h.name,
  city: h.city,
  stars: h.stars,
  rooms: 12 + ((idx * 3) % 25),
  occupancy: 50 + ((idx * 8) % 45),
  monthRevenue: 6000 + ((idx * 2100) % 24000),
  rating: h.rating,
  status: idx === 13 ? "paused" : "active",
  gravaServicio10: h.gravaServicio10,
  address: h.address,
  phone: h.phone,
  taxId: h.taxId,
  description: h.description,
  amenities: h.amenities,
  gallery: [h.image],
}));

const DEFAULT_STAFF: StaffUser[] = [
  { id: "usr-001", name: "Carlos Admin", email: "admin@hotelmanta.com.ec", phone: "+593 99 100 1001", role: "superadmin", hotelIds: [], status: "active", lastAccess: "Hoy, 09:42" },
  { id: "usr-002", name: "Ana Administradora", email: "direccion@laspalmeras.ec", phone: "+593 98 203 1212", role: "admin", hotelIds: ["las-palmeras"], status: "active", lastAccess: "Hoy, 08:15" },
  { id: "usr-003", name: "María Gerente", email: "gerente@laspalmeras.ec", phone: "+593 99 322 4403", role: "manager", hotelIds: ["las-palmeras"], status: "active", lastAccess: "Ayer, 19:20" },
  { id: "usr-004", name: "Juan Recepción", email: "recepcion@laspalmeras.ec", phone: "+593 98 100 2004", role: "receptionist", hotelIds: ["las-palmeras"], status: "active", lastAccess: "Hoy, 07:03" },
  { id: "usr-005", name: "Lucía Gómez", email: "recepcion@hostalcentro.ec", phone: "+593 99 211 5005", role: "receptionist", hotelIds: ["hostal-centro"], status: "invited", lastAccess: "Pendiente" },
];

const ROLE_INFO: Record<AdminRole, { label: string; color: string; bg: string }> = {
  superadmin: { label: "Superadministrador", color: "#d97706", bg: "rgba(245, 158, 11, 0.15)" },
  admin: { label: "Administrador", color: "#7c3aed", bg: "rgba(124, 58, 237, 0.15)" },
  manager: { label: "Gerente", color: "#2563eb", bg: "rgba(37, 99, 235, 0.15)" },
  receptionist: { label: "Recepcionista", color: "#059669", bg: "rgba(16, 185, 129, 0.15)" },
};

function usePersistentState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) as T : initialValue;
    } catch {
      return initialValue;
    }
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue] as const;
}

// ─── Hotels overview view ─────────────────────────────────────────────────────

function Field({ label, value, onChange, type = "text", required = false }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs mb-1" style={{ color: "var(--muted-foreground)" }}>{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full rounded border px-3 py-2.5 text-sm outline-none"
        style={{ background: "var(--muted)", borderColor: "var(--border)", color: "var(--foreground)" }}
      />
    </div>
  );
}

function HotelsView({ hotels, onSelect, onSave, onDelete, canDelete }: {
  hotels: PlatformHotel[];
  onSelect: (id: string) => void;
  onSave: (hotel: PlatformHotel) => void;
  onDelete: (id: string) => void;
  canDelete: boolean;
}) {
  const [editing, setEditing] = useState<PlatformHotel | null>(null);
  const totalRevenue = hotels.reduce((s, h) => s + h.monthRevenue, 0);
  const activeHotels = hotels.filter(h => h.status === "active");
  const avgOccupancy = activeHotels.length ? Math.round(activeHotels.reduce((s, h) => s + h.occupancy, 0) / activeHotels.length) : 0;
  const activeCount = activeHotels.length;

  const starLabel = (s: 1 | 2 | 3) => s === 1 ? "Pensión" : s === 2 ? "Hostal" : "Hotel";
  const statusStyle: Record<string, { bg: string; color: string; label: string }> = {
    active: { bg: "rgba(16, 185, 129, 0.15)", color: "#059669", label: "Activo" },
    paused: { bg: "rgba(245, 158, 11, 0.15)", color: "#d97706", label: "Pausado" },
    pending: { bg: "rgba(59, 130, 246, 0.15)", color: "#2563eb", label: "Pendiente" },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl" style={{ color: "var(--foreground)" }}>Mis Hoteles</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--muted-foreground)" }}>{activeCount} propiedades activas en la plataforma</p>
        </div>
        {canDelete && <button onClick={() => setEditing({ id: "", name: "", city: "", stars: 3, rooms: 1, occupancy: 0, monthRevenue: 0, rating: 0, status: "pending", address: "", phone: "", taxId: "", description: "", amenities: [], gallery: [] })} className="px-4 py-2 rounded text-sm font-semibold hover:opacity-90 transition-opacity" style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>
          + Añadir hotel
        </button>}
      </div>

      {/* Platform KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="Hoteles activos" value={String(activeCount)} sub={`${hotels.length} en total`} />
        <KpiCard label="Revenue plataforma (Ago)" value={fmtUsd(totalRevenue)} sub="facturado en USD Manta" accent />
        <KpiCard label="Ocupación media" value={`${avgOccupancy}%`} sub="hoteles activos" />
        <KpiCard label="Habitaciones totales" value={String(hotels.reduce((s, h) => s + h.rooms, 0))} sub="en toda la red" />
      </div>

      {/* Hotels table */}
      <div className="rounded-md border overflow-hidden" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Hotel", "Sector", "Cat.", "10% Servicio", "Habs.", "Ocupación", "Revenue (Ago)", "Rating", "Estado", ""].map(h => (
                  <th key={h} className="mono text-left px-4 py-3 text-[10px] uppercase tracking-widest font-medium" style={{ color: "var(--muted-foreground)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hotels.map((h, i) => {
                const ss = statusStyle[h.status];
                const hasServ10 = h.gravaServicio10 ?? true;
                return (
                  <tr key={h.id} className="transition-colors hover:bg-[var(--secondary)]" style={{ borderBottom: i < hotels.length - 1 ? "1px solid var(--border)" : "none" }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {h.gallery?.[0] && <img src={h.gallery[0]} alt="" className="w-12 h-10 rounded object-cover" />}
                        <div><p className="font-medium" style={{ color: "var(--foreground)" }}>{h.name}</p><p className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>{h.amenities?.slice(0, 2).join(" · ")}</p></div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: "var(--muted-foreground)" }}>{h.city}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-0.5">
                        {Array.from({ length: h.stars }).map((_, i) => <span key={i} style={{ color: "#f59e0b", fontSize: 10 }}>★</span>)}
                      </div>
                      <span className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>{starLabel(h.stars)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const updated = { ...h, gravaServicio10: !hasServ10 };
                          onSave(updated);
                        }}
                        title="Clic para activar/desactivar 10% servicio (Art. 41 Ley de Turismo Ecuador)"
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer border ${
                          hasServ10
                            ? "bg-emerald-950/70 text-emerald-300 border-emerald-700 hover:bg-emerald-900"
                            : "bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${hasServ10 ? "bg-emerald-400" : "bg-slate-500"}`} />
                        {hasServ10 ? "+10% Activo" : "Sin Servicio"}
                      </button>
                    </td>
                    <td className="px-4 py-3 mono text-center" style={{ color: "var(--muted-foreground)" }}>{h.rooms}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--muted)" }}>
                          <div className="h-full rounded-full" style={{ width: `${h.occupancy}%`, background: h.occupancy >= 75 ? "#6ee7b7" : h.occupancy >= 50 ? "#f59e0b" : "#f87171" }} />
                        </div>
                        <span className="mono text-xs" style={{ color: "var(--foreground)" }}>{h.occupancy}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 mono font-semibold" style={{ color: "var(--primary)" }}>
                      {fmtUsd(h.monthRevenue)}
                    </td>
                    <td className="px-4 py-3 mono text-sm font-semibold" style={{ color: "#f59e0b" }}>{h.rating}</td>
                    <td className="px-4 py-3">
                      <span className="mono text-[10px] font-medium px-2 py-0.5 rounded uppercase tracking-wide" style={{ background: ss.bg, color: ss.color }}>{ss.label}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => onSelect(h.id)} className="text-xs px-2 py-1.5 rounded font-medium transition-colors" style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>Gestionar</button>
                        <button onClick={() => setEditing({ ...h })} className="text-xs px-2 py-1.5 rounded border" style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}>Editar</button>
                        {canDelete && <button onClick={() => { if (confirm(`¿Eliminar ${h.name}?`)) onDelete(h.id); }} className="text-xs px-2 py-1.5 rounded border" style={{ borderColor: "#7f1d1d", color: "#fca5a5" }}>Eliminar</button>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(3, 7, 18, .78)" }}>
          <form
            onSubmit={e => {
              e.preventDefault();
              const slug = editing.id || `${editing.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${Date.now().toString().slice(-4)}`;
              onSave({ ...editing, id: slug });
              setEditing(null);
            }}
            className="w-full max-w-2xl rounded-xl border p-6"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}
          >
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="mono text-[10px] uppercase tracking-widest" style={{ color: "var(--primary)" }}>Propiedad</p>
                <h2 className="text-xl">{editing.id ? "Editar hotel" : "Nueva propiedad"}</h2>
              </div>
              <button type="button" onClick={() => setEditing(null)} className="text-xl" style={{ color: "var(--muted-foreground)" }}>×</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Nombre" value={editing.name} onChange={name => setEditing({ ...editing, name })} required />
              <Field label="Sector / Ciudad" value={editing.city} onChange={city => setEditing({ ...editing, city })} required />
              <Field label="Dirección" value={editing.address ?? ""} onChange={address => setEditing({ ...editing, address })} />
              <Field label="Teléfono" value={editing.phone ?? ""} onChange={phone => setEditing({ ...editing, phone })} />
              <Field label="RUC Ecuador" value={editing.taxId ?? ""} onChange={taxId => setEditing({ ...editing, taxId })} />
              <Field label="Descripción" value={editing.description ?? ""} onChange={description => setEditing({ ...editing, description })} />
              <Field label="Servicios (separados por comas)" value={(editing.amenities ?? []).join(", ")} onChange={value => setEditing({ ...editing, amenities: value.split(",").map(item => item.trim()).filter(Boolean) })} />
              <Field label="Galería (URLs separadas por comas)" value={(editing.gallery ?? []).join(", ")} onChange={value => setEditing({ ...editing, gallery: value.split(",").map(item => item.trim()).filter(Boolean) })} />
              <div>
                <label className="block text-xs mb-1" style={{ color: "var(--muted-foreground)" }}>Estado</label>
                <select value={editing.status} onChange={e => setEditing({ ...editing, status: e.target.value as PlatformHotel["status"] })} className="w-full rounded border px-3 py-2.5 text-sm outline-none" style={{ background: "var(--muted)", borderColor: "var(--border)" }}>
                  <option value="active">Activo</option><option value="paused">Pausado</option><option value="pending">Pendiente</option>
                </select>
              </div>
              <Field label="Habitaciones" type="number" value={String(editing.rooms)} onChange={rooms => setEditing({ ...editing, rooms: Number(rooms) })} required />
              <Field label="Categoría (1–3)" type="number" value={String(editing.stars)} onChange={stars => setEditing({ ...editing, stars: Math.min(3, Math.max(1, Number(stars))) as 1 | 2 | 3 })} required />
              <div className="sm:col-span-2 flex items-center gap-3 p-3 rounded-lg border border-amber-500/30 bg-amber-500/10">
                <input
                  id="hotel-grava-servicio"
                  type="checkbox"
                  checked={editing.gravaServicio10 ?? true}
                  onChange={e => setEditing({ ...editing, gravaServicio10: e.target.checked })}
                  className="h-4 w-4 rounded accent-amber-500 cursor-pointer"
                />
                <label htmlFor="hotel-grava-servicio" className="text-xs cursor-pointer select-none text-slate-200">
                  <strong className="text-amber-400">Gravar 10% de Servicio Turístico (Art. 41 Ley de Turismo)</strong>
                  <span className="block text-[11px] text-slate-400">Actívalo para hoteles que cobran la propina legal; desactívalo para hostales o pensiones exentas.</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
              <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 rounded text-sm" style={{ color: "var(--muted-foreground)" }}>Cancelar</button>
              <button type="submit" className="px-5 py-2 rounded text-sm font-semibold" style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>Guardar propiedad</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function UsersView({ users, hotels, currentRole, onSave, onDelete }: {
  users: StaffUser[];
  hotels: PlatformHotel[];
  currentRole: AdminRole;
  onSave: (user: StaffUser) => void;
  onDelete: (id: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<StaffUser | null>(null);
  const roleOptions: AdminRole[] = currentRole === "superadmin"
    ? ["superadmin", "admin", "manager", "receptionist"]
    : ["manager", "receptionist"];
  const visibleUsers = users.filter(user => `${user.name} ${user.email} ${ROLE_INFO[user.role].label}`.toLowerCase().includes(search.toLowerCase()));
  const activeUsers = users.filter(user => user.status === "active").length;

  const startNewUser = () => setEditing({
    id: "",
    name: "",
    email: "",
    phone: "",
    role: currentRole === "superadmin" ? "admin" : "manager",
    hotelIds: hotels[0] ? [hotels[0].id] : [],
    status: "invited",
    lastAccess: "Pendiente",
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="mono text-[10px] uppercase tracking-[.18em] mb-1" style={{ color: "var(--primary)" }}>Control de acceso</p>
          <h1 className="text-2xl">Usuarios y permisos</h1>
          <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>Asigna cada cuenta a una propiedad y limita su acceso por rol.</p>
        </div>
        <button onClick={startNewUser} className="px-4 py-2.5 rounded text-sm font-semibold" style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>+ Crear usuario</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="Usuarios" value={String(users.length)} sub="cuentas registradas" />
        <KpiCard label="Activos" value={String(activeUsers)} sub="con acceso habilitado" accent />
        <KpiCard label="Invitaciones" value={String(users.filter(u => u.status === "invited").length)} sub="pendientes de aceptar" />
        <KpiCard label="Propiedades asignadas" value={String(new Set(users.flatMap(u => u.hotelIds)).size)} sub="con equipo activo" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
        <div className="rounded-md border overflow-hidden" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <div className="p-3 border-b flex items-center gap-3" style={{ borderColor: "var(--border)" }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar nombre, email o rol..." className="w-full max-w-sm rounded border px-3 py-2 text-xs outline-none" style={{ background: "var(--muted)", borderColor: "var(--border)" }} />
            <span className="mono text-[10px] ml-auto whitespace-nowrap" style={{ color: "var(--muted-foreground)" }}>{visibleUsers.length} cuentas</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Usuario", "Rol", "Hotel asignado", "Estado", "Último acceso", ""].map(label => <th key={label} className="mono text-left px-4 py-3 text-[10px] uppercase tracking-widest font-medium" style={{ color: "var(--muted-foreground)" }}>{label}</th>)}
              </tr></thead>
              <tbody>
                {visibleUsers.map((user, index) => {
                  const role = ROLE_INFO[user.role];
                  const assignedNames = user.role === "superadmin" ? "Todas las propiedades" : user.hotelIds.map(id => hotels.find(h => h.id === id)?.name).filter(Boolean).join(", ") || "Sin asignar";
                  return (
                    <tr key={user.id} style={{ borderBottom: index < visibleUsers.length - 1 ? "1px solid var(--border)" : "none" }}>
                      <td className="px-4 py-3">
                        <p className="font-medium">{user.name}</p>
                        <p className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>{user.email}</p>
                      </td>
                      <td className="px-4 py-3"><span className="mono text-[9px] uppercase px-2 py-1 rounded" style={{ color: role.color, background: role.bg }}>{role.label}</span></td>
                      <td className="px-4 py-3 text-xs max-w-48" style={{ color: "var(--muted-foreground)" }}>{assignedNames}</td>
                      <td className="px-4 py-3"><span className="text-[10px] font-semibold uppercase" style={{ color: user.status === "active" ? "#6ee7b7" : user.status === "invited" ? "#fcd34d" : "#fca5a5" }}>{user.status === "active" ? "Activo" : user.status === "invited" ? "Invitado" : "Bloqueado"}</span></td>
                      <td className="px-4 py-3 mono text-[10px]" style={{ color: "var(--muted-foreground)" }}>{user.lastAccess}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button onClick={() => setEditing({ ...user })} className="px-2 py-1 rounded border text-xs" style={{ borderColor: "var(--border)" }}>Editar</button>
                          {user.role !== "superadmin" && <button onClick={() => { if (confirm(`¿Eliminar la cuenta de ${user.name}?`)) onDelete(user.id); }} className="px-2 py-1 rounded border text-xs" style={{ borderColor: "#7f1d1d", color: "#fca5a5" }}>Eliminar</button>}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-md border p-4 h-fit" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <p className="mono text-[10px] uppercase tracking-widest mb-4" style={{ color: "var(--primary)" }}>Permisos por rol</p>
          {[
            ["Superadministrador", "Todos los hoteles, usuarios y configuración."],
            ["Administrador", "Todas las funciones de su hotel y su equipo."],
            ["Gerente", "Operación, facturación y analítica; sin usuarios."],
            ["Recepcionista", "Reservas, huéspedes, habitaciones, tarifas y pagos."],
          ].map(([role, description]) => <div key={role} className="pb-3 mb-3 border-b last:border-0 last:mb-0 last:pb-0" style={{ borderColor: "var(--border)" }}><p className="text-xs font-semibold">{role}</p><p className="text-[11px] mt-1 leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{description}</p></div>)}
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(3, 7, 18, .78)" }}>
          <form onSubmit={e => { e.preventDefault(); onSave({ ...editing, id: editing.id || `usr-${Date.now()}` }); setEditing(null); }} className="w-full max-w-xl rounded-xl border p-6" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <div className="flex items-start justify-between mb-5">
              <div><p className="mono text-[10px] uppercase tracking-widest" style={{ color: "var(--primary)" }}>Cuenta de personal</p><h2 className="text-xl">{editing.id ? "Editar usuario" : "Nuevo usuario"}</h2></div>
              <button type="button" onClick={() => setEditing(null)} className="text-xl" style={{ color: "var(--muted-foreground)" }}>×</button>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Nombre completo" value={editing.name} onChange={name => setEditing({ ...editing, name })} required />
              <Field label="Email corporativo" type="email" value={editing.email} onChange={email => setEditing({ ...editing, email })} required />
              <Field label="Teléfono" value={editing.phone} onChange={phone => setEditing({ ...editing, phone })} />
              <div><label className="block text-xs mb-1" style={{ color: "var(--muted-foreground)" }}>Rol</label><select value={editing.role} onChange={e => setEditing({ ...editing, role: e.target.value as AdminRole, hotelIds: e.target.value === "superadmin" ? [] : editing.hotelIds })} className="w-full rounded border px-3 py-2.5 text-sm" style={{ background: "var(--muted)", borderColor: "var(--border)" }}>{roleOptions.map(role => <option key={role} value={role}>{ROLE_INFO[role].label}</option>)}</select></div>
              {editing.role !== "superadmin" && <div><label className="block text-xs mb-1" style={{ color: "var(--muted-foreground)" }}>Hotel asignado</label><select required value={editing.hotelIds[0] ?? ""} onChange={e => setEditing({ ...editing, hotelIds: [e.target.value] })} className="w-full rounded border px-3 py-2.5 text-sm" style={{ background: "var(--muted)", borderColor: "var(--border)" }}><option value="">Seleccionar hotel</option>{hotels.map(hotel => <option key={hotel.id} value={hotel.id}>{hotel.name}</option>)}</select></div>}
              <div><label className="block text-xs mb-1" style={{ color: "var(--muted-foreground)" }}>Estado</label><select value={editing.status} onChange={e => setEditing({ ...editing, status: e.target.value as StaffUser["status"] })} className="w-full rounded border px-3 py-2.5 text-sm" style={{ background: "var(--muted)", borderColor: "var(--border)" }}><option value="active">Activo</option><option value="invited">Invitación pendiente</option><option value="blocked">Bloqueado</option></select></div>
            </div>
            <div className="rounded p-3 mt-4 text-[11px] leading-relaxed" style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}>Al guardar, el usuario recibirá una invitación para crear su contraseña. Los permisos se aplican automáticamente según su rol y hotel asignado.</div>
            <div className="flex justify-end gap-2 mt-5"><button type="button" onClick={() => setEditing(null)} className="px-4 py-2 text-sm" style={{ color: "var(--muted-foreground)" }}>Cancelar</button><button type="submit" className="px-5 py-2 rounded text-sm font-semibold" style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>Guardar usuario</button></div>
          </form>
        </div>
      )}
    </div>
  );
}

// ─── App root ─────────────────────────────────────────────────────────────────

export default function App() {
  const [theme, setTheme] = usePersistentState<"light" | "dark">("hoteldirekt.theme", "light");
  const [appMode, setAppMode] = useState<"auth" | "guest" | "admin">("guest");
  const [authDefaultTab, setAuthDefaultTab] = useState<"guest" | "admin">("guest");
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [guestUser, setGuestUser] = useState<GuestUser | null>(null);
  const [view, setView] = useState<View>("hotels");
  const [activeHotelId, setActiveHotelId] = useState<string>("costa-sol");
  const [showModal, setShowModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hotels, setHotels] = usePersistentState<PlatformHotel[]>("hoteldirekt.hotels", DEFAULT_HOTELS);
  const [staffUsers, setStaffUsers] = usePersistentState<StaffUser[]>("hoteldirekt.staff", DEFAULT_STAFF);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Auth page (only for admin access or when guest needs to log in)
  if (appMode === "auth") {
    return (
      <AuthPage
        defaultTab={authDefaultTab}
        onAdminLogin={user => {
          setAdminUser(user);
          const firstHotel = user.hotelIds?.[0];
          if (firstHotel) setActiveHotelId(firstHotel);
          setView(user.role === "superadmin" ? "hotels" : user.role === "receptionist" ? "reservations" : "dashboard");
          setAppMode("admin");
        }}
        onGuestLogin={user => { setGuestUser(user); setAppMode("guest"); }}
        onBackToGuest={() => setAppMode("guest")}
        theme={theme}
        onToggleTheme={() => setTheme(t => t === "light" ? "dark" : "light")}
      />
    );
  }

  // Guest platform — default entry point
  if (appMode === "guest") {
    return (
      <GuestPage
        user={guestUser}
        onGuestLogin={user => setGuestUser(user)}
        onLogout={() => setGuestUser(null)}
        onAdminAccess={() => { setAuthDefaultTab("admin"); setAppMode("auth"); }}
        theme={theme}
        onToggleTheme={() => setTheme(t => t === "light" ? "dark" : "light")}
      />
    );
  }

  const role = adminUser?.role ?? "receptionist";
  const allowedHotels = role === "superadmin" ? hotels : hotels.filter(h => adminUser?.hotelIds?.includes(h.id));
  const activeHotel = allowedHotels.find(h => h.id === activeHotelId) ?? allowedHotels[0] ?? hotels[0];
  const visibleStaff = role === "superadmin" ? staffUsers : staffUsers.filter(user => user.hotelIds.some(id => adminUser?.hotelIds?.includes(id)));

  return (
    <div className="flex min-h-screen" style={{ background: "var(--background)" }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 flex flex-col border-r transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        style={{
          width: 200,
          background: "var(--card)",
          borderColor: "var(--border)",
          flexShrink: 0,
        }}
      >
        {/* Logo */}
        <div className="px-4 py-3.5 border-b" style={{ borderColor: "var(--border)" }}>
          <h2 className="text-base font-bold leading-tight" style={{ color: "var(--primary)" }}>
            HotelDirekt Manta
          </h2>
          <p className="text-[10px] text-slate-400 mt-0.5">Portal de Reservas Hoteleras</p>
          {adminUser && (
            <div className="mt-1.5 flex items-center gap-1.5">
              <span className="mono text-[9px] px-1.5 py-0.5 rounded uppercase font-bold" style={{ background: ROLE_INFO[adminUser.role].bg, color: ROLE_INFO[adminUser.role].color }}>
                {ROLE_INFO[adminUser.role].label}
              </span>
              <span className="text-[10px] truncate" style={{ color: "var(--muted-foreground)" }}>{adminUser.name.split(" ")[0]}</span>
            </div>
          )}
        </div>

        {/* Botón rápido a la web de huéspedes */}
        <div className="px-3 pt-2.5 pb-1">
          <button
            onClick={() => setAppMode("guest")}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer shadow-xs"
          >
            <span>🌐</span>
            <span>Ver Web de Huéspedes</span>
          </button>
        </div>

        {/* Hotel selector */}
        {view !== "hotels" && view !== "users" && activeHotel && (
          <div className="px-3 pt-3 pb-2 border-b" style={{ borderColor: "var(--border)" }}>
            <p className="mono text-[9px] uppercase tracking-widest mb-1" style={{ color: "var(--muted-foreground)" }}>Hotel activo</p>
            <select
              className="w-full px-2 py-1.5 rounded text-xs font-medium border outline-none cursor-pointer hover:border-amber-500/50 transition-colors"
              style={{ background: "var(--secondary)", borderColor: "var(--border)", color: "var(--foreground)" }}
              value={activeHotelId}
              disabled={false}
              onChange={e => setActiveHotelId(e.target.value)}
            >
              {hotels.map(h => (
                <option key={h.id} value={h.id}>{h.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 p-2 space-y-0.5 mt-1">
          {NAV_ITEMS.filter(item => item.roles.includes(role)).map((item) => (
            <div key={item.view}>
              {item.divider && (
                <div className="border-t my-1.5" style={{ borderColor: "var(--border)" }} />
              )}
              <button
                onClick={() => {
                  setView(item.view);
                  setSidebarOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded text-sm transition-all"
                style={{
                  background: view === item.view ? "var(--secondary)" : "transparent",
                  color: view === item.view ? "var(--foreground)" : "var(--muted-foreground)",
                  borderLeft: view === item.view ? "2px solid var(--primary)" : "2px solid transparent",
                }}
              >
                <span className="mono w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold leading-none" style={{ background: "var(--muted)" }}>{item.icon}</span>
                {item.label}
              </button>
            </div>
          ))}
        </nav>

        {/* Ver web + tema + logout */}
        <div className="px-2 pb-1 space-y-1.5">
          {/* Botón de cambio de tema Claro / Oscuro */}
          <button
            onClick={() => setTheme(t => (t === "light" ? "dark" : "light"))}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all border cursor-pointer hover:border-amber-500/50 shadow-xs"
            style={{ background: "var(--muted)", borderColor: "var(--border)", color: "var(--foreground)" }}
            title="Alternar entre modo claro y modo oscuro"
          >
            <span className="flex items-center gap-1.5">
              <span>{theme === "light" ? "☀️" : "🌙"}</span>
              <span>{theme === "light" ? "Modo Claro" : "Modo Oscuro"}</span>
            </span>
            <span className="mono text-[10px] px-1.5 py-0.5 rounded font-bold uppercase" style={{ background: "var(--secondary)", color: "var(--primary)" }}>
              {theme === "light" ? "Claro" : "Oscuro"}
            </span>
          </button>

          <button
            onClick={() => setAppMode("guest")}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer"
            style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}
          >
            Ver web cliente
          </button>
          <button
            onClick={() => { setAdminUser(null); setAppMode("auth"); }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer"
            style={{ background: "var(--muted)", color: "#fca5a5" }}
          >
            ← Cerrar sesión
          </button>
        </div>

        {/* Bottom */}
        <div className="p-4 border-t" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
              style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
            >
              A
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium truncate" style={{ color: "var(--foreground)" }}>
                {adminUser?.name ?? "Admin"}
              </p>
              <p className="mono text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                {adminUser?.email ?? ""}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar (mobile) */}
        <div
          className="lg:hidden flex items-center justify-between px-4 py-3 border-b"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-lg"
              style={{ color: "var(--foreground)" }}
            >
              ☰
            </button>
            <span className="font-bold text-sm" style={{ color: "var(--primary)" }}>
              HotelDirekt Manta
            </span>
          </div>
          <button
            onClick={() => setTheme(t => (t === "light" ? "dark" : "light"))}
            className="text-sm px-2 py-1 rounded border cursor-pointer"
            style={{ background: "var(--muted)", borderColor: "var(--border)" }}
            title="Cambiar tema"
          >
            {theme === "light" ? "☀️" : "🌙"}
          </button>
        </div>

        {/* Content */}
        <main className="flex-1 p-5 lg:p-8 overflow-auto">
          {view === "hotels" && (
            <HotelsView
              hotels={allowedHotels}
              onSelect={id => { setActiveHotelId(id); setView("dashboard"); }}
              onSave={hotel => setHotels(current => current.some(item => item.id === hotel.id) ? current.map(item => item.id === hotel.id ? hotel : item) : [...current, hotel])}
              onDelete={id => setHotels(current => current.filter(hotel => hotel.id !== id))}
              canDelete={role === "superadmin"}
            />
          )}
          {view === "users" && (
            <UsersView
              users={visibleStaff}
              hotels={allowedHotels}
              currentRole={role}
              onSave={user => setStaffUsers(current => current.some(item => item.id === user.id) ? current.map(item => item.id === user.id ? user : item) : [...current, user])}
              onDelete={id => setStaffUsers(current => current.filter(user => user.id !== id))}
            />
          )}
          {view === "dashboard" && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs px-1 pb-1 border-b" style={{ borderColor: "var(--border)" }}>
                <span style={{ color: "var(--muted-foreground)" }}>Gestionando:</span>
                <span className="font-semibold" style={{ color: "var(--primary)" }}>{activeHotel?.name}</span>
                <span style={{ color: "var(--muted-foreground)" }}>·</span>
                <span style={{ color: "var(--muted-foreground)" }}>{activeHotel?.city}</span>
              </div>
              <Dashboard onNewBooking={() => setShowModal(true)} />
            </div>
          )}
          {view === "reservations" && activeHotel && <ReservationsView key={activeHotel.id} hotelId={activeHotel.id} />}
          {view === "rooms" && activeHotel && (
            <RoomsView
              key={activeHotel.id}
              hotelId={activeHotel.id}
              hotel={activeHotel}
              allHotels={allowedHotels}
              onSelectHotel={id => setActiveHotelId(id)}
              onGoToGuestWeb={() => setAppMode("guest")}
            />
          )}
          {view === "revenue" && <RevenueView />}
          {view === "guests" && activeHotel && <GuestsView key={activeHotel.id} hotelId={activeHotel.id} />}
          {view === "billing" && activeHotel && <BillingView key={activeHotel.id} hotelId={activeHotel.id} hotel={activeHotel} />}
          {view === "payments" && activeHotel && <PaymentsView key={activeHotel.id} hotelId={activeHotel.id} hotel={activeHotel} />}
          {view === "rates" && activeHotel && <RatesView key={activeHotel.id} hotelId={activeHotel.id} hotel={activeHotel} />}
        </main>
      </div>

      {showModal && <NewBookingModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
