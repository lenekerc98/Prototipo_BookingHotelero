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
  HOTEL_COMMERCIAL_INFO,
  getHotelInitialInvoices,
  getHotelInitialPayments,
  fmtUsd,
  getIvaDecretoConfig,
  setIvaDecretoConfig,
  getActiveIvaPercent,
  getAuditLogs,
  addAuditLog,
  playNewBookingSound,
  type HotelRatesConfig,
  type RoomRateInfo,
  type SeasonInfo,
  type HotelInvoice,
  type HotelPayment,
  type AuditLogEntry,
} from "./hotelData";

// ─── Types ────────────────────────────────────────────────────────────────────

type View = "hotels" | "users" | "dashboard" | "reservations" | "rooms" | "revenue" | "guests" | "billing" | "payments" | "rates";

type ReservationStatus =
  | "confirmed"
  | "pending"
  | "validated"
  | "completed"
  | "cancelled"
  | "checkin"
  | "checkout";

type RoomStatus = "available" | "occupied";

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
  voucherValidated?: boolean;
  voucherValidatedAt?: string;
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
    roomNumber: "Cupo Web #1",
    roomType: "Doble Estándar",
    checkIn: "2026-08-15",
    checkOut: "2026-08-18",
    nights: 3,
    status: "validated",
    total: 210,
    adults: 2,
    children: 0,
    source: "Portal AlojaManta",
    voucherValidated: true,
    voucherValidatedAt: "15/08/2026 14:15",
  },
  {
    id: "RES-002",
    guestName: "Laura Fernández",
    guestEmail: "lfernandez@hotmail.com",
    roomNumber: "Cupo Web #2",
    roomType: "Simple",
    checkIn: "2026-08-15",
    checkOut: "2026-08-16",
    nights: 1,
    status: "completed",
    total: 55,
    adults: 1,
    children: 0,
    source: "Directo Web",
    voucherValidated: true,
    voucherValidatedAt: "15/08/2026 13:50",
  },
  {
    id: "RES-003",
    guestName: "Familia Rodríguez",
    guestEmail: "jrodriguez@yahoo.com",
    roomNumber: "Cupo Web #3",
    roomType: "Triple Familiar",
    checkIn: "2026-08-16",
    checkOut: "2026-08-20",
    nights: 4,
    status: "confirmed",
    total: 440,
    adults: 2,
    children: 1,
    source: "Portal AlojaManta",
    notes: "Cama supletoria para niño solicitada",
  },
  {
    id: "RES-004",
    guestName: "Miguel Torres",
    guestEmail: "mtorres@empresa.ec",
    roomNumber: "Cupo Web #4",
    roomType: "Doble Estándar",
    checkIn: "2026-08-17",
    checkOut: "2026-08-19",
    nights: 2,
    status: "confirmed",
    total: 140,
    adults: 1,
    children: 0,
    source: "Directo Web",
    notes: "Requiere recibo corporativo del hotel",
  },
  {
    id: "RES-005",
    guestName: "Ana Gómez",
    guestEmail: "agomez@gmail.com",
    roomNumber: "Cupo Web #5",
    roomType: "Simple",
    checkIn: "2026-08-18",
    checkOut: "2026-08-21",
    nights: 3,
    status: "pending",
    total: 165,
    adults: 1,
    children: 0,
    source: "Link de Pago",
  },
  {
    id: "RES-006",
    guestName: "Roberto Silva",
    guestEmail: "rsilva@gmail.com",
    roomNumber: "Cupo Web #6",
    roomType: "Doble Estándar",
    checkIn: "2026-08-14",
    checkOut: "2026-08-15",
    nights: 1,
    status: "completed",
    total: 70,
    adults: 2,
    children: 0,
    source: "Portal AlojaManta",
    voucherValidated: true,
  },
  {
    id: "RES-007",
    guestName: "Patricia Ruiz",
    guestEmail: "pruiz@hotmail.com",
    roomNumber: "Cupo Web #7",
    roomType: "Triple Familiar",
    checkIn: "2026-08-19",
    checkOut: "2026-08-22",
    nights: 3,
    status: "confirmed",
    total: 330,
    adults: 2,
    children: 2,
    source: "Directo Web",
  },
  {
    id: "RES-008",
    guestName: "Daniel Castro",
    guestEmail: "dcastro@outlook.com",
    roomNumber: "Cupo Web #8",
    roomType: "Simple",
    checkIn: "2026-08-20",
    checkOut: "2026-08-23",
    nights: 3,
    status: "pending",
    total: 165,
    adults: 1,
    children: 0,
    source: "Portal AlojaManta",
  },
];

