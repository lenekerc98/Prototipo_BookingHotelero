import { useState, useRef } from "react";
import type { GuestUser } from "./AuthPage";
import { HOTEL_SRI_INFO } from "./hotelData";

// ─── Types ────────────────────────────────────────────────────────────────────

type GuestView = "home" | "results" | "hotel" | "account";

interface SearchParams {
  destination: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
}

interface Hotel {
  id: string;
  name: string;
  stars: 1 | 2 | 3;
  city: string;
  address: string;
  image: string;
  rating: number;
  reviews: number;
  priceFrom: number;
  tags: string[];
  amenities: string[];
  description: string;
  distance: string;
  gravaServicio10?: boolean;
  rooms: RoomOffer[];
}

interface RoomOffer {
  id: string;
  type: string;
  beds: string;
  capacity: number;
  size: number;
  pricePerNight: number;
  originalPrice?: number;
  image: string;
  amenities: string[];
  available: number;
  breakfastIncluded?: boolean;
}

interface MyReservation {
  id: string;
  hotel: string;
  city: string;
  room: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  total: number;
  status: "upcoming" | "completed" | "cancelled";
  image: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const HOTELS: Hotel[] = [
  {
    id: "costa-sol", name: "Hotel Costa Sol", stars: 3, city: "Manta - Barbasquillo",
    address: "Av. Malecón Jaime Chávez Gutiérrez y Calle 15, Manta",
    image: "https://images.unsplash.com/photo-1563629986-97c92e385f66?w=700&h=460&fit=crop&auto=format",
    rating: 4.5, reviews: 342, priceFrom: 55,
    tags: ["Frente al mar", "Piscina exterior", "10% Servicio"],
    amenities: ["WiFi alta velocidad", "Piscina", "Estacionamiento", "Restaurante", "Bar", "Aire acondicionado", "Recepción 24h"],
    description: "Hotel 3 estrellas premium frente a la bahía de Manta y playa El Murciélago. Habitaciones luminosas con balcón y vista panorámica al mar.",
    distance: "Frente a la playa El Murciélago",
    gravaServicio10: true,
    rooms: [
      { id: "r1", type: "Individual Vista Mar", beds: "1 cama individual", capacity: 1, size: 18, pricePerNight: 55, image: "https://images.unsplash.com/photo-1777383505025-c0edf7047083?w=600&h=380&fit=crop&auto=format", amenities: ["WiFi", "TV Smart", "A/C", "Baño privado"], available: 5 },
      { id: "r2", type: "Doble Superior Frente al Mar", beds: "1 cama queen", capacity: 2, size: 26, pricePerNight: 85, originalPrice: 95, image: "https://images.unsplash.com/photo-1780126752257-cae35f118114?w=600&h=380&fit=crop&auto=format", amenities: ["WiFi", "TV Smart", "A/C", "Vista al mar", "Balcón", "Baño privado"], available: 4, breakfastIncluded: true },
      { id: "r3", type: "Villa Familiar con Piscina", beds: "1 queen + 2 individuales", capacity: 4, size: 45, pricePerNight: 135, image: "https://images.unsplash.com/photo-1767348923171-f5535f88fb39?w=600&h=380&fit=crop&auto=format", amenities: ["WiFi", "TV Smart", "A/C", "Cocina equipada", "Baño privado", "Terraza"], available: 2 },
    ],
  },
  {
    id: "las-palmeras", name: "Hotel Las Palmeras", stars: 3, city: "Manta - El Murciélago",
    address: "Av. Flavio Reyes y Calle 24, Manta",
    image: "https://images.unsplash.com/photo-1563273410-ca16d83b2cce?w=700&h=460&fit=crop&auto=format",
    rating: 4.3, reviews: 312, priceFrom: 60,
    tags: ["Zona Comercial", "Piscina", "10% Servicio"],
    amenities: ["WiFi gratis", "Piscina", "Estacionamiento", "Recepción 24h", "Bar", "Aire acondicionado"],
    description: "Ubicado en la mejor zona gastronómica y hotelera de Manta, a 3 minutos del Mall del Pacífico y playa El Murciélago.",
    distance: "200 m de Playa El Murciélago",
    gravaServicio10: true,
    rooms: [
      { id: "r1", type: "Habitación Individual", beds: "1 cama individual", capacity: 1, size: 16, pricePerNight: 60, image: "https://images.unsplash.com/photo-1777383505025-c0edf7047083?w=600&h=380&fit=crop&auto=format", amenities: ["WiFi", "TV", "A/C", "Baño privado"], available: 4 },
      { id: "r2", type: "Habitación Doble", beds: "1 cama doble o 2 individuales", capacity: 2, size: 22, pricePerNight: 75, originalPrice: 90, image: "https://images.unsplash.com/photo-1781004672179-9790a9623a77?w=600&h=380&fit=crop&auto=format", amenities: ["WiFi", "TV", "A/C", "Baño privado", "Caja fuerte"], available: 3 },
      { id: "r3", type: "Triple Familiar", beds: "1 doble + 1 individual", capacity: 3, size: 28, pricePerNight: 115, image: "https://images.unsplash.com/photo-1767348923171-f5535f88fb39?w=600&h=380&fit=crop&auto=format", amenities: ["WiFi", "TV", "A/C", "Baño privado", "Minibar"], available: 2 },
    ],
  },
  {
    id: "mirador-alhambra", name: "Hotel Mirador del Pacífico", stars: 3, city: "Manta - Barbasquillo",
    address: "Vía a Barbasquillo y Calle 120, Manta",
    image: "https://images.unsplash.com/photo-1620677368158-32b1293fac36?w=700&h=460&fit=crop&auto=format",
    rating: 4.6, reviews: 218, priceFrom: 65,
    tags: ["Vista al Océano", "Barbasquillo", "10% Servicio"],
    amenities: ["WiFi gratis", "Desayuno incluido", "Recepción 24h", "Estacionamiento", "Jardín", "Aire acondicionado"],
    description: "Hotel boutique con vista panorámica a los acantilados y el mar de Barbasquillo. Ambiente exclusivo y tranquilo.",
    distance: "3 min en auto a Barbasquillo",
    gravaServicio10: true,
    rooms: [
      { id: "r1", type: "Individual Ejecutiva", beds: "1 cama individual", capacity: 1, size: 16, pricePerNight: 65, image: "https://images.unsplash.com/photo-1777383505025-c0edf7047083?w=600&h=380&fit=crop&auto=format", amenities: ["WiFi", "TV", "A/C", "Baño privado"], available: 2 },
      { id: "r2", type: "Doble con Vistas al Mar", beds: "1 cama queen", capacity: 2, size: 24, pricePerNight: 100, image: "https://images.unsplash.com/photo-1769123300291-81262063e667?w=600&h=380&fit=crop&auto=format", amenities: ["WiFi", "TV", "Vistas al Mar", "Baño privado"], available: 3, breakfastIncluded: true },
      { id: "r3", type: "Suite Panorámica Manta", beds: "1 cama king", capacity: 2, size: 38, pricePerNight: 155, image: "https://images.unsplash.com/photo-1779547011126-c646b7de93b5?w=600&h=380&fit=crop&auto=format", amenities: ["WiFi", "TV 4K", "Minibar", "Jacuzzi", "Vistas panorámicas", "Desayuno incluido"], available: 1, breakfastIncluded: true },
    ],
  },
  {
    id: "hostal-centro", name: "Hostal El Centro", stars: 2, city: "Manta - Tarqui",
    address: "Calle 13 y Av. 4, Tarqui, Manta",
    image: "https://images.unsplash.com/photo-1704908327293-82e8a6026450?w=700&h=460&fit=crop&auto=format",
    rating: 3.9, reviews: 521, priceFrom: 28,
    tags: ["Económico Tarqui", "Tarifa Neta", "Sin 10%"],
    amenities: ["WiFi gratis", "Recepción 24h", "Custodia de equipaje", "Aire acondicionado"],
    description: "Hostal familiar tradicional en el corazón de Tarqui, Manta. Habitaciones confortables con excelente relación calidad-precio. No grava el 10% de servicio.",
    distance: "300 m del Mercado de Mariscos de Tarqui",
    gravaServicio10: false,
    rooms: [
      { id: "r1", type: "Individual Económica", beds: "1 cama individual", capacity: 1, size: 14, pricePerNight: 28, image: "https://images.unsplash.com/photo-1777383504729-bd8364d28de8?w=600&h=380&fit=crop&auto=format", amenities: ["WiFi", "TV", "A/C"], available: 5 },
      { id: "r2", type: "Doble Estándar", beds: "1 cama matrimonial", capacity: 2, size: 18, pricePerNight: 40, image: "https://images.unsplash.com/photo-1780126752257-cae35f118114?w=600&h=380&fit=crop&auto=format", amenities: ["WiFi", "TV", "A/C", "Baño privado"], available: 3 },
      { id: "r3", type: "Doble con Balcón", beds: "1 cama matrimonial grande", capacity: 2, size: 22, pricePerNight: 50, image: "https://images.unsplash.com/photo-1769123300291-81262063e667?w=600&h=380&fit=crop&auto=format", amenities: ["WiFi", "TV", "A/C", "Balcón", "Baño privado"], available: 1 },
    ],
  },
  {
    id: "hostal-rambla", name: "Hostal Rambla", stars: 2, city: "Manta - Tarqui",
    address: "Av. 102 y Calle 108, Tarqui, Manta",
    image: "https://images.unsplash.com/photo-1628950752032-06fed9c9d0f8?w=700&h=460&fit=crop&auto=format",
    rating: 3.8, reviews: 412, priceFrom: 32,
    tags: ["Frente Malecón Tarqui", "Tarifa Neta", "Sin 10%"],
    amenities: ["WiFi gratis", "Recepción 24h", "Consigna", "Aire acondicionado"],
    description: "Hospedaje acogedor frente al malecón de Tarqui. Ideal para estancias cortas y viajes comerciales en Manta. Tarifa neta directa sin recargo de servicio.",
    distance: "100 m de Playa de Tarqui",
    gravaServicio10: false,
    rooms: [
      { id: "r1", type: "Individual Confort", beds: "1 cama individual", capacity: 1, size: 14, pricePerNight: 32, image: "https://images.unsplash.com/photo-1777383504729-bd8364d28de8?w=600&h=380&fit=crop&auto=format", amenities: ["WiFi", "TV", "A/C"], available: 6 },
      { id: "r2", type: "Doble Estándar", beds: "2 camas individuales o 1 matrimonial", capacity: 2, size: 20, pricePerNight: 45, image: "https://images.unsplash.com/photo-1781004672179-9790a9623a77?w=600&h=380&fit=crop&auto=format", amenities: ["WiFi", "TV", "A/C", "Baño privado"], available: 4 },
    ],
  },
  {
    id: "pension-marina", name: "Pensión La Marina", stars: 1, city: "Manta - Centro Histórico",
    address: "Av. 2 y Calle 9, Manta",
    image: "https://images.unsplash.com/photo-1579678918123-79d85d5b3873?w=700&h=460&fit=crop&auto=format",
    rating: 3.6, reviews: 89, priceFrom: 20,
    tags: ["Super Económico", "Puerto de Manta", "Sin 10%"],
    amenities: ["WiFi gratis", "Recepción", "Ventilador / A/C"],
    description: "Alojamiento básico y accesible a pasos del puerto de Manta y la Plaza Cívica. No aplica tasa de servicio del 10%.",
    distance: "5 min a pie del Puerto de Manta",
    gravaServicio10: false,
    rooms: [
      { id: "r1", type: "Individual Básica", beds: "1 cama individual", capacity: 1, size: 12, pricePerNight: 20, image: "https://images.unsplash.com/photo-1777383504729-bd8364d28de8?w=600&h=380&fit=crop&auto=format", amenities: ["WiFi", "Baño privado", "Ventilador"], available: 4 },
      { id: "r2", type: "Doble Clásica", beds: "1 cama doble", capacity: 2, size: 16, pricePerNight: 30, image: "https://images.unsplash.com/photo-1781004672179-9790a9623a77?w=600&h=380&fit=crop&auto=format", amenities: ["WiFi", "TV", "A/C", "Baño privado"], available: 3 },
    ],
  },
];

const DESTINATIONS = [
  { city: "Manta - El Murciélago", img: "https://images.unsplash.com/photo-1563273410-ca16d83b2cce?w=400&h=300&fit=crop&auto=format", hotels: 38 },
  { city: "Manta - Barbasquillo", img: "https://images.unsplash.com/photo-1563629986-97c92e385f66?w=400&h=300&fit=crop&auto=format", hotels: 28 },
  { city: "Manta - Tarqui", img: "https://images.unsplash.com/photo-1704908327293-82e8a6026450?w=400&h=300&fit=crop&auto=format", hotels: 24 },
  { city: "Manta - Los Esteros", img: "https://images.unsplash.com/photo-1628950752032-06fed9c9d0f8?w=400&h=300&fit=crop&auto=format", hotels: 18 },
  { city: "Manta - San Mateo", img: "https://images.unsplash.com/photo-1620677368158-32b1293fac36?w=400&h=300&fit=crop&auto=format", hotels: 6 },
  { city: "Manta - Santa Marianita", img: "https://images.unsplash.com/photo-1579678918123-79d85d5b3873?w=400&h=300&fit=crop&auto=format", hotels: 4 },
];

const DEMO_RESERVATIONS: MyReservation[] = [
  { id: "RES-4821", hotel: "Hotel Costa Sol", city: "Manta - Barbasquillo", room: "Doble Superior Frente al Mar", checkIn: "2026-08-15", checkOut: "2026-08-18", nights: 3, total: 318.75, status: "completed", image: "https://images.unsplash.com/photo-1781004672179-9790a9623a77?w=400&h=250&fit=crop&auto=format" },
  { id: "RES-5103", hotel: "Hotel Las Palmeras", city: "Manta - El Murciélago", room: "Habitación Doble", checkIn: "2026-09-05", checkOut: "2026-09-08", nights: 3, total: 281.25, status: "upcoming", image: "https://images.unsplash.com/photo-1769123300291-81262063e667?w=400&h=250&fit=crop&auto=format" },
  { id: "RES-3970", hotel: "Hostal El Centro", city: "Manta - Tarqui", room: "Individual Económica", checkIn: "2026-05-20", checkOut: "2026-05-22", nights: 2, total: 64.40, status: "completed", image: "https://images.unsplash.com/photo-1777383504729-bd8364d28de8?w=400&h=250&fit=crop&auto=format" },
];

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
function StarsRow({ n }: { n: 1 | 2 | 3 }) {
  return <span className="flex gap-0.5">{Array.from({ length: 3 }).map((_, i) => <span key={i} style={{ color: i < n ? "#f59e0b" : "#d1d5db", fontSize: 11 }}>★</span>)}</span>;
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
              <strong>Facturación electrónica directa:</strong> Este comprobante es emitido y autorizado ante el <strong>SRI</strong> directamente por {hotelName ? <strong>{hotelName}</strong> : "el hotel prestador"} en Manta.
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
    <div className={`flex flex-wrap gap-2 items-end ${variant === "hero" ? "p-3 rounded-2xl shadow-2xl" : "p-2 rounded-xl border"}`} style={{ background: "#fff", borderColor: variant === "sticky" ? "#e2e8f0" : undefined }}>
      <div className="flex-1 min-w-[140px]">
        <label className="block text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "#94a3b8" }}>¿A dónde vas?</label>
        <input className="w-full px-3 py-2 rounded-lg border text-sm font-medium outline-none" style={{ borderColor: "#e2e8f0", color: "#1e293b" }} value={params.destination} onChange={e => onChange({ ...params, destination: e.target.value })} placeholder="Ciudad..." list="dest-list" />
        <datalist id="dest-list">{DESTINATIONS.map(d => <option key={d.city} value={d.city} />)}</datalist>
      </div>
      <div className="min-w-[120px]">
        <label className="block text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "#94a3b8" }}>Llegada</label>
        <input type="date" className="w-full px-3 py-2 rounded-lg border text-sm font-medium outline-none" style={{ borderColor: "#e2e8f0", color: "#1e293b", colorScheme: "light" }} value={params.checkIn} min={todayStr()} onChange={e => onChange({ ...params, checkIn: e.target.value, checkOut: params.checkOut && e.target.value >= params.checkOut ? addDays(e.target.value, 1) : params.checkOut })} />
      </div>
      <div className="min-w-[120px]">
        <label className="block text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "#94a3b8" }}>Salida</label>
        <input type="date" className="w-full px-3 py-2 rounded-lg border text-sm font-medium outline-none" style={{ borderColor: "#e2e8f0", color: "#1e293b", colorScheme: "light" }} value={params.checkOut} min={params.checkIn ? addDays(params.checkIn, 1) : addDays(todayStr(), 1)} onChange={e => onChange({ ...params, checkOut: e.target.value })} />
      </div>
      <div className="min-w-[100px]">
        <label className="block text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "#94a3b8" }}>Huéspedes</label>
        <select className="w-full px-3 py-2 rounded-lg border text-sm font-medium outline-none" style={{ borderColor: "#e2e8f0", color: "#1e293b" }} value={params.adults} onChange={e => onChange({ ...params, adults: Number(e.target.value) })}>
          {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n} adulto{n > 1 ? "s" : ""}</option>)}
        </select>
      </div>
      <button onClick={onSearch} className="px-5 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 active:scale-95 transition-all whitespace-nowrap" style={{ background: "#f59e0b", color: "#0c1220" }}>🔍 Buscar</button>
    </div>
  );
}

