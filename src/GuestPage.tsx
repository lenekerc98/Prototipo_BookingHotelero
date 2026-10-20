import { useState, useRef, useEffect } from "react";
import type { GuestUser } from "./AuthPage";
import { HOTEL_SRI_INFO } from "./hotelData";
import {
  MANTA_HOTELS,
  INITIAL_DEMO_RESERVATIONS,
  type Hotel,
  type RoomOffer,
  type MyReservation,
} from "./mantaHotels";

// ─── Types ────────────────────────────────────────────────────────────────────

type GuestView = "home" | "results" | "hotel" | "account";

interface SearchParams {
  destination: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const HOTELS: Hotel[] = MANTA_HOTELS;

const DESTINATIONS = [
  { city: "Manta - Barbasquillo", img: "https://images.unsplash.com/photo-1563629986-97c92e385f66?w=400&h=300&fit=crop&auto=format", hotels: 18 },
  { city: "Manta - El Murciélago", img: "https://images.unsplash.com/photo-1563273410-ca16d83b2cce?w=400&h=300&fit=crop&auto=format", hotels: 22 },
  { city: "Manta - Tarqui", img: "https://images.unsplash.com/photo-1704908327293-82e8a6026450?w=400&h=300&fit=crop&auto=format", hotels: 38 },
  { city: "Manta - Santa Marianita", img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop&auto=format", hotels: 9 },
  { city: "Manta - San Mateo", img: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=400&h=300&fit=crop&auto=format", hotels: 8 },
  { city: "Manta - Los Esteros", img: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=300&fit=crop&auto=format", hotels: 15 },
];

const DEMO_RESERVATIONS: MyReservation[] = INITIAL_DEMO_RESERVATIONS;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return new Intl.NumberFormat("es-EC", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(n);
}
function nightsBetween(a: string, b: string) {
  if (!a || !b) return 0;
  return Math.max(0, Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000));
}
function todayStr() { return new Date().toISOString().split("T")[0]; }
function addDays(date: string, n: number) {
  const d = new Date(date + "T12:00:00"); d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
}
function fmtDateShort(d: string) {
  return new Date(d + "T12:00:00").toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
}
function StarsRow({ n }: { n: number }) {
  return (
    <span className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} style={{ color: i < n ? "#f59e0b" : "#e2e8f0", fontSize: 11 }}>★</span>
      ))}
    </span>
  );
}

// ─── Price breakdown component (Booking.com style) ───────────────────────────

interface PriceBreakdownProps {
  basePrice: number;
  nights?: number;
  hasService10?: boolean;
  serviceFee?: number;
  hotelName?: string;
  className?: string;
  showToggle?: boolean;
  defaultExpanded?: boolean;
}