const ROOMS: Room[] = [
  { number: "101", type: "Doble Estándar", floor: 1, status: "occupied", pricePerNight: 70, capacity: 2, amenities: ["WiFi", "TV", "A/C"], guestName: "Carlos Méndez", checkOut: "2026-08-18" },
  { number: "102", type: "Simple", floor: 1, status: "available", pricePerNight: 55, capacity: 1, amenities: ["WiFi", "TV"] },
  { number: "103", type: "Simple", floor: 1, status: "available", pricePerNight: 55, capacity: 1, amenities: ["WiFi", "TV"] },
  { number: "104", type: "Doble Estándar", floor: 1, status: "available", pricePerNight: 70, capacity: 2, amenities: ["WiFi", "TV", "A/C"] },
  { number: "105", type: "Doble Estándar", floor: 1, status: "available", pricePerNight: 70, capacity: 2, amenities: ["WiFi", "TV", "A/C"] },
  { number: "106", type: "Simple", floor: 1, status: "available", pricePerNight: 55, capacity: 1, amenities: ["WiFi", "TV"] },
  { number: "107", type: "Simple", floor: 1, status: "available", pricePerNight: 55, capacity: 1, amenities: ["WiFi", "TV"] },
  { number: "108", type: "Doble Estándar", floor: 1, status: "available", pricePerNight: 70, capacity: 2, amenities: ["WiFi", "TV", "A/C"] },
  { number: "110", type: "Doble Estándar", floor: 1, status: "available", pricePerNight: 70, capacity: 2, amenities: ["WiFi", "TV", "A/C"] },
  { number: "201", type: "Doble Superior", floor: 2, status: "available", pricePerNight: 85, capacity: 2, amenities: ["WiFi", "TV", "A/C", "Minibar"] },
  { number: "203", type: "Simple", floor: 2, status: "available", pricePerNight: 55, capacity: 1, amenities: ["WiFi", "TV"] },
  { number: "205", type: "Simple", floor: 2, status: "occupied", pricePerNight: 55, capacity: 1, amenities: ["WiFi", "TV"], guestName: "Laura Fernández" },
  { number: "207", type: "Doble Superior", floor: 2, status: "occupied", pricePerNight: 85, capacity: 2, amenities: ["WiFi", "TV", "A/C", "Minibar"], guestName: "Invitado", checkOut: "2026-08-17" },
  { number: "208", type: "Simple", floor: 2, status: "available", pricePerNight: 55, capacity: 1, amenities: ["WiFi", "TV"] },
  { number: "210", type: "Doble Superior", floor: 2, status: "available", pricePerNight: 85, capacity: 2, amenities: ["WiFi", "TV", "A/C", "Minibar"] },
  { number: "301", type: "Triple", floor: 3, status: "available", pricePerNight: 110, capacity: 3, amenities: ["WiFi", "TV", "A/C", "Bañera"] },
  { number: "302", type: "Triple", floor: 3, status: "available", pricePerNight: 110, capacity: 3, amenities: ["WiFi", "TV", "A/C", "Bañera"] },
  { number: "303", type: "Suite", floor: 3, status: "occupied", pricePerNight: 150, capacity: 4, amenities: ["WiFi", "TV", "A/C", "Jacuzzi", "Minibar", "Vista al mar"], guestName: "VIP Guest", checkOut: "2026-08-19" },
  { number: "304", type: "Suite", floor: 3, status: "available", pricePerNight: 150, capacity: 4, amenities: ["WiFi", "TV", "A/C", "Jacuzzi", "Minibar", "Vista al mar"] },
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
  { name: "Portal AlojaManta", value: 48, color: "#f59e0b" },
  { name: "Directo Web", value: 28, color: "#10b981" },
  { name: "Link PayPhone", value: 15, color: "#3b82f6" },
  { name: "DeUna QR", value: 9, color: "#ec4899" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const statusLabel: Record<ReservationStatus, string> = {
  confirmed: "Confirmada",
  pending: "Por Confirmar",
  validated: "Voucher QR Validado",
  completed: "Liquidada",
  cancelled: "Cancelada",
  checkin: "Voucher QR Validado",
  checkout: "Liquidada",
};

const roomStatusLabel: Record<RoomStatus, string> = {
  available: "Cupo Disponible",
  occupied: "Cupo Reservado",
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
  const normalizedStatus =
    status === "validated"
      ? "checkin"
      : status === "completed"
      ? "checkout"
      : status;
  const cls =
    type === "reservation"
      ? `badge-${normalizedStatus}`
      : `badge-${normalizedStatus}`;
  const label =
    type === "reservation"
      ? statusLabel[status as ReservationStatus] || status
      : roomStatusLabel[status as RoomStatus] || status;
  return (
    <span
      className={`mono text-[10px] font-medium px-2 py-0.5 rounded uppercase tracking-wide ${cls}`}
    >
      {label}
    </span>
  );
}

// RF-21: Conmutador Rápido de Emergencia IVA 15% / 8% por Decreto Presidencial
function IvaEmergencySwitchBanner({ userName = "Administrador" }: { userName?: string }) {
  const [ivaCfg, setIvaCfgState] = useState(() => getIvaDecretoConfig());

  useEffect(() => {
    const sync = () => setIvaCfgState(getIvaDecretoConfig());
    window.addEventListener("alojamanta-iva-change", sync);
    return () => window.removeEventListener("alojamanta-iva-change", sync);
  }, []);

  function toggleIva(enable8: boolean) {
    const updated = {
      ...ivaCfg,
      ivaReducido8Activo: enable8,
      actualizadoPor: `${userName} (${new Date().toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" })})`,
    };
    setIvaDecretoConfig(updated);
    setIvaCfgState(updated);
    addAuditLog({
      usuario: userName,
      rol: "Administración Tributaria",
      modulo: "Motor Tributario LORTI (RF-21)",
      accion: enable8 ? "ACTIVAR_IVA_8_FERIADO" : "RESTAURAR_IVA_15_ORDINARIO",
      detalle: enable8
        ? `Activado IVA reducido 8% por ${updated.decretoReferencia} (${updated.nombreFeriado})`
        : "Restaurada tarifa ordinaria de IVA 15% en el motor de reservas cantonal",
    });
  }

  return (
    <div
      className="rounded-xl border p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3"
      style={{
        background: ivaCfg.ivaReducido8Activo ? "rgba(16, 185, 129, 0.1)" : "var(--card)",
        borderColor: ivaCfg.ivaReducido8Activo ? "rgba(16, 185, 129, 0.45)" : "var(--border)",
      }}
    >
      <div className="flex items-start gap-3">
        <span className="text-xl flex-shrink-0">{ivaCfg.ivaReducido8Activo ? "🇪🇨" : "🏛️"}</span>
        <div className="text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-sm" style={{ color: "var(--foreground)" }}>
              Conmutador Rápido de IVA Turístico (RF-21 · LORTI Ecuador)
            </span>
            <span
              className={`mono text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                ivaCfg.ivaReducido8Activo
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
              }`}
            >
              {ivaCfg.ivaReducido8Activo ? "Activo: IVA 8% Decreto Feriado" : "Activo: IVA 15% Ordinario"}
            </span>
          </div>
          <p className="mt-0.5" style={{ color: "var(--muted-foreground)" }}>
            {ivaCfg.ivaReducido8Activo
              ? `Aplicando reducción temporal al 8% en todo el motor de reservas (${ivaCfg.nombreFeriado} · ${ivaCfg.decretoReferencia}).`
              : "Aplicando tarifa general vigente de IVA 15% más 10% de Servicio Turístico (Art. 41 Ley de Turismo, exento en Hostales)."}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button
          type="button"
          onClick={() => toggleIva(false)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
            !ivaCfg.ivaReducido8Activo
              ? "bg-amber-500 text-slate-950 border-amber-400 shadow-sm"
              : "bg-transparent text-slate-400 border-slate-700 hover:text-white"
          }`}
        >
          IVA 15% (Ordinario)
        </button>
        <button
          type="button"
          onClick={() => toggleIva(true)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
            ivaCfg.ivaReducido8Activo
              ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-sm"
              : "bg-transparent text-slate-400 border-slate-700 hover:text-white"
          }`}
        >
          🇪🇨 IVA 8% (Decreto Feriado)
        </button>
      </div>
    </div>
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
                Fecha de Entrada (Arribo) *
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
                Fecha de Salida *
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
              Tipo de Habitación (Cupo Web) *
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
              <option value="">Seleccionar tipo de habitación...</option>
              {availableRooms.map((r) => (
                <option key={r.number} value={r.number}>
                  {r.type} ({fmt(r.pricePerNight)}/noche)
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
                {["Portal AlojaManta", "Directo Web", "Link de Pago", "Teléfono / WhatsApp"].map(
                  (s) => (
                    <option key={s}>{s}</option>
                  )
                )}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs mb-1" style={{ color: "var(--muted-foreground)" }}>
              Observaciones de la reserva
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
              placeholder="Hora estimada de arribo, extras solicitados..."
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
            onClick={() => {
              playNewBookingSound();
              addAuditLog({
                usuario: "Operador Extranet",
                rol: "Operador Reservas / Recepción",
                modulo: "Bandeja de Reservas",
                accion: "CREAR_RESERVA_DIRECTA",
                detalle: `Reserva directa registrada para ${form.guestName || "Huésped"} (${selectedRoom?.type || "Habitación"})`,
              });
              onClose();
            }}
            className="flex-1 py-2 rounded text-sm font-semibold transition-colors"
            style={{
              background: "var(--primary)",
              color: "var(--primary-foreground)",
            }}
          >
            Confirmar Reserva y Emitir Voucher QR
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Views ────────────────────────────────────────────────────────────────────

function Dashboard({ onNewBooking }: { onNewBooking: () => void }) {
  const [liveAlert, setLiveAlert] = useState<string | null>(null);
  const confirmedUpcoming = RESERVATIONS.filter((r) => r.status === "confirmed" || r.status === "pending");
  const validatedStays = RESERVATIONS.filter((r) => r.status === "validated" || r.status === "checkin" || r.status === "completed" || r.status === "checkout");
  const reservedCupos = ROOMS.filter((r) => r.status === "occupied").length;
  const occupancyPct = Math.round((reservedCupos / ROOMS.length) * 100);

  function triggerSimulatedBooking() {
    playNewBookingSound();
    const code = `RES-${Math.floor(10000 + Math.random() * 90000)}`;
    setLiveAlert(`🔔 Nueva reserva web entrante ${code}: Habitación Matrimonial Vista al Mar (2 noches · Pagada vía PayPhone).`);
    addAuditLog({
      usuario: "Motor de Reservas Web",
      rol: "Sistema Tiempo Real",
      modulo: "Notificaciones RF-11",
      accion: "ALERTA_RESERVA_ENTRANTE",
      detalle: `Notificación sonora y visual emitida para nueva reserva ${code}`,
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl leading-tight" style={{ color: "var(--foreground)" }}>
            Dashboard de Reservas & Cupos Web
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--muted-foreground)" }}>
            Extranet de Comercialización y Validación de Vouchers QR (Sin PMS físico)
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={triggerSimulatedBooking}
            className="px-3.5 py-2 rounded text-xs font-bold border border-emerald-500/40 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>🔔</span> Simular Reserva Web Entrante (RF-11)
          </button>
          <button
            onClick={onNewBooking}
            className="px-4 py-2 rounded text-sm font-semibold transition-all hover:opacity-90 cursor-pointer"
            style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
          >
            + Registrar Reserva Directa
          </button>
        </div>
      </div>

      {/* Live audio-visual notification banner (RF-11) */}
      {liveAlert && (
        <div className="p-3.5 rounded-xl border border-emerald-400 bg-emerald-950/80 text-emerald-200 flex items-center justify-between gap-3 text-xs animate-pulse">
          <div className="flex items-center gap-2">
            <span className="text-base">🔊</span>
            <span className="font-semibold">{liveAlert}</span>
          </div>
          <button onClick={() => setLiveAlert(null)} className="text-emerald-300 hover:text-white font-bold px-2">✕</button>
        </div>
      )}

      {/* Emergency IVA 15% / 8% switch banner (RF-21) */}
      <IvaEmergencySwitchBanner />

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard
          label="Cupos Web Reservados"
          value={`${occupancyPct}%`}
          sub={`${reservedCupos} de ${ROOMS.length} cupos comercializados`}
          accent
        />
        <KpiCard
          label="Revenue Reservas (Ago)"
          value={fmt(21600)}
          sub="↑ 8.4% vs julio"
        />
        <KpiCard
          label="Arribos por Validar QR"
          value={String(confirmedUpcoming.length)}
          sub="reservas garantizadas próximas"
        />
        <KpiCard
          label="Vouchers QR Validados"
          value={String(validatedStays.length)}
          sub="reservas efectivas validadas"
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
              Revenue mensual por reservas
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
                Cupo Web
              </p>
              <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                {reservedCupos} cupos vendidos
              </p>
              <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                {ROOMS.filter((r) => r.status === "available").length} cupos libres para venta online
              </p>
            </div>
          </div>
          <div
            className="rounded-md p-4 border"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}
          >
            <p className="text-xs uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>
              Canal de origen de reservas
            </p>
            <SourceBar />
          </div>
        </div>
      </div>

      {/* Today activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Upcoming arrivals to validate */}
        <div
          className="rounded-md border overflow-hidden"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          <div
            className="px-4 py-3 border-b flex items-center justify-between"
            style={{ borderColor: "var(--border)" }}
          >
            <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
              Próximos Arribos (Pendientes de Validar Voucher QR)
            </p>
            <span className="mono text-xs" style={{ color: "var(--primary)" }}>
              {confirmedUpcoming.length} reservas
            </span>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {confirmedUpcoming.map((r) => (
              <div key={r.id} className="px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                    {r.guestName}
                  </p>
                  <p className="mono text-xs" style={{ color: "var(--muted-foreground)" }}>
                    {r.roomType} · Entrada {fmtDate(r.checkIn)} ({r.nights}n)
                  </p>
                </div>
                <div className="text-right">
                  <p className="mono text-sm font-semibold" style={{ color: "var(--primary)" }}>
                    {fmt(r.total)}
                  </p>
                  <StatusBadge status={r.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Validated vouchers */}
        <div
          className="rounded-md border overflow-hidden"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          <div
            className="px-4 py-3 border-b flex items-center justify-between"
            style={{ borderColor: "var(--border)" }}
          >
            <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
              Vouchers QR Validados y Reservas Liquidadas
            </p>
            <span className="mono text-xs" style={{ color: "#6ee7b7" }}>
              {validatedStays.length} reservas
            </span>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {validatedStays.map((r) => (
              <div key={r.id} className="px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                    {r.guestName}
                  </p>
                  <p className="mono text-xs" style={{ color: "var(--muted-foreground)" }}>
                    {r.roomType} · {r.source} {r.voucherValidatedAt ? `· QR: ${r.voucherValidatedAt}` : ""}
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
  const [qrInput, setQrInput] = useState("");
  const [qrFeedback, setQrFeedback] = useState<{ type: "ok" | "err"; msg: string } | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<HotelInvoice | null>(null);

  // Sincronizar reservas creadas por huéspedes en el portal web (hoteldirekt_guest_reservations)
  useEffect(() => {
    function syncGuestBookings() {
      try {
        const raw = localStorage.getItem("hoteldirekt_guest_reservations");
        if (!raw) return;
        const guestList: MyReservation[] = JSON.parse(raw);
        const forThisHotel = guestList.filter(g => !g.hotelId || g.hotelId === hotelId);
        if (forThisHotel.length === 0) return;
        setReservations(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const mappedNew: Reservation[] = forThisHotel
            .filter(g => !existingIds.has(g.id))
            .map(g => ({
              id: g.id,
              guestName: g.guestName || "Huésped Web",
              guestEmail: g.guestEmail || "cliente@alojamanta.ec",
              roomNumber: "Cupo Web",
              roomType: g.room,
              checkIn: g.checkIn,
              checkOut: g.checkOut,
              nights: g.nights,
              status: g.status === "cancelled" ? "cancelled" : g.status === "completed" ? "completed" : "confirmed",
              total: g.total,
              adults: 2,
              children: 0,
              source: "Portal AlojaManta",
            }));
          return mappedNew.length > 0 ? [...mappedNew, ...prev] : prev;
        });
      } catch {
        // ignore
      }
    }
    syncGuestBookings();
    window.addEventListener("alojamanta-new-booking", syncGuestBookings);
    return () => window.removeEventListener("alojamanta-new-booking", syncGuestBookings);
  }, [hotelId, setReservations]);

  // Normalizar estados heredados (checkin -> validated, checkout -> completed)
  const normalizedReservations = useMemo(
    () =>
      reservations.map(r => ({
        ...r,
        status: (r.status === "checkin" ? "validated" : r.status === "checkout" ? "completed" : r.status) as ReservationStatus,
      })),
    [reservations]
  );

  const filtered = useMemo(
    () =>
      normalizedReservations.filter(
        (r) =>
          (filter === "all" || r.status === filter) &&
          (search === "" ||
            r.guestName.toLowerCase().includes(search.toLowerCase()) ||
            r.roomType.toLowerCase().includes(search.toLowerCase()) ||
            r.id.toLowerCase().includes(search.toLowerCase()))
      ),
    [filter, search, normalizedReservations]
  );

  function handleValidateQr(resIdToValidate: string) {
    const cleanCode = resIdToValidate.trim().toUpperCase();
    const target = normalizedReservations.find(
      r => r.id.toUpperCase() === cleanCode || cleanCode.includes(r.id.toUpperCase())
    );
    if (!target) {
      setQrFeedback({ type: "err", msg: `No se encontró ninguna reserva con el código o QR "${cleanCode}".` });
      return;
    }
    const nowStr = new Date().toLocaleString("es-EC", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
    setReservations(items =>
      items.map(item =>
        item.id === target.id
          ? { ...item, status: "validated", voucherValidated: true, voucherValidatedAt: nowStr }
          : item
      )
    );
    addAuditLog({
      usuario: "Operador Extranet",
      rol: "Operador Reservas / Recepción",
      modulo: "Validador Voucher QR (RF-13)",
      accion: "VALIDAR_VOUCHER_QR",
      detalle: `Voucher QR de reserva ${target.id} (${target.guestName} · ${target.roomType}) validado correctamente`,
    });
    setQrFeedback({
      type: "ok",
      msg: `✓ Voucher QR Validado (${nowStr}): ${target.id} · ${target.guestName} (${target.roomType}, ${target.nights} noches).`,
    });
    setQrInput("");
  }

  function handleConfirmPending(r: Reservation) {
    setReservations(items =>
      items.map(item => (item.id === r.id ? { ...item, status: "confirmed" } : item))
    );
    addAuditLog({
      usuario: "Operador Extranet",
      rol: "Operador Reservas / Recepción",
      modulo: "Bandeja de Reservas (RF-12)",
      accion: "CONFIRMAR_RESERVA",
      detalle: `Reserva ${r.id} (${r.guestName}) cambiada a estado Confirmada`,
    });
  }

  function handleSimulateIncomingWebBooking() {
    playNewBookingSound();
    const newId = `RES-${Math.floor(10000 + Math.random() * 89999)}`;
    const simulated: Reservation = {
      id: newId,
      guestName: "Valeria Andrade (Reserva Web)",
      guestEmail: "vandrade@turismo.ec",
      roomNumber: "Cupo Web",
      roomType: "Habitación Matrimonial Queen",
      checkIn: "2026-08-18",
      checkOut: "2026-08-20",
      nights: 2,
      status: "confirmed",
      total: 162,
      adults: 2,
      children: 0,
      source: "Portal AlojaManta",
      notes: "Pago acreditado vía PayPhone · Pendiente validar QR al arribo",
    };
    setReservations(items => [simulated, ...items]);
    setQrFeedback({
      type: "ok",
      msg: `🔔 ¡Nueva reserva web entrante ${newId} de ${simulated.guestName}! (Alerta sonora RF-11 activada)`,
    });
    addAuditLog({
      usuario: "Motor de Reservas Web",
      rol: "Sistema Tiempo Real",
      modulo: "Bandeja de Reservas (RF-11)",
      accion: "NUEVA_RESERVA_ENTRANTE",
      detalle: `Reserva entrante ${newId} (${simulated.guestName}) recibida en tiempo real`,
    });
  }

  const tabs: { key: ReservationStatus | "all"; label: string }[] = [
    { key: "all", label: "Todas" },
    { key: "pending", label: "Por Confirmar" },
    { key: "confirmed", label: "Confirmadas" },
    { key: "validated", label: "Voucher QR Validado" },
    { key: "completed", label: "Liquidadas" },
    { key: "cancelled", label: "Canceladas" },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl" style={{ color: "var(--foreground)" }}>
            Bandeja de Reservas & Validación de Voucher QR
          </h1>
          <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
            Gestión de reservas entrantes, confirmación de cupos web y validación de Voucher QR al arribo del huésped (Extranet No-PMS).
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleSimulateIncomingWebBooking}
            className="px-3.5 py-2 rounded text-xs font-bold border border-emerald-500/40 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>🔔</span> Simular Reserva Entrante (Sonido RF-11)
          </button>
          <button
            onClick={() => setEditing({ id: "", guestName: "", guestEmail: "", roomNumber: "Cupo Web", roomType: "Doble Estándar", checkIn: "", checkOut: "", nights: 1, status: "confirmed", total: 0, adults: 2, children: 0, source: "Directo Web", notes: "" })}
            className="px-4 py-2 rounded text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer"
            style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
          >
            + Nueva Reserva
          </button>
        </div>
      </div>

      {/* RF-13: Validador de Voucher QR en 1 Clic */}
      <div
        className="rounded-xl border p-4 space-y-2.5"
        style={{ background: "var(--card)", borderColor: "rgba(245, 158, 11, 0.35)" }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">📱</span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Validador de Voucher QR y Código de Reserva en 1 Clic (RF-13)
              </p>
              <p className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>
                Ingresa o escanea el código del Voucher QR del huésped al llegar al establecimiento para dejar constancia de reserva efectiva.
              </p>
            </div>
          </div>
          <form
            onSubmit={e => {
              e.preventDefault();
              if (qrInput.trim()) handleValidateQr(qrInput);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={qrInput}
              onChange={e => setQrInput(e.target.value)}
              placeholder="Ej: RES-003 o código QR..."
              className="px-3 py-1.5 rounded border text-xs font-mono outline-none"
              style={{ background: "var(--muted)", borderColor: "var(--border)", color: "var(--foreground)" }}
            />
            <button
              type="submit"
              className="px-3.5 py-1.5 rounded text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors cursor-pointer whitespace-nowrap"
            >
              ✓ Validar Voucher QR
            </button>
          </form>
        </div>
        {qrFeedback && (
          <div
            className={`p-2.5 rounded-lg text-xs font-medium flex items-center justify-between ${
              qrFeedback.type === "ok"
                ? "bg-emerald-950/70 text-emerald-300 border border-emerald-700"
                : "bg-red-950/70 text-red-300 border border-red-800"
            }`}
          >
            <span>{qrFeedback.msg}</span>
            <button onClick={() => setQrFeedback(null)} className="text-xs font-bold ml-2">✕</button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <input
          className="px-3 py-1.5 rounded text-sm border outline-none"
          style={{
            background: "var(--card)",
            borderColor: "var(--border)",
            color: "var(--foreground)",
            minWidth: 220,
          }}
          placeholder="Buscar por huésped, tipo de habitación, código RES..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-1 flex-wrap">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className="px-3 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer"
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
                {["Código", "Huésped", "Tipo de Habitación", "Fecha Entrada", "Fecha Salida", "Noches", "Canal", "Total", "Estado Reserva", "Acciones (1 Clic)"].map(
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
                    <span className="mono text-xs font-bold text-amber-400">
                      {r.id}
                    </span>
                    {r.voucherValidatedAt && (
                      <span className="block mono text-[9px] text-emerald-400">
                        QR: {r.voucherValidatedAt}
                      </span>
                    )}
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
                    <p className="font-semibold text-xs text-amber-400">
                      {r.roomType}
                    </p>
                    <p className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                      {r.adults} ad. {r.children ? `· ${r.children} niñ.` : ""}
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
                    <div className="flex items-center gap-1 flex-wrap">
                      {r.status === "pending" && (
                        <button
                          onClick={() => handleConfirmPending(r)}
                          className="text-[11px] px-2 py-1 rounded font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40 hover:bg-blue-500/30 cursor-pointer"
                          title="Confirmar reserva en 1 clic (RF-12)"
                        >
                          ✓ Confirmar
                        </button>
                      )}
                      {r.status === "confirmed" && (
                        <button
                          onClick={() => handleValidateQr(r.id)}
                          className="text-[11px] px-2 py-1 rounded font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 cursor-pointer"
                          title="Validar Voucher QR del huésped en 1 clic (RF-13)"
                        >
                          📱 Validar QR
                        </button>
                      )}
                      <button
                        onClick={() => {
                          const ivaPct = getActiveIvaPercent(hotelId);
                          const base = Number((r.total / (1 + ivaPct / 100 + 0.10)).toFixed(2));
                          setSelectedInvoice({
                            id: `VCH-${r.id}`,
                            resId: r.id,
                            guest: r.guestName,
                            clientEmail: r.guestEmail,
                            roomType: r.roomType,
                            checkIn: r.checkIn,
                            checkOut: r.checkOut,
                            nights: r.nights,
                            base,
                            tax: Number((r.total - base).toFixed(2)),
                            ivaPercent: ivaPct,
                            total: r.total,
                            status: "paid",
                            payMethod: r.source,
                          });
                        }}
                        className="text-[11px] px-2 py-1 rounded font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 cursor-pointer"
                      >
                        🧾 Voucher
                      </button>
                      <button onClick={() => setEditing({ ...r })} className="text-[11px] px-2 py-1 rounded transition-colors cursor-pointer" style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}>Editar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="text-center py-10 text-sm" style={{ color: "var(--muted-foreground)" }}>
            No se encontraron reservas con ese filtro
          </p>
        )}
      </div>

      {selectedInvoice && (
        <SriInvoiceModal
          invoice={selectedInvoice}
          hotelId={hotelId}
          onClose={() => setSelectedInvoice(null)}
        />
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(3,7,18,.78)" }}>
          <form onSubmit={event => {
            event.preventDefault();
            const nights = editing.checkIn && editing.checkOut ? Math.max(1, Math.round((new Date(editing.checkOut).getTime() - new Date(editing.checkIn).getTime()) / 86400000)) : editing.nights;
            const saved = { ...editing, nights, id: editing.id || `RES-${Date.now().toString().slice(-5)}` };
            setReservations(items => items.some(item => item.id === saved.id) ? items.map(item => item.id === saved.id ? saved : item) : [saved, ...items]);
            addAuditLog({
              usuario: "Operador Extranet",
              rol: "Operador Reservas / Recepción",
              modulo: "Bandeja de Reservas",
              accion: editing.id ? "ACTUALIZAR_RESERVA" : "CREAR_RESERVA",
              detalle: `Reserva ${saved.id} (${saved.guestName}) guardada con estado ${saved.status}`,
            });
            setEditing(null);
          }} className="w-full max-w-2xl rounded-xl border p-6" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <div className="flex items-start justify-between mb-5"><div><p className="mono text-[10px] uppercase tracking-widest" style={{ color: "var(--primary)" }}>Reserva</p><h2 className="text-xl">{editing.id ? "Editar reserva" : "Nueva reserva"}</h2></div><button type="button" onClick={() => setEditing(null)} style={{ color: "var(--muted-foreground)" }}>×</button></div>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Nombre del huésped" value={editing.guestName} onChange={guestName => setEditing({ ...editing, guestName })} required />
              <Field label="Email" type="email" value={editing.guestEmail} onChange={guestEmail => setEditing({ ...editing, guestEmail })} required />
              <Field label="Tipo de Habitación" value={editing.roomType} onChange={roomType => setEditing({ ...editing, roomType })} required />
              <Field label="Cupo Web Asignado" value={editing.roomNumber || "Cupo Web"} onChange={roomNumber => setEditing({ ...editing, roomNumber })} />
              <Field label="Fecha de Entrada (Arribo)" type="date" value={editing.checkIn} onChange={checkIn => setEditing({ ...editing, checkIn })} required />
              <Field label="Fecha de Salida" type="date" value={editing.checkOut} onChange={checkOut => setEditing({ ...editing, checkOut })} required />
              <Field label="Total ($ USD)" type="number" value={String(editing.total)} onChange={total => setEditing({ ...editing, total: Number(total) })} />
              <Field label="Canal de Origen" value={editing.source} onChange={source => setEditing({ ...editing, source })} />
              <div>
                <label className="block text-xs mb-1" style={{ color: "var(--muted-foreground)" }}>Estado de la Reserva</label>
                <select value={editing.status} onChange={event => setEditing({ ...editing, status: event.target.value as ReservationStatus })} className="w-full rounded border px-3 py-2.5 text-sm" style={{ background: "var(--muted)", borderColor: "var(--border)" }}>
                  <option value="pending">Por Confirmar</option>
                  <option value="confirmed">Confirmada</option>
                  <option value="validated">Voucher QR Validado</option>
                  <option value="completed">Liquidada</option>
                  <option value="cancelled">Cancelada</option>
                </select>
              </div>
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
        <span className="text-2xl flex-shrink-0">🛏️</span>
        <div className="text-xs leading-relaxed">
          <p className="font-bold text-amber-400 text-sm">
            Portal de Reservas Hoteleras · Manta (Gestión por Tipo de Habitación)
          </p>
          <p className="mt-0.5" style={{ color: "var(--muted-foreground)" }}>
            Este sistema gestiona la intermediación turística, las <strong>opciones y tipos de habitación que los clientes escogieron</strong> y el inventario de habitaciones publicado en la web. No incluye módulos de aseo ni llaves físicas porque <strong>no es un sistema PMS</strong>.
          </p>
        </div>
      </div>

      {/* Cabecera con selector de pestañas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
            Tipos de Habitación & Cupos Disponibles
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
          <span>Tipos de Habitación Reservados</span>
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
          <span>Tipos de Habitación en Oferta Web</span>
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
          <span>Catálogo de los 116 Alojamientos</span>
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
              label="Camas / Plazas Asignadas"
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
                placeholder="Buscar por cliente, tipo de habitación (ej. Suite, Matrimonial), código (ej. RES-4821)..."
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
                Estas son las opciones de habitaciones y cupos disponibles que los turistas pueden reservar en la web de <strong>{currentMantaHotel.name}</strong>.
              </p>
            </div>

            <button
              onClick={() => {
                const newId = `hab-${Date.now().toString().slice(-4)}`;
                const newOffer: RoomOffer = {
                  id: newId,
                  type: "Habitación Matrimonial Deluxe con Balcón",
                  beds: "1 Cama Queen (1.60x2m)",
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

                <div className="p-4 pt-0 flex gap-2">
                  <button
                    onClick={() => setEditingOffer(offer)}
                    className="flex-1 py-1.5 rounded-lg border text-xs font-medium hover:bg-slate-800 transition-colors cursor-pointer text-slate-300"
                    style={{ borderColor: "var(--border)" }}
                  >
                    Editar tarifa
                  </button>
                  <button
                    onClick={() => {
                      const nextAvail = offer.available > 0 ? 0 : 4;
                      setRoomOffers(prev => prev.map(o => (o.id === offer.id ? { ...o, available: nextAvail } : o)));
                      addAuditLog({
                        usuario: "Operador Extranet",
                        rol: "Revenue / Admin Hotel",
                        modulo: "Cupos Web (RF-15)",
                        accion: nextAvail === 0 ? "STOP_SELL_CIERRE_VENTA" : "ABRIR_VENTA_WEB",
                        detalle: `${nextAvail === 0 ? "Cierre de venta web (Stop Sell)" : "Reapertura de cupos (4)"} en ${offer.type}`,
                      });
                    }}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors cursor-pointer ${
                      offer.available > 0
                        ? "border-red-800/60 text-red-300 hover:bg-red-950/50"
                        : "border-emerald-700/60 text-emerald-300 hover:bg-emerald-950/50"
                    }`}
                    title="Cerrar o abrir inmediatamente la venta web de este tipo de habitación (RF-15 Stop Sell)"
                  >
                    {offer.available > 0 ? "⛔ Stop Sell" : "✓ Abrir Venta"}
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
                Catálogo de los 116 Alojamientos de Manta
              </h2>
              <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                Catálogo oficial adscrito al Catastro de Manta 2026. Selecciona cualquier establecimiento para gestionar sus tipos de habitación y cupos.
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
                        {"★".repeat(h.stars)} ({h.category || `${h.stars} Estrellas`})
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
                      <span>Tipos de habitación: <strong>{h.rooms.length} opciones</strong></span>
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
    { type: "1 Cama Queen Matrimonial", revenue: 8400, pct: 39 },
    { type: "1 Cama Individual", revenue: 4200, pct: 19 },
    { type: "1 Cama Queen + 1 Twin", revenue: 3800, pct: 18 },
    { type: "1 Cama King Superior", revenue: 3100, pct: 14 },
    { type: "Master Suite (King)", revenue: 2100, pct: 10 },
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
          sub="Revenue por cama/plaza disponible"
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
            Revenue por tipo de habitación (Ago)
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
    country: "Ecuador",
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
          Directorio de Huéspedes (LOPDP)
        </h1>
        <div className="flex gap-3">
          <span className="mono text-xs px-3 py-1.5 rounded" style={{ background: "var(--card)", color: "var(--muted-foreground)", border: "1px solid var(--border)" }}>
            {guests.length} registrados
          </span>
          <button onClick={() => setEditing({ id: "", name: "", email: "", phone: "", document: "", country: "Ecuador", notes: "", visits: 0, totalSpend: 0, lastVisit: new Date().toISOString().split("T")[0], source: "Directo Web" })} className="px-3 py-1.5 rounded text-xs font-semibold" style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>+ Huésped</button>
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
  issued: { bg: "rgba(16, 185, 129, 0.15)", color: "#059669", label: "Cobro Aprobado" },
  error: { bg: "rgba(239, 68, 68, 0.15)", color: "#dc2626", label: "Cobro Fallido" },
  returned: { bg: "rgba(245, 158, 11, 0.15)", color: "#d97706", label: "Reversado" },
};

// ─── Payment Receipts & Booking Settlements ───────────────────────────────────

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
    const hotelMeta = HOTEL_COMMERCIAL_INFO[hotelId] || HOTEL_COMMERCIAL_INFO["costa-sol"];
    const base = Number(newInvBase);
    const iva = Number((base * 0.15).toFixed(2));
    const hasServicio10 = hotelMeta.gravaServicio10 ?? true;
    const servicio10 = hasServicio10 ? Number((base * 0.10).toFixed(2)) : 0;
    const total = Number((base + iva + servicio10).toFixed(2));
    const seq = String(invoices.length + 1).padStart(9, "0");

    const newInv: HotelInvoice = {
      id: `${hotelMeta.estab}-${hotelMeta.ptoEmi}-${seq}`,
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
      roomType: "1 Cama Queen Matrimonial",
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
            <h1 className="text-2xl" style={{ color: "var(--foreground)" }}>Comprobantes de Pago y Liquidación</h1>
            <span className="mono text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
              Pasarela PayPhone / DeUna
            </span>
          </div>
          <p className="text-xs text-amber-500 font-medium mt-0.5">{hotelName} · RUC: {HOTEL_COMMERCIAL_INFO[hotelId]?.ruc || "1391789456001"} · Comprobantes de abono y liquidación de reserva</p>
        </div>
        <button
          onClick={() => setShowNewInvoiceModal(true)}
          className="px-4 py-2 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-md flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <span>+</span> Registrar Comprobante de Pago
        </button>
      </div>

      {/* Operational model banner */}
      <div className="p-3.5 rounded-xl border flex items-center justify-between gap-3 text-xs" style={{ background: "rgba(245, 158, 11, 0.08)", borderColor: "rgba(245, 158, 11, 0.25)" }}>
        <div className="flex items-center gap-2.5">
          <span className="text-xl flex-shrink-0">💳</span>
          <div>
            <p className="font-bold text-amber-400">Plataforma de Cobros Digitales y Liquidación de Reservas</p>
            <p className="text-slate-400 mt-0.5">La plataforma procesa y certifica los cobros y anticipos digitales en tiempo real (PayPhone, DeUna y Kushki), emitiendo los comprobantes oficiales de reserva con código QR para el huésped y recepción.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="Cobrado en Pasarela (Ago)" value={fmtUsd(totalPaid)} sub={`${invoices.filter(i => i.status === "paid").length} pagos confirmados`} accent />
        <KpiCard label="Pendiente de cobro" value={fmtUsd(totalPending)} sub={`${invoices.filter(i => i.status === "pending" || i.status === "overdue").length} transacciones`} />
        <KpiCard label="Comprobantes Emitidos" value={String(invoices.filter(i => i.hotelInvoiceNumber).length || 3)} sub="registrados en el sistema de reservas" />
        <KpiCard label="Comprobantes Pendientes" value={String(Math.max(0, invoices.length - (invoices.filter(i => i.hotelInvoiceNumber).length || 3)))} sub="por conciliar o liquidar" />
      </div>

      {/* Filters */}
      <div className="flex gap-1.5 flex-wrap">
        {[{ k: "all" as const, l: "Todos los Comprobantes" }, { k: "paid" as const, l: "Pagados" }, { k: "pending" as const, l: "Pendientes" }, { k: "overdue" as const, l: "Por Conciliar" }].map(f => (
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
                {["Nº Comprobante", "Reserva", "Huésped", "Fecha", "Subtotal", "IVA 15%", "Total USD", "Pasarela", "Estado Pago", "Recibo / Comprobante", ""].map(h => (
                  <th key={h} className="mono text-left px-4 py-3 text-[10px] uppercase tracking-widest font-medium" style={{ color: "var(--muted-foreground)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv, i) => {
                const st = INVOICE_STYLE[inv.status];
                const voucherCode = `REC-2026-${(inv.id.replace(/\D/g, "") || String(i + 101)).padStart(5, "0")}`;
                return (
                  <tr key={inv.id} className="transition-colors hover:bg-[var(--secondary)]" style={{ borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none" }}>
                    <td className="px-4 py-3"><span className="mono text-xs font-semibold text-amber-400">{voucherCode}</span></td>
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
                    <td className="px-4 py-3">
                      {inv.hotelInvoiceNumber ? (
                        <span className="mono text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1 w-fit">
                          <span>✓</span> #{inv.hotelInvoiceNumber}
                        </span>
                      ) : (
                        <span className="mono text-[10px] font-medium px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/60 flex items-center gap-1 w-fit">
                          <span>⚠️</span> Pendiente Confirmar
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSelected(inv)} className="text-xs px-2.5 py-1 rounded font-medium bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500 hover:text-slate-950 transition-colors cursor-pointer whitespace-nowrap">
                        Ver Comprobante de Pago
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Receipt & Hotel Invoicing Modal */}
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
          onRegisterHotelInvoice={(invNum) => {
            const updated = { ...selected, hotelInvoiceNumber: invNum };
            setInvoices(items => items.map(item => item.id === updated.id ? updated : item));
            setSelected(updated);
          }}
        />
      )}

      {/* Quick create payment receipt modal */}
      {showNewInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(3, 7, 18, 0.8)", backdropFilter: "blur(4px)" }}>
          <form onSubmit={handleCreateQuickInvoice} className="w-full max-w-md rounded-2xl border p-6 space-y-4" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: "var(--border)" }}>
              <div>
                <h3 className="text-base font-bold" style={{ color: "var(--foreground)" }}>Registrar Comprobante de Pago</h3>
                <p className="text-xs text-amber-500 font-medium">{hotelName} · Pasarela de cobro</p>
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
                <span>IVA 15% (Referencial): {fmtUsd(newInvBase * 0.15)}</span>
                <span className="font-bold text-amber-400">Total a Cobrar: {fmtUsd(newInvBase * 1.15)}</span>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowNewInvoiceModal(false)} className="px-4 py-2 text-xs text-slate-400 hover:text-white">Cancelar</button>
              <button type="submit" className="px-5 py-2 rounded font-bold text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 shadow">Registrar Comprobante</button>
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
          <p className="text-xs text-slate-400 mt-0.5">{hotel.city} · {hotel.rooms} camas disponibles · Precios en USD ($)</p>
        </div>
        <button
          onClick={() => setShowNewTariffModal(true)}
          className="px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity bg-amber-500 text-slate-950 shadow self-start sm:self-auto cursor-pointer"
        >
          + Nueva tarifa especial
        </button>
      </div>

      {/* RF-21: Conmutador Rápido de Emergencia IVA 15% / 8% */}
      <IvaEmergencySwitchBanner userName="Revenue Manager" />

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
            <h3 className="font-bold text-sm" style={{ color: "var(--foreground)" }}>Nueva Tarifa por Tipo de Habitación</h3>
            <p className="text-xs text-amber-500 font-medium">{hotel.name}</p>
            <div>
              <label className="block text-xs mb-1 text-slate-400">Nombre de la Habitación / Tarifa *</label>
              <input
                type="text"
                required
                value={newRoomType}
                onChange={e => setNewRoomType(e.target.value)}
                placeholder="Ej: Habitación Matrimonial Frente al Mar"
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

const NAV_ITEMS: { view: View; label: string; icon: string; divider?: boolean; roles: AdminRole[] }[] = [
  { view: "hotels", label: "Catastro Hotelero (116)", icon: "🏨", roles: ["superadmin"] },
  { view: "users", label: "Usuarios y accesos", icon: "👤", roles: ["superadmin", "admin"], divider: true },
  { view: "dashboard", label: "Dashboard Reservas", icon: "📊", roles: ["superadmin", "admin", "manager"], divider: true },
  { view: "rooms", label: "Tipos de Habitación", icon: "🛏️", roles: ALL_ROLES },
  { view: "reservations", label: "Bandeja de Reservas", icon: "📑", roles: ALL_ROLES },
  { view: "guests", label: "Directorio Huéspedes", icon: "👥", roles: ["superadmin", "admin", "receptionist"] },
  { view: "billing", label: "Comprobantes de Pago", icon: "🧾", roles: ["superadmin", "admin", "receptionist"], divider: true },
  { view: "payments", label: "Pasarela & Links de Pago", icon: "💳", roles: ["superadmin", "admin", "receptionist"] },
  { view: "rates", label: "Tarifas por Temporada", icon: "🏷️", roles: ["superadmin", "admin", "manager"] },
  { view: "revenue", label: "Métricas & RevPAR", icon: "📈", roles: ["superadmin", "admin", "manager"] },
];

// ─── Platform hotels data ─────────────────────────────────────────────────────

interface PlatformHotel {
  id: string;
  name: string;
  city: string;
  stars: 1 | 2 | 3 | 4 | 5;
  classification?: string;
  category?: string;
  rooms: number; // Capacidad de camas / plazas
  occupancy: number;
  monthRevenue: number;
  rating: number;
  status: "active" | "paused" | "pending";
  gravaServicio10?: boolean;
  address?: string;
  phone?: string;
  taxId?: string;
  owner?: string;
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
  classification: h.classification,
  category: h.category,
  rooms: 14 + ((idx * 5) % 35),
  occupancy: 50 + ((idx * 8) % 45),
  monthRevenue: 6000 + ((idx * 2100) % 24000),
  rating: h.rating,
  status: idx === 13 ? "paused" : "active",
  gravaServicio10: h.gravaServicio10,
  address: h.address,
  phone: h.phone,
  taxId: h.taxId,
  owner: h.owner,
  description: h.description,
  amenities: h.amenities,
  gallery: [h.image],
}));

const DEFAULT_STAFF: StaffUser[] = [
  { id: "usr-001", name: "Carlos Admin", email: "admin@alojamanta.ec", phone: "+593 99 100 1001", role: "superadmin", hotelIds: [], status: "active", lastAccess: "Hoy, 09:42" },
  { id: "usr-002", name: "Ana Administradora", email: "direccion@voyagermanta.ec", phone: "+593 98 203 1212", role: "admin", hotelIds: ["hotel-voyager-manta", "hostal-el-naufrago"], status: "active", lastAccess: "Hoy, 08:15" },
  { id: "usr-003", name: "María Revenue", email: "revenue@voyagermanta.ec", phone: "+593 99 322 4403", role: "manager", hotelIds: ["hotel-voyager-manta", "hostal-el-naufrago"], status: "active", lastAccess: "Ayer, 19:20" },
  { id: "usr-004", name: "Juan Recepción", email: "recepcion@voyagermanta.ec", phone: "+593 98 100 2004", role: "receptionist", hotelIds: ["hotel-voyager-manta", "hostal-el-naufrago"], status: "active", lastAccess: "Hoy, 07:03" },
  { id: "usr-005", name: "Lucía Gómez", email: "recepcion@elnaufrago.ec", phone: "+593 99 211 5005", role: "receptionist", hotelIds: ["hostal-el-naufrago", "hostal-el-naufrago-2"], status: "invited", lastAccess: "Pendiente" },
];

const ROLE_INFO: Record<AdminRole, { label: string; color: string; bg: string }> = {
  superadmin: { label: "Superadministrador (Cantonal)", color: "#d97706", bg: "rgba(245, 158, 11, 0.15)" },
  admin: { label: "Administrador de Hotel", color: "#7c3aed", bg: "rgba(124, 58, 237, 0.15)" },
  manager: { label: "Revenue Manager", color: "#2563eb", bg: "rgba(37, 99, 235, 0.15)" },
  receptionist: { label: "Operador Reservas / Recepción", color: "#059669", bg: "rgba(16, 185, 129, 0.15)" },
};

function usePersistentState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      // Limpieza proactiva de datos obsoletos del prototipo inicial (ciudades de España / menos de 50 hoteles)
      if (key.includes("hotels")) {
        const stored = localStorage.getItem(key);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && (parsed.length < 50 || parsed.some((h: any) => h.city === "Benidorm" || h.city === "Madrid" || h.city === "Granada" || h.city === "Málaga"))) {
            localStorage.removeItem(key);
            localStorage.removeItem("hoteldirekt.hotels");
            return initialValue;
          }
          return parsed as T;
        }
        localStorage.removeItem("hoteldirekt.hotels");
        return initialValue;
      }
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

function HotelsView({ hotels, onSelect, onSave, onDelete, canDelete, onResetCatalog }: {
  hotels: PlatformHotel[];
  onSelect: (id: string) => void;
  onSave: (hotel: PlatformHotel) => void;
  onDelete: (id: string) => void;
  canDelete: boolean;
  onResetCatalog?: () => void;
}) {
  const [editing, setEditing] = useState<PlatformHotel | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [classificationFilter, setClassificationFilter] = useState<string>("all");
  const [sectorFilter, setSectorFilter] = useState<string>("all");
  const [pageSize, setPageSize] = useState<number>(25);
  const [page, setPage] = useState<number>(1);

  const totalRevenue = hotels.reduce((s, h) => s + h.monthRevenue, 0);
  const activeHotels = hotels.filter(h => h.status === "active");
  const avgOccupancy = activeHotels.length ? Math.round(activeHotels.reduce((s, h) => s + h.occupancy, 0) / activeHotels.length) : 0;
  const activeCount = activeHotels.length;

  const starLabel = (s: number) => `${s} Estrella${s > 1 ? "s" : ""}`;
  const statusStyle: Record<string, { bg: string; color: string; label: string }> = {
    active: { bg: "rgba(16, 185, 129, 0.15)", color: "#059669", label: "Activo" },
    paused: { bg: "rgba(245, 158, 11, 0.15)", color: "#d97706", label: "Pausado" },
    pending: { bg: "rgba(59, 130, 246, 0.15)", color: "#2563eb", label: "Pendiente" },
  };

  const filteredHotels = useMemo(() => {
    return hotels.filter(h => {
      const q = search.toLowerCase().trim();
      const matchSearch = !q ||
        h.name.toLowerCase().includes(q) ||
        (h.city && h.city.toLowerCase().includes(q)) ||
        (h.address && h.address.toLowerCase().includes(q)) ||
        (h.taxId && h.taxId.includes(q)) ||
        (h.owner && h.owner.toLowerCase().includes(q));

      const matchCat = categoryFilter === "all" ||
        (h.category && h.category.toLowerCase().includes(categoryFilter.toLowerCase())) ||
        String(h.stars) === categoryFilter;

      const matchClass = classificationFilter === "all" ||
        (h.classification && h.classification.toLowerCase() === classificationFilter.toLowerCase());

      const matchSector = sectorFilter === "all" ||
        (h.city && h.city.toLowerCase().includes(sectorFilter.toLowerCase()));

      return matchSearch && matchCat && matchClass && matchSector;
    });
  }, [hotels, search, categoryFilter, classificationFilter, sectorFilter]);

  const totalPages = pageSize === 0 ? 1 : Math.ceil(filteredHotels.length / pageSize);
  const paginatedHotels = pageSize === 0
    ? filteredHotels
    : filteredHotels.slice((page - 1) * pageSize, page * pageSize);

  const sectors = ["Barbasquillo", "El Murciélago", "Tarqui", "Los Esteros", "San Mateo", "Santa Marianita", "Manta"];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>Catastro Hotelero Oficial de Manta</h1>
            <span className="mono text-xs px-2.5 py-0.5 rounded font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
              116 Establecimientos
            </span>
          </div>
          <p className="text-sm mt-0.5" style={{ color: "var(--muted-foreground)" }}>
            Catastro Turístico Cantonal 2026 · {activeCount} establecimientos activos en Manta, Manabí
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {onResetCatalog && (
            <button
              onClick={() => {
                if (confirm("¿Restaurar todo el Catastro oficial de Manta con los 116 hoteles del archivo consolidado?")) {
                  onResetCatalog();
                }
              }}
              title="Restaurar y sincronizar todos los 116 hoteles de Manta desde el archivo oficial"
              className="px-3 py-2 rounded text-xs font-semibold border flex items-center gap-1.5 transition-colors hover:bg-amber-500/10 cursor-pointer"
              style={{ borderColor: "rgba(245, 158, 11, 0.4)", color: "#f59e0b" }}
            >
              <span>🔄</span> Recargar 116 Hoteles Oficiales
            </button>
          )}
          {canDelete && (
            <button
              onClick={() => setEditing({ id: "", name: "", city: "Manta - Barbasquillo", stars: 3, rooms: 15, occupancy: 50, monthRevenue: 5000, rating: 4.0, status: "active", address: "", phone: "", taxId: "", description: "", amenities: [], gallery: [] })}
              className="px-4 py-2 rounded text-xs font-bold hover:opacity-90 transition-opacity flex items-center gap-1 cursor-pointer"
              style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
            >
              <span>+</span> Añadir Hotel
            </button>
          )}
        </div>
      </div>

      {/* Platform KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="Alojamientos registrados" value={String(activeCount)} sub={`${hotels.length} en el Catastro Cantonal 2026`} />
        <KpiCard label="Revenue plataforma (Ago)" value={fmtUsd(totalRevenue)} sub="reservado en USD Manta" accent />
        <KpiCard label="Ocupación media cantonal" value={`${avgOccupancy}%`} sub="red oficial de Manta" />
        <KpiCard label="Capacidad total de camas" value={String(hotels.reduce((s, h) => s + h.rooms, 0))} sub="plazas de alojamiento cantonal" />
      </div>

      {/* RF-21: Conmutador Rápido de Emergencia IVA 15% / 8% por Decreto Presidencial */}
      <IvaEmergencySwitchBanner userName="Superadministrador Cantonal" />

      {/* Filter bar */}
      <div className="p-4 rounded-xl border space-y-3" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="🔍 Buscar por nombre de hotel, sector, dirección, propietario o RUC..."
              className="w-full rounded-lg border px-3 py-2 text-xs outline-none"
              style={{ background: "var(--muted)", borderColor: "var(--border)", color: "var(--foreground)" }}
            />
            {search && (
              <button
                onClick={() => { setSearch(""); setPage(1); }}
                className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex gap-2 flex-wrap">
            {/* Classification */}
            <select
              value={classificationFilter}
              onChange={e => { setClassificationFilter(e.target.value); setPage(1); }}
              className="rounded-lg border px-2.5 py-2 text-xs outline-none cursor-pointer"
              style={{ background: "var(--muted)", borderColor: "var(--border)", color: "var(--foreground)" }}
            >
              <option value="all">Todas las Modalidades</option>
              <option value="Hotel">Hoteles</option>
              <option value="Hostal">Hostales</option>
              <option value="Hostería">Hosterías</option>
            </select>

            {/* Stars / Category */}
            <select
              value={categoryFilter}
              onChange={e => { setCategoryFilter(e.target.value); setPage(1); }}
              className="rounded-lg border px-2.5 py-2 text-xs outline-none cursor-pointer"
              style={{ background: "var(--muted)", borderColor: "var(--border)", color: "var(--foreground)" }}
            >
              <option value="all">Todas las Categorías</option>
              <option value="5">5 Estrellas (Lujo)</option>
              <option value="4">4 Estrellas (Primera)</option>
              <option value="3">3 Estrellas (Superior)</option>
              <option value="2">2 Estrellas (Turista)</option>
              <option value="1">1 Estrella (Económico)</option>
            </select>

            {/* Sector */}
            <select
              value={sectorFilter}
              onChange={e => { setSectorFilter(e.target.value); setPage(1); }}
              className="rounded-lg border px-2.5 py-2 text-xs outline-none cursor-pointer"
              style={{ background: "var(--muted)", borderColor: "var(--border)", color: "var(--foreground)" }}
            >
              <option value="all">Todos los Sectores</option>
              {sectors.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            {/* Page Size */}
            <select
              value={pageSize}
              onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
              className="rounded-lg border px-2.5 py-2 text-xs outline-none cursor-pointer"
              style={{ background: "var(--muted)", borderColor: "var(--border)", color: "var(--foreground)" }}
            >
              <option value={25}>25 por pág.</option>
              <option value={50}>50 por pág.</option>
              <option value={0}>Ver todos (116)</option>
            </select>
          </div>
        </div>

        {/* Filters summary & clear */}
        <div className="flex items-center justify-between text-xs pt-1 border-t" style={{ borderColor: "var(--border)" }}>
          <span style={{ color: "var(--muted-foreground)" }}>
            Mostrando <strong>{paginatedHotels.length}</strong> de <strong>{filteredHotels.length}</strong> establecimientos encontrados (Total cantón: {hotels.length})
          </span>
          {(search || categoryFilter !== "all" || classificationFilter !== "all" || sectorFilter !== "all") && (
            <button
              onClick={() => { setSearch(""); setCategoryFilter("all"); setClassificationFilter("all"); setSectorFilter("all"); setPage(1); }}
              className="text-amber-400 hover:underline font-medium cursor-pointer"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Hotels table */}
      <div className="rounded-md border overflow-hidden" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Alojamiento", "Sector / Parroquia", "Modalidad / Cat.", "10% Servicio", "Camas", "Ocupación", "Revenue (Ago)", "Rating", "Estado", ""].map(h => (
                  <th key={h} className="mono text-left px-4 py-3 text-[10px] uppercase tracking-widest font-medium" style={{ color: "var(--muted-foreground)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedHotels.map((h, i) => {
                const ss = statusStyle[h.status];
                const hasServ10 = h.gravaServicio10 ?? true;
                return (
                  <tr key={h.id} className="transition-colors hover:bg-[var(--secondary)]" style={{ borderBottom: i < paginatedHotels.length - 1 ? "1px solid var(--border)" : "none" }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {h.gallery?.[0] ? (
                          <img src={h.gallery[0]} alt="" className="w-12 h-10 rounded object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-12 h-10 rounded bg-slate-800 flex items-center justify-center text-sm flex-shrink-0">🏨</div>
                        )}
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate" style={{ color: "var(--foreground)" }}>{h.name}</p>
                          <p className="text-[10px] truncate" style={{ color: "var(--muted-foreground)" }}>
                            {h.taxId ? `RUC: ${h.taxId}` : ""} {h.address ? `· ${h.address}` : ""}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: "var(--muted-foreground)" }}>
                      <p className="font-medium text-slate-200">{h.city}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-0.5">
                        {Array.from({ length: h.stars }).map((_, idx) => <span key={idx} style={{ color: "#f59e0b", fontSize: 10 }}>★</span>)}
                      </div>
                      <span className="text-[10px] block" style={{ color: "var(--muted-foreground)" }}>
                        {h.classification || "Hotel"} · {starLabel(h.stars)}
                      </span>
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
                        <button onClick={() => onSelect(h.id)} className="text-xs px-2 py-1.5 rounded font-medium transition-colors cursor-pointer" style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>Gestionar</button>
                        <button onClick={() => setEditing({ ...h })} className="text-xs px-2 py-1.5 rounded border cursor-pointer hover:border-amber-400" style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}>Editar</button>
                        {canDelete && <button onClick={() => { if (confirm(`¿Eliminar ${h.name}?`)) onDelete(h.id); }} className="text-xs px-2 py-1.5 rounded border cursor-pointer" style={{ borderColor: "#7f1d1d", color: "#fca5a5" }}>Eliminar</button>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {pageSize > 0 && totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t text-xs" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
            <span style={{ color: "var(--muted-foreground)" }}>
              Página <strong>{page}</strong> de <strong>{totalPages}</strong>
            </span>
            <div className="flex gap-1.5">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded border disabled:opacity-30 cursor-pointer font-medium"
                style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
              >
                ← Anterior
              </button>
              {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className="w-8 h-8 rounded border text-xs font-semibold cursor-pointer"
                    style={{
                      background: page === pageNum ? "var(--primary)" : "transparent",
                      color: page === pageNum ? "var(--primary-foreground)" : "var(--muted-foreground)",
                      borderColor: page === pageNum ? "transparent" : "var(--border)",
                    }}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {totalPages > 5 && <span className="self-center px-1 text-slate-500">...</span>}
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded border disabled:opacity-30 cursor-pointer font-medium"
                style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
              >
                Siguiente →
              </button>
            </div>
          </div>
        )}
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
              <Field label="Capacidad de Camas / Plazas" type="number" value={String(editing.rooms)} onChange={rooms => setEditing({ ...editing, rooms: Number(rooms) })} required />
              <div>
                <label className="block text-xs mb-1" style={{ color: "var(--muted-foreground)" }}>Categoría Estrellas (1–5)</label>
                <select value={editing.stars} onChange={e => setEditing({ ...editing, stars: Math.min(5, Math.max(1, Number(e.target.value))) as 1 | 2 | 3 | 4 | 5 })} className="w-full rounded border px-3 py-2.5 text-sm outline-none" style={{ background: "var(--muted)", borderColor: "var(--border)" }}>
                  {[1, 2, 3, 4, 5].map(s => <option key={s} value={s}>{s} Estrella{s > 1 ? "s" : ""}</option>)}
                </select>
              </div>
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
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => getAuditLogs());

  useEffect(() => {
    const refreshLogs = () => setAuditLogs(getAuditLogs());
    window.addEventListener("alojamanta-audit-change", refreshLogs);
    return () => window.removeEventListener("alojamanta-audit-change", refreshLogs);
  }, []);

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
          <p className="mono text-[10px] uppercase tracking-[.18em] mb-1" style={{ color: "var(--primary)" }}>Control de acceso RBAC & Auditoría LOPDP</p>
          <h1 className="text-2xl">Usuarios, Permisos y Bitácora de Auditoría</h1>
          <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>Asigna cada cuenta a una propiedad, limita su acceso por rol y supervisa la bitácora inalterable de operaciones (RF-29, RF-30).</p>
        </div>
        <button onClick={startNewUser} className="px-4 py-2.5 rounded text-sm font-semibold cursor-pointer" style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>+ Crear usuario</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="Usuarios" value={String(users.length)} sub="cuentas registradas" />
        <KpiCard label="Activos" value={String(activeUsers)} sub="con acceso habilitado" accent />
        <KpiCard label="Invitaciones" value={String(users.filter(u => u.status === "invited").length)} sub="pendientes de aceptar" />
        <KpiCard label="Eventos Auditados" value={String(auditLogs.length)} sub="bitácora LOPDP inalterable" />
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
          <p className="mono text-[10px] uppercase tracking-widest mb-4" style={{ color: "var(--primary)" }}>Permisos por rol (RBAC · RF-29)</p>
          {[
            ["Superadministrador (Cantonal)", "Acceso total a los 116 alojamientos de Manta, conmutador IVA 15%/8%, auditoría LOPDP, catastro y métricas consolidadas."],
            ["Administrador de Hotel", "Control de su establecimiento, configuración del 10% de servicio (Art. 41), liquidaciones de pasarela y su equipo."],
            ["Revenue Manager", "Control de tarifas por temporada, planes tarifarios, apertura/cierre de venta web (Stop Sell) y cupos disponibles."],
            ["Operador Reservas / Recepción", "Bandeja de reservas en tiempo real, validación de Voucher QR en 1 clic al arribo del huésped, links de pago y comprobantes digitales (Sin PMS físico)."],
          ].map(([role, description]) => <div key={role} className="pb-3 mb-3 border-b last:border-0 last:mb-0 last:pb-0" style={{ borderColor: "var(--border)" }}><p className="text-xs font-semibold">{role}</p><p className="text-[11px] mt-1 leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{description}</p></div>)}
        </div>
      </div>

      {/* RF-30: Bitácora Inalterable de Auditoría (LOPDP Ecuador) */}
      <div className="rounded-md border overflow-hidden" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
          <div>
            <p className="text-sm font-semibold flex items-center gap-2" style={{ color: "var(--foreground)" }}>
              <span>🛡️</span> Bitácora Inalterable de Auditoría del Sistema (RF-30 · LOPDP Ecuador)
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
              Registro cronológico automático de cambios tributarios (IVA 15%/8%), validaciones de Voucher QR, cierres de cupo (Stop Sell) y reservas.
            </p>
          </div>
          <span className="mono text-[10px] px-2 py-1 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            Registro Activo · Solo Lectura
          </span>
        </div>
        <div className="overflow-x-auto max-h-72">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["ID", "Fecha y Hora", "Usuario", "Rol", "Módulo", "Acción", "Detalle de la Operación", "IP"].map(h => (
                  <th key={h} className="mono text-left px-3.5 py-2.5 text-[10px] uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log, i) => (
                <tr key={log.id} style={{ borderBottom: i < auditLogs.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <td className="px-3.5 py-2.5 mono text-[10px] text-amber-400">{log.id}</td>
                  <td className="px-3.5 py-2.5 mono text-[11px] whitespace-nowrap" style={{ color: "var(--muted-foreground)" }}>{log.timestamp}</td>
                  <td className="px-3.5 py-2.5 font-medium" style={{ color: "var(--foreground)" }}>{log.usuario}</td>
                  <td className="px-3.5 py-2.5 text-[11px]" style={{ color: "var(--muted-foreground)" }}>{log.rol}</td>
                  <td className="px-3.5 py-2.5 text-[11px] font-semibold text-sky-400">{log.modulo}</td>
                  <td className="px-3.5 py-2.5 mono text-[10px] font-bold text-emerald-400">{log.accion}</td>
                  <td className="px-3.5 py-2.5 text-[11px]" style={{ color: "var(--foreground)" }}>{log.detalle}</td>
                  <td className="px-3.5 py-2.5 mono text-[10px]" style={{ color: "var(--muted-foreground)" }}>{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
  const [activeHotelId, setActiveHotelId] = useState<string>("hotel-voyager-manta");
  const [showModal, setShowModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hotels, setHotels] = usePersistentState<PlatformHotel[]>("hoteldirekt.hotels.manta_116", DEFAULT_HOTELS);
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
            AlojaManta
          </h2>
          <p className="text-[10px] text-slate-400 mt-0.5">Portal Cantonal de Alojamientos</p>
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
            <p className="mono text-[9px] uppercase tracking-widest mb-1" style={{ color: "var(--muted-foreground)" }}>
              {role === "superadmin" ? "Hotel supervisado" : "Mi Hotel"}
            </p>
            <select
              className="w-full px-2 py-1.5 rounded text-xs font-medium border outline-none cursor-pointer hover:border-amber-500/50 transition-colors"
              style={{ background: "var(--secondary)", borderColor: "var(--border)", color: "var(--foreground)" }}
              value={activeHotelId}
              disabled={allowedHotels.length <= 1}
              onChange={e => setActiveHotelId(e.target.value)}
            >
              {allowedHotels.map(h => (
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
              AlojaManta
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
              onResetCatalog={() => {
                localStorage.removeItem("hoteldirekt.hotels.manta_116");
                localStorage.removeItem("hoteldirekt.hotels");
                setHotels(DEFAULT_HOTELS);
              }}
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