// ─── Invoice modal ────────────────────────────────────────────────────────────

function InvoiceModal({ res, onClose }: { res: MyReservation; onClose: () => void }) {
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
                <span className="text-[9px] bg-amber-500/20 text-amber-300 font-mono px-1.5 py-0.5 rounded border border-amber-500/30">FACTURA DIRECTA</span>
              </div>
              <p className="text-xs text-slate-300">{sri.razonSocial}</p>
              <p className="text-[10px] text-slate-400 font-mono">RUC: {sri.ruc} · {sri.regimen}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">AUTORIZADA SRI</span>
              <p className="font-mono font-bold text-slate-100 text-xs mt-1">{invoiceNum}</p>
              <p className="text-[10px] text-slate-400">Fecha: {fmtDateShort(res.checkOut)}</p>
            </div>
          </div>
        </div>

        <div className="p-3 bg-amber-50 border-b border-amber-200 text-[11px] text-amber-800 flex items-center gap-2">
          <span>🏛️</span>
          <span><strong>Facturación Directa del Hotel:</strong> Emitida bajo normativa tributaria del SRI por el establecimiento en Manta.</span>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Facturado a</p>
              <p className="font-semibold text-slate-700">Huésped Registrado</p>
              <p className="text-xs text-slate-500 font-mono">Reserva {res.id}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Establecimiento</p>
              <p className="font-semibold text-slate-700">{res.hotel}</p>
              <p className="text-xs text-slate-500">{res.city}</p>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden border" style={{ borderColor: "#e2e8f0" }}>
            <table className="w-full text-sm">
              <thead><tr style={{ background: "#f8fafc" }}><th className="text-left px-4 py-2.5 text-xs font-bold text-slate-500">Concepto</th><th className="text-right px-4 py-2.5 text-xs font-bold text-slate-500">Importe</th></tr></thead>
              <tbody>
                <tr style={{ borderTop: "1px solid #e2e8f0" }}>
                  <td className="px-4 py-2.5"><p className="font-medium text-slate-700">{res.room}</p><p className="text-xs text-slate-400">{res.nights} noche{res.nights > 1 ? "s" : ""} · {fmtDateShort(res.checkIn)} → {fmtDateShort(res.checkOut)}</p></td>
                  <td className="px-4 py-2.5 text-right font-medium text-slate-700">{fmt(base)}</td>
                </tr>
                <tr style={{ borderTop: "1px solid #e2e8f0", background: "#f8fafc" }}>
                  <td className="px-4 py-2 text-xs text-slate-500">IVA (15% SRI)</td>
                  <td className="px-4 py-2 text-right text-xs text-slate-500">{fmt(iva)}</td>
                </tr>
                <tr style={{ background: "#f8fafc" }}>
                  <td className="px-4 py-2 text-xs text-slate-600 font-medium">Tasa Municipal de Turismo (GAD Manta)</td>
                  <td className="px-4 py-2 text-right text-xs text-slate-700 font-medium">{fmt(2.50)}</td>
                </tr>
                {hasServicio && (
                  <tr style={{ background: "#f8fafc" }}>
                    <td className="px-4 py-2 text-xs text-emerald-600 font-medium">10% Cargo gubernamental (Ley Turismo Art. 41)</td>
                    <td className="px-4 py-2 text-right text-xs text-emerald-600 font-bold">{fmt(servicio)}</td>
                  </tr>
                )}
                <tr style={{ borderTop: "1px solid #e2e8f0" }}>
                  <td className="px-4 py-3 font-bold text-slate-800">Total Pagado</td>
                  <td className="px-4 py-3 text-right font-bold text-lg" style={{ color: "#f59e0b" }}>{fmt(res.total)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex items-center gap-2 rounded-xl p-3" style={{ background: "#d1fae5", border: "1px solid #a7f3d0" }}>
            <span className="text-green-600 font-bold">✓</span>
            <span className="text-xs font-semibold text-green-700">Comprobante y pago liquidado en mostrador/enlace digital</span>
          </div>
        </div>
        <div className="px-6 py-4 border-t flex gap-2" style={{ borderColor: "#e2e8f0" }}>
          <button onClick={onClose} className="flex-1 py-2 rounded-xl text-sm font-medium border" style={{ borderColor: "#e2e8f0", color: "#64748b" }}>Cerrar</button>
          <button className="flex-1 py-2 rounded-xl text-sm font-bold" style={{ background: "#f59e0b", color: "#0c1220" }}>⬇ Descargar RIDE PDF</button>
        </div>
      </div>
    </div>
  );
}