function PriceBreakdownBox({
  basePrice,
  nights = 1,
  hasService10 = false,
  serviceFee = 2.50,
  hotelName,
  className = "",
  showToggle = true,
  defaultExpanded = false,
}: PriceBreakdownProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const n = Math.max(nights, 1);
  const subtotal = Number((basePrice * n).toFixed(2));
  const iva = Number((subtotal * 0.15).toFixed(2));
  const fee = Number(serviceFee.toFixed(2));
  // El 10% de servicio turístico se calcula sobre el subtotal según Art. 41 Ley de Turismo
  const servicio = hasService10 ? Number(((subtotal + fee) * 0.10).toFixed(2)) : 0;
  const totalImpuestos = Number((iva + fee + servicio).toFixed(2));
  const totalPagar = Number((subtotal + totalImpuestos).toFixed(2));

  return (
    <div className={`rounded-xl border bg-white p-3.5 shadow-sm text-left transition-all ${className}`} style={{ borderColor: "#e2e8f0" }}>
      {/* Resumen estilo Booking */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Desglose del precio</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xs text-slate-500 font-medium">Precio</span>
            <span className="text-xl font-black text-slate-900 tracking-tight">US${subtotal.toFixed(2)}</span>
            {n > 1 && <span className="text-[11px] text-slate-400">({n} noches)</span>}
          </div>
          <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
            + US${totalImpuestos.toFixed(2)} de impuestos y cargos
          </p>
        </div>
        {showToggle && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
            className="text-xs font-semibold text-sky-600 hover:text-sky-800 transition-colors py-1 px-2.5 rounded-lg hover:bg-sky-50 border border-sky-100 flex items-center gap-1"
          >
            <span>{expanded ? "Ver menos" : "Ver desglose"}</span>
            <span className="text-[10px]">{expanded ? "▲" : "▼"}</span>
          </button>
        )}
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-slate-100 space-y-2.5 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 font-bold text-slate-800 text-[11px]">
            <span>ℹ️</span>
            <span>Información sobre el precio</span>
          </div>

          <div className="rounded-lg p-3 bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-slate-700 text-[11px] pb-1.5 border-b border-slate-200">
              <span>💳</span>
              <span>No incluye US${totalImpuestos.toFixed(2)} de impuestos y cargos</span>
            </div>

            <div className="flex justify-between items-center text-slate-600">
              <span>15% IVA</span>
              <span className="font-mono font-medium">US${iva.toFixed(2)}</span>
            </div>

            {fee > 0 && (
              <div className="flex justify-between items-center text-slate-600">
                <span>Tasa Municipal de Turismo (GAD Manta)</span>
                <span className="font-mono font-medium">US${fee.toFixed(2)}</span>
              </div>
            )}

            {hasService10 ? (
              <div className="flex justify-between items-center text-emerald-800 font-medium bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                <span>10% Cargo gubernamental (Ley Turismo Art. 41)</span>
                <span className="font-mono font-bold">US${servicio.toFixed(2)}</span>
              </div>
            ) : (
              <div className="flex justify-between items-center text-slate-400 italic text-[11px]">
                <span>10% Cargo gubernamental (Hostal exento)</span>
                <span className="font-mono">US$0.00</span>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center pt-1 font-bold text-slate-900 text-sm border-t border-slate-100">
            <span>Total final a pagar</span>
            <span className="text-base font-black text-amber-600 font-mono">US${totalPagar.toFixed(2)}</span>
          </div>

          <div className="p-2 rounded-lg bg-amber-50/70 border border-amber-200/80 flex items-start gap-1.5 text-[11px] text-amber-900 leading-tight">
            <span className="text-sm">🏛️</span>
            <div>
              <strong>Comprobante de Pago Digital:</strong> Certificado emitido por la pasarela turística. La Factura Electrónica fiscal (SRI) correspondiente al hospedaje es emitida y entregada directamente por {hotelName ? <strong>{hotelName}</strong> : "el hotel prestador"} en recepción.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Search bar ───────────────────────────────────────────────────────────────

function SearchBar({ params, onChange, onSearch, variant = "hero" }: { params: SearchParams; onChange: (p: SearchParams) => void; onSearch: () => void; variant?: "hero" | "sticky" }) {
  return (
    <div className={`w-full max-w-full flex flex-col md:flex-row gap-2.5 md:items-end ${variant === "hero" ? "p-3 sm:p-4 rounded-2xl shadow-2xl" : "p-2.5 rounded-xl border"}`} style={{ background: "#fff", borderColor: variant === "sticky" ? "#e2e8f0" : undefined }}>
      <div className="flex-1 min-w-0">
        <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-slate-500 text-left">¿A dónde vas?</label>
        <input className="w-full px-3 py-2 rounded-lg border text-sm font-medium outline-none text-slate-800" style={{ borderColor: "#cbd5e1" }} value={params.destination} onChange={e => onChange({ ...params, destination: e.target.value })} placeholder="Ciudad, parroquia o playa..." list="dest-list" />
        <datalist id="dest-list">{DESTINATIONS.map(d => <option key={d.city} value={d.city} />)}</datalist>
      </div>
      <div className="grid grid-cols-2 gap-2 md:flex md:gap-2">
        <div className="min-w-0 sm:w-32">
          <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-slate-500 text-left">Llegada</label>
          <input type="date" className="w-full px-2.5 py-2 rounded-lg border text-xs sm:text-sm font-medium outline-none text-slate-800" style={{ borderColor: "#cbd5e1", colorScheme: "light" }} value={params.checkIn} min={todayStr()} onChange={e => onChange({ ...params, checkIn: e.target.value, checkOut: params.checkOut && e.target.value >= params.checkOut ? addDays(e.target.value, 1) : params.checkOut })} />
        </div>
        <div className="min-w-0 sm:w-32">
          <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-slate-500 text-left">Salida</label>
          <input type="date" className="w-full px-2.5 py-2 rounded-lg border text-xs sm:text-sm font-medium outline-none text-slate-800" style={{ borderColor: "#cbd5e1", colorScheme: "light" }} value={params.checkOut} min={params.checkIn ? addDays(params.checkIn, 1) : addDays(todayStr(), 1)} onChange={e => onChange({ ...params, checkOut: e.target.value })} />
        </div>
      </div>
      <div className="min-w-0 md:w-28">
        <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-slate-500 text-left">Huéspedes</label>
        <select className="w-full px-3 py-2 rounded-lg border text-sm font-medium outline-none text-slate-800 bg-white" style={{ borderColor: "#cbd5e1" }} value={params.adults} onChange={e => onChange({ ...params, adults: Number(e.target.value) })}>
          {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} adulto{n > 1 ? "s" : ""}</option>)}
        </select>
      </div>
      <button onClick={onSearch} className="w-full md:w-auto px-6 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 active:scale-95 transition-all whitespace-nowrap cursor-pointer shadow-sm text-center" style={{ background: "#f59e0b", color: "#0c1220" }}>
        🔍 Buscar
      </button>
    </div>
  );
}

// ─── Invoice modal ────────────────────────────────────────────────────────────

export function InvoiceModal({ res, onClose }: { res: MyReservation; onClose: () => void }) {
  // Buscar datos fiscales reales del hotel en Manta
  const hotelKey = Object.keys(HOTEL_SRI_INFO).find(k => 
    res.hotel.toLowerCase().includes(k.replace(/-/g, " ")) || 
    HOTEL_SRI_INFO[k].nombreComercial.toLowerCase().includes(res.hotel.toLowerCase())
  ) || "costa-sol";
  const sri = HOTEL_SRI_INFO[hotelKey] || HOTEL_SRI_INFO["costa-sol"];

  const hasServicio = sri.gravaServicio10 ?? (res.hotel.includes("Costa Sol") || res.hotel.includes("Palmeras") || res.hotel.includes("Pacífico"));
  const divisor = hasServicio ? 1.25 : 1.15;
  const base = res.total / divisor;
  const iva = base * 0.15;
  const servicio = hasServicio ? base * 0.10 : 0;
  const invoiceNum = `${sri.estab}-${sri.ptoEmi}-${res.id.split("-")[1].padStart(9, "0")}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-md rounded-2xl border overflow-hidden shadow-2xl" style={{ background: "#fff" }}>
        <div className="px-6 py-5 border-b" style={{ borderColor: "#e2e8f0", background: "#0c1220" }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-bold text-amber-400 text-lg" style={{ fontFamily: "DM Serif Display, serif" }}>{sri.nombreComercial}</p>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-mono px-1.5 py-0.5 rounded border border-emerald-500/30">PAGO ACREDITADO</span>
              </div>
              <p className="text-xs text-slate-300">{sri.razonSocial}</p>
              <p className="text-[10px] text-slate-400 font-mono">RUC: {sri.ruc} · Manta, Manabí</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">VOUCHER DIGITAL</span>
              <p className="font-mono font-bold text-slate-100 text-xs mt-1">REC-{res.id}</p>
              <p className="text-[10px] text-slate-400">Fecha: {fmtDateShort(res.checkOut)}</p>
            </div>
          </div>
        </div>

        <div className="p-3 bg-blue-50 border-b border-blue-200 text-[11px] text-blue-900 flex items-center gap-2">
          <span>🏛️</span>
          <span><strong>Facturación Directa por el Hotel:</strong> Este documento certifica su pago online transferido al hotel. Su factura fiscal oficial (SRI) será emitida directamente por {sri.nombreComercial} al momento de su estancia.</span>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Titular de Reserva</p>
              <p className="font-semibold text-slate-700">Huésped Registrado</p>
              <p className="text-xs text-slate-500 font-mono">Código {res.id}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Establecimiento Destino</p>
              <p className="font-semibold text-slate-700">{res.hotel}</p>
              <p className="text-xs text-slate-500">{res.city}</p>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden border" style={{ borderColor: "#e2e8f0" }}>
            <table className="w-full text-sm">
              <thead><tr style={{ background: "#f8fafc" }}><th className="text-left px-4 py-2.5 text-xs font-bold text-slate-500">Detalle de Hospedaje</th><th className="text-right px-4 py-2.5 text-xs font-bold text-slate-500">Monto</th></tr></thead>
              <tbody>
                <tr style={{ borderTop: "1px solid #e2e8f0" }}>
                  <td className="px-4 py-2.5"><p className="font-medium text-slate-700">{res.room}</p><p className="text-xs text-slate-400">{res.nights} noche{res.nights > 1 ? "s" : ""} · {fmtDateShort(res.checkIn)} → {fmtDateShort(res.checkOut)}</p></td>
                  <td className="px-4 py-2.5 text-right font-medium text-slate-700">{fmt(base)}</td>
                </tr>
                <tr style={{ borderTop: "1px solid #e2e8f0", background: "#f8fafc" }}>
                  <td className="px-4 py-2 text-xs text-slate-500">IVA (15% base para factura hotel)</td>
                  <td className="px-4 py-2 text-right text-xs text-slate-500">{fmt(iva)}</td>
                </tr>
                <tr style={{ background: "#f8fafc" }}>
                  <td className="px-4 py-2 text-xs text-slate-600 font-medium">Tasa Municipal de Turismo (GAD Manta)</td>
                  <td className="px-4 py-2 text-right text-xs text-slate-700 font-medium">{fmt(2.50)}</td>
                </tr>
                {hasServicio && (
                  <tr style={{ background: "#f8fafc" }}>
                    <td className="px-4 py-2 text-xs text-emerald-600 font-medium">10% Servicio Turístico (Art. 41 Ley Turismo)</td>
                    <td className="px-4 py-2 text-right text-xs text-emerald-600 font-bold">{fmt(servicio)}</td>
                  </tr>
                )}
                <tr style={{ borderTop: "1px solid #e2e8f0" }}>
                  <td className="px-4 py-3 font-bold text-slate-800">Total Cobrado</td>
                  <td className="px-4 py-3 text-right font-bold text-lg" style={{ color: "#f59e0b" }}>{fmt(res.total)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex items-center gap-2 rounded-xl p-3" style={{ background: "#d1fae5", border: "1px solid #a7f3d0" }}>
            <span className="text-green-600 font-bold">✓</span>
            <span className="text-xs font-semibold text-green-700">Cobro liquidado vía pasarela y transferido al hotel</span>
          </div>
        </div>
        <div className="px-6 py-4 border-t flex gap-2" style={{ borderColor: "#e2e8f0" }}>
          <button onClick={onClose} className="flex-1 py-2 rounded-xl text-sm font-medium border" style={{ borderColor: "#e2e8f0", color: "#64748b" }}>Cerrar</button>
          <button className="flex-1 py-2 rounded-xl text-sm font-bold" style={{ background: "#f59e0b", color: "#0c1220" }}>⬇ Descargar Voucher PDF</button>
        </div>
      </div>
    </div>
  );
}


// ─── My Account view (Hub & Perfil) ──────────────────────────────────────────

function AccountView({
  user,
  reservations,
  onLogout,
  onCancelReservation,
  onViewVoucher,
  onBack,
  initialTab = "hub",
  onAdminAccess,
}: {
  user: GuestUser;
  reservations: MyReservation[];
  onLogout: () => void;
  onCancelReservation: (id: string) => void;
  onViewVoucher: (res: MyReservation) => void;
  onBack?: () => void;
  initialTab?: "hub" | "reservations" | "personal" | "billing" | "payments" | "benefits";
  onAdminAccess?: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"hub" | "reservations" | "personal" | "billing" | "payments" | "benefits">(initialTab);
  const [resFilter, setResFilter] = useState<"all" | "upcoming" | "completed" | "cancelled">("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Perfil del huésped persistente
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(`alojamanta_profile_${user.email}`);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      fullName: user.name,
      email: user.email,
      documentType: "Cédula de Identidad (Ecuador)",
      documentNumber: "1314589201",
      phone: "+593 99 234 5678",
      city: "Guayaquil / Ecuador",
      roomPref: "Cama Matrimonial King · Piso alto con vista",
      dietPref: "Desayuno incluido en estancia",
      // Facturación SRI
      wantsInvoice: true,
      taxId: "1314589201001",
      razonSocial: user.name,
      direccionFiscal: "Av. Malecón y Calle 15, Edif. Poseidón",
      correoFactura: user.email,
    };
  });

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }

  function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    try {
      localStorage.setItem(`alojamanta_profile_${user.email}`, JSON.stringify(profile));
    } catch {}
    showToast("✓ Datos de perfil guardados para tu próximo check-in");
  }

  function handleSaveBilling(e: React.FormEvent) {
    e.preventDefault();
    try {
      localStorage.setItem(`alojamanta_profile_${user.email}`, JSON.stringify(profile));
    } catch {}
    showToast("✓ Datos fiscales SRI actualizados para la factura del hotel");
  }

  const statusStyle: Record<string, { bg: string; color: string; label: string }> = {
    upcoming: { bg: "#1e3a5f", color: "#93c5fd", label: "Próxima estancia" },
    completed: { bg: "#064e3b", color: "#6ee7b7", label: "Completada" },
    cancelled: { bg: "#450a0a", color: "#fca5a5", label: "Cancelada" },
  };

  const userReservations = reservations.filter(r =>
    r.guestEmail.toLowerCase() === user.email.toLowerCase() ||
    r.guestName.toLowerCase().includes(user.name.toLowerCase())
  );
  const allList = userReservations.length > 0 ? userReservations : reservations;

  const filteredReservations = allList.filter(r => {
    if (resFilter === "all") return true;
    return r.status === resFilter;
  });

  const totalNights = allList.reduce((s, r) => s + r.nights, 0);
  const totalPaid = allList.reduce((s, r) => s + r.total, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-700 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navegación superior */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={onBack}
          className="text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <span>←</span>
          <span>Volver a buscar hoteles</span>
        </button>

        <div className="flex items-center gap-2">
          {onAdminAccess && (
            <button
              onClick={onAdminAccess}
              className="text-xs px-3 py-1.5 rounded-lg border border-amber-300 bg-amber-50 text-amber-900 font-semibold hover:bg-amber-100 transition-colors flex items-center gap-1 cursor-pointer"
              title="Acceso para recepcionistas y propietarios de hotel"
            >
              <span>🏨</span>
              <span className="hidden sm:inline">Panel Hotel / PMS</span>
            </button>
          )}
          <button
            onClick={onLogout}
            className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors font-medium cursor-pointer"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Tarjeta de Encabezado del Huésped */}
      <div className="rounded-2xl border bg-white p-5 sm:p-6 mb-6 shadow-xs" style={{ borderColor: "#e2e8f0" }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b" style={{ borderColor: "#f1f5f9" }}>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center text-2xl font-black shadow-md shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900" style={{ fontFamily: "DM Serif Display, serif" }}>
                  {profile.fullName || user.name}
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  ⭐ Nivel 1 · Huésped Frecuente Manta
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{user.email} · {profile.phone}</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Reserva directa oficial · Sin sobreprecios ni cargos ocultos de intermediarios
              </p>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-xl">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Resumen de cuenta</span>
            <div className="flex items-center gap-3 text-xs">
              <span className="font-bold text-slate-700 font-mono">{allList.length} reservas</span>
              <span className="text-slate-300">|</span>
              <span className="font-bold text-amber-600 font-mono">{totalNights} noches</span>
            </div>
          </div>
        </div>

        {/* Barra de pestañas */}
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto whitespace-nowrap scrollbar-none pt-4 text-xs font-semibold">
          {[
            { id: "hub", label: "Panel General", icon: "🏠" },
            { id: "reservations", label: `Mis Reservas (${allList.length})`, icon: "🛎️" },
            { id: "personal", label: "Datos Personales & Check-in", icon: "👤" },
            { id: "billing", label: "Facturación SRI Hotel", icon: "🏛️" },
            { id: "payments", label: "Medios de Pago", icon: "💳" },
            { id: "benefits", label: "Beneficios Manta Direct", icon: "🎁" },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === t.id
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ─── TAB 1: HUB PRINCIPAL (Tarjetas Categorizadas) ─── */}
      {activeTab === "hub" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Card 1: Estancias y Viajes */}
            <div className="rounded-2xl border bg-white p-5 hover:shadow-md transition-shadow" style={{ borderColor: "#e2e8f0" }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <span>🛎️</span>
                  <span>Estancias y Viajes</span>
                </h3>
                <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {allList.length} activas
                </span>
              </div>
              <div className="space-y-1 divide-y divide-slate-100 text-xs">
                <button
                  onClick={() => setActiveTab("reservations")}
                  className="w-full py-2.5 flex items-center justify-between text-left hover:text-amber-600 transition-colors cursor-pointer group"
                >
                  <span className="text-slate-700 font-medium group-hover:text-amber-600">Mis reservas y viajes en Manta</span>
                  <span className="text-slate-400 group-hover:translate-x-1 transition-transform">→</span>
                </button>
                <button
                  onClick={() => setActiveTab("reservations")}
                  className="w-full py-2.5 flex items-center justify-between text-left hover:text-amber-600 transition-colors cursor-pointer group"
                >
                  <span className="text-slate-700 font-medium group-hover:text-amber-600">Vouchers y comprobantes con QR</span>
                  <span className="text-slate-400 group-hover:translate-x-1 transition-transform">→</span>
                </button>
                <button
                  onClick={() => setActiveTab("reservations")}
                  className="w-full py-2.5 flex items-center justify-between text-left hover:text-amber-600 transition-colors cursor-pointer group"
                >
                  <span className="text-slate-700 font-medium group-hover:text-amber-600">Alojamientos guardados y favoritos</span>
                  <span className="text-slate-400 group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </div>

            {/* Card 2: Gestión de la cuenta y Check-in */}
            <div className="rounded-2xl border bg-white p-5 hover:shadow-md transition-shadow" style={{ borderColor: "#e2e8f0" }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <span>👤</span>
                  <span>Datos del Huésped</span>
                </h3>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Check-in ágil
                </span>
              </div>
              <div className="space-y-1 divide-y divide-slate-100 text-xs">
                <button
                  onClick={() => setActiveTab("personal")}
                  className="w-full py-2.5 flex items-center justify-between text-left hover:text-amber-600 transition-colors cursor-pointer group"
                >
                  <span className="text-slate-700 font-medium group-hover:text-amber-600">Datos personales (Cédula / Pasaporte)</span>
                  <span className="text-slate-400 group-hover:translate-x-1 transition-transform">→</span>
                </button>
                <button
                  onClick={() => setActiveTab("personal")}
                  className="w-full py-2.5 flex items-center justify-between text-left hover:text-amber-600 transition-colors cursor-pointer group"
                >
                  <span className="text-slate-700 font-medium group-hover:text-amber-600">Teléfono y WhatsApp de confirmación</span>
                  <span className="text-slate-400 group-hover:translate-x-1 transition-transform">→</span>
                </button>
                <button
                  onClick={() => setActiveTab("personal")}
                  className="w-full py-2.5 flex items-center justify-between text-left hover:text-amber-600 transition-colors cursor-pointer group"
                >
                  <span className="text-slate-700 font-medium group-hover:text-amber-600">Preferencias de cama y habitación</span>
                  <span className="text-slate-400 group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </div>

            {/* Card 3: Facturación Directa SRI */}
            <div className="rounded-2xl border bg-white p-5 hover:shadow-md transition-shadow" style={{ borderColor: "#e2e8f0" }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <span>🏛️</span>
                  <span>Facturación SRI</span>
                </h3>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  Factura del Hotel
                </span>
              </div>
              <div className="space-y-1 divide-y divide-slate-100 text-xs">
                <button
                  onClick={() => setActiveTab("billing")}
                  className="w-full py-2.5 flex items-center justify-between text-left hover:text-amber-600 transition-colors cursor-pointer group"
                >
                  <span className="text-slate-700 font-medium group-hover:text-amber-600">Datos tributarios (RUC / Cédula)</span>
                  <span className="text-slate-400 group-hover:translate-x-1 transition-transform">→</span>
                </button>
                <button
                  onClick={() => setActiveTab("billing")}
                  className="w-full py-2.5 flex items-center justify-between text-left hover:text-amber-600 transition-colors cursor-pointer group"
                >
                  <span className="text-slate-700 font-medium group-hover:text-amber-600">Razón Social y Domicilio fiscal</span>
                  <span className="text-slate-400 group-hover:translate-x-1 transition-transform">→</span>
                </button>
                <button
                  onClick={() => setActiveTab("billing")}
                  className="w-full py-2.5 flex items-center justify-between text-left hover:text-amber-600 transition-colors cursor-pointer group"
                >
                  <span className="text-slate-700 font-medium group-hover:text-amber-600">Emisión en recepción del alojamiento</span>
                  <span className="text-slate-400 group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </div>

            {/* Card 4: Medios de Pago Digitales */}
            <div className="rounded-2xl border bg-white p-5 hover:shadow-md transition-shadow" style={{ borderColor: "#e2e8f0" }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <span>💳</span>
                  <span>Cobro y Pagos</span>
                </h3>
                <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                  Digital Seguro
                </span>
              </div>
              <div className="space-y-1 divide-y divide-slate-100 text-xs">
                <button
                  onClick={() => setActiveTab("payments")}
                  className="w-full py-2.5 flex items-center justify-between text-left hover:text-amber-600 transition-colors cursor-pointer group"
                >
                  <span className="text-slate-700 font-medium group-hover:text-amber-600">Tarjetas de crédito y débito vinculadas</span>
                  <span className="text-slate-400 group-hover:translate-x-1 transition-transform">→</span>
                </button>
                <button
                  onClick={() => setActiveTab("payments")}
                  className="w-full py-2.5 flex items-center justify-between text-left hover:text-amber-600 transition-colors cursor-pointer group"
                >
                  <span className="text-slate-700 font-medium group-hover:text-amber-600">Cobro local vía PayPhone & DeUna</span>
                  <span className="text-slate-400 group-hover:translate-x-1 transition-transform">→</span>
                </button>
                <button
                  onClick={() => setActiveTab("payments")}
                  className="w-full py-2.5 flex items-center justify-between text-left hover:text-amber-600 transition-colors cursor-pointer group"
                >
                  <span className="text-slate-700 font-medium group-hover:text-amber-600">Certificados de acreditación hotelera</span>
                  <span className="text-slate-400 group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </div>

            {/* Card 5: Beneficios Manta Direct */}
            <div className="rounded-2xl border bg-white p-5 hover:shadow-md transition-shadow" style={{ borderColor: "#e2e8f0" }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <span>🎁</span>
                  <span>Beneficios Manta Direct</span>
                </h3>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                  0% Comisión OTA
                </span>
              </div>
              <div className="space-y-1 divide-y divide-slate-100 text-xs">
                <button
                  onClick={() => setActiveTab("benefits")}
                  className="w-full py-2.5 flex items-center justify-between text-left hover:text-amber-600 transition-colors cursor-pointer group"
                >
                  <span className="text-slate-700 font-medium group-hover:text-amber-600">Tarifa neta garantizada por el hotel</span>
                  <span className="text-slate-400 group-hover:translate-x-1 transition-transform">→</span>
                </button>
                <button
                  onClick={() => setActiveTab("benefits")}
                  className="w-full py-2.5 flex items-center justify-between text-left hover:text-amber-600 transition-colors cursor-pointer group"
                >
                  <span className="text-slate-700 font-medium group-hover:text-amber-600">Alianzas en Murciélago & Barbasquillo</span>
                  <span className="text-slate-400 group-hover:translate-x-1 transition-transform">→</span>
                </button>
                <button
                  onClick={() => setActiveTab("benefits")}
                  className="w-full py-2.5 flex items-center justify-between text-left hover:text-amber-600 transition-colors cursor-pointer group"
                >
                  <span className="text-slate-700 font-medium group-hover:text-amber-600">Cancelación flexible sin penalidades</span>
                  <span className="text-slate-400 group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </div>

            {/* Card 6: Ayuda, Soporte & Propietarios */}
            <div className="rounded-2xl border bg-white p-5 hover:shadow-md transition-shadow" style={{ borderColor: "#e2e8f0" }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <span>🏖️</span>
                  <span>Soporte & Hoteleros</span>
                </h3>
                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  Cantón Manta
                </span>
              </div>
              <div className="space-y-1 divide-y divide-slate-100 text-xs">
                <div className="py-2.5 flex items-center justify-between text-left">
                  <span className="text-slate-700 font-medium">Asistencia local: +593 5 262 8900</span>
                  <span className="text-slate-400">📞</span>
                </div>
                <div className="py-2.5 flex items-center justify-between text-left">
                  <span className="text-slate-700 font-medium">WhatsApp Manta: +593 99 876 5432</span>
                  <span className="text-slate-400">💬</span>
                </div>
                {onAdminAccess && (
                  <button
                    onClick={onAdminAccess}
                    className="w-full py-2.5 flex items-center justify-between text-left text-amber-800 font-bold hover:underline cursor-pointer group"
                  >
                    <span>¿Eres hotelero? Ingresa a tu panel PMS</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 2: MIS RESERVAS ─── */}
      {activeTab === "reservations" && (
        <div className="space-y-5">
          {/* Filtros */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border" style={{ borderColor: "#e2e8f0" }}>
            <div className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap text-xs font-semibold">
              {[
                { id: "all", label: "Todas" },
                { id: "upcoming", label: "Próximas" },
                { id: "completed", label: "Completadas" },
                { id: "cancelled", label: "Canceladas" },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setResFilter(f.id as any)}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    resFilter === f.id
                      ? "bg-amber-500 text-slate-950 font-bold shadow-xs"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {f.label} ({f.id === "all" ? allList.length : allList.filter(x => x.status === f.id).length})
                </button>
              ))}
            </div>

            <span className="text-xs text-slate-400">
              Mostrando {filteredReservations.length} de {allList.length} reservas
            </span>
          </div>

          {/* Listado */}
          <div className="space-y-4">
            {filteredReservations.map(res => {
              const st = statusStyle[res.status] || statusStyle.upcoming;
              return (
                <div key={res.id} className="rounded-2xl border bg-white overflow-hidden shadow-xs hover:shadow-md transition-all" style={{ borderColor: "#e2e8f0" }}>
                  <div className="flex flex-col sm:flex-row">
                    <img src={res.image} alt={res.room} className="sm:w-48 w-full object-cover" style={{ height: 140 }} />
                    <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-bold text-slate-900 text-base">{res.hotel}</p>
                            <p className="text-xs text-slate-500 font-medium">{res.city} · {res.room}</p>
                          </div>
                          <span className="mono text-[10px] px-2.5 py-1 rounded-full uppercase font-bold tracking-wider" style={{ background: st.bg, color: st.color }}>
                            {st.label}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-2 flex items-center gap-2">
                          <span>📅 {fmtDateShort(res.checkIn)} → {fmtDateShort(res.checkOut)}</span>
                          <span>·</span>
                          <span>🌙 {res.nights} noche{res.nights > 1 ? "s" : ""}</span>
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-3 border-t" style={{ borderColor: "#f1f5f9" }}>
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Código de confirmación</p>
                          <p className="font-mono text-sm font-bold text-slate-800">{res.id}</p>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <p className="font-black text-lg text-slate-900">{fmt(res.total)}</p>
                          <button
                            onClick={() => onViewVoucher(res)}
                            className="text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-xs cursor-pointer flex items-center gap-1"
                          >
                            <span>🧾</span>
                            <span>Ver Voucher</span>
                          </button>
                          {res.status === "upcoming" && (
                            <button
                              onClick={() => {
                                if (confirm(`¿Deseas cancelar la reserva ${res.id}? Recuerda que la política flexible te reintegra el valor total.`)) {
                                  onCancelReservation(res.id);
                                  showToast(`Reserva ${res.id} cancelada correctamente`);
                                }
                              }}
                              className="text-xs px-2.5 py-1.5 rounded-xl font-semibold transition-all border border-red-200 text-red-600 hover:bg-red-50 cursor-pointer"
                            >
                              Cancelar
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredReservations.length === 0 && (
              <div className="text-center py-12 rounded-2xl border bg-white" style={{ borderColor: "#e2e8f0" }}>
                <p className="text-3xl mb-2">🏖️</p>
                <p className="font-bold text-slate-700 text-sm">No tienes reservas con este filtro</p>
                <button
                  onClick={() => setResFilter("all")}
                  className="mt-3 text-xs text-amber-700 font-semibold underline cursor-pointer"
                >
                  Ver todas las reservas
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── TAB 3: DATOS PERSONALES & CHECK-IN ─── */}
      {activeTab === "personal" && (
        <form onSubmit={handleSaveProfile} className="rounded-2xl border bg-white p-6 shadow-xs max-w-2xl" style={{ borderColor: "#e2e8f0" }}>
          <div className="border-b pb-4 mb-5" style={{ borderColor: "#f1f5f9" }}>
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2" style={{ fontFamily: "DM Serif Display, serif" }}>
              <span>👤</span>
              <span>Datos Personales y Check-in Exprés</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Esta información agiliza tu registro en la recepción de los hoteles de Manta y personaliza tu estancia.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nombre y Apellidos Completos</label>
              <input
                type="text"
                value={profile.fullName}
                onChange={e => setProfile({ ...profile, fullName: e.target.value })}
                className="w-full px-3 py-2 text-sm border rounded-xl outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                style={{ borderColor: "#cbd5e1" }}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tipo de Documento</label>
                <select
                  value={profile.documentType}
                  onChange={e => setProfile({ ...profile, documentType: e.target.value })}
                  className="w-full px-3 py-2 text-sm border rounded-xl outline-none bg-white"
                  style={{ borderColor: "#cbd5e1" }}
                >
                  <option value="Cédula de Identidad (Ecuador)">Cédula de Identidad (Ecuador)</option>
                  <option value="Pasaporte Internacional">Pasaporte Internacional</option>
                  <option value="RUC Personal">RUC Personal</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Número de Identificación</label>
                <input
                  type="text"
                  value={profile.documentNumber}
                  onChange={e => setProfile({ ...profile, documentNumber: e.target.value })}
                  placeholder="Ej: 1314589201"
                  className="w-full px-3 py-2 text-sm border rounded-xl outline-none font-mono"
                  style={{ borderColor: "#cbd5e1" }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full px-3 py-2 text-sm border rounded-xl bg-slate-50 text-slate-500 cursor-not-allowed"
                  style={{ borderColor: "#cbd5e1" }}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Teléfono / WhatsApp</label>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={e => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full px-3 py-2 text-sm border rounded-xl outline-none font-mono"
                  style={{ borderColor: "#cbd5e1" }}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Ciudad o País de Residencia</label>
              <input
                type="text"
                value={profile.city}
                onChange={e => setProfile({ ...profile, city: e.target.value })}
                placeholder="Ej: Quito, Guayaquil, Cuenca, etc."
                className="w-full px-3 py-2 text-sm border rounded-xl outline-none"
                style={{ borderColor: "#cbd5e1" }}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Preferencia Habitual de Habitación</label>
              <input
                type="text"
                value={profile.roomPref}
                onChange={e => setProfile({ ...profile, roomPref: e.target.value })}
                placeholder="Ej: Cama King, piso alto, almohadas extras..."
                className="w-full px-3 py-2 text-sm border rounded-xl outline-none"
                style={{ borderColor: "#cbd5e1" }}
              />
            </div>

            <div className="pt-3 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab("hub")}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-xs cursor-pointer transition-colors"
              >
                Guardar Datos de Huésped
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ─── TAB 4: FACTURACIÓN DIRECTA SRI ─── */}
      {activeTab === "billing" && (
        <form onSubmit={handleSaveBilling} className="rounded-2xl border bg-white p-6 shadow-xs max-w-2xl" style={{ borderColor: "#e2e8f0" }}>
          <div className="border-b pb-4 mb-5" style={{ borderColor: "#f1f5f9" }}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2" style={{ fontFamily: "DM Serif Display, serif" }}>
                <span>🏛️</span>
                <span>Datos Fiscales para el Hotel (SRI Ecuador)</span>
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-300">
                15% IVA SRI
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              <strong>El hotel emite tu factura fiscal oficial en recepción.</strong> Guarda aquí tus datos para que el recepcionista la facture automáticamente a tu nombre o empresa.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
              <span className="text-base">ℹ️</span>
              <p>
                La plataforma de reserva cobra y transfiere el importe neto al alojamiento. La factura con validez tributaria ante el SRI es emitida por la razón social del hotel destino al momento de tu estancia.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">RUC o Cédula para Factura</label>
                <input
                  type="text"
                  value={profile.taxId}
                  onChange={e => setProfile({ ...profile, taxId: e.target.value })}
                  placeholder="Ej: 1314589201001"
                  className="w-full px-3 py-2 text-sm border rounded-xl outline-none font-mono"
                  style={{ borderColor: "#cbd5e1" }}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Razón Social o Nombre Fiscal</label>
                <input
                  type="text"
                  value={profile.razonSocial}
                  onChange={e => setProfile({ ...profile, razonSocial: e.target.value })}
                  placeholder="Nombre de empresa o persona natural"
                  className="w-full px-3 py-2 text-sm border rounded-xl outline-none"
                  style={{ borderColor: "#cbd5e1" }}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Dirección Fiscal en Ecuador</label>
              <input
                type="text"
                value={profile.direccionFiscal}
                onChange={e => setProfile({ ...profile, direccionFiscal: e.target.value })}
                placeholder="Calle, número y ciudad"
                className="w-full px-3 py-2 text-sm border rounded-xl outline-none"
                style={{ borderColor: "#cbd5e1" }}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Correo para Factura Electrónica</label>
              <input
                type="email"
                value={profile.correoFactura}
                onChange={e => setProfile({ ...profile, correoFactura: e.target.value })}
                className="w-full px-3 py-2 text-sm border rounded-xl outline-none font-mono"
                style={{ borderColor: "#cbd5e1" }}
                required
              />
            </div>

            <div className="pt-3 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab("hub")}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer"
              >
                Volver
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-xs cursor-pointer transition-colors"
              >
                Guardar Datos de Facturación
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ─── TAB 5: MEDIOS DE PAGO ─── */}
      {activeTab === "payments" && (
        <div className="rounded-2xl border bg-white p-6 shadow-xs max-w-2xl space-y-5" style={{ borderColor: "#e2e8f0" }}>
          <div className="border-b pb-4" style={{ borderColor: "#f1f5f9" }}>
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2" style={{ fontFamily: "DM Serif Display, serif" }}>
              <span>💳</span>
              <span>Medios de Pago y Cobro Digital</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Pasarelas integradas seguras para reservas directas en Manta.
            </p>
          </div>

          <div className="space-y-3">
            {/* Tarjeta 1 */}
            <div className="p-4 rounded-xl border flex items-center justify-between bg-slate-50" style={{ borderColor: "#cbd5e1" }}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">💳</span>
                <div>
                  <p className="text-xs font-bold text-slate-800">Visa Débito / Crédito **** 4821</p>
                  <p className="text-[10px] text-slate-400">Vence 09/28 · Pago digital seguro con 3DS</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">Predeterminada</span>
            </div>

            {/* PayPhone */}
            <div className="p-4 rounded-xl border flex items-center justify-between bg-slate-50" style={{ borderColor: "#cbd5e1" }}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">📱</span>
                <div>
                  <p className="text-xs font-bold text-slate-800">PayPhone Ecuador</p>
                  <p className="text-[10px] text-slate-400">Vinculado con número {profile.phone}</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">Activo</span>
            </div>

            {/* DeUna */}
            <div className="p-4 rounded-xl border flex items-center justify-between bg-slate-50" style={{ borderColor: "#cbd5e1" }}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚡</span>
                <div>
                  <p className="text-xs font-bold text-slate-800">DeUna / Banco Pichincha</p>
                  <p className="text-[10px] text-slate-400">Cobro QR instantáneo sin comisiones extra</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">Disponible</span>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 6: BENEFICIOS MANTA DIRECT ─── */}
      {activeTab === "benefits" && (
        <div className="rounded-2xl border bg-white p-6 shadow-xs max-w-2xl space-y-5" style={{ borderColor: "#e2e8f0" }}>
          <div className="border-b pb-4" style={{ borderColor: "#f1f5f9" }}>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎁</span>
              <div>
                <h3 className="font-bold text-slate-900 text-lg" style={{ fontFamily: "DM Serif Display, serif" }}>
                  Beneficios del Programa Manta Direct
                </h3>
                <p className="text-xs text-slate-500">
                  Por reservar directamente con el hotel en lugar de intermediarios internacionales.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-4 rounded-xl border bg-amber-50/50 border-amber-200">
              <span className="text-xl">💰</span>
              <p className="font-bold text-slate-900 mt-1">Sin Sobreprecio OTA</p>
              <p className="text-slate-600 mt-0.5 leading-relaxed">
                Ahorras entre el 15% y 20% en cada noche frente a plataformas extranjeras que cobran altas comisiones al hotel.
              </p>
            </div>
            <div className="p-4 rounded-xl border bg-blue-50/50 border-blue-200">
              <span className="text-xl">🎟️</span>
              <p className="font-bold text-slate-900 mt-1">Alianzas en Restaurantes</p>
              <p className="text-slate-600 mt-0.5 leading-relaxed">
                Presentando tu voucher obtienes 10% de descuento en locales gastronómicos aliados de Barbasquillo y Murciélago.
              </p>
            </div>
            <div className="p-4 rounded-xl border bg-emerald-50/50 border-emerald-200">
              <span className="text-xl">⚡</span>
              <p className="font-bold text-slate-900 mt-1">Check-in Prioritario</p>
              <p className="text-slate-600 mt-0.5 leading-relaxed">
                Recepción exprés mostrando el código QR de confirmación desde tu teléfono.
              </p>
            </div>
            <div className="p-4 rounded-xl border bg-purple-50/50 border-purple-200">
              <span className="text-xl">🔄</span>
              <p className="font-bold text-slate-900 mt-1">Cancelación Flexible</p>
              <p className="text-slate-600 mt-0.5 leading-relaxed">
                Trato directo con el hotel para cambios de fecha sin trámites engorrosos ni penalizaciones abusivas.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Consult Reservations Modal ──────────────────────────────────────────────

function ConsultReservationModal({
  reservations,
  onClose,
  onViewVoucher,
  onCancelReservation,
}: {
  reservations: MyReservation[];
  onClose: () => void;
  onViewVoucher: (res: MyReservation) => void;
  onCancelReservation: (resId: string) => void;
}) {
  const [query, setQuery] = useState("");
  const trimmed = query.trim().toLowerCase();

  const results = trimmed
    ? reservations.filter(r =>
        r.id.toLowerCase().includes(trimmed) ||
        r.guestEmail.toLowerCase().includes(trimmed) ||
        r.guestName.toLowerCase().includes(trimmed) ||
        r.hotel.toLowerCase().includes(trimmed) ||
        (r.guestPhone && r.guestPhone.includes(trimmed))
      )
    : reservations;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(5px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-2xl rounded-2xl border bg-white overflow-hidden shadow-2xl flex flex-col" style={{ maxHeight: "90vh" }}>
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ background: "#ffffff", borderColor: "#e2e8f0" }}>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-lg" style={{ fontFamily: "DM Serif Display, serif" }}>
                Consultar Reservas de Hotel
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold border border-amber-300">
                Manta 2026
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Busca por código de confirmación (ej: RES-4821), correo o nombre del titular
            </p>
          </div>
          <button onClick={onClose} className="text-2xl text-slate-400 hover:text-slate-800 cursor-pointer">×</button>
        </div>

        {/* Search input */}
        <div className="p-5 border-b bg-slate-50" style={{ borderColor: "#e2e8f0" }}>
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Escribe RES-4821, tu correo (cmendez@gmail.com) o nombre..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
              style={{ borderColor: "#cbd5e1" }}
              autoFocus
            />
            <span className="absolute left-3.5 top-3 text-slate-400 text-sm">🔍</span>
            {query && (
              <button onClick={() => setQuery("")} className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 cursor-pointer">
                Limpiar
              </button>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-1.5 mt-2.5 text-xs">
            <span className="text-slate-400">Códigos rápidos para probar:</span>
            {["RES-4821", "RES-5103", "RES-3970", "RES-7720", "RES-8941"].map(c => (
              <button
                key={c}
                onClick={() => setQuery(c)}
                className="font-mono text-[11px] px-2 py-0.5 rounded bg-white border border-slate-200 text-amber-800 hover:bg-amber-50 cursor-pointer font-semibold"
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Results List */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {results.length > 0 ? (
            results.map(res => {
              const statusColors: Record<string, { bg: string; color: string; label: string }> = {
                upcoming: { bg: "#eff6ff", color: "#1d4ed8", label: "Próxima estancia" },
                completed: { bg: "#ecfdf5", color: "#047857", label: "Completada / Pagada" },
                cancelled: { bg: "#fef2f2", color: "#b91c1c", label: "Cancelada" },
              };
              const st = statusColors[res.status] || statusColors.upcoming;

              return (
                <div key={res.id} className="rounded-xl border p-4 hover:shadow-md transition-all bg-white" style={{ borderColor: "#e2e8f0" }}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b" style={{ borderColor: "#f1f5f9" }}>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-slate-800">{res.id}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase" style={{ background: st.bg, color: st.color }}>
                          {st.label}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-700 mt-0.5">{res.hotel} · {res.city}</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-xs text-slate-400">Total abonado</p>
                      <p className="font-bold text-base text-amber-600">{fmt(res.total)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-2.5 text-xs text-slate-600">
                    <div>
                      <p className="text-slate-400 text-[10px]">Huésped Titular</p>
                      <p className="font-medium truncate">{res.guestName}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-[10px]">Tipo de Habitación</p>
                      <p className="font-medium truncate">{res.room}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-[10px]">Fechas</p>
                      <p className="font-medium">{fmtDateShort(res.checkIn)} → {fmtDateShort(res.checkOut)}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-[10px]">Duración</p>
                      <p className="font-medium">{res.nights} noche{res.nights > 1 ? "s" : ""}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2.5 border-t gap-2" style={{ borderColor: "#f1f5f9" }}>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <span>💳</span> {res.payMethod || "Cobro digital liquidado"}
                    </span>
                    <div className="flex gap-2">
                      {res.status === "upcoming" && (
                        <button
                          onClick={() => {
                            if (confirm(`¿Estás seguro de cancelar la reserva ${res.id}?`)) {
                              onCancelReservation(res.id);
                            }
                          }}
                          className="px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg border border-red-200 cursor-pointer font-medium"
                        >
                          Cancelar
                        </button>
                      )}
                      <button
                        onClick={() => {
                          onViewVoucher(res);
                        }}
                        className="px-3 py-1.5 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg shadow-xs cursor-pointer flex items-center gap-1"
                      >
                        <span>🧾</span>
                        <span>Ver Voucher & Comprobante</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12">
              <span className="text-4xl block mb-2">🔍</span>
              <p className="font-bold text-slate-700">No encontramos reservas con ese término</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                Verifica haber escrito correctamente tu código de confirmación (ej: RES-4821) o el correo con el que hiciste la reserva.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t bg-slate-50 flex items-center justify-between text-xs text-slate-500" style={{ borderColor: "#e2e8f0" }}>
          <span>¿Inquietudes sobre tu estancia? Central Manta: +593 5 262 8900</span>
          <button onClick={onClose} className="px-4 py-1.5 bg-white border rounded-lg text-slate-700 font-medium hover:bg-slate-100 cursor-pointer">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Login & Session Modal ────────────────────────────────────────────────────

function LoginModal({
  onClose,
  onGuestLogin,
  onAdminAccess,
  onOpenConsult,
}: {
  onClose: () => void;
  onGuestLogin: (u: GuestUser) => void;
  onAdminAccess?: () => void;
  onOpenConsult?: () => void;
}) {
  const [tab, setTab] = useState<"guest" | "admin">("guest");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  function handleGuestSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      setError("Completa correo y contraseña.");
      return;
    }
    onGuestLogin({ name: name || email.split("@")[0], email });
    onClose();
  }

  function handleDemoLogin(u: GuestUser) {
    onGuestLogin(u);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(5px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md rounded-2xl border bg-white overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b" style={{ background: "#ffffff", borderColor: "#e2e8f0" }}>
          <div>
            <span className="font-bold text-amber-600 text-lg" style={{ fontFamily: "DM Serif Display, serif" }}>
              AlojaManta
            </span>
            <p className="text-xs text-slate-500">Acceso al sistema y consulta de reservas</p>
          </div>
          <button onClick={onClose} className="text-2xl text-slate-400 hover:text-slate-800 cursor-pointer">×</button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b" style={{ borderColor: "#e2e8f0", background: "#f8fafc" }}>
          <button
            onClick={() => setTab("guest")}
            className={`flex-1 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              tab === "guest" ? "border-amber-500 text-slate-900 bg-white" : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            👤 Huésped / Turista
          </button>
          <button
            onClick={() => setTab("admin")}
            className={`flex-1 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              tab === "admin" ? "border-amber-500 text-slate-900 bg-white" : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            🏨 Personal de Hotel / PMS
          </button>
        </div>

        <div className="p-6">
          {tab === "guest" ? (
            <div className="space-y-4">
              <form onSubmit={handleGuestSubmit} className="space-y-3">
                {mode === "register" && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre y Apellido</label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Ej. Carlos Méndez"
                      className="w-full px-3 py-2 text-sm border rounded-xl"
                      style={{ borderColor: "#cbd5e1" }}
                      required
                    />
                  </div>
                )}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="tu@correo.com"
                    className="w-full px-3 py-2 text-sm border rounded-xl"
                    style={{ borderColor: "#cbd5e1" }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Contraseña</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 text-sm border rounded-xl"
                    style={{ borderColor: "#cbd5e1" }}
                    required
                  />
                </div>

                {error && <p className="text-xs text-red-600">{error}</p>}

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl text-sm font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-sm cursor-pointer"
                >
                  {mode === "login" ? "Ingresar a mi cuenta" : "Crear cuenta"}
                </button>
              </form>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <button
                  onClick={() => setMode(mode === "login" ? "register" : "login")}
                  className="text-amber-600 hover:underline font-medium cursor-pointer"
                >
                  {mode === "login" ? "¿No tienes cuenta? Regístrate gratis" : "¿Ya tienes cuenta? Inicia sesión"}
                </button>
              </div>

              {onOpenConsult && (
                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenConsult();
                    }}
                    className="text-xs text-slate-500 hover:text-amber-700 transition-colors cursor-pointer"
                  >
                    ¿Buscas una reserva con tu código? <span className="font-semibold underline text-amber-600">Consultar aquí</span>
                  </button>
                </div>
              )}

              {/* Acceso Rápido Demo */}
              <div className="pt-3 border-t" style={{ borderColor: "#f1f5f9" }}>
                <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-2">
                  Acceso Rápido de Prueba:
                </p>
                <button
                  onClick={() => handleDemoLogin({ name: "Carlos Méndez", email: "cmendez@gmail.com" })}
                  className="w-full py-2 px-3 text-xs rounded-xl border border-amber-300 bg-amber-50 text-amber-900 font-semibold hover:bg-amber-100 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>⚡</span>
                  <span>Ingresar como Carlos Méndez (3 reservas listas)</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                <p className="font-bold">Panel Multi-Hotel Cantón Manta (116 Alojamientos)</p>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  Acceso directo con roles RBAC para los 116 establecimientos oficiales del Catastro de Manta.
                </p>
              </div>

              <div className="space-y-2">
                {[
                  { role: "Superadmin Cantonal", name: "Carlos Admin", email: "admin@alojamanta.ec", desc: "Supervisión de los 116 hoteles de Manta" },
                  { role: "Administrador de Hotel", name: "Ana Administradora", email: "direccion@mantahost.ec", desc: "MantaHost Hotel (Gestión integral)" },
                  { role: "Revenue Manager", name: "María Revenue", email: "revenue@mantahost.ec", desc: "Tarifas, temporadas y tipos de habitación" },
                  { role: "Recepcionista Mostrador", name: "Juan Recepción", email: "recepcion@mantahost.ec", desc: "Operación de reservas y facturas SRI" },
                ].map(acc => (
                  <button
                    key={acc.email}
                    onClick={() => {
                      onClose();
                      onAdminAccess?.();
                    }}
                    className="w-full p-3 rounded-xl border text-left hover:border-amber-400 hover:bg-slate-50 transition-all flex items-center justify-between cursor-pointer"
                    style={{ borderColor: "#e2e8f0" }}
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-800">{acc.name} <span className="text-[10px] text-amber-600 font-mono">({acc.role})</span></p>
                      <p className="text-[11px] text-slate-400">{acc.desc}</p>
                    </div>
                    <span className="text-xs text-amber-600 font-bold">Entrar →</span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  onClose();
                  onAdminAccess?.();
                }}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-colors cursor-pointer"
              >
                Abrir pantalla completa de acceso hotelero
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Booking modal ────────────────────────────────────────────────────────────

type BookingStep = "auth" | "details" | "payment" | "invoice";

function BookingModal({
  hotel,
  room,
  params,
  user,
  onClose,
  onGuestLogin,
  onReservationCreated,
}: {
  hotel: Hotel;
  room: RoomOffer;
  params: SearchParams;
  user: GuestUser | null;
  onClose: () => void;
  onGuestLogin: (u: GuestUser) => void;
  onReservationCreated?: (r: MyReservation) => void;
}) {
  const tasaMunicipal = 2.50;
  const nights = Math.max(nightsBetween(params.checkIn, params.checkOut), 1);
  const base = room.pricePerNight * nights;
  const iva = parseFloat((base * 0.15).toFixed(2));
  const hasService = hotel.gravaServicio10 ?? false;
  const servicio = hasService ? parseFloat(((base + tasaMunicipal) * 0.10).toFixed(2)) : 0;
  const total = parseFloat((base + iva + tasaMunicipal + servicio).toFixed(2));

  const initialStep: BookingStep = user ? "details" : "auth";
  const [step, setStep] = useState<BookingStep>(initialStep);
  const [processing, setProcessing] = useState(false);

  // Auth sub-state
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPass, setAuthPass] = useState("");
  const [authError, setAuthError] = useState("");

  // Guest details
  const [form, setForm] = useState({
    name: user?.name ?? "", email: user?.email ?? "",
    phone: "", dni: "", notes: "",
  });

  // Card
  const [cardHolder, setCardHolder] = useState(user?.name ?? "");
  const [cardNum, setCardNum] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [saveCard, setSaveCard] = useState(false);

  const hotelSri = HOTEL_SRI_INFO[hotel.id] || HOTEL_SRI_INFO["costa-sol"];
  const [resId] = useState(`RES-${Math.floor(Math.random() * 90000) + 10000}`);
  const [invoiceId] = useState(`${hotelSri.estab}-${hotelSri.ptoEmi}-${String(Math.floor(Math.random() * 900000) + 100000).padStart(9, "0")}`);
  const issueDate = new Date().toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
  const verifyCode = Math.random().toString(36).slice(2, 10).toUpperCase();
  const last4 = cardNum.replace(/\s/g, "").slice(-4) || "****";

  const STEPS: { k: BookingStep; l: string }[] = user
    ? [{ k: "details", l: "1. Datos" }, { k: "payment", l: "2. Pago" }, { k: "invoice", l: "3. Comprobante" }]
    : [{ k: "auth", l: "1. Acceso" }, { k: "details", l: "2. Datos" }, { k: "payment", l: "3. Pago" }, { k: "invoice", l: "4. Comprobante" }];

  const stepIndex = STEPS.findIndex(s => s.k === step);

  function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    if (!authEmail || !authPass) { setAuthError("Completa todos los campos."); return; }
    if (authMode === "register" && !authName) { setAuthError("Indica tu nombre."); return; }
    const u: GuestUser = { name: authMode === "register" ? authName : authEmail.split("@")[0], email: authEmail };
    onGuestLogin(u);
    setForm(f => ({ ...f, name: u.name, email: u.email }));
    setCardHolder(u.name);
    setAuthError("");
    setStep("details");
  }

  function handlePay(e: React.FormEvent) {
    e.preventDefault();
    if (!cardNum || !cardExp || !cardCvv || !cardHolder) return;
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setStep("invoice");
      onReservationCreated?.({
        id: resId,
        hotel: hotel.name,
        hotelId: hotel.id,
        city: hotel.city,
        room: room.type,
        checkIn: params.checkIn,
        checkOut: params.checkOut,
        nights,
        total,
        status: "upcoming",
        image: room.image || hotel.image,
        guestName: form.name || cardHolder || "Huésped Registrado",
        guestEmail: form.email || user?.email || "cliente@gmail.com",
        guestPhone: form.phone || "+593 98 000 0000",
        payMethod: "Tarjeta Digital (PayPhone / Kushki)",
      });
    }, 1800);
  }

  // ── Shared backdrop
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        style={{ background: "#fff", maxHeight: "92vh" }}>

        {/* Step bar */}
        <div className="flex flex-shrink-0" style={{ borderBottom: "1px solid #e2e8f0" }}>
          {STEPS.map((s, i) => {
            const done = i < stepIndex;
            const active = s.k === step;
            return (
              <div key={s.k} className="flex-1 text-center py-2.5 text-[10px] font-bold uppercase tracking-wide transition-all"
                style={{ background: active ? "#fef3c7" : "#f8fafc", color: active ? "#92400e" : done ? "#059669" : "#94a3b8", borderBottom: active ? "2px solid #f59e0b" : "2px solid transparent" }}>
                {done ? "✓ " : ""}{s.l}
              </div>
            );
          })}
        </div>

        {/* Room strip (not on invoice) */}
        {step !== "invoice" && (
          <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0" style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
            <img src={room.image} alt={room.type} className="w-14 h-10 rounded-lg object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-800 text-sm truncate">{hotel.name}</p>
              <p className="text-xs text-slate-500">{room.type} · {nights}n · {fmtDateShort(params.checkIn)} → {fmtDateShort(params.checkOut)}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="font-bold text-sm" style={{ color: "#f59e0b" }}>{fmt(total)}</p>
              <p className="text-[10px] text-slate-400">IVA incl.</p>
            </div>
            <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs" style={{ background: "#e2e8f0", color: "#64748b" }}>✕</button>
          </div>
        )}

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-5">

          {/* ── STEP: AUTH ── */}
          {step === "auth" && (
            <div className="space-y-4">
              <div className="text-center pb-2">
                <p className="text-2xl mb-1">🔑</p>
                <h3 className="font-bold text-slate-800 text-base" style={{ fontFamily: "DM Serif Display, serif" }}>
                  {authMode === "login" ? "Inicia sesión para continuar" : "Crea tu cuenta gratis"}
                </h3>
                <p className="text-xs text-slate-400 mt-1">Necesitas cuenta para completar la reserva y recibir tu factura</p>
              </div>
              <div className="flex rounded-xl overflow-hidden border" style={{ borderColor: "#e2e8f0" }}>
                {[{ k: "login" as const, l: "Iniciar sesión" }, { k: "register" as const, l: "Registrarme" }].map(m => (
                  <button key={m.k} onClick={() => setAuthMode(m.k)} className="flex-1 py-2 text-sm font-semibold transition-all" style={{ background: authMode === m.k ? "#f59e0b" : "#f8fafc", color: authMode === m.k ? "#0c1220" : "#64748b" }}>{m.l}</button>
                ))}
              </div>
              <form onSubmit={handleAuth} className="space-y-3">
                {authMode === "register" && (
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Nombre completo</label>
                    <input className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none" style={{ borderColor: "#e2e8f0", color: "#1e293b" }} value={authName} onChange={e => setAuthName(e.target.value)} placeholder="María García" />
                  </div>
                )}
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Email</label>
                  <input type="email" className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none" style={{ borderColor: "#e2e8f0", color: "#1e293b" }} value={authEmail} onChange={e => setAuthEmail(e.target.value)} placeholder="maria@email.com" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Contraseña</label>
                  <input type="password" className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none" style={{ borderColor: "#e2e8f0", color: "#1e293b" }} value={authPass} onChange={e => setAuthPass(e.target.value)} placeholder="••••••••" />
                </div>
                {authError && <p className="text-xs px-3 py-2 rounded-lg" style={{ background: "#fee2e2", color: "#ef4444" }}>{authError}</p>}
                <button type="submit" className="w-full py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all" style={{ background: "#f59e0b", color: "#0c1220" }}>
                  {authMode === "login" ? "Entrar y continuar →" : "Crear cuenta y continuar →"}
                </button>
              </form>
              <div className="relative flex items-center gap-2">
                <div className="flex-1 h-px" style={{ background: "#e2e8f0" }} />
                <span className="text-xs text-slate-400">o</span>
                <div className="flex-1 h-px" style={{ background: "#e2e8f0" }} />
              </div>
              <button onClick={() => { const u = { name: "Usuario Google", email: "usuario@gmail.com" }; onGuestLogin(u); setForm(f => ({ ...f, ...u })); setCardHolder(u.name); setStep("details"); }} className="w-full py-2.5 rounded-xl border text-sm font-medium flex items-center justify-center gap-2" style={{ borderColor: "#e2e8f0", color: "#475569" }}>
                🌐 Continuar con Google
              </button>
            </div>
          )}

          {/* ── STEP: DETAILS ── */}
          {step === "details" && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-800">Datos del huésped</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs text-slate-400 mb-1">Nombre completo *</label>
                  <input className="w-full px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: "#e2e8f0", color: "#1e293b" }} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs text-slate-400 mb-1">Email *</label>
                  <input type="email" className="w-full px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: "#e2e8f0", color: "#1e293b" }} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Teléfono</label>
                  <input type="tel" className="w-full px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: "#e2e8f0", color: "#1e293b" }} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+34 612 345 678" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">DNI / Pasaporte *</label>
                  <input className="w-full px-3 py-2 rounded-lg border text-sm outline-none font-mono" style={{ borderColor: "#e2e8f0", color: "#1e293b" }} value={form.dni} onChange={e => setForm({ ...form, dni: e.target.value })} placeholder="12345678A" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-slate-400 mb-1">Peticiones especiales</label>
                  <textarea className="w-full px-3 py-2 rounded-lg border text-sm outline-none resize-none" style={{ borderColor: "#e2e8f0", color: "#1e293b" }} rows={2} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Hora de llegada, cama adicional, alergias..." />
                </div>
              </div>
              {/* Desglose estilo Booking.com */}
              <PriceBreakdownBox
                basePrice={room.pricePerNight}
                nights={nights}
                hasService10={hasService}
                serviceFee={2.50}
                hotelName={hotel.name}
                defaultExpanded={true}
                showToggle={true}
              />
              <div className="flex gap-2">
                {!user && <button onClick={() => setStep("auth")} className="px-4 py-3 rounded-xl text-sm font-medium border" style={{ borderColor: "#e2e8f0", color: "#64748b" }}>← Atrás</button>}
                <button onClick={() => setStep("payment")} className="flex-1 py-3 rounded-xl font-bold text-sm hover:opacity-90" style={{ background: "#f59e0b", color: "#0c1220" }}>
                  Continuar al pago →
                </button>
              </div>
            </div>
          )}

          {/* ── STEP: PAYMENT ── */}
          {step === "payment" && (
            <form onSubmit={handlePay} className="space-y-4">
              <h3 className="font-bold text-slate-800">Pago con tarjeta</h3>
              {/* Visual card */}
              <div className="relative rounded-2xl p-5 overflow-hidden" style={{ background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)", minHeight: 140 }}>
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 80% 20%, #f59e0b 0%, transparent 60%)" }} />
                <div className="flex items-start justify-between mb-6">
                  <div className="space-y-0.5">
                    <div className="w-8 h-5 rounded-sm opacity-80" style={{ background: "linear-gradient(135deg, #fcd34d, #f59e0b)" }} />
                  </div>
                  <span className="text-white/40 text-xs font-bold uppercase tracking-widest">VISA / MASTERCARD</span>
                </div>
                <p className="font-mono text-white text-lg tracking-widest mb-3">
                  {cardNum ? cardNum.padEnd(19, " ").replace(/ /g, " ") : "•••• •••• •••• ••••"}
                </p>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-white/40 text-[9px] uppercase tracking-widest">Titular</p>
                    <p className="text-white text-sm font-medium truncate max-w-[180px]">{cardHolder || "NOMBRE APELLIDOS"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/40 text-[9px] uppercase tracking-widest">Vence</p>
                    <p className="text-white text-sm font-mono">{cardExp || "MM/AA"}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Titular de la tarjeta</label>
                  <input className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none uppercase" style={{ borderColor: "#e2e8f0", color: "#1e293b" }} value={cardHolder} onChange={e => setCardHolder(e.target.value.toUpperCase())} placeholder="NOMBRE APELLIDOS" required />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Número de tarjeta</label>
                  <div className="relative">
                    <input className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none font-mono pr-16" style={{ borderColor: "#e2e8f0", color: "#1e293b" }}
                      value={cardNum}
                      onChange={e => {
                        const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
                        setCardNum(raw.replace(/(\d{4})/g, "$1 ").trim());
                      }}
                      placeholder="4242 4242 4242 4242" maxLength={19} required />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                      <div className="w-5 h-3 rounded-sm opacity-70" style={{ background: "#ef4444" }} />
                      <div className="w-5 h-3 rounded-sm opacity-70 -ml-2" style={{ background: "#f59e0b" }} />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Fecha de expiración</label>
                    <input className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none font-mono" style={{ borderColor: "#e2e8f0", color: "#1e293b" }}
                      value={cardExp}
                      onChange={e => {
                        let v = e.target.value.replace(/\D/g, "").slice(0, 4);
                        if (v.length >= 2) v = v.slice(0, 2) + "/" + v.slice(2);
                        setCardExp(v);
                      }}
                      placeholder="MM/AA" maxLength={5} required />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">CVV</label>
                    <input type="password" className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none font-mono" style={{ borderColor: "#e2e8f0", color: "#1e293b" }} value={cardCvv} onChange={e => setCardCvv(e.target.value.slice(0, 3))} placeholder="•••" maxLength={3} required />
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" className="accent-amber-400 rounded" checked={saveCard} onChange={e => setSaveCard(e.target.checked)} />
                  <span className="text-xs text-slate-500">Guardar tarjeta para futuras reservas</span>
                </label>
              </div>

              <div className="rounded-xl p-3 space-y-1.5" style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                <div className="flex justify-between text-sm text-slate-500"><span>Subtotal Hospedaje</span><span>{fmt(base)}</span></div>
                <div className="flex justify-between text-sm text-slate-500"><span>15% IVA (SRI)</span><span>{fmt(iva)}</span></div>
                <div className="flex justify-between text-sm text-slate-600"><span>Tasa Municipal de Turismo (GAD Manta)</span><span className="font-mono font-medium">{fmt(tasaMunicipal)}</span></div>
                {hasService && (
                  <div className="flex justify-between text-sm text-emerald-700 font-medium bg-emerald-50/60 px-2 py-0.5 rounded">
                    <span>10% Cargo gubernamental (Ley Turismo)</span>
                    <span className="font-mono font-bold">{fmt(servicio)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-base pt-1.5 border-t" style={{ borderColor: "#e2e8f0", color: "#1e293b" }}><span>Total a cargar</span><span style={{ color: "#f59e0b" }}>{fmt(total)}</span></div>
              </div>

              {/* LOPDP Consent */}
              <label className="flex items-start gap-2 cursor-pointer select-none text-left p-2.5 rounded-lg border bg-slate-50/60 border-slate-200">
                <input type="checkbox" required defaultChecked className="mt-0.5 accent-amber-500 rounded" />
                <span className="text-[11px] text-slate-600 leading-tight">
                  Acepto los Términos y la Política de Tratamiento de Datos Personales conforme a la <strong>Ley Orgánica de Protección de Datos Personales (LOPDP Ecuador)</strong>. Mis datos personales se tratarán exclusivamente para la reserva y facturación SRI.
                </span>
              </label>

              <div className="flex items-center gap-1.5 text-xs text-slate-400 justify-center">
                <span>🔒</span> Pago tokenizado seguro (PCI-DSS compliant) · Cifrado SSL 256-bit · Sin almacenar CVV
              </div>

              <div className="flex gap-2">
                <button type="button" onClick={() => setStep("details")} className="px-4 py-3 rounded-xl text-sm font-medium border" style={{ borderColor: "#e2e8f0", color: "#64748b" }}>← Atrás</button>
                <button type="submit" disabled={processing} className="flex-1 py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-70" style={{ background: "#f59e0b", color: "#0c1220" }}>
                  {processing ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20" /></svg>
                      Procesando pago...
                    </span>
                  ) : `Pagar ${fmt(total)} →`}
                </button>
              </div>
            </form>
          )}

          {/* ── STEP: INVOICE ── */}
          {step === "invoice" && (
            <div className="space-y-0">
              {/* Success banner */}
              <div className="text-center py-4">
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mx-auto mb-2" style={{ background: "#d1fae5" }}>✓</div>
                <h3 className="font-bold text-slate-800 text-base">¡Pago procesado y reserva confirmada!</h3>
                <p className="text-xs text-slate-500 mt-0.5">Comprobante de pago oficial de la pasarela y voucher de reserva</p>
              </div>

              {/* Electronic payment receipt & Voucher */}
              <div className="rounded-2xl border overflow-hidden shadow-lg" style={{ borderColor: "#e2e8f0" }}>
                {/* Header: Payment gateway receipt */}
                <div className="px-5 py-4 flex items-start justify-between" style={{ background: "#0c1220" }}>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-lg text-amber-400" style={{ fontFamily: "DM Serif Display, serif" }}>{hotelSri.nombreComercial}</p>
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded border border-emerald-500/30">PAGO APROBADO</span>
                    </div>
                    <p className="text-xs text-slate-300 font-medium">{hotelSri.razonSocial}</p>
                    <p className="text-[10px] text-slate-400 font-mono">RUC: {hotelSri.ruc} · {hotelSri.city}</p>
                    <p className="text-[10px] text-slate-400">Pasarela: PayPhone / Tarjeta · Aut: AUTH-PP-{resId.replace(/\D/g, "").slice(-6) || "948210"}</p>
                  </div>
                  <div className="text-right">
                    <span className="mono text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">COMPROBANTE DIGITAL</span>
                    <p className="font-bold mt-1 text-slate-100 font-mono text-xs">{invoiceId}</p>
                    <p className="mono text-[10px] text-slate-400">{issueDate}</p>
                  </div>
                </div>

                {/* Banner de Facturación por el Hotel */}
                <div className="px-4 py-2.5 bg-amber-50 border-b border-amber-200 flex items-start gap-2 text-[11px] text-amber-900 leading-tight">
                  <span className="text-base flex-shrink-0">🏨</span>
                  <div>
                    <p className="font-bold">Facturación Fiscal a cargo de {hotel.name}:</p>
                    <p className="text-amber-800 text-[10px] mt-0.5">
                      Este comprobante certifica su pago en línea. Su Factura Electrónica fiscal (SRI) será emitida y entregada por el hotel a su llegada o al realizar el check-out en recepción con los datos registrados.
                    </p>
                  </div>
                </div>

                {/* Client + hotel */}
                <div className="grid grid-cols-2 gap-px" style={{ background: "#e2e8f0" }}>
                  <div className="px-4 py-3 bg-white">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Huésped titular</p>
                    <p className="font-semibold text-slate-800 text-sm">{form.name || user?.name}</p>
                    <p className="text-xs text-slate-500">{form.email || user?.email}</p>
                    {form.dni && <p className="mono text-xs text-slate-500">C.I. / Pasaporte: {form.dni}</p>}
                    {form.phone && <p className="text-xs text-slate-500">Tel: {form.phone}</p>}
                  </div>
                  <div className="px-4 py-3 bg-white">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Hotel prestador</p>
                    <p className="font-semibold text-slate-800 text-sm">{hotel.name}</p>
                    <p className="text-xs text-slate-500">{hotel.address}</p>
                    <p className="text-xs text-slate-500">{hotel.city}</p>
                  </div>
                </div>

                {/* Reservation details */}
                <div className="px-4 py-3 bg-white" style={{ borderTop: "1px solid #e2e8f0" }}>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Detalle de la reserva</p>
                  <div className="grid grid-cols-4 gap-3 text-xs">
                    {[
                      { l: "Nº Reserva", v: resId },
                      { l: "Check-in", v: `${fmtDateShort(params.checkIn)} · 14:00h` },
                      { l: "Check-out", v: `${fmtDateShort(params.checkOut)} · 12:00h` },
                      { l: "Noches", v: String(nights) },
                    ].map(item => (
                      <div key={item.l}>
                        <p className="text-slate-400">{item.l}</p>
                        <p className="font-semibold text-slate-700 font-mono">{item.v}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Line items con desglose SRI */}
                <table className="w-full text-sm" style={{ borderTop: "1px solid #e2e8f0" }}>
                  <thead style={{ background: "#f8fafc" }}>
                    <tr>
                      {["Concepto", "Cantidad", "Precio/u.", "Total"].map(h => (
                        <th key={h} className="text-left px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderTop: "1px solid #e2e8f0" }}>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-800">{room.type}</p>
                        <p className="text-xs text-slate-400">{hotel.name} · {room.beds}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{nights} noche{nights > 1 ? "s" : ""}</td>
                      <td className="px-4 py-3 font-mono text-slate-600">{fmt(room.pricePerNight)}</td>
                      <td className="px-4 py-3 font-mono font-semibold text-slate-800">{fmt(base)}</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr style={{ borderTop: "1px solid #e2e8f0", background: "#f8fafc" }}>
                      <td colSpan={3} className="px-4 py-2 text-xs text-right text-slate-500">Subtotal Neto (Hospedaje)</td>
                      <td className="px-4 py-2 font-mono text-sm text-slate-700">{fmt(base)}</td>
                    </tr>
                    <tr style={{ background: "#f8fafc" }}>
                      <td colSpan={3} className="px-4 py-2 text-xs text-right text-slate-500">15% IVA (SRI Ecuador)</td>
                      <td className="px-4 py-2 font-mono text-sm text-slate-700">{fmt(iva)}</td>
                    </tr>
                    <tr style={{ background: "#f8fafc" }}>
                      <td colSpan={3} className="px-4 py-2 text-xs text-right text-slate-600 font-medium">Tasa Municipal de Turismo (GAD Manta)</td>
                      <td className="px-4 py-2 font-mono text-sm text-slate-700 font-medium">{fmt(tasaMunicipal)}</td>
                    </tr>
                    {hasService && (
                      <tr style={{ background: "#f8fafc" }}>
                        <td colSpan={3} className="px-4 py-2 text-xs text-right text-emerald-700 font-medium">10% Cargo gubernamental (Ley Turismo Art. 41)</td>
                        <td className="px-4 py-2 font-mono text-sm text-emerald-700 font-bold">{fmt(servicio)}</td>
                      </tr>
                    )}
                    <tr style={{ borderTop: "2px solid #e2e8f0" }}>
                      <td colSpan={3} className="px-4 py-3 font-bold text-right text-slate-800">TOTAL PAGADO</td>
                      <td className="px-4 py-3 font-bold font-mono text-lg" style={{ color: "#f59e0b" }}>{fmt(total)}</td>
                    </tr>
                  </tfoot>
                </table>

                {/* Payment confirmation */}
                <div className="px-4 py-3 flex items-center gap-3" style={{ background: "#d1fae5", borderTop: "1px solid #a7f3d0" }}>
                  <span className="text-green-600 text-lg">✓</span>
                  <div>
                    <p className="text-xs font-bold text-green-700">Pago procesado correctamente</p>
                    <p className="text-xs text-green-600">Tarjeta **** **** **** {last4} · {fmt(total)} · {issueDate}</p>
                  </div>
                </div>

                {/* Verification code / QR */}
                <div className="px-4 py-3 flex items-center justify-between" style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Código de confirmación y QR</p>
                    <p className="font-mono font-bold text-slate-700 tracking-widest text-sm">{verifyCode}</p>
                    <p className="text-[10px] text-slate-400">Presenta este código al recepcionista al momento del check-in.</p>
                  </div>
                  <div className="w-14 h-14 flex-shrink-0 rounded-lg flex items-center justify-center border-2 border-slate-300 bg-white">
                    <div className="grid grid-cols-5 gap-0.5 w-10 h-10">
                      {Array.from({ length: 25 }).map((_, i) => (
                        <div key={i} className="rounded-sm" style={{ background: (i % 2 === 0 || i % 3 === 0) ? "#0c1220" : "transparent", aspectRatio: "1" }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-medium border" style={{ borderColor: "#e2e8f0", color: "#64748b" }}>Cerrar</button>
                <button className="flex-1 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-sm flex items-center justify-center gap-1.5" style={{ background: "#f59e0b", color: "#0c1220" }}>
                  <span>⬇</span>
                  <span>Descargar Comprobante & Voucher PDF</span>
                </button>
              </div>
              <p className="text-center text-xs text-slate-400 pt-1">Comprobante enviado a <strong>{form.email || user?.email}</strong></p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ─── Hotel card ───────────────────────────────────────────────────────────────

function HotelCard({ hotel, nights, onSelect }: { hotel: Hotel; nights: number; onSelect: () => void }) {
  const n = Math.max(nights, 1);
  return (
    <div className="rounded-2xl overflow-hidden border bg-white transition-all hover:shadow-lg cursor-pointer group" style={{ borderColor: "#e2e8f0" }} onClick={onSelect}>
      <div className="flex flex-col sm:flex-row">
        <div className="sm:w-64 flex-shrink-0 relative overflow-hidden" style={{ height: 200 }}>
          <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
          <div className="absolute top-3 left-3 flex flex-wrap gap-1">
            {hotel.tags.slice(0, 2).map(t => <span key={t} className="text-[10px] font-bold px-2 py-1 rounded-full" style={{ background: "rgba(0,0,0,0.55)", color: "#fff" }}>{t}</span>)}
          </div>
        </div>
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2 mb-1">
              <div>
                <div className="flex items-center gap-2 mb-0.5"><StarsRow n={hotel.stars} /><span className="text-xs text-slate-400">{hotel.city}</span></div>
                <h3 className="font-bold text-slate-800 text-base group-hover:text-amber-600 transition-colors">{hotel.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{hotel.address}</p>
              </div>
              <div className="flex-shrink-0 text-right">
                <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: "#1e3a5f" }}>
                  <span className="font-bold text-white text-sm">{hotel.rating}</span><span className="text-white/60 text-xs">/ 5</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">{hotel.reviews} opiniones</p>
              </div>
            </div>
            <p className="text-sm text-slate-500 mt-1.5 leading-relaxed line-clamp-2">{hotel.description}</p>
            <p className="text-xs mt-1 font-medium" style={{ color: "#059669" }}>📍 {hotel.distance}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {hotel.amenities.slice(0, 5).map(a => <span key={a} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "#f1f5f9", color: "#475569" }}>{a}</span>)}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mt-3 pt-3 border-t" style={{ borderColor: "#f1f5f9" }}>
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wide">Precio desde</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-900 leading-none">US${hotel.priceFrom}</span>
                <span className="text-xs text-slate-500 font-medium">/ noche</span>
              </div>
              <p className="text-[11px] font-semibold text-slate-500 mt-1">
                + US${(((hotel.priceFrom * n) * 0.15) + 2.50 + (hotel.gravaServicio10 ? ((hotel.priceFrom * n + 2.50) * 0.10) : 0)).toFixed(2)} de impuestos y cargos ({n}n)
              </p>
              <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium border border-slate-200">
                  {hotel.gravaServicio10 ? "15% IVA + Tasa GAD Manta + 10% Propina" : "15% IVA + Tasa GAD Manta"}
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                  ✓ Comprobante Digital · Factura en Hotel
                </span>
              </div>
            </div>
            <button className="px-5 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all self-end sm:self-auto shadow-sm" style={{ background: "#f59e0b", color: "#0c1220" }}>
              Ver habitaciones →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Hotel detail ─────────────────────────────────────────────────────────────

function HotelDetail({ hotel, params, onBack, onBook }: { hotel: Hotel; params: SearchParams; onBack: () => void; onBook: (r: RoomOffer) => void }) {
  const nights = Math.max(nightsBetween(params.checkIn, params.checkOut), 1);
  const gallery = [hotel.image, ...hotel.rooms.map(room => room.image)].slice(0, 4);
  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-medium mb-5 hover:opacity-70 transition-opacity" style={{ color: "#64748b" }}>← Volver a resultados</button>
      <div className="rounded-2xl overflow-hidden border mb-6 bg-white" style={{ borderColor: "#e2e8f0" }}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 bg-slate-100">
          {gallery.map((image, index) => (
            <div key={`${image}-${index}`} className={`${index === 0 ? "col-span-2 row-span-2" : ""} overflow-hidden`} style={{ minHeight: index === 0 ? 260 : 128 }}>
              <img
                src={image}
                alt={index === 0 ? `Vista principal de ${hotel.name}` : `${hotel.name}, vista ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          ))}
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-1"><StarsRow n={hotel.stars} /><span className="text-xs text-slate-400">{hotel.city}</span></div>
              <h1 className="text-2xl font-bold text-slate-800" style={{ fontFamily: "DM Serif Display, serif" }}>{hotel.name}</h1>
              <p className="text-sm text-slate-400 mt-0.5">📍 {hotel.address} · {hotel.distance}</p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl" style={{ background: "#1e3a5f" }}>
              <span className="text-white font-bold text-xl">{hotel.rating}</span>
              <div><p className="text-white/80 text-xs">Muy bueno</p><p className="text-white/50 text-[10px]">{hotel.reviews} reseñas</p></div>
            </div>
          </div>
          <p className="text-sm text-slate-600 mt-3 leading-relaxed">{hotel.description}</p>
          <div className="mt-5 pt-4 border-t" style={{ borderColor: "#f1f5f9" }}>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Servicios del alojamiento</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {hotel.amenities.map(a => (
                <div key={a} className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium" style={{ background: "#f8fafc", color: "#475569" }}>
                  <span className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "#d1fae5", color: "#047857" }}>✓</span>
                  {a}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl p-4 mb-5 border" style={{ background: "#fef3c7", borderColor: "#fcd34d" }}>
        <div className="flex flex-wrap gap-4 text-sm font-semibold text-amber-800">
          <span>📅 {fmtDateShort(params.checkIn)} → {fmtDateShort(params.checkOut)}</span>
          <span>🌙 {nights} noche{nights > 1 ? "s" : ""}</span>
          <span>👤 {params.adults + params.children} huésped{params.adults + params.children > 1 ? "es" : ""}</span>
        </div>
        <p className="text-xs text-amber-700">✓ Cancelación gratuita hasta 24h antes</p>
      </div>
      <h2 className="text-lg font-bold text-slate-800 mb-4" style={{ fontFamily: "DM Serif Display, serif" }}>Tipos de Habitación Disponibles</h2>
      <div className="space-y-4">
        {hotel.rooms.filter(r => r.capacity >= params.adults).map(room => (
          <div key={room.id} className="rounded-2xl overflow-hidden border bg-white hover:shadow-md transition-all" style={{ borderColor: "#e2e8f0" }}>
            <div className="flex flex-col sm:flex-row">
              <div className="sm:w-52 flex-shrink-0" style={{ height: 160 }}>
                <img src={room.image} alt={room.type} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-slate-800">{room.type}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{room.beds} · {room.size} m² · hasta {room.capacity} pers.</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      {room.originalPrice && <p className="text-xs line-through text-slate-400">{fmt(room.originalPrice)}</p>}
                      <p className="text-xl font-bold" style={{ color: "#f59e0b" }}>{fmt(room.pricePerNight)}</p>
                      <p className="text-[10px] text-slate-400">/ noche base</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {room.amenities.map(a => <span key={a} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "#f1f5f9", color: "#475569" }}>{a}</span>)}
                    {room.breakfastIncluded && <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: "#d1fae5", color: "#065f46" }}>☕ Desayuno incl.</span>}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t space-y-3" style={{ borderColor: "#f1f5f9" }}>
                  <PriceBreakdownBox
                    basePrice={room.pricePerNight}
                    nights={nights}
                    hasService10={hotel.gravaServicio10}
                    serviceFee={2.50}
                    hotelName={hotel.name}
                    defaultExpanded={false}
                    showToggle={true}
                  />
                  <div className="flex items-center justify-between">
                    <div>
                      {room.available <= 2 && <p className="text-[10px] font-semibold text-red-600">⚡ ¡Solo {room.available} {room.available === 1 ? "queda" : "quedan"}!</p>}
                    </div>
                    <button onClick={() => onBook(room)} className="px-6 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 active:scale-95 transition-all shadow-sm" style={{ background: "#f59e0b", color: "#0c1220" }}>
                      Reservar →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Results ──────────────────────────────────────────────────────────────────

function ResultsView({ params, onChange, onSearch, onSelect }: { params: SearchParams; onChange: (p: SearchParams) => void; onSearch: () => void; onSelect: (h: Hotel) => void }) {
  const [stars, setStars] = useState<number[]>([]);
  const [maxPrice, setMaxPrice] = useState(250);
  const [classification, setClassification] = useState<string>("all");
  const [parish, setParish] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"price" | "rating">("rating");
  const nights = nightsBetween(params.checkIn, params.checkOut);
  let results = HOTELS.filter(h => {
    const d = !params.destination || h.city.toLowerCase().includes(params.destination.toLowerCase()) || (h.parish && h.parish.toLowerCase().includes(params.destination.toLowerCase()));
    const s = stars.length === 0 || stars.includes(h.stars);
    const p = h.priceFrom <= maxPrice;
    const c = h.rooms.some(r => r.capacity >= params.adults);
    const cl = classification === "all" || (h.classification && h.classification.toLowerCase() === classification.toLowerCase());
    const pa = parish === "all" || (h.parish && h.parish.toLowerCase() === parish.toLowerCase());
    return d && s && p && c && cl && pa;
  });
  if (sortBy === "price") results = [...results].sort((a, b) => a.priceFrom - b.priceFrom);
  if (sortBy === "rating") results = [...results].sort((a, b) => b.rating - a.rating);

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <div className="sticky top-0 z-20 border-b shadow-sm" style={{ background: "#fff", borderColor: "#e2e8f0" }}>
        <div className="max-w-5xl mx-auto px-4 py-3">
          <SearchBar params={params} onChange={onChange} onSearch={onSearch} variant="sticky" />
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-6 flex gap-5">
        <aside className="w-56 flex-shrink-0 hidden lg:block space-y-4">
          <div className="rounded-xl p-4 border bg-white" style={{ borderColor: "#e2e8f0" }}>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-slate-700 text-sm">Categoría</h4>
              {stars.length > 0 && (
                <button onClick={() => setStars([])} className="text-[11px] text-amber-600 hover:underline">Limpiar</button>
              )}
            </div>
            {[5, 4, 3, 2, 1].map(s => (
              <label key={s} className="flex items-center justify-between gap-1 mb-2 cursor-pointer hover:bg-slate-50 p-1 rounded transition-colors">
                <div className="flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    className="accent-amber-400"
                    checked={stars.includes(s)}
                    onChange={() => setStars(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])}
                  />
                  <div className="flex gap-0.5">
                    {Array.from({ length: s }).map((_, i) => <span key={i} style={{ color: "#f59e0b", fontSize: 11 }}>★</span>)}
                    {Array.from({ length: 5 - s }).map((_, i) => <span key={i} style={{ color: "#d1d5db", fontSize: 11 }}>★</span>)}
                  </div>
                  <span className="text-[11px] text-slate-600 font-medium">
                    {s === 5 ? "5★ Lujo" : s === 4 ? "4★ Primera" : s === 3 ? "3★ Superior" : s === 2 ? "2★ Turista" : "1★ Económico"}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">({HOTELS.filter(h => h.stars === s).length})</span>
              </label>
            ))}
          </div>

          <div className="rounded-xl p-4 border bg-white" style={{ borderColor: "#e2e8f0" }}>
            <h4 className="font-bold text-slate-700 text-sm mb-2">Clasificación</h4>
            <div className="space-y-1">
              {[
                { id: "all", label: "Todos los tipos", count: HOTELS.length },
                { id: "Hotel", label: "Hotel", count: HOTELS.filter(h => h.classification === "Hotel").length },
                { id: "Hostal", label: "Hostal", count: HOTELS.filter(h => h.classification === "Hostal").length },
                { id: "Hostería", label: "Hostería", count: HOTELS.filter(h => h.classification === "Hostería").length },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setClassification(item.id)}
                  className={`w-full flex items-center justify-between text-xs px-2.5 py-1.5 rounded-lg text-left transition-all ${
                    classification === item.id ? "bg-amber-100 text-amber-900 font-bold" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="font-mono text-[10px] text-slate-400">({item.count})</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl p-4 border bg-white" style={{ borderColor: "#e2e8f0" }}>
            <h4 className="font-bold text-slate-700 text-sm mb-2">Parroquia</h4>
            <select
              value={parish}
              onChange={e => setParish(e.target.value)}
              className="w-full text-xs rounded-lg border p-2 bg-slate-50 border-slate-200 text-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="all">Todas las parroquias (116)</option>
              {Array.from(new Set(HOTELS.map(h => h.parish).filter(Boolean))).sort().map(p => (
                <option key={p} value={p}>{p} ({HOTELS.filter(h => h.parish === p).length})</option>
              ))}
            </select>
          </div>

          <div className="rounded-xl p-4 border bg-white" style={{ borderColor: "#e2e8f0" }}>
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-bold text-slate-700 text-sm">Precio máx./noche</h4>
              <span className="font-bold text-amber-600 text-sm font-mono">${maxPrice}</span>
            </div>
            <input
              type="range"
              min={25}
              max={300}
              step={5}
              value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>$25</span>
              <span>$150</span>
              <span>$300+</span>
            </div>
          </div>
        </aside>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <h2 className="font-bold text-slate-800">{results.length} alojamiento{results.length !== 1 ? "s" : ""}{params.destination ? ` en ${params.destination}` : ""}</h2>
              {nights > 0 && <p className="text-xs text-slate-400">{nights} noche{nights > 1 ? "s" : ""} · {params.adults} adulto{params.adults > 1 ? "s" : ""}</p>}
            </div>
            <div className="flex gap-1.5 text-xs">
              <span className="text-slate-400 self-center">Ordenar:</span>
              {[{ k: "rating" as const, l: "Valoración" }, { k: "price" as const, l: "Precio" }].map(s => (
                <button key={s.k} onClick={() => setSortBy(s.k)} className="px-3 py-1.5 rounded-lg font-semibold border transition-all" style={{ background: sortBy === s.k ? "#f59e0b" : "#fff", color: sortBy === s.k ? "#0c1220" : "#64748b", borderColor: sortBy === s.k ? "#f59e0b" : "#e2e8f0" }}>{s.l}</button>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            {results.map(h => <HotelCard key={h.id} hotel={h} nights={nights} onSelect={() => onSelect(h)} />)}
            {results.length === 0 && (
              <div className="text-center py-16 rounded-2xl border bg-white" style={{ borderColor: "#e2e8f0" }}>
                <p className="text-4xl mb-3">🏨</p>
                <p className="font-semibold text-slate-700">No encontramos alojamientos con estos filtros.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Home ─────────────────────────────────────────────────────────────────────

function HomePage({
  params,
  onChange,
  onSearch,
  theme,
  onToggleTheme,
  onAdminAccess,
  onOpenConsult,
}: {
  params: SearchParams;
  onChange: (p: SearchParams) => void;
  onSearch: () => void;
  theme?: "light" | "dark";
  onToggleTheme?: () => void;
  onAdminAccess?: () => void;
  onOpenConsult?: () => void;
}) {
  return (
    <div style={{ background: "#f8fafc" }}>
      <div className="relative" style={{ minHeight: 400 }}>
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #0c1220 0%, #1e3a5f 50%, #0f2744 100%)" }}>
          <img src="https://images.unsplash.com/photo-1722191847760-8426e74d4b3d?w=1400&h=600&fit=crop&auto=format" alt="" className="w-full h-full object-cover opacity-25" />
        </div>
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(12,18,32,0.3) 0%, rgba(12,18,32,0.75) 100%)" }} />
        <div className="relative max-w-5xl mx-auto px-4 pt-12 sm:pt-20 pb-8 sm:pb-12 text-center">
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-3 leading-tight" style={{ fontFamily: "DM Serif Display, serif" }}>Encuentra tu hotel en Manta</h1>
          <p className="text-white/80 text-sm sm:text-base mb-6 sm:mb-8 max-w-lg mx-auto">Compara y reserva en hoteles, hostales y hosterías de Barbasquillo, El Murciélago, Tarqui, Los Esteros, San Mateo y Santa Marianita.</p>
          <div className="max-w-4xl mx-auto"><SearchBar params={params} onChange={onChange} onSearch={onSearch} /></div>
        </div>
      </div>
      <div className="border-b" style={{ background: "#fff", borderColor: "#e2e8f0" }}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-6 overflow-x-auto whitespace-nowrap scrollbar-none">
          {[["🛡️", "Cobro digital seguro (PayPhone/DeUna)"], ["✅", "Confirmación instantánea"], ["🔄", "Cancelación flexible"], ["🏆", "Tarifa directa sin sobreprecio OTA"], ["💬", "Atención local en Manta"]].map(([icon, text]) => (
            <div key={text as string} className="flex items-center gap-1.5 text-xs font-medium text-slate-600 shrink-0"><span>{icon}</span>{text}</div>
          ))}
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h2 className="text-xl font-bold text-slate-800 mb-5" style={{ fontFamily: "DM Serif Display, serif" }}>Sectores y Playas de Manta</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-12">
          {DESTINATIONS.map(d => (
            <button key={d.city} onClick={() => { onChange({ ...params, destination: d.city }); onSearch(); }} className="relative rounded-xl overflow-hidden transition-transform hover:scale-105 hover:shadow-lg cursor-pointer" style={{ height: 110 }}>
              <img src={d.img} alt={d.city} className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%)" }} />
              <div className="absolute bottom-0 left-0 right-0 p-2 text-left">
                <p className="text-white font-bold text-sm">{d.city.replace("Manta - ", "")}</p>
                <p className="text-white/70 text-[10px]">{d.hotels} hoteles</p>
              </div>
            </button>
          ))}
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-5" style={{ fontFamily: "DM Serif Display, serif" }}>Alojamientos Destacados de Manta</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {HOTELS.filter(h => h.rating >= 4.4).slice(0, 6).map(h => (
            <button key={h.id} onClick={() => { onChange({ ...params, destination: h.city }); onSearch(); }} className="rounded-2xl overflow-hidden border bg-white text-left hover:shadow-lg group transition-all cursor-pointer" style={{ borderColor: "#e2e8f0" }}>
              <div style={{ height: 160 }} className="overflow-hidden"><img src={h.image} alt={h.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" /></div>
              <div className="p-3">
                <div className="flex items-center justify-between mb-0.5"><StarsRow n={h.stars} /><span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ background: "#1e3a5f", color: "#93c5fd" }}>{h.rating}</span></div>
                <p className="font-bold text-slate-800 text-sm group-hover:text-amber-600 transition-colors">{h.name}</p>
                <p className="text-xs text-slate-400">{h.city}</p>
                <div className="flex items-baseline gap-1 mt-2"><span className="font-bold" style={{ color: "#f59e0b" }}>desde {fmt(h.priceFrom)}</span><span className="text-xs text-slate-400">/ noche</span></div>
              </div>
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[["💰", "Sin comisiones abusivas", "Reserva directamente con el establecimiento. Sin el 18-20% de recargo de intermediarios internacionales."], ["⭐", "Alojamientos Verificados", "Establecimientos registrados y validados: hostales, hoteles y hosterías del cantón Manta."], ["🏛️", "Facturación Directa", "El hotel emite tu factura fiscal en recepción. La plataforma liquida y transfiere el cobro al alojamiento."]].map(([icon, title, desc]) => (
            <div key={title as string} className="rounded-2xl p-5 border bg-white" style={{ borderColor: "#e2e8f0" }}>
              <span className="text-2xl">{icon}</span>
              <h4 className="font-bold text-slate-800 mt-2 mb-1 text-sm">{title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
      <footer className="border-t mt-10" style={{ background: "#1e293b", borderColor: "#334155" }}>
        <div className="max-w-5xl mx-auto px-4 py-8 flex flex-wrap gap-8 justify-between">
          <div>
            <p className="font-bold text-white text-lg mb-1" style={{ fontFamily: "DM Serif Display, serif" }}>AlojaManta</p>
            <p className="text-xs text-slate-400 max-w-xs">Plataforma oficial de reservas y comercialización directa hotelera para el cantón Manta, Manabí.</p>
          </div>
          <div className="flex gap-10 text-xs text-slate-400">
            <div className="space-y-1.5"><p className="font-semibold text-slate-300 mb-2">Sectores</p><p>Barbasquillo & El Murciélago</p><p>Tarqui & Los Esteros</p><p>San Mateo & Santa Marianita</p></div>
            <div className="space-y-1.5">
              <p className="font-semibold text-slate-300 mb-2">Ayuda & Soporte</p>
              {onOpenConsult ? (
                <button
                  type="button"
                  onClick={onOpenConsult}
                  className="hover:text-amber-400 text-slate-400 transition-colors text-left block cursor-pointer"
                >
                  Consultar mi reserva
                </button>
              ) : (
                <p>Consultar Reserva</p>
              )}
              <p>Contacto directo hotel</p>
              <p>Términos de servicio</p>
            </div>
          </div>
        </div>
        <div className="border-t py-4 px-4 max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400" style={{ borderColor: "#334155" }}>
          <span>© 2026 AlojaManta · Red Oficial de Alojamientos del Cantón Manta</span>
          <div className="flex items-center gap-4">
            {onToggleTheme && (
              <button
                type="button"
                onClick={onToggleTheme}
                className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition-colors text-xs py-1 px-2.5 rounded hover:bg-slate-800 cursor-pointer"
                title="Cambiar tema claro / oscuro"
              >
                <span>{theme === "dark" ? "☀️" : "🌙"}</span>
                <span>{theme === "dark" ? "Modo Claro" : "Modo Oscuro"}</span>
              </button>
            )}
            {onAdminAccess && (
              <button
                type="button"
                onClick={onAdminAccess}
                className="text-slate-500 hover:text-slate-300 transition-colors text-xs py-1 px-2 cursor-pointer"
                title="Acceso para administradores y recepción hotelera"
              >
                Acceso Establecimientos
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function GuestPage({
  user,
  onGuestLogin,
  onLogout,
  onAdminAccess,
  theme = "light",
  onToggleTheme,
}: {
  user: GuestUser | null;
  onGuestLogin: (u: GuestUser) => void;
  onLogout: () => void;
  onAdminAccess?: () => void;
  theme?: "light" | "dark";
  onToggleTheme?: () => void;
}) {
  const [view, setView] = useState<GuestView>("home");
  const [params, setParams] = useState<SearchParams>({
    destination: "",
    checkIn: addDays(todayStr(), 1),
    checkOut: addDays(todayStr(), 3),
    adults: 2,
    children: 0,
  });
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [bookingRoom, setBookingRoom] = useState<RoomOffer | null>(null);

  // Modales
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showConsultModal, setShowConsultModal] = useState(false);
  const [voucherRes, setVoucherRes] = useState<MyReservation | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [accountInitialTab, setAccountInitialTab] = useState<"hub" | "reservations" | "personal" | "billing" | "payments" | "benefits">("hub");

  // Reservas persistentes
  const [reservations, setReservations] = useState<MyReservation[]>(() => {
    try {
      const saved = localStorage.getItem("alojamanta_guest_reservations") || localStorage.getItem("hoteldirekt_guest_reservations");
      return saved ? JSON.parse(saved) : INITIAL_DEMO_RESERVATIONS;
    } catch {
      return INITIAL_DEMO_RESERVATIONS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("alojamanta_guest_reservations", JSON.stringify(reservations));
    } catch {
      // Ignorar si no hay storage
    }
  }, [reservations]);

  function handleCancelReservation(resId: string) {
    setReservations(prev =>
      prev.map(r => (r.id === resId ? { ...r, status: "cancelled" as const } : r))
    );
  }

  function handleReservationCreated(newRes: MyReservation) {
    setReservations(prev => [newRes, ...prev]);
  }

  const logoClickCount = useRef(0);
  const logoClickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleSearch() {
    setView("results");
    setSelectedHotel(null);
  }
  function handleSelectHotel(h: Hotel) {
    setSelectedHotel(h);
    setView("hotel");
    window.scrollTo({ top: 0 });
  }

  function handleLogoClick() {
    setView("home");
    setSelectedHotel(null);
    logoClickCount.current += 1;
    if (logoClickTimer.current) clearTimeout(logoClickTimer.current);
    if (logoClickCount.current >= 5) {
      logoClickCount.current = 0;
      onAdminAccess?.();
      return;
    }
    logoClickTimer.current = setTimeout(() => {
      logoClickCount.current = 0;
    }, 2000);
  }

  return (
    <div className="min-h-screen overflow-x-hidden w-full max-w-full" style={{ background: "#f8fafc" }}>
      {/* Nav */}
      <header className="sticky top-0 z-30 border-b shadow-xs" style={{ background: "#fff", borderColor: "#e2e8f0" }}>
        <div className="max-w-5xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2">
          <button onClick={handleLogoClick} className="flex items-center gap-1.5 sm:gap-2 cursor-pointer shrink-0">
            <span className="font-bold text-lg sm:text-xl" style={{ fontFamily: "DM Serif Display, serif", color: "#0c1220" }}>
              AlojaManta
            </span>
            <span className="hidden sm:inline-block text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
              MANTA 2026
            </span>
          </button>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {user ? (
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setShowProfileMenu(prev => !prev)}
                  className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full border border-slate-200 hover:border-amber-400 bg-white hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
                  title="Menú de perfil y cuenta"
                >
                  <span className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 text-xs flex items-center justify-center font-black shadow-2xs">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[110px]">
                      {user.name.split(" ")[0]}
                    </p>
                    <p className="text-[9px] text-amber-700 font-semibold leading-none">
                      Nivel 1 Huésped
                    </p>
                  </div>
                  <span className="text-xs text-slate-400">▾</span>
                </button>

                {showProfileMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowProfileMenu(false)}
                    />
                    <div
                      className="absolute right-0 mt-2 w-72 rounded-2xl border bg-white shadow-2xl z-50 overflow-hidden divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-100"
                      style={{ borderColor: "#e2e8f0" }}
                    >
                      {/* Cabecera del usuario */}
                      <div className="p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-950 font-black text-base flex items-center justify-center shrink-0 shadow-md">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-sm text-white truncate">{user.name}</p>
                            <span className="inline-block text-[9px] font-semibold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 mt-0.5">
                              ⭐ Huésped Frecuente Manta
                            </span>
                            <p className="text-[11px] text-slate-400 truncate mt-0.5">{user.email}</p>
                          </div>
                        </div>
                      </div>

                      {/* Enlaces del Menú */}
                      <div className="py-1.5 text-xs text-slate-700 font-medium">
                        <button
                          onClick={() => { setAccountInitialTab("hub"); setView("account"); setShowProfileMenu(false); }}
                          className="w-full px-4 py-2.5 text-left hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                        >
                          <span className="text-base">🏠</span>
                          <div>
                            <p className="font-semibold text-slate-800">Centro de mi cuenta</p>
                            <p className="text-[10px] text-slate-400">Panel general de perfil y servicios</p>
                          </div>
                        </button>

                        <button
                          onClick={() => { setAccountInitialTab("reservations"); setView("account"); setShowProfileMenu(false); }}
                          className="w-full px-4 py-2.5 text-left hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                        >
                          <span className="text-base">🛎️</span>
                          <div>
                            <p className="font-semibold text-slate-800">Mis Reservas y Viajes</p>
                            <p className="text-[10px] text-slate-400">Ver vouchers y códigos de check-in</p>
                          </div>
                        </button>

                        <button
                          onClick={() => { setAccountInitialTab("personal"); setView("account"); setShowProfileMenu(false); }}
                          className="w-full px-4 py-2.5 text-left hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                        >
                          <span className="text-base">👤</span>
                          <div>
                            <p className="font-semibold text-slate-800">Datos Personales & Check-in</p>
                            <p className="text-[10px] text-slate-400">Cédula, contacto y preferencias de cama</p>
                          </div>
                        </button>

                        <button
                          onClick={() => { setAccountInitialTab("billing"); setView("account"); setShowProfileMenu(false); }}
                          className="w-full px-4 py-2.5 text-left hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                        >
                          <span className="text-base">🏛️</span>
                          <div>
                            <p className="font-semibold text-slate-800">Datos de Facturación SRI</p>
                            <p className="text-[10px] text-slate-400">Factura directa emitida por el hotel</p>
                          </div>
                        </button>

                        <button
                          onClick={() => { setAccountInitialTab("payments"); setView("account"); setShowProfileMenu(false); }}
                          className="w-full px-4 py-2.5 text-left hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                        >
                          <span className="text-base">💳</span>
                          <div>
                            <p className="font-semibold text-slate-800">Medios de Pago</p>
                            <p className="text-[10px] text-slate-400">Tarjetas, DeUna y PayPhone</p>
                          </div>
                        </button>

                        <button
                          onClick={() => { setAccountInitialTab("benefits"); setView("account"); setShowProfileMenu(false); }}
                          className="w-full px-4 py-2.5 text-left hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                        >
                          <span className="text-base">🎁</span>
                          <div>
                            <p className="font-semibold text-slate-800">Beneficios Manta Direct</p>
                            <p className="text-[10px] text-slate-400">Garantía sin recargos OTA de intermediarios</p>
                          </div>
                        </button>

                        {onAdminAccess && (
                          <button
                            onClick={() => { setShowProfileMenu(false); onAdminAccess(); }}
                            className="w-full px-4 py-2 text-left hover:bg-amber-50 text-amber-900 flex items-center gap-2.5 transition-colors cursor-pointer border-t border-slate-100"
                          >
                            <span className="text-base">🏨</span>
                            <div>
                              <p className="font-semibold">Acceso Hotel / PMS</p>
                              <p className="text-[10px] text-amber-700">Administración y mostrador hotelero</p>
                            </div>
                          </button>
                        )}
                      </div>

                      {/* Cerrar Sesión */}
                      <div className="p-2 bg-slate-50">
                        <button
                          onClick={() => { setShowProfileMenu(false); onLogout(); }}
                          className="w-full px-3 py-2 rounded-xl text-left text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <span>🚪</span>
                          <span>Cerrar sesión</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="text-xs sm:text-sm font-bold px-3.5 sm:px-4 py-1.5 rounded-lg hover:opacity-90 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm text-slate-950 bg-amber-500 hover:bg-amber-400 shrink-0"
              >
                <span>👤</span>
                <span className="hidden sm:inline">Iniciar sesión</span>
                <span className="sm:hidden text-xs font-semibold">Iniciar sesión</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {view === "home" && (
        <HomePage
          params={params}
          onChange={setParams}
          onSearch={handleSearch}
          theme={theme}
          onToggleTheme={onToggleTheme}
          onAdminAccess={onAdminAccess}
          onOpenConsult={() => setShowConsultModal(true)}
        />
      )}
      {view === "results" && <ResultsView params={params} onChange={setParams} onSearch={handleSearch} onSelect={handleSelectHotel} />}
      {view === "hotel" && selectedHotel && <HotelDetail hotel={selectedHotel} params={params} onBack={() => setView("results")} onBook={r => setBookingRoom(r)} />}
      {view === "account" && user && (
        <AccountView
          user={user}
          reservations={reservations}
          onLogout={onLogout}
          onCancelReservation={handleCancelReservation}
          onViewVoucher={setVoucherRes}
          onBack={() => setView("home")}
          initialTab={accountInitialTab}
          onAdminAccess={onAdminAccess}
        />
      )}

      {/* Modal de Reserva y Pago */}
      {bookingRoom && selectedHotel && (
        <BookingModal
          hotel={selectedHotel}
          room={bookingRoom}
          params={params}
          user={user}
          onClose={() => setBookingRoom(null)}
          onGuestLogin={onGuestLogin}
          onReservationCreated={handleReservationCreated}
        />
      )}

      {/* Modal de Inicio de Sesión */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onGuestLogin={u => {
            onGuestLogin(u);
            setShowLoginModal(false);
          }}
          onAdminAccess={() => {
            setShowLoginModal(false);
            onAdminAccess?.();
          }}
          onOpenConsult={() => setShowConsultModal(true)}
        />
      )}

      {/* Modal de Consulta de Reservas */}
      {showConsultModal && (
        <ConsultReservationModal
          reservations={reservations}
          onClose={() => setShowConsultModal(false)}
          onViewVoucher={res => {
            setVoucherRes(res);
          }}
          onCancelReservation={handleCancelReservation}
        />
      )}

      {/* Modal de Voucher / Comprobante de Cobro */}
      {voucherRes && (
        <InvoiceModal res={voucherRes} onClose={() => setVoucherRes(null)} />
      )}

      {/* Botón flotante para cambiar tema (Modo Claro / Modo Oscuro) */}
      {onToggleTheme && (
        <button
          type="button"
          onClick={onToggleTheme}
          className="fixed bottom-5 right-5 z-40 w-11 h-11 rounded-full shadow-xl border flex items-center justify-center text-lg transition-transform hover:scale-110 active:scale-90 cursor-pointer bg-white text-slate-800 border-slate-300 hover:bg-slate-100"
          style={{
            boxShadow: "0 10px 25px -5px rgba(0,0,0,0.25)",
          }}
          title={theme === "dark" ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
          aria-label="Alternar tema claro / oscuro"
        >
          <span>{theme === "dark" ? "☀️" : "🌙"}</span>
        </button>
      )}
    </div>
  );
}