// ─── My Account view ──────────────────────────────────────────────────────────

function AccountView({ user, onLogout }: { user: GuestUser; onLogout: () => void }) {
  const [invoiceRes, setInvoiceRes] = useState<MyReservation | null>(null);
  const statusStyle = {
    upcoming: { bg: "#1e3a5f", color: "#93c5fd", label: "Próxima" },
    completed: { bg: "#064e3b", color: "#6ee7b7", label: "Completada" },
    cancelled: { bg: "#1f1f23", color: "#6b7280", label: "Cancelada" },
  };
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Profile */}
      <div className="flex items-center gap-4 mb-8 p-5 rounded-2xl border bg-white" style={{ borderColor: "#e2e8f0" }}>
        <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0" style={{ background: "#fef3c7", color: "#92400e" }}>
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <p className="font-bold text-slate-800 text-lg">{user.name}</p>
          <p className="text-sm text-slate-400">{user.email}</p>
          <p className="text-xs text-slate-400 mt-0.5">Miembro desde agosto 2026 · {DEMO_RESERVATIONS.length} reservas</p>
        </div>
        <button onClick={onLogout} className="text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors hover:bg-red-50" style={{ borderColor: "#fee2e2", color: "#ef4444" }}>
          Cerrar sesión
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { label: "Reservas", val: String(DEMO_RESERVATIONS.length) },
          { label: "Noches hospedado", val: String(DEMO_RESERVATIONS.reduce((s, r) => s + r.nights, 0)) },
          { label: "Total gastado", val: fmt(DEMO_RESERVATIONS.reduce((s, r) => s + r.total, 0)) },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-4 border bg-white text-center" style={{ borderColor: "#e2e8f0" }}>
            <p className="text-xl font-bold text-slate-800">{s.val}</p>
            <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Reservations */}
      <h2 className="font-bold text-slate-800 text-lg mb-4" style={{ fontFamily: "DM Serif Display, serif" }}>Mis reservas</h2>
      <div className="space-y-4">
        {DEMO_RESERVATIONS.map(res => {
          const st = statusStyle[res.status];
          return (
            <div key={res.id} className="rounded-2xl border bg-white overflow-hidden" style={{ borderColor: "#e2e8f0" }}>
              <div className="flex flex-col sm:flex-row">
                <img src={res.image} alt={res.room} className="sm:w-44 w-full object-cover" style={{ height: 130 }} />
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-bold text-slate-800">{res.hotel}</p>
                        <p className="text-xs text-slate-400">{res.city} · {res.room}</p>
                      </div>
                      <span className="mono text-[10px] px-2 py-1 rounded uppercase font-bold" style={{ background: st.bg, color: st.color }}>{st.label}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1.5">
                      {fmtDateShort(res.checkIn)} → {fmtDateShort(res.checkOut)} · {res.nights} noche{res.nights > 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t" style={{ borderColor: "#f1f5f9" }}>
                    <div>
                      <p className="text-xs text-slate-400">Nº reserva</p>
                      <p className="font-mono text-sm font-semibold text-slate-700">{res.id}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold" style={{ color: "#f59e0b" }}>{fmt(res.total)}</p>
                      {res.status === "completed" && (
                        <button onClick={() => setInvoiceRes(res)} className="text-xs px-3 py-1.5 rounded-lg font-semibold transition-all hover:opacity-80" style={{ background: "#f1f5f9", color: "#475569" }}>
                          🧾 Factura
                        </button>
                      )}
                      {res.status === "upcoming" && (
                        <button className="text-xs px-3 py-1.5 rounded-lg font-semibold transition-all" style={{ background: "#fee2e2", color: "#ef4444" }}>
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
      </div>
      {invoiceRes && <InvoiceModal res={invoiceRes} onClose={() => setInvoiceRes(null)} />}
    </div>
  );
}

// ─── Booking modal ────────────────────────────────────────────────────────────

type BookingStep = "auth" | "details" | "payment" | "invoice";

function BookingModal({ hotel, room, params, user, onClose, onGuestLogin }: {
  hotel: Hotel; room: RoomOffer; params: SearchParams;
  user: GuestUser | null; onClose: () => void; onGuestLogin: (u: GuestUser) => void;
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
    ? [{ k: "details", l: "1. Datos" }, { k: "payment", l: "2. Pago" }, { k: "invoice", l: "3. Factura" }]
    : [{ k: "auth", l: "1. Acceso" }, { k: "details", l: "2. Datos" }, { k: "payment", l: "3. Pago" }, { k: "invoice", l: "4. Factura" }];

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
    setTimeout(() => { setProcessing(false); setStep("invoice"); }, 1800);
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
                <h3 className="font-bold text-slate-800 text-base">¡Reserva confirmada con éxito!</h3>
                <p className="text-xs text-slate-500 mt-0.5">Voucher oficial con QR y Facturación Directa del Hotel</p>
              </div>

              {/* Electronic invoice & Voucher */}
              <div className="rounded-2xl border overflow-hidden shadow-lg" style={{ borderColor: "#e2e8f0" }}>
                {/* Invoice header: Hotel Direct Fiscal Entity */}
                <div className="px-5 py-4 flex items-start justify-between" style={{ background: "#0c1220" }}>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-lg text-amber-400" style={{ fontFamily: "DM Serif Display, serif" }}>{hotelSri.nombreComercial}</p>
                      <span className="text-[9px] bg-amber-500/20 text-amber-300 font-mono px-2 py-0.5 rounded border border-amber-500/30">FACTURA DIRECTA</span>
                    </div>
                    <p className="text-xs text-slate-300 font-medium">{hotelSri.razonSocial}</p>
                    <p className="text-[10px] text-slate-400 font-mono">RUC: {hotelSri.ruc} · {hotelSri.regimen}</p>
                    <p className="text-[10px] text-slate-400">{hotelSri.dirMatriz} · Manta - Manabí</p>
                  </div>
                  <div className="text-right">
                    <span className="mono text-xs font-bold px-2 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">AUTORIZADA SRI</span>
                    <p className="font-bold mt-1 text-slate-100 font-mono text-xs">{invoiceId}</p>
                    <p className="mono text-[10px] text-slate-400">{issueDate}</p>
                  </div>
                </div>

                {/* Banner de Facturación Directa SRI */}
                <div className="px-4 py-2 bg-amber-50 border-b border-amber-200 flex items-center gap-2 text-[11px] text-amber-900 leading-tight">
                  <span className="text-sm">🏛️</span>
                  <span><strong>Facturación Electrónica Directa SRI:</strong> Comprobante emitido sin intermediación por el establecimiento hotelero bajo normativa del SRI Ecuador.</span>
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
                  <span>Descargar Factura SRI (RIDE PDF)</span>
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
                  ✓ Factura SRI directa
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
      <h2 className="text-lg font-bold text-slate-800 mb-4" style={{ fontFamily: "DM Serif Display, serif" }}>Habitaciones disponibles</h2>
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
  const [maxPrice, setMaxPrice] = useState(200);
  const [sortBy, setSortBy] = useState<"price" | "rating">("rating");
  const nights = nightsBetween(params.checkIn, params.checkOut);
  let results = HOTELS.filter(h => {
    const d = !params.destination || h.city.toLowerCase().includes(params.destination.toLowerCase());
    const s = stars.length === 0 || stars.includes(h.stars);
    const p = h.priceFrom <= maxPrice;
    const c = h.rooms.some(r => r.capacity >= params.adults);
    return d && s && p && c;
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
        <aside className="w-52 flex-shrink-0 hidden lg:block space-y-4">
          <div className="rounded-xl p-4 border bg-white" style={{ borderColor: "#e2e8f0" }}>
            <h4 className="font-bold text-slate-700 text-sm mb-3">Categoría</h4>
            {[3, 2, 1].map(s => (
              <label key={s} className="flex items-center gap-2 mb-2 cursor-pointer">
                <input type="checkbox" className="accent-amber-400" checked={stars.includes(s)} onChange={() => setStars(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])} />
                <div className="flex gap-0.5">{Array.from({ length: s }).map((_, i) => <span key={i} style={{ color: "#f59e0b", fontSize: 12 }}>★</span>)}{Array.from({ length: 3 - s }).map((_, i) => <span key={i} style={{ color: "#d1d5db", fontSize: 12 }}>★</span>)}</div>
                <span className="text-xs text-slate-500">{s === 1 ? "Pensión" : s === 2 ? "Hostal" : "Hotel"}</span>
              </label>
            ))}
          </div>
          <div className="rounded-xl p-4 border bg-white" style={{ borderColor: "#e2e8f0" }}>
            <h4 className="font-bold text-slate-700 text-sm mb-3">Precio máx./noche</h4>
            <input type="range" min={30} max={200} value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} className="w-full accent-amber-400" />
            <div className="flex justify-between text-xs text-slate-400 mt-1"><span>$30</span><span className="font-semibold text-slate-600">${maxPrice}</span><span>$200</span></div>
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

function HomePage({ params, onChange, onSearch }: { params: SearchParams; onChange: (p: SearchParams) => void; onSearch: () => void }) {
  return (
    <div style={{ background: "#f8fafc" }}>
      <div className="relative" style={{ minHeight: 420 }}>
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #0c1220 0%, #1e3a5f 50%, #0f2744 100%)" }}>
          <img src="https://images.unsplash.com/photo-1722191847760-8426e74d4b3d?w=1400&h=600&fit=crop&auto=format" alt="" className="w-full h-full object-cover opacity-25" />
        </div>
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(12,18,32,0.3) 0%, rgba(12,18,32,0.75) 100%)" }} />
        <div className="relative max-w-5xl mx-auto px-4 pt-20 pb-10 text-center">
          <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-3">+2.000 hoteles · 1 a 3 estrellas · Toda España</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3 leading-tight" style={{ fontFamily: "DM Serif Display, serif" }}>Encuentra tu hotel perfecto</h1>
          <p className="text-white/70 text-base mb-8 max-w-lg mx-auto">Compara y reserva hoteles, hostales y pensiones. Sin comisiones ocultas, precio directo garantizado.</p>
          <div className="max-w-4xl mx-auto"><SearchBar params={params} onChange={onChange} onSearch={onSearch} /></div>
        </div>
      </div>
      <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0" }}>
        <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap gap-5 justify-center sm:justify-between">
          {[["🛡️", "Pago seguro"], ["✅", "Confirmación instantánea"], ["🔄", "Cancelación gratuita"], ["🏆", "Precio directo"], ["💬", "Soporte 24/7 en español"]].map(([icon, text]) => (
            <div key={text as string} className="flex items-center gap-1.5 text-xs font-medium text-slate-500"><span>{icon}</span>{text}</div>
          ))}
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h2 className="text-xl font-bold text-slate-800 mb-5" style={{ fontFamily: "DM Serif Display, serif" }}>Destinos populares</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-12">
          {DESTINATIONS.map(d => (
            <button key={d.city} onClick={() => { onChange({ ...params, destination: d.city }); onSearch(); }} className="relative rounded-xl overflow-hidden transition-transform hover:scale-105 hover:shadow-lg" style={{ height: 110 }}>
              <img src={d.img} alt={d.city} className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%)" }} />
              <div className="absolute bottom-0 left-0 right-0 p-2 text-left">
                <p className="text-white font-bold text-sm">{d.city}</p>
                <p className="text-white/70 text-[10px]">{d.hotels} hoteles</p>
              </div>
            </button>
          ))}
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-5" style={{ fontFamily: "DM Serif Display, serif" }}>Destacados</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {HOTELS.filter(h => h.rating >= 4.1).map(h => (
            <button key={h.id} onClick={() => { onChange({ ...params, destination: h.city }); onSearch(); }} className="rounded-2xl overflow-hidden border bg-white text-left hover:shadow-lg group transition-all" style={{ borderColor: "#e2e8f0" }}>
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
          {[["💰", "Sin comisiones ocultas", "Reserva directamente con el hotel. Lo que ves es lo que pagas."], ["⭐", "Solo alojamientos verificados", "Puntuaciones reales de huéspedes verificados."], ["📞", "Soporte en español", "Atención en español todos los días del año."]].map(([icon, title, desc]) => (
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
            <p className="font-bold text-white text-lg mb-1" style={{ fontFamily: "DM Serif Display, serif" }}>HotelDirekt</p>
            <p className="text-xs text-slate-400 max-w-xs">La plataforma líder en reservas de hoteles económicos en España.</p>
          </div>
          <div className="flex gap-10 text-xs text-slate-400">
            <div className="space-y-1.5"><p className="font-semibold text-slate-300 mb-2">Hoteles</p><p>Listar mi hotel</p><p>Área de propietarios</p></div>
            <div className="space-y-1.5"><p className="font-semibold text-slate-300 mb-2">Ayuda</p><p>Centro de ayuda</p><p>Política de cancelación</p><p>Contacto</p></div>
          </div>
        </div>
        <div className="border-t text-center py-3 text-[11px] text-slate-500" style={{ borderColor: "#334155" }}>© 2026 HotelDirekt · Plataforma de reservas hoteleras</div>
      </footer>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function GuestPage({ user, onGuestLogin, onLogout, onAdminAccess }: { user: GuestUser | null; onGuestLogin: (u: GuestUser) => void; onLogout: () => void; onAdminAccess?: () => void }) {
  const [view, setView] = useState<GuestView>("home");
  const [params, setParams] = useState<SearchParams>({ destination: "", checkIn: addDays(todayStr(), 1), checkOut: addDays(todayStr(), 3), adults: 2, children: 0 });
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [bookingRoom, setBookingRoom] = useState<RoomOffer | null>(null);
  const logoClickCount = useRef(0);
  const logoClickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleSearch() { setView("results"); setSelectedHotel(null); }
  function handleSelectHotel(h: Hotel) { setSelectedHotel(h); setView("hotel"); window.scrollTo({ top: 0 }); }

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
    logoClickTimer.current = setTimeout(() => { logoClickCount.current = 0; }, 2000);
  }

  return (
    <div className="min-h-screen" style={{ background: "#f8fafc" }}>
      {/* Nav */}
      <header className="sticky top-0 z-30 border-b" style={{ background: "#fff", borderColor: "#e2e8f0" }}>
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={handleLogoClick} className="flex items-center gap-2">
            <span className="font-bold text-xl" style={{ fontFamily: "DM Serif Display, serif", color: "#0c1220" }}>HotelDirekt</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: "#fef3c7", color: "#92400e" }}>BETA</span>
          </button>
          <div className="flex items-center gap-2">
            <a href="#" className="text-sm font-medium hidden sm:block text-slate-500 hover:text-slate-800 transition-colors">Para hoteles</a>
            {user ? (
              <>
                <button onClick={() => setView("account")} className={`text-sm font-semibold px-3 py-1.5 rounded-lg transition-all ${view === "account" ? "text-amber-700" : "text-slate-600"}`} style={{ background: view === "account" ? "#fef3c7" : "#f1f5f9" }}>
                  👤 {user.name.split(" ")[0]}
                </button>
                <button onClick={onLogout} className="text-xs text-slate-400 hover:text-slate-600 transition-colors">Salir</button>
              </>
            ) : (
              <button onClick={() => {}} className="text-xs font-bold px-3 py-1.5 rounded-lg hover:opacity-90 transition-all" style={{ background: "#0c1220", color: "#fff" }}>
                Iniciar sesión
              </button>
            )}
          </div>
        </div>
      </header>

      {view === "home" && <HomePage params={params} onChange={setParams} onSearch={handleSearch} />}
      {view === "results" && <ResultsView params={params} onChange={setParams} onSearch={handleSearch} onSelect={handleSelectHotel} />}
      {view === "hotel" && selectedHotel && <HotelDetail hotel={selectedHotel} params={params} onBack={() => setView("results")} onBook={r => setBookingRoom(r)} />}
      {view === "account" && user && <AccountView user={user} onLogout={onLogout} />}

      {bookingRoom && selectedHotel && (
        <BookingModal hotel={selectedHotel} room={bookingRoom} params={params} user={user} onClose={() => setBookingRoom(null)} onGuestLogin={onGuestLogin} />
      )}
    </div>
  );
}
