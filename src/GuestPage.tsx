import { useState, useRef, useEffect } from "react";
import type { GuestUser } from "./AuthPage";
import {
  HOTEL_COMMERCIAL_INFO,
  getActiveIvaPercent,
  getIvaDecretoConfig,
  addAuditLog,
  playNewBookingSound,
} from "./hotelData";
import {
  MANTA_HOTELS,
  INITIAL_DEMO_RESERVATIONS,
  type Hotel,
  type RoomOffer,
  type MyReservation,
} from "./mantaHotels";
import MantaMapModal from "./MantaMapModal";

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
  { city: "Manta - Barbasquillo", img: "https://images.unsplash.com/photo-1563629986-97c92e385f66?w=400&h=300&fit=crop&auto=format", hotels: 18, type: "Playa & Zona Hotelera" },
  { city: "Manta - El Murciélago", img: "https://images.unsplash.com/photo-1563273410-ca16d83b2cce?w=400&h=300&fit=crop&auto=format", hotels: 22, type: "Playa Urbana & Malecón" },
  { city: "Manta - Tarqui", img: "https://images.unsplash.com/photo-1704908327293-82e8a6026450?w=400&h=300&fit=crop&auto=format", hotels: 38, type: "Parroquia Urbana" },
  { city: "Manta - Santa Marianita", img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop&auto=format", hotels: 9, type: "Parroquia Rural · Kitesurf" },
  { city: "Manta - San Mateo", img: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=400&h=300&fit=crop&auto=format", hotels: 8, type: "Parroquia Urbana · Surf" },
  { city: "Manta - Los Esteros", img: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=300&fit=crop&auto=format", hotels: 15, type: "Parroquia Urbana" },
  { city: "Manta - San Lorenzo", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop&auto=format", hotels: 4, type: "Parroquia Rural · Pacoche" },
  { city: "Manta - Eloy Alfaro", img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop&auto=format", hotels: 2, type: "Parroquia Urbana" },
];

const MANTA_PARROQUIAS_OFICIALES = [
  { name: "Manta (Matriz)", query: "Manta", type: "Parroquia Urbana", desc: "Barbasquillo, El Murciélago, Malecón y Centro", count: 40, icon: "🏛️" },
  { name: "Tarqui", query: "Tarqui", type: "Parroquia Urbana", desc: "Playa de Tarqui, hotelería y comercio tradicional", count: 38, icon: "🏖️" },
  { name: "Los Esteros", query: "Los Esteros", type: "Parroquia Urbana", desc: "Zona costera, hoteles y playas del norte", count: 15, icon: "🌊" },
  { name: "San Mateo", query: "San Mateo", type: "Parroquia Urbana", desc: "Puerto pesquero artesanal, acantilados y surf", count: 8, icon: "⛵" },
  { name: "Santa Marianita", query: "Santa Marianita", type: "Parroquia Rural", desc: "Capital del kitesurf del Ecuador y playa amplia", count: 9, icon: "🪁" },
  { name: "San Lorenzo", query: "San Lorenzo", type: "Parroquia Rural", desc: "Reserva Marina de Pacoche, El Faro y senderos", count: 4, icon: "🌿" },
  { name: "Eloy Alfaro", query: "Eloy Alfaro", type: "Parroquia Urbana", desc: "Sector residencial y comercial del cantón", count: 2, icon: "🏘️" },
];

const MANTA_SECTORES_DESTACADOS = [
  { name: "Barbasquillo", query: "Barbasquillo", parroquia: "Parroquia Manta", desc: "Hoteles frente al mar, gastronomía y alta gama", count: 18, badge: "Exclusivo", icon: "🍸" },
  { name: "Playa El Murciélago", query: "El Murciélago", parroquia: "Parroquia Manta", desc: "Malecón escénico, playa urbana y vida nocturna", count: 22, badge: "Popular", icon: "🌴" },
  { name: "Playa Santa Marianita", query: "Santa Marianita", parroquia: "Parroquia Rural", desc: "Kitesurf, viento constante y mar abierto", count: 9, badge: "Kitesurf", icon: "🪁" },
  { name: "San Lorenzo & Pacoche", query: "San Lorenzo", parroquia: "Parroquia Rural", desc: "Naturaleza, bosque húmedo y playas vírgenes", count: 4, badge: "Ecoturismo", icon: "🐢" },
  { name: "Playa Tarqui", query: "Tarqui", parroquia: "Parroquia Tarqui", desc: "Gastronomía marina, mariscos y tradición", count: 38, badge: "Tradición", icon: "🐟" },
  { name: "Puerto San Mateo", query: "San Mateo", parroquia: "Parroquia San Mateo", desc: "Miradores marinos y surf sobre olas derechas", count: 8, badge: "Surf & Puerto", icon: "🌊" },
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
  hotelName,
  className = "",
  showToggle = true,
  defaultExpanded = false,
}: PriceBreakdownProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [ivaPct, setIvaPct] = useState<15 | 8>(() => getActiveIvaPercent());
  const decretoCfg = getIvaDecretoConfig();

  useEffect(() => {
    const syncIva = () => setIvaPct(getActiveIvaPercent());
    window.addEventListener("alojamanta-iva-change", syncIva);
    window.addEventListener("storage", syncIva);
    return () => {
      window.removeEventListener("alojamanta-iva-change", syncIva);
      window.removeEventListener("storage", syncIva);
    };
  }, []);

  const n = Math.max(nights, 1);
  const subtotal = Number((basePrice * n).toFixed(2));
  const iva = Number((subtotal * (ivaPct / 100)).toFixed(2));
  // El 10% de servicio turístico se calcula sobre el subtotal neto según Art. 41 Ley de Turismo
  const servicio = hasService10 ? Number((subtotal * 0.10).toFixed(2)) : 0;
  const totalImpuestos = Number((iva + servicio).toFixed(2));
  const totalPagar = Number((subtotal + totalImpuestos).toFixed(2));

  return (
    <div className={`rounded-xl border bg-white p-3.5 shadow-sm text-left transition-all ${className}`} style={{ borderColor: "#e2e8f0" }}>
      {/* Resumen de precio */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Desglose del precio</span>
            {ivaPct === 8 && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                IVA 8% tarifa feriado
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xs text-slate-500 font-medium">Precio</span>
            <span className="text-xl font-black text-slate-900 tracking-tight">US${subtotal.toFixed(2)}</span>
            {n > 1 && <span className="text-[11px] text-slate-400">({n} noches)</span>}
          </div>
          <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
            + US${totalImpuestos.toFixed(2)} de impuestos ({ivaPct}% IVA{hasService10 ? " + 10% Serv." : ""})
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
            <span>Detalle de impuestos y tasas</span>
          </div>

          <div className="rounded-lg p-3 bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-slate-700 text-[11px] pb-1.5 border-b border-slate-200">
              <span>Impuestos y cargos: US${totalImpuestos.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center text-slate-600">
              <span>
                {ivaPct}% IVA {ivaPct === 8 ? `(${decretoCfg.nombreFeriado})` : ""}
              </span>
              <span className={`font-mono font-medium ${ivaPct === 8 ? "text-emerald-700 font-bold" : ""}`}>US${iva.toFixed(2)}</span>
            </div>

            {hasService10 ? (
              <div className="flex justify-between items-center text-emerald-800 font-medium bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                <span>10% Servicio turístico</span>
                <span className="font-mono font-bold">US${servicio.toFixed(2)}</span>
              </div>
            ) : (
              <div className="flex justify-between items-center text-slate-400 italic text-[11px]">
                <span>10% Servicio turístico (no aplica)</span>
                <span className="font-mono">US$0.00</span>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center pt-1 font-bold text-slate-900 text-sm border-t border-slate-100">
            <span>Total a pagar</span>
            <span className="text-base font-black text-amber-600 font-mono">US${totalPagar.toFixed(2)}</span>
          </div>

          <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900 leading-tight">
            <div>
              <strong>Voucher digital de reserva:</strong> Emitido con tu código de confirmación al validar el pago. Preséntalo a tu llegada a {hotelName ? <strong>{hotelName}</strong> : "el alojamiento"}.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Search bar ───────────────────────────────────────────────────────────────

function SearchBar({
  params,
  onChange,
  onSearch,
  variant = "hero",
}: {
  params: SearchParams;
  onChange: (p: SearchParams) => void;
  onSearch: () => void;
  variant?: "hero" | "sticky";
}) {
  const [isPopOpen, setIsPopOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"parroquias" | "sectores" | "todo">("parroquias");
  const popoverRef = useRef<HTMLDivElement>(null);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsPopOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelectDestination(destQuery: string) {
    onChange({ ...params, destination: destQuery });
    setIsPopOpen(false);
  }

  function handleClear() {
    onChange({ ...params, destination: "" });
    setIsPopOpen(false);
  }

  return (
    <div
      className={`w-full max-w-full flex flex-col md:flex-row gap-2.5 md:items-end ${
        variant === "hero"
          ? "p-3 sm:p-4 rounded-2xl bg-white shadow-xl shadow-slate-900/10 border border-slate-200/90"
          : "p-2.5 rounded-2xl border border-slate-200 bg-white shadow-xs"
      }`}
      style={{ borderColor: variant === "sticky" ? "#e2e8f0" : undefined }}
    >
      {/* ─── Selector de Destino Moderno (Solid Clean Popover) ─── */}
      <div className="flex-1 min-w-0 relative" ref={popoverRef}>
        <div className="mb-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
            <span>📍</span>
            <span>¿A dónde vas en Manta?</span>
          </label>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <span className="text-sm">🔍</span>
          </div>

          <input
            type="text"
            value={params.destination}
            onFocus={() => setIsPopOpen(true)}
            onClick={() => setIsPopOpen(true)}
            onChange={e => {
              onChange({ ...params, destination: e.target.value });
              if (!isPopOpen) setIsPopOpen(true);
            }}
            onKeyDown={e => {
              if (e.key === "Enter") {
                setIsPopOpen(false);
                onSearch();
              } else if (e.key === "Escape") {
                setIsPopOpen(false);
              }
            }}
            placeholder="Parroquia, playa o sector de Manta..."
            className="w-full pl-8 pr-8 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white focus:bg-white text-sm font-semibold text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:ring-2 focus:ring-amber-500/25 focus:border-amber-400 cursor-pointer shadow-2xs"
          />

          {params.destination && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer text-xs font-bold"
              title="Borrar filtro de destino"
            >
              ✕
            </button>
          )}
        </div>

        {/* ─── Modern Travel Explorer Popover (Airbnb Style: 100% Light, Espacioso y Visual) ─── */}
        {isPopOpen && (
          <div
            className="absolute left-0 top-full mt-2 w-full sm:w-[500px] max-w-[96vw] rounded-2xl bg-white border border-slate-200/90 shadow-2xl shadow-slate-900/15 z-50 overflow-hidden text-left animate-in fade-in zoom-in-95 duration-150"
          >
            {/* Header Amigable y Luminoso (Sin barras negras) */}
            <div className="px-4 pt-3.5 pb-2.5 bg-white border-b border-slate-100 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">🧭</span>
                  <h4 className="font-bold text-xs text-slate-900">Explora Manta por zona</h4>
                  <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    116 alojamientos
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Elige una parroquia oficial o una playa turística destacada
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsPopOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 text-xs flex items-center justify-center cursor-pointer transition-colors"
                title="Cerrar"
              >
                ✕
              </button>
            </div>

            {/* Banner Destacado: Abrir Mapa Real */}
            <div className="p-3 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-xl mb-2.5 flex items-center justify-between shadow-xs border border-slate-700/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center text-base shrink-0 font-bold">
                  🗺️
                </div>
                <div>
                  <p className="font-bold text-xs text-white leading-tight">Mapa Geográfico del Cantón</p>
                  <p className="text-[10px] text-slate-300">Explora las 7 parroquias en el mapa interactivo real</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsPopOpen(false);
                  setIsMapModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-all cursor-pointer shrink-0 shadow-xs flex items-center gap-1 hover:scale-105"
              >
                <span>Abrir Mapa</span>
                <span>↗</span>
              </button>
            </div>

            {/* Chips de Categoría Rápidos */}
            <div className="px-4 py-2 bg-slate-50/70 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
              <button
                type="button"
                onClick={() => {
                  setIsPopOpen(false);
                  setIsMapModalOpen(true);
                }}
                className="py-1 px-3 rounded-full whitespace-nowrap transition-all cursor-pointer font-bold flex items-center gap-1.5 text-[11px] bg-amber-500 text-slate-950 shadow-xs hover:bg-amber-400"
              >
                <span>🗺️</span>
                <span>Ver Mapa Interactivo</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("parroquias")}
                className={`py-1 px-2.5 rounded-full whitespace-nowrap transition-all cursor-pointer font-semibold flex items-center gap-1 text-[11px] ${
                  activeTab === "parroquias"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                <span>🏛️</span>
                <span>7 Parroquias Oficiales</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("sectores")}
                className={`py-1 px-2.5 rounded-full whitespace-nowrap transition-all cursor-pointer font-semibold flex items-center gap-1 text-[11px] ${
                  activeTab === "sectores"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                <span>🏖️</span>
                <span>Playas & Sectores</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("todo")}
                className={`py-1 px-2.5 rounded-full whitespace-nowrap transition-all cursor-pointer font-semibold flex items-center gap-1 text-[11px] ${
                  activeTab === "todo"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                <span>⭐</span>
                <span>Todo Manta</span>
              </button>
            </div>

            {/* Contenido según pestaña */}
            <div className="max-h-80 overflow-y-auto p-3 text-xs">
              {/* Pestaña 1: Parroquias Oficiales en Cuadrícula */}
              {activeTab === "parroquias" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {MANTA_PARROQUIAS_OFICIALES.map(p => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => handleSelectDestination(p.query)}
                      className="p-2.5 rounded-xl border border-slate-150 hover:border-amber-300 bg-white hover:bg-amber-50/40 text-left transition-all cursor-pointer group flex flex-col justify-between hover:shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-1 mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-base group-hover:scale-110 transition-transform">{p.icon}</span>
                          <span className="font-bold text-slate-900 text-xs group-hover:text-amber-900">
                            {p.name}
                          </span>
                        </div>
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded-md">
                          {p.count} hot.
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-1 text-[10px]">
                        <span className="text-slate-500 truncate max-w-[160px]">{p.desc}</span>
                        <span
                          className={`text-[8px] font-bold px-1.5 py-0.2 rounded uppercase shrink-0 ${
                            p.type.includes("Rural")
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : "bg-blue-50 text-blue-800 border border-blue-200"
                          }`}
                        >
                          {p.type.includes("Rural") ? "Rural" : "Urbana"}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Pestaña 2: Playas y Sectores Destacados en Cuadrícula */}
              {activeTab === "sectores" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {MANTA_SECTORES_DESTACADOS.map(s => (
                    <button
                      key={s.name}
                      type="button"
                      onClick={() => handleSelectDestination(s.query)}
                      className="p-2.5 rounded-xl border border-slate-150 hover:border-amber-300 bg-white hover:bg-amber-50/40 text-left transition-all cursor-pointer group flex flex-col justify-between hover:shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-1 mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-base group-hover:scale-110 transition-transform">{s.icon}</span>
                          <span className="font-bold text-slate-900 text-xs group-hover:text-amber-900">
                            {s.name}
                          </span>
                        </div>
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded-md">
                          {s.count} hot.
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-1 text-[10px]">
                        <span className="text-slate-500 truncate max-w-[160px]">{s.desc}</span>
                        <span className="text-[8px] font-bold px-1.5 py-0.2 rounded uppercase shrink-0 bg-amber-50 text-amber-800 border border-amber-200">
                          {s.badge}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Pestaña 3: Todo el Cantón */}
              {activeTab === "todo" && (
                <div className="p-4 text-center space-y-2 bg-slate-50/70 rounded-xl border border-slate-150">
                  <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center text-xl mx-auto shadow-2xs">
                    🌊
                  </div>
                  <p className="font-bold text-slate-900 text-xs">Catálogo Completo de Manta</p>
                  <p className="text-[11px] text-slate-500 max-w-xs mx-auto leading-relaxed">
                    Visualiza los 116 hoteles, hostales y hosterías registrados en las 7 parroquias del cantón.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleSelectDestination("")}
                    className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer transition-colors shadow-xs"
                  >
                    Ver los 116 Alojamientos de Manta
                  </button>
                </div>
              )}
            </div>

            {/* Pie del Popover */}
            <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
              <span>💡 También puedes escribir directamente el nombre del sector</span>
              {params.destination && (
                <button
                  type="button"
                  onClick={() => {
                    onChange({ ...params, destination: "" });
                    setIsPopOpen(false);
                  }}
                  className="text-amber-700 hover:underline font-semibold cursor-pointer"
                >
                  Limpiar filtro
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ─── Fechas (Llegada & Salida) ─── */}
      <div className="grid grid-cols-2 gap-2 md:flex md:gap-2">
        <div className="min-w-0 sm:w-32">
          <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-slate-500 text-left flex items-center gap-1">
            <span>📅</span>
            <span>Llegada</span>
          </label>
          <input
            type="date"
            className="w-full px-2.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white focus:bg-white text-xs sm:text-sm font-semibold outline-none text-slate-800 focus:ring-2 focus:ring-amber-500/25 focus:border-amber-400 transition-all cursor-pointer shadow-2xs"
            style={{ colorScheme: "light" }}
            value={params.checkIn}
            min={todayStr()}
            onChange={e =>
              onChange({
                ...params,
                checkIn: e.target.value,
                checkOut: params.checkOut && e.target.value >= params.checkOut ? addDays(e.target.value, 1) : params.checkOut,
              })
            }
          />
        </div>

        <div className="min-w-0 sm:w-32">
          <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-slate-500 text-left flex items-center gap-1">
            <span>📅</span>
            <span>Salida</span>
          </label>
          <input
            type="date"
            className="w-full px-2.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white focus:bg-white text-xs sm:text-sm font-semibold outline-none text-slate-800 focus:ring-2 focus:ring-amber-500/25 focus:border-amber-400 transition-all cursor-pointer shadow-2xs"
            style={{ colorScheme: "light" }}
            value={params.checkOut}
            min={params.checkIn ? addDays(params.checkIn, 1) : addDays(todayStr(), 1)}
            onChange={e => onChange({ ...params, checkOut: e.target.value })}
          />
        </div>
      </div>

      {/* ─── Huéspedes ─── */}
      <div className="min-w-0 md:w-32">
        <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-slate-500 text-left flex items-center gap-1">
          <span>👥</span>
          <span>Huéspedes</span>
        </label>
        <select
          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white focus:bg-white text-sm font-semibold outline-none text-slate-800 focus:ring-2 focus:ring-amber-500/25 focus:border-amber-400 transition-all cursor-pointer shadow-2xs"
          value={params.adults}
          onChange={e => onChange({ ...params, adults: Number(e.target.value) })}
        >
          {[1, 2, 3, 4, 5, 6].map(n => (
            <option key={n} value={n}>
              {n} adulto{n > 1 ? "s" : ""}
            </option>
          ))}
        </select>
      </div>

      {/* ─── Botón de Búsqueda Moderno ─── */}
      <button
        type="button"
        onClick={() => {
          setIsPopOpen(false);
          onSearch();
        }}
        className="w-full md:w-auto px-7 py-2.5 rounded-xl font-black text-sm transition-all whitespace-nowrap cursor-pointer text-center bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 shrink-0 flex items-center justify-center gap-1.5"
      >
        <span>🔍</span>
        <span>Buscar Hoteles</span>
      </button>

      {/* ─── Modal de Mapa Geográfico Real (Leaflet / CartoDB) ─── */}
      <MantaMapModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        onSelectDestination={handleSelectDestination}
        hotels={HOTELS}
      />
    </div>
  );
}

// ─── Invoice modal ────────────────────────────────────────────────────────────

export function InvoiceModal({ res, onClose }: { res: MyReservation; onClose: () => void }) {
  // Buscar datos comerciales del hotel en Manta
  const hotelKey = Object.keys(HOTEL_COMMERCIAL_INFO).find(k => 
    res.hotel.toLowerCase().includes(k.replace(/-/g, " ")) || 
    HOTEL_COMMERCIAL_INFO[k].nombreComercial.toLowerCase().includes(res.hotel.toLowerCase())
  ) || "costa-sol";
  const hotelMeta = HOTEL_COMMERCIAL_INFO[hotelKey] || HOTEL_COMMERCIAL_INFO["costa-sol"];

  const hasServicio = hotelMeta.gravaServicio10 ?? (res.hotel.includes("Costa Sol") || res.hotel.includes("Palmeras") || res.hotel.includes("Pacífico") || res.hotel.toLowerCase().includes("hotel"));
  const ivaPct = getActiveIvaPercent();
  const divisor = 1 + (ivaPct / 100) + (hasServicio ? 0.10 : 0);
  const base = res.total / divisor;
  const iva = base * (ivaPct / 100);
  const servicio = hasServicio ? base * 0.10 : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-md rounded-2xl border overflow-hidden shadow-2xl" style={{ background: "#fff" }}>
        <div className="px-6 py-5 border-b" style={{ borderColor: "#e2e8f0", background: "#0c1220" }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-bold text-amber-400 text-lg" style={{ fontFamily: "DM Serif Display, serif" }}>{hotelMeta.nombreComercial}</p>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-mono px-1.5 py-0.5 rounded border border-emerald-500/30">RESERVA GARANTIZADA</span>
              </div>
              <p className="text-xs text-slate-300">{hotelMeta.razonSocial}</p>
              <p className="text-[10px] text-slate-400 font-mono">RUC: {hotelMeta.ruc} · Manta, Manabí</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">VOUCHER DIGITAL</span>
              <p className="font-mono font-bold text-slate-100 text-xs mt-1">REC-{res.id}</p>
              <p className="text-[10px] text-slate-400">Entrada: {fmtDateShort(res.checkIn)}</p>
            </div>
          </div>
        </div>

        <div className="p-3 bg-blue-50 border-b border-blue-200 text-[11px] text-blue-900">
          <span><strong>Voucher Digital de Reserva:</strong> Certifica tu reserva garantizada y pago en línea. Presenta tu código de reserva en {hotelMeta.nombreComercial} a tu llegada.</span>
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
                  <td className="px-4 py-2.5"><p className="font-medium text-slate-700">{res.room}</p><p className="text-xs text-slate-400">{res.nights} noche{res.nights > 1 ? "s" : ""} · Entrada {fmtDateShort(res.checkIn)} → Salida {fmtDateShort(res.checkOut)}</p></td>
                  <td className="px-4 py-2.5 text-right font-medium text-slate-700">{fmt(base)}</td>
                </tr>
                <tr style={{ borderTop: "1px solid #e2e8f0", background: "#f8fafc" }}>
                  <td className="px-4 py-2 text-xs text-slate-500">IVA ({ivaPct}% {ivaPct === 8 ? "Decreto Feriado Turístico" : "Tarifa Ordinaria"})</td>
                  <td className="px-4 py-2 text-right text-xs text-slate-500">{fmt(iva)}</td>
                </tr>
                {hasServicio ? (
                  <tr style={{ background: "#f8fafc" }}>
                    <td className="px-4 py-2 text-xs text-emerald-600 font-medium">10% Servicio Turístico (Art. 41 Ley Turismo)</td>
                    <td className="px-4 py-2 text-right text-xs text-emerald-600 font-bold">{fmt(servicio)}</td>
                  </tr>
                ) : (
                  <tr style={{ background: "#f8fafc" }}>
                    <td className="px-4 py-2 text-xs text-slate-400 italic">10% Servicio Turístico (Hostal exento)</td>
                    <td className="px-4 py-2 text-right text-xs text-slate-400">$0.00</td>
                  </tr>
                )}
                <tr style={{ borderTop: "1px solid #e2e8f0" }}>
                  <td className="px-4 py-3 font-bold text-slate-800">Total Liquidado</td>
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
}: {
  user: GuestUser;
  reservations: MyReservation[];
  onLogout: () => void;
  onCancelReservation: (id: string) => void;
  onViewVoucher: (res: MyReservation) => void;
  onBack?: () => void;
  initialTab?: "hub" | "reservations" | "personal" | "billing" | "payments" | "about";
}) {
  const [activeTab, setActiveTab] = useState<"hub" | "reservations" | "personal" | "billing" | "payments" | "about">(initialTab);
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
      // Datos de contacto para comprobante
      wantsInvoice: true,
      taxId: "1314589201001",
      razonSocial: user.name,
      direccionFiscal: "Av. Malecón y Calle 15, Edif. Poseidón",
      correoComprobante: user.email,
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
    showToast("Datos de perfil guardados para tus reservas");
  }

  function handleSaveBilling(e: React.FormEvent) {
    e.preventDefault();
    try {
      localStorage.setItem(`alojamanta_profile_${user.email}`, JSON.stringify(profile));
    } catch {}
    showToast("✓ Datos de contacto y comprobante actualizados");
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
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                  ✓ Cuenta Verificada
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
            { id: "hub", label: "Inicio" },
            { id: "reservations", label: `Mis Reservas (${allList.length})` },
            { id: "personal", label: "Datos personales" },
            { id: "billing", label: "Comprobantes" },
            { id: "payments", label: "Medios de pago" },
            { id: "about", label: "Información" },
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
                <h3 className="font-bold text-slate-900 text-base">
                  Estancias y viajes
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
                  <span className="text-slate-700 font-medium group-hover:text-amber-600">Vouchers y comprobantes de reserva</span>
                  <span className="text-slate-400 group-hover:translate-x-1 transition-transform">→</span>
                </button>
                <button
                  onClick={onBack}
                  className="w-full py-2.5 flex items-center justify-between text-left hover:text-amber-600 transition-colors cursor-pointer group"
                >
                  <span className="text-slate-700 font-medium group-hover:text-amber-600">Explorar alojamientos en Manta</span>
                  <span className="text-slate-400 group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </div>

            {/* Card 2: Gestión de la cuenta y Llegada */}
            <div className="rounded-2xl border bg-white p-5 hover:shadow-md transition-shadow" style={{ borderColor: "#e2e8f0" }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 text-base">
                  Datos del titular
                </h3>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Llegada ágil
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

            {/* Card 3: Comprobantes y Contacto */}
            <div className="rounded-2xl border bg-white p-5 hover:shadow-md transition-shadow" style={{ borderColor: "#e2e8f0" }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 text-base">
                  Comprobantes de pago
                </h3>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  Comprobante de Reserva
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
                <h3 className="font-bold text-slate-900 text-base">
                  Cobro y pagos
                </h3>
                <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                  Digital seguro
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

            {/* Card 5: Acerca de AlojaManta */}
            <div className="rounded-2xl border bg-white p-5 hover:shadow-md transition-shadow" style={{ borderColor: "#e2e8f0" }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 text-base">
                  Acerca de AlojaManta
                </h3>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                  Red Manta
                </span>
              </div>
              <div className="space-y-1 divide-y divide-slate-100 text-xs">
                <button
                  onClick={() => setActiveTab("about")}
                  className="w-full py-2.5 flex items-center justify-between text-left hover:text-amber-600 transition-colors cursor-pointer group"
                >
                  <span className="text-slate-700 font-medium group-hover:text-amber-600">116 Alojamientos catastrados y validados</span>
                  <span className="text-slate-400 group-hover:translate-x-1 transition-transform">→</span>
                </button>
                <button
                  onClick={() => setActiveTab("about")}
                  className="w-full py-2.5 flex items-center justify-between text-left hover:text-amber-600 transition-colors cursor-pointer group"
                >
                  <span className="text-slate-700 font-medium group-hover:text-amber-600">Modelo directo sin comisiones abusivas</span>
                  <span className="text-slate-400 group-hover:translate-x-1 transition-transform">→</span>
                </button>
                <button
                  onClick={() => setActiveTab("billing")}
                  className="w-full py-2.5 flex items-center justify-between text-left hover:text-amber-600 transition-colors cursor-pointer group"
                >
                  <span className="text-slate-700 font-medium group-hover:text-amber-600">Comprobantes digitales y liquidación de reserva</span>
                  <span className="text-slate-400 group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </div>

            {/* Card 6: Atención y Asistencia al Huésped */}
            <div className="rounded-2xl border bg-white p-5 hover:shadow-md transition-shadow" style={{ borderColor: "#e2e8f0" }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 text-base">
                  Asistencia al huésped
                </h3>
                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  Cantón Manta
                </span>
              </div>
              <div className="space-y-1 divide-y divide-slate-100 text-xs">
                <a
                  href="https://wa.me/593998765432?text=Hola%2C%20requiero%20asistencia%20en%20AlojaManta"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 flex items-center justify-between text-left hover:text-emerald-600 transition-colors cursor-pointer group"
                >
                  <span className="text-slate-700 font-medium group-hover:text-emerald-600">WhatsApp Manta: +593 99 876 5432</span>
                  <span className="text-emerald-600 font-bold group-hover:translate-x-1 transition-transform">💬</span>
                </a>
                <a
                  href="tel:+59352628900"
                  className="py-2.5 flex items-center justify-between text-left hover:text-amber-600 transition-colors cursor-pointer group"
                >
                  <span className="text-slate-700 font-medium group-hover:text-amber-600">Línea Cantonal: +593 5 262 8900</span>
                  <span className="text-amber-600 font-bold group-hover:translate-x-1 transition-transform">📞</span>
                </a>
                <button
                  onClick={() => setActiveTab("reservations")}
                  className="w-full py-2.5 flex items-center justify-between text-left hover:text-amber-600 transition-colors cursor-pointer group"
                >
                  <span className="text-slate-700 font-medium group-hover:text-amber-600">Consultar reservas y comprobantes</span>
                  <span className="text-slate-400 group-hover:translate-x-1 transition-transform">→</span>
                </button>
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

      {/* ─── TAB 3: DATOS PERSONALES ─── */}
      {activeTab === "personal" && (
        <form onSubmit={handleSaveProfile} className="rounded-2xl border bg-white p-6 shadow-xs max-w-2xl" style={{ borderColor: "#e2e8f0" }}>
          <div className="border-b pb-4 mb-5" style={{ borderColor: "#f1f5f9" }}>
            <h3 className="font-bold text-slate-900 text-lg" style={{ fontFamily: "DM Serif Display, serif" }}>
              Datos Personales del Huésped
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Esta información agiliza la validación de tu reserva en la recepción de los hoteles de Manta.
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

      {/* ─── TAB 4: COMPROBANTES Y CONTACTO ─── */}
      {activeTab === "billing" && (
        <form onSubmit={handleSaveBilling} className="rounded-2xl border bg-white p-6 shadow-xs max-w-2xl" style={{ borderColor: "#e2e8f0" }}>
          <div className="border-b pb-4 mb-5" style={{ borderColor: "#f1f5f9" }}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2" style={{ fontFamily: "DM Serif Display, serif" }}>
                <span>🏛️</span>
                <span>Datos del Huésped y Comprobante de Reserva</span>
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-300">
                15% IVA
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              <strong>El establecimiento recibe tus datos verificados para agilizar la validación de tu reserva.</strong> Guarda aquí tus datos para que el hotel emita tus comprobantes de estancia a tu nombre o empresa.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
              <span className="text-base">ℹ️</span>
              <p>
                La plataforma de reserva procesa el cobro del anticipo y transfiere el importe neto al alojamiento. El hotel entrega tu comprobante de estancia y registro al momento de tu llegada.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Cédula o Pasaporte del Huésped</label>
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
              <label className="block text-xs font-bold text-slate-700 mb-1">Correo para Envío de Comprobante</label>
              <input
                type="email"
                value={profile.correoComprobante}
                onChange={e => setProfile({ ...profile, correoComprobante: e.target.value })}
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
                Guardar Datos de Reserva
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
                  <p className="text-[10px] text-slate-400">Cobro instantáneo por app móvil sin comisiones extra</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">Disponible</span>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 6: ACERCA DE ALOJAMANTA ─── */}
      {activeTab === "about" && (
        <div className="rounded-2xl border bg-white p-6 sm:p-8 shadow-xs max-w-3xl space-y-6" style={{ borderColor: "#e2e8f0" }}>
          <div className="border-b pb-5" style={{ borderColor: "#f1f5f9" }}>
            <div className="flex items-center gap-3">
              <span className="text-3xl">ℹ️</span>
              <div>
                <h3 className="font-bold text-slate-900 text-xl sm:text-2xl" style={{ fontFamily: "DM Serif Display, serif" }}>
                  Acerca de AlojaManta
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Red oficial de comercialización directa y formalización hotelera del Cantón Manta.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-slate-800">
              <h4 className="font-bold text-amber-950 text-sm mb-1 flex items-center gap-1.5">
                <span>🏛️</span>
                <span>Iniciativa Turística Cantonal de Hospedaje Formal</span>
              </h4>
              <p>
                <strong>AlojaManta</strong> es la plataforma tecnológica desarrollada para articular de forma transparente la oferta de alojamiento formal en la ciudad y cantón de Manta, Manabí, conectando a huéspedes nacionales y extranjeros directamente con los establecimientos de hospedaje.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/80">
                <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                  <span className="text-base">🏨</span>
                  <span>116 Alojamientos Catastrados</span>
                </div>
                <p className="text-xs text-slate-600">
                  Integra hoteles, hostales, hosterías y residencias turísticas legalmente registradas e inspeccionadas en Barbasquillo, El Murciélago, Tarqui, Los Esteros, San Mateo y Santa Marianita.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/80">
                <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                  <span className="text-base">💰</span>
                  <span>0% Sobreprecio de Intermediarios</span>
                </div>
                <p className="text-xs text-slate-600">
                  Elimina el sobreprecio del 18% al 20% habitual de las agencias de viajes online (OTAs) internacionales. La tarifa que pagas va íntegramente a dinamizar el sector hotelero local.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/80">
                <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                  <span className="text-base">🏛️</span>
                  <span>Comprobante de Reserva y Liquidación</span>
                </div>
                <p className="text-xs text-slate-600">
                  El comprobante digital con 15% de IVA y confirmación inmediata es emitido por la plataforma al momento de tu reserva online.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/80">
                <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                  <span className="text-base">📱</span>
                  <span>Confirmación Digital Inmediata</span>
                </div>
                <p className="text-xs text-slate-600">
                  Cada reserva genera un voucher oficial con código de confirmación y token de verificación instantáneo para recepción sin trámites engorrosos ni papeleo innecesario.
                </p>
              </div>
            </div>

            <div className="border-t pt-4 border-slate-100">
              <h4 className="font-bold text-slate-800 text-xs sm:text-sm mb-1.5">Compromiso con el Huésped y la Ciudad</h4>
              <p className="text-xs text-slate-500">
                Al reservar mediante AlojaManta, aseguras un trato directo con los anfitriones y hoteleros de Manta, políticas de cancelación claras, seguridad en tus pagos digitales y el respaldo de establecimientos que cumplen con los estándares de hospitalidad del puerto manabita.
              </p>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => setActiveTab("hub")}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer"
              >
                ← Volver al Panel
              </button>
              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-xs cursor-pointer transition-colors"
                >
                  Explorar Alojamientos Disponibles →
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Modal Acerca de AlojaManta ───────────────────────────────────────────────

function AboutModal({
  onClose,
  onExplore,
}: {
  onClose: () => void;
  onExplore?: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(5px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-2xl rounded-2xl border bg-white overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150" style={{ borderColor: "#e2e8f0" }}>
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ background: "#ffffff", borderColor: "#e2e8f0" }}>
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">ℹ️</span>
            <div>
              <h3 className="font-bold text-slate-900 text-lg" style={{ fontFamily: "DM Serif Display, serif" }}>
                Acerca de AlojaManta
              </h3>
              <p className="text-xs text-slate-500">
                Red oficial de reservas directas y formalización hotelera del Cantón Manta
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer text-sm"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-600 leading-relaxed">
          {/* Banner */}
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-slate-800">
            <h4 className="font-bold text-amber-950 text-sm mb-1 flex items-center gap-1.5">
              <span>🏛️</span>
              <span>Iniciativa Turística y Comercial Cantonal</span>
            </h4>
            <p>
              <strong>AlojaManta</strong> nace como el ecosistema digital directo para que los visitantes puedan reservar con total seguridad en la planta hotelera formal del cantón Manta (Manabí, Ecuador), sin pagar sobreprecios a intermediarios internacionales.
            </p>
          </div>

          {/* 4 Pilares clave */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70">
              <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                <span className="text-base">🏨</span>
                <span>116 Establecimientos Registrados</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Catastro completo de hoteles, hostales, hosterías y departamentos en Barbasquillo, El Murciélago, Tarqui, Los Esteros, San Mateo y Santa Marianita.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70">
              <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                <span className="text-base">💰</span>
                <span>0% Comisión de Intermediación (OTA)</span>
              </div>
              <p className="text-[11px] text-slate-600">
                A diferencia de portales foráneos que cobran entre el 18% y 20% al hotelero, aquí se garantiza la tarifa más competitiva y el dinero dinamiza directamente la economía local.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70">
              <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                <span className="text-base">🏛️</span>
                <span>Comprobante Oficial de Reserva</span>
              </div>
              <p className="text-[11px] text-slate-600">
                El comprobante oficial con 15% de IVA y detalle de reserva certifica tu estancia y pago anticipado.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70">
              <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                <span className="text-base">📲</span>
                <span>Vouchers con Código de Confirmación</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Confirmación instantánea con código de reserva único descargable en PDF o guardado en tu cuenta para un registro ágil en recepción.
              </p>
            </div>
          </div>

          {/* Contacto Directo */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="font-bold text-slate-900 text-xs">Mesa de Asistencia Turística Manta</p>
              <p className="text-[11px] text-slate-500">Atención directa para consultas de reserva y orientación en el cantón.</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a
                href="https://wa.me/593998765432?text=Hola%2C%20quisiera%20m%C3%A1s%20informaci%C3%B3n%20sobre%20AlojaManta"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 transition-colors"
              >
                <span>💬</span>
                <span>WhatsApp</span>
              </a>
              <a
                href="tel:+59352628900"
                className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1 transition-colors"
              >
                <span>📞</span>
                <span>Llamar</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t bg-slate-50 flex items-center justify-between text-xs" style={{ borderColor: "#e2e8f0" }}>
          <span className="text-slate-400">Cantón Manta · Manabí · Ecuador</span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-100 cursor-pointer"
            >
              Cerrar
            </button>
            {onExplore && (
              <button
                onClick={onExplore}
                className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg cursor-pointer transition-colors shadow-2xs"
              >
                Explorar Hoteles
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Modal Términos y Privacidad LOPDP ────────────────────────────────────────────

function LegalModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(5px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-2xl rounded-2xl border bg-white overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150" style={{ borderColor: "#e2e8f0" }}>
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ background: "#ffffff", borderColor: "#e2e8f0" }}>
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🏛️</span>
            <div>
              <h3 className="font-bold text-slate-900 text-lg" style={{ fontFamily: "DM Serif Display, serif" }}>
                Términos del Servicio y Privacidad LOPDP
              </h3>
              <p className="text-xs text-slate-500">
                Normativa tributaria y condiciones de reserva en AlojaManta
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer text-sm"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-600 leading-relaxed">
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-slate-800">
            <h4 className="font-bold text-blue-950 text-sm mb-1 flex items-center gap-1.5">
              <span>🧾</span>
              <span>Comprobante Digital de Reserva y Pagos</span>
            </h4>
            <p>
              La plataforma emite el comprobante de reserva y certificación de pago digital con el desglose del 15% de IVA. El establecimiento hotelero entrega el recibo y comprobante de estancia directamente presentando tu código de reserva a la llegada.
            </p>
          </div>

          <div className="space-y-3">
            <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/50">
              <h5 className="font-bold text-slate-900 mb-1">1. Datos Tributarios Requeridos</h5>
              <p className="text-[11px] text-slate-600">
                Puedes registrar previamente tu documento de identidad, nombres completos y correo electrónico desde la pestaña "Comprobantes y Contacto" de tu cuenta para agilizar tu registro en recepción.
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/50">
              <h5 className="font-bold text-slate-900 mb-1">2. Cancelación y Modificaciones</h5>
              <p className="text-[11px] text-slate-600">
                Las políticas de cancelación son transparentes y fijadas por cada establecimiento. Puedes anular o reprogramar tu estancia directamente desde "Mis Reservas" o comunicándote con el hotel a través de los canales de asistencia autorizados.
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/50">
              <h5 className="font-bold text-slate-900 mb-1">3. Protección y Privacidad de Datos</h5>
              <p className="text-[11px] text-slate-600">
                Tus datos personales y de pago se procesan bajo protocolos cifrados y no son compartidos con terceros comerciales ajenos a la estancia hotelera contratada.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t bg-slate-50 flex items-center justify-end text-xs" style={{ borderColor: "#e2e8f0" }}>
          <button
            onClick={onClose}
            className="px-5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg cursor-pointer transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
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
                  { role: "Recepcionista Mostrador", name: "Juan Recepción", email: "recepcion@mantahost.ec", desc: "Operación de reservas y comprobantes digitales" },
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
  const nights = Math.max(nightsBetween(params.checkIn, params.checkOut), 1);

  // RF-04: Planes de Tarifa
  const [ratePlan, setRatePlan] = useState<"flexible" | "non_refundable" | "breakfast_plus">("flexible");
  // RF-06: Extras y Servicios Adicionales de Alojamiento
  const [selectedExtras, setSelectedExtras] = useState<{
    airport: boolean;
    extrabed: boolean;
    crib: boolean;
    lateout: boolean;
  }>({ airport: false, extrabed: false, crib: false, lateout: false });

  const effectiveNightlyRate =
    ratePlan === "non_refundable"
      ? Math.round(room.pricePerNight * 0.90 * 100) / 100
      : ratePlan === "breakfast_plus" && !room.breakfastIncluded
      ? room.pricePerNight + 8
      : room.pricePerNight;

  const extrasTotal =
    (selectedExtras.airport ? 15 : 0) +
    (selectedExtras.extrabed ? 20 : 0) +
    (selectedExtras.lateout ? 15 : 0);

  const roomBase = parseFloat((effectiveNightlyRate * nights).toFixed(2));
  const base = parseFloat((roomBase + extrasTotal).toFixed(2));
  const ivaPct = getActiveIvaPercent(hotel.id);
  const iva = parseFloat((base * (ivaPct / 100)).toFixed(2));
  const hasService = hotel.gravaServicio10 ?? false;
  const servicio = hasService ? parseFloat((base * 0.10).toFixed(2)) : 0;
  const total = parseFloat((base + iva + servicio).toFixed(2));

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
  const [docType, setDocType] = useState<"CEDULA" | "RUC" | "PASAPORTE">("CEDULA");
  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: "",
    dni: "",
    razonSocial: "",
    country: "Ecuador",
    city: "Manta",
    address: "",
    notes: "",
  });

  // Card
  const [cardHolder, setCardHolder] = useState(user?.name ?? "");
  const [cardNum, setCardNum] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [saveCard, setSaveCard] = useState(false);

  const hotelMeta = HOTEL_COMMERCIAL_INFO[hotel.id] || HOTEL_COMMERCIAL_INFO["costa-sol"];
  const [resId] = useState(`RES-${Math.floor(Math.random() * 90000) + 10000}`);
  const [invoiceId] = useState(`${hotelMeta.estab}-${hotelMeta.ptoEmi}-${String(Math.floor(Math.random() * 900000) + 100000).padStart(9, "0")}`);
  const issueDate = new Date().toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
  const verifyCode = Math.random().toString(36).slice(2, 10).toUpperCase();
  const last4 = cardNum.replace(/\s/g, "").slice(-4) || "****";

  const STEPS: { k: BookingStep; l: string }[] = user
    ? [{ k: "details", l: "1. Datos y Tarifa" }, { k: "payment", l: "2. Pago Seguro" }, { k: "invoice", l: "3. Voucher de Reserva" }]
    : [{ k: "auth", l: "1. Acceso / Invitado" }, { k: "details", l: "2. Datos y Tarifa" }, { k: "payment", l: "3. Pago Seguro" }, { k: "invoice", l: "4. Voucher de Reserva" }];

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
      playNewBookingSound();
      const guestFullName = form.name || cardHolder || "Huésped Invitado";
      addAuditLog({
        usuario: guestFullName,
        rol: user ? "Huésped Registrado" : "Checkout Invitado",
        modulo: "Motor de Reservas Web",
        accion: "RESERVA_WEB_CONFIRMADA",
        detalle: `Reserva ${resId} en ${hotel.name} (${room.type}, ${nights} noches) · Plan: ${ratePlan} · Total USD $${total.toFixed(2)} (IVA ${ivaPct}%)`,
      });
      const newRes: MyReservation = {
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
        guestName: guestFullName,
        guestEmail: form.email || user?.email || "invitado@alojamanta.ec",
        guestPhone: form.phone || "+593 98 421 8890",
        payMethod: "Tarjeta Digital (PayPhone / Kushki)",
      };
      onReservationCreated?.(newRes);
      window.dispatchEvent(new CustomEvent("alojamanta-new-booking", { detail: newRes }));
    }, 1500);
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
              <div className="text-center pb-1">
                <h3 className="font-bold text-slate-800 text-base" style={{ fontFamily: "DM Serif Display, serif" }}>
                  {authMode === "login" ? "Inicia sesión o reserva como invitado" : "Crea tu cuenta gratis"}
                </h3>
                <p className="text-xs text-slate-500 mt-1">Accede con tu cuenta o reserva directamente sin necesidad de registrarte</p>
              </div>

              {/* Guest Checkout */}
              <button
                type="button"
                onClick={() => setStep("details")}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 border border-emerald-600 bg-emerald-50 text-emerald-900 hover:bg-emerald-100 cursor-pointer shadow-sm"
              >
                <span>Continuar como invitado</span>
              </button>

              <div className="relative flex items-center gap-2">
                <div className="flex-1 h-px" style={{ background: "#e2e8f0" }} />
                <span className="text-[11px] text-slate-400 uppercase font-semibold">o accede con tu cuenta</span>
                <div className="flex-1 h-px" style={{ background: "#e2e8f0" }} />
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
              <button onClick={() => { const u = { name: "Usuario Google", email: "usuario@gmail.com" }; onGuestLogin(u); setForm(f => ({ ...f, ...u })); setCardHolder(u.name); setStep("details"); }} className="w-full py-2.5 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors" style={{ borderColor: "#e2e8f0", color: "#475569" }}>
                <span>Continuar con Google</span>
              </button>
            </div>
          )}

          {/* ── STEP: DETAILS ── */}
          {step === "details" && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-800">1. Datos del huésped titular</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Nombre completo del titular *</label>
                  <input
                    className="w-full px-3 py-2 rounded-lg border text-sm outline-none focus:border-amber-500"
                    style={{ borderColor: "#e2e8f0", color: "#1e293b" }}
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Ej: Carlos Mendoza"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Email para voucher y confirmación *</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 rounded-lg border text-sm outline-none focus:border-amber-500"
                    style={{ borderColor: "#e2e8f0", color: "#1e293b" }}
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="cliente@correo.ec"
                    required
                  />
                </div>
              </div>

              {/* Selector dinámico de Tipo de Documento */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tipo de Documento *</label>
                  <select
                    value={docType}
                    onChange={e => {
                      const t = e.target.value as "CEDULA" | "RUC" | "PASAPORTE";
                      setDocType(t);
                      setForm(f => ({ ...f, dni: "" }));
                    }}
                    className="w-full px-3 py-2 rounded-lg border text-xs font-semibold outline-none bg-white cursor-pointer"
                    style={{ borderColor: "#cbd5e1" }}
                  >
                    <option value="CEDULA">Cédula de Identidad (10 dígitos)</option>
                    <option value="RUC">RUC (13 dígitos / Empresa)</option>
                    <option value="PASAPORTE">Pasaporte Internacional (Alfanumérico)</option>
                  </select>
                </div>

                <div className={docType === "RUC" ? "sm:col-span-1" : "sm:col-span-2"}>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {docType === "CEDULA" && "Cédula de Identidad (10 dígitos) *"}
                    {docType === "RUC" && "Número de RUC (13 dígitos) *"}
                    {docType === "PASAPORTE" && "Número de Pasaporte (Alfanumérico) *"}
                  </label>
                  <input
                    type="text"
                    maxLength={docType === "CEDULA" ? 10 : docType === "RUC" ? 13 : 20}
                    value={form.dni}
                    onChange={e => {
                      let val = e.target.value;
                      if (docType === "CEDULA" || docType === "RUC") {
                        val = val.replace(/\D/g, "");
                      } else {
                        val = val.toUpperCase().replace(/[^A-Z0-9]/g, "");
                      }
                      setForm({ ...form, dni: val });
                    }}
                    placeholder={docType === "CEDULA" ? "1314589201" : docType === "RUC" ? "1391789456001" : "A14892015"}
                    className="w-full px-3 py-2 rounded-lg border text-sm outline-none font-mono bg-white"
                    style={{ borderColor: "#cbd5e1" }}
                    required
                  />
                  {docType === "CEDULA" && form.dni.length > 0 && form.dni.length !== 10 && (
                    <p className="text-[10px] text-amber-600 mt-0.5">La cédula debe contener exactamente 10 dígitos numéricos.</p>
                  )}
                  {docType === "RUC" && form.dni.length > 0 && form.dni.length !== 13 && (
                    <p className="text-[10px] text-amber-600 mt-0.5">El RUC ecuatoriano debe tener 13 dígitos numéricos (termina en 001).</p>
                  )}
                </div>

                {docType === "RUC" && (
                  <div className="col-span-1 sm:col-span-3">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Razón Social o Nombre de Empresa *</label>
                    <input
                      type="text"
                      value={form.razonSocial}
                      onChange={e => setForm({ ...form, razonSocial: e.target.value })}
                      placeholder="Ej: IMPORTADORA DEL PACIFICO S.A.S."
                      className="w-full px-3 py-2 rounded-lg border text-sm outline-none bg-white"
                      style={{ borderColor: "#cbd5e1" }}
                      required
                    />
                  </div>
                )}
              </div>

              {/* Teléfono, País, Ciudad y Dirección */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Teléfono / WhatsApp *</label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 rounded-lg border text-sm outline-none font-mono"
                    style={{ borderColor: "#e2e8f0", color: "#1e293b" }}
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    placeholder="+593 98 421 8890"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">País</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                    style={{ borderColor: "#e2e8f0", color: "#1e293b" }}
                    value={form.country}
                    onChange={e => setForm({ ...form, country: e.target.value })}
                    placeholder="Ecuador"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Ciudad</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                    style={{ borderColor: "#e2e8f0", color: "#1e293b" }}
                    value={form.city}
                    onChange={e => setForm({ ...form, city: e.target.value })}
                    placeholder="Manta, Portoviejo, Quito..."
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Dirección domiciliaria o fiscal</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                    style={{ borderColor: "#e2e8f0", color: "#1e293b" }}
                    value={form.address}
                    onChange={e => setForm({ ...form, address: e.target.value })}
                    placeholder="Av. 4 de Noviembre y Calle 114, Manta"
                  />
                </div>
              </div>

              {/* Selección de Plan de Tarifa */}
              <div className="rounded-xl border p-3.5 bg-slate-50/70 space-y-2" style={{ borderColor: "#e2e8f0" }}>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center justify-between">
                  <span>2. Plan de tarifa</span>
                  <span className="text-[10px] font-mono text-amber-700">{fmt(effectiveNightlyRate)} / noche</span>
                </p>
                <div className="grid grid-cols-1 gap-2 text-xs">
                  <label className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-all ${ratePlan === "flexible" ? "bg-amber-50 border-amber-400 text-slate-900 font-semibold" : "bg-white border-slate-200 text-slate-600"}`}>
                    <div className="flex items-center gap-2">
                      <input type="radio" name="ratePlan" checked={ratePlan === "flexible"} onChange={() => setRatePlan("flexible")} className="accent-amber-500" />
                      <div>
                        <p className="font-bold text-slate-800">Tarifa Estándar Flexible (Reembolsable 48h)</p>
                        <p className="text-[10px] text-slate-500">Cancelación gratuita hasta 48h antes de la Fecha de Entrada</p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-slate-800">{fmt(room.pricePerNight)}/n</span>
                  </label>

                  <label className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-all ${ratePlan === "non_refundable" ? "bg-emerald-50 border-emerald-400 text-slate-900 font-semibold" : "bg-white border-slate-200 text-slate-600"}`}>
                    <div className="flex items-center gap-2">
                      <input type="radio" name="ratePlan" checked={ratePlan === "non_refundable"} onChange={() => setRatePlan("non_refundable")} className="accent-emerald-600" />
                      <div>
                        <p className="font-bold text-emerald-800">Tarifa Promocional No Reembolsable (-10%)</p>
                        <p className="text-[10px] text-slate-500">10% de descuento inmediato · Pago final sin reembolso</p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-emerald-700">{fmt(Math.round(room.pricePerNight * 0.90 * 100) / 100)}/n</span>
                  </label>

                  {!room.breakfastIncluded && (
                    <label className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-all ${ratePlan === "breakfast_plus" ? "bg-amber-50 border-amber-400 text-slate-900 font-semibold" : "bg-white border-slate-200 text-slate-600"}`}>
                      <div className="flex items-center gap-2">
                        <input type="radio" name="ratePlan" checked={ratePlan === "breakfast_plus"} onChange={() => setRatePlan("breakfast_plus")} className="accent-amber-500" />
                        <div>
                          <p className="font-bold text-slate-800">Plan con Desayuno Manabita Incluido (+$8/noche)</p>
                          <p className="text-[10px] text-slate-500">Incluye desayuno costero completo y cancelación flexible</p>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-slate-800">{fmt(room.pricePerNight + 8)}/n</span>
                    </label>
                  )}
                </div>
              </div>

              {/* Extras y Servicios Adicionales */}
              <div className="rounded-xl border p-3.5 bg-slate-50/70 space-y-2" style={{ borderColor: "#e2e8f0" }}>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center justify-between">
                  <span>3. Servicios adicionales</span>
                  {extrasTotal > 0 && <span className="text-[10px] font-mono font-bold text-emerald-700">+{fmt(extrasTotal)}</span>}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[
                    { k: "airport" as const, label: "Traslado Aeropuerto Manta (MEC)", price: "+$15.00" },
                    { k: "extrabed" as const, label: "Cama supletoria adicional", price: "+$20.00" },
                    { k: "crib" as const, label: "Cuna para bebé sujeta a cupo", price: "Cortesía $0" },
                    { k: "lateout" as const, label: "Salida extendida (hasta 16:00h)", price: "+$15.00" },
                  ].map(ext => (
                    <label key={ext.k} className={`flex items-center justify-between p-2 rounded-lg border cursor-pointer ${selectedExtras[ext.k] ? "bg-amber-50 border-amber-400" : "bg-white border-slate-200"}`}>
                      <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                        <input
                          type="checkbox"
                          checked={selectedExtras[ext.k]}
                          onChange={e => setSelectedExtras(s => ({ ...s, [ext.k]: e.target.checked }))}
                          className="accent-amber-500 rounded"
                        />
                        {ext.label}
                      </span>
                      <span className="font-mono text-[11px] font-bold text-slate-600">{ext.price}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Observaciones o hora estimada de arribo</label>
                <textarea className="w-full px-3 py-2 rounded-lg border text-sm outline-none resize-none" style={{ borderColor: "#e2e8f0", color: "#1e293b" }} rows={2} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Ej: Llegada en vuelo de las 15:30, preferencia piso alto..." />
              </div>

              {/* Desglose estilo Booking.com */}
              <PriceBreakdownBox
                basePrice={base / nights}
                nights={nights}
                hasService10={hasService}
                hotelName={hotel.name}
                defaultExpanded={true}
                showToggle={true}
              />
              <div className="flex gap-2">
                {!user && <button onClick={() => setStep("auth")} className="px-4 py-3 rounded-xl text-sm font-medium border" style={{ borderColor: "#e2e8f0", color: "#64748b" }}>← Atrás</button>}
                <button onClick={() => setStep("payment")} className="flex-1 py-3 rounded-xl font-bold text-sm hover:opacity-90" style={{ background: "#f59e0b", color: "#0c1220" }}>
                  Continuar al pago seguro →
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
                <div className="flex justify-between text-sm text-slate-500"><span>Subtotal Hospedaje ({nights}n)</span><span>{fmt(roomBase)}</span></div>
                {extrasTotal > 0 && (
                  <div className="flex justify-between text-sm text-slate-500"><span>Extras de Alojamiento</span><span>{fmt(extrasTotal)}</span></div>
                )}
                <div className="flex justify-between text-sm text-slate-500">
                  <span>{ivaPct}% IVA {ivaPct === 8 ? "(Decreto Feriado Turístico)" : "(Tarifa Ordinaria)"}</span>
                  <span className={ivaPct === 8 ? "text-emerald-700 font-bold" : ""}>{fmt(iva)}</span>
                </div>
                {hasService && (
                  <div className="flex justify-between text-sm text-emerald-700 font-medium bg-emerald-50/60 px-2 py-0.5 rounded">
                    <span>10% Servicio Turístico (Art. 41 Ley Turismo)</span>
                    <span className="font-mono font-bold">{fmt(servicio)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-base pt-1.5 border-t" style={{ borderColor: "#e2e8f0", color: "#1e293b" }}><span>Total a cargar</span><span style={{ color: "#f59e0b" }}>{fmt(total)}</span></div>
              </div>

              {/* LOPDP Consent */}
              <label className="flex items-start gap-2 cursor-pointer select-none text-left p-2.5 rounded-lg border bg-slate-50/60 border-slate-200">
                <input type="checkbox" required defaultChecked className="mt-0.5 accent-amber-500 rounded" />
                <span className="text-[11px] text-slate-600 leading-tight">
                  Acepto los Términos y la Política de Tratamiento de Datos Personales conforme a la <strong>Ley Orgánica de Protección de Datos Personales (LOPDP Ecuador)</strong>. Mis datos personales se tratarán exclusivamente para la reserva y gestión de mi estancia.
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
                <p className="text-xs text-slate-500 mt-0.5">Voucher Oficial de Reserva Garantizada y liquidación de pasarela</p>
              </div>

              {/* Electronic payment receipt & Voucher */}
              <div className="rounded-2xl border overflow-hidden shadow-lg" style={{ borderColor: "#e2e8f0" }}>
                {/* Header: Payment gateway receipt */}
                <div className="px-5 py-4 flex items-start justify-between" style={{ background: "#0c1220" }}>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-lg text-amber-400" style={{ fontFamily: "DM Serif Display, serif" }}>{hotelMeta.nombreComercial}</p>
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded border border-emerald-500/30">RESERVA GARANTIZADA</span>
                    </div>
                    <p className="text-xs text-slate-300 font-medium">{hotelMeta.razonSocial}</p>
                    <p className="text-[10px] text-slate-400 font-mono">RUC: {hotelMeta.ruc} · {hotelMeta.city}</p>
                    <p className="text-[10px] text-slate-400">Pasarela: PayPhone / Tarjeta · Aut: AUTH-PP-{resId.replace(/\D/g, "").slice(-6) || "948210"}</p>
                  </div>
                  <div className="text-right">
                    <span className="mono text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">VOUCHER DIGITAL</span>
                    <p className="font-bold mt-1 text-slate-100 font-mono text-xs">{invoiceId}</p>
                    <p className="mono text-[10px] text-slate-400">{issueDate}</p>
                  </div>
                </div>

                {/* Banner de Comprobante */}
                <div className="px-4 py-2.5 bg-amber-50 border-b border-amber-200 text-[11px] text-amber-900 leading-tight">
                  <p className="font-bold">Voucher de reserva - {hotel.name}:</p>
                  <p className="text-amber-800 text-[10px] mt-0.5">
                    Este documento confirma tu reserva garantizada y pago en línea. Presenta tu código de reserva al llegar al hotel para validar tu estancia.
                  </p>
                </div>

                {/* Client + hotel */}
                <div className="grid grid-cols-2 gap-px" style={{ background: "#e2e8f0" }}>
                  <div className="px-4 py-3 bg-white">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Huésped titular</p>
                    <p className="font-semibold text-slate-800 text-sm">{form.name || user?.name || "Huésped Invitado"}</p>
                    {docType === "RUC" && form.razonSocial && (
                      <p className="text-xs text-slate-600 font-medium">🏢 {form.razonSocial}</p>
                    )}
                    <p className="text-xs text-slate-500">{form.email || user?.email || "invitado@alojamanta.ec"}</p>
                    {form.dni && (
                      <p className="mono text-xs text-slate-500">
                        {docType === "CEDULA" ? "Cédula: " : docType === "RUC" ? "RUC: " : "Pasaporte: "}
                        {form.dni}
                      </p>
                    )}
                    {form.phone && <p className="text-xs text-slate-500">Tel: {form.phone}</p>}
                    {(form.city || form.country) && (
                      <p className="text-[11px] text-slate-400 truncate">
                        📍 {[form.address, form.city, form.country].filter(Boolean).join(", ")}
                      </p>
                    )}
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
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Detalle de la estancia reservada</p>
                  <div className="grid grid-cols-4 gap-3 text-xs">
                    {[
                      { l: "Nº Reserva", v: resId },
                      { l: "Fecha Entrada", v: `${fmtDateShort(params.checkIn)} · 14:00h` },
                      { l: "Fecha Salida", v: `${fmtDateShort(params.checkOut)} · 12:00h` },
                      { l: "Noches", v: String(nights) },
                    ].map(item => (
                      <div key={item.l}>
                        <p className="text-slate-400">{item.l}</p>
                        <p className="font-semibold text-slate-700 font-mono">{item.v}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Line items con desglose transparente */}
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
                      <td className="px-4 py-3 font-mono text-slate-600">{fmt(effectiveNightlyRate)}</td>
                      <td className="px-4 py-3 font-mono font-semibold text-slate-800">{fmt(roomBase)}</td>
                    </tr>
                    {extrasTotal > 0 && (
                      <tr style={{ borderTop: "1px solid #e2e8f0" }}>
                        <td className="px-4 py-2 text-xs text-slate-600" colSpan={3}>Servicios adicionales y extras seleccionados</td>
                        <td className="px-4 py-2 font-mono text-xs font-semibold text-slate-800">{fmt(extrasTotal)}</td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr style={{ borderTop: "1px solid #e2e8f0", background: "#f8fafc" }}>
                      <td colSpan={3} className="px-4 py-2 text-xs text-right text-slate-500">Subtotal Neto (Hospedaje y Extras)</td>
                      <td className="px-4 py-2 font-mono text-sm text-slate-700">{fmt(base)}</td>
                    </tr>
                    <tr style={{ background: "#f8fafc" }}>
                      <td colSpan={3} className="px-4 py-2 text-xs text-right text-slate-500">
                        {ivaPct}% IVA {ivaPct === 8 ? "(Decreto Feriado Turístico)" : "(Tarifa Ordinaria)"}
                      </td>
                      <td className="px-4 py-2 font-mono text-sm text-slate-700">{fmt(iva)}</td>
                    </tr>
                    {hasService && (
                      <tr style={{ background: "#f8fafc" }}>
                        <td colSpan={3} className="px-4 py-2 text-xs text-right text-emerald-700 font-medium">10% Servicio Turístico (Ley Turismo Art. 41)</td>
                        <td className="px-4 py-2 font-mono text-sm text-emerald-700 font-bold">{fmt(servicio)}</td>
                      </tr>
                    )}
                    <tr style={{ borderTop: "2px solid #e2e8f0" }}>
                      <td colSpan={3} className="px-4 py-3 font-bold text-right text-slate-800">TOTAL LIQUIDADO</td>
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

                {/* Verification code & Booking Reference */}
                <div className="px-4 py-3 flex items-center justify-between" style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Código de Confirmación de Reserva</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="font-mono font-bold text-slate-800 tracking-wider text-sm">{resId}</p>
                      <span className="text-slate-300">|</span>
                      <span className="font-mono font-bold text-amber-600 text-xs">PIN: {verifyCode}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">Menciona este código o tu nombre al presentarte en el establecimiento.</p>
                  </div>
                  <div className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-center shadow-xs">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">Estado</span>
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                      Confirmada
                    </span>
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
                + US${(((hotel.priceFrom * n) * (getActiveIvaPercent(hotel.id) / 100)) + (hotel.gravaServicio10 ? ((hotel.priceFrom * n) * 0.10) : 0)).toFixed(2)} de impuestos ({n}n)
              </p>
              <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium border border-slate-200">
                  {hotel.gravaServicio10
                    ? `${getActiveIvaPercent(hotel.id)}% IVA + 10% Servicio Turístico`
                    : `${getActiveIvaPercent(hotel.id)}% IVA (Hostal Exento 10% Serv.)`}
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                  ✓ Reserva Garantizada
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
  const score10 = Math.min(9.9, Math.max(8.2, Number((hotel.rating * 1.98).toFixed(1))));
  const subcriteria = [
    { label: "Limpieza e Higiene", val: Math.min(10, Number((score10 + 0.2).toFixed(1))) },
    { label: "Ubicación en Manta", val: Math.min(10, Number((score10 + 0.1).toFixed(1))) },
    { label: "Atención del Personal", val: score10 },
    { label: "Relación Calidad-Precio", val: Math.max(8.0, Number((score10 - 0.2).toFixed(1))) },
    { label: "Conectividad WiFi", val: Math.max(8.1, Number((score10 - 0.1).toFixed(1))) },
  ];

  const isRural = hotel.city.includes("Santa Marianita") || hotel.city.includes("San Lorenzo") || hotel.city.includes("San Mateo");
  const landmarks = isRural
    ? [
        { icon: "🏖️", place: "Playa local / Zona Costera", dist: "0.2 km", time: "3 min a pie" },
        { icon: "🌴", place: "Playa El Murciélago & Malecón", dist: "14.5 km", time: "20 min en auto" },
        { icon: "🛍️", place: "Mall del Pacífico", dist: "15.0 km", time: "22 min en auto" },
        { icon: "✈️", place: "Aeropuerto Internacional Eloy Alfaro (MEC)", dist: "21.0 km", time: "28 min en auto" },
        { icon: "🚌", place: "Terminal Terrestre Luis Valdiviezo Morán", dist: "22.5 km", time: "30 min en auto" },
      ]
    : [
        { icon: "🌴", place: "Playa El Murciélago & Malecón Escénico", dist: "0.8 km", time: "4 min en auto / 10 min a pie" },
        { icon: "🛍️", place: "Mall del Pacífico", dist: "1.1 km", time: "5 min en auto" },
        { icon: "🍽️", place: "Zona Gastronómica Flavio Reyes / Barbasquillo", dist: "1.4 km", time: "5 min en auto" },
        { icon: "✈️", place: "Aeropuerto Internacional Eloy Alfaro (MEC)", dist: "6.5 km", time: "12 min en auto" },
        { icon: "🚌", place: "Terminal Terrestre Luis Valdiviezo Morán", dist: "7.8 km", time: "15 min en auto" },
      ];

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
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl" style={{ background: "#1e3a5f" }}>
              <span className="text-white font-bold text-xl">{score10}</span>
              <div><p className="text-amber-300 font-bold text-xs">Excelente (/10)</p><p className="text-white/60 text-[10px]">{hotel.reviews} reseñas verificadas</p></div>
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

          {/* Puntos de referencia y tiempos de traslado en Manta */}
          <div className="mt-5 pt-4 border-t grid grid-cols-1 md:grid-cols-2 gap-4" style={{ borderColor: "#f1f5f9" }}>
            <div className="rounded-xl p-4 border bg-slate-50/70" style={{ borderColor: "#e2e8f0" }}>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
                Lugares de interés cercanos
              </p>
              <div className="space-y-2 text-xs">
                {landmarks.map(lm => (
                  <div key={lm.place} className="flex items-center justify-between gap-2 py-1 border-b border-slate-200/60 last:border-0">
                    <span className="text-slate-700 font-medium">
                      {lm.place}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 whitespace-nowrap">{lm.dist} · {lm.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reseñas y Valoraciones Verificadas */}
            <div className="rounded-xl p-4 border bg-slate-50/70" style={{ borderColor: "#e2e8f0" }}>
              <div className="flex items-center justify-between mb-2.5">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Puntuación de los huéspedes
                </p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">Opiniones verificadas</span>
              </div>
              <div className="space-y-2 text-xs">
                {subcriteria.map(sc => (
                  <div key={sc.label}>
                    <div className="flex justify-between text-[11px] mb-0.5">
                      <span className="text-slate-600 font-medium">{sc.label}</span>
                      <span className="font-mono font-bold text-slate-800">{sc.val} / 10</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                      <div className="h-full rounded-full bg-amber-500" style={{ width: `${sc.val * 10}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl p-4 mb-5 border" style={{ background: "#fef3c7", borderColor: "#fcd34d" }}>
        <div className="flex flex-wrap gap-4 text-sm font-semibold text-amber-800">
          <span>Entrada: {fmtDateShort(params.checkIn)} → Salida: {fmtDateShort(params.checkOut)}</span>
          <span>{nights} noche{nights > 1 ? "s" : ""}</span>
          <span>{params.adults + params.children} huésped{params.adults + params.children > 1 ? "es" : ""}</span>
        </div>
        <p className="text-xs text-amber-700">Confirmación inmediata · Cancelación flexible según tarifa</p>
      </div>
      <h2 className="text-lg font-bold text-slate-800 mb-4" style={{ fontFamily: "DM Serif Display, serif" }}>Tipos de Habitación y Cupos para Venta Web</h2>
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
                    {room.breakfastIncluded && <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: "#d1fae5", color: "#065f46" }}>Desayuno incluido</span>}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t space-y-3" style={{ borderColor: "#f1f5f9" }}>
                  <PriceBreakdownBox
                    basePrice={room.pricePerNight}
                    nights={nights}
                    hasService10={hotel.gravaServicio10}
                    hotelName={hotel.name}
                    defaultExpanded={false}
                    showToggle={true}
                  />
                  <div className="flex items-center justify-between">
                    <div>
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${room.available <= 2 ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"}`}>
                        {room.available <= 2 ? `Últimas ${room.available} habitaciones disponibles` : `${room.available} habitaciones disponibles`}
                      </span>
                    </div>
                    <button onClick={() => onBook(room)} className="px-6 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 active:scale-95 transition-all shadow-sm" style={{ background: "#f59e0b", color: "#0c1220" }}>
                      Reservar Cupo →
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
  onOpenConsult,
  onOpenAbout,
  onOpenLegal,
}: {
  params: SearchParams;
  onChange: (p: SearchParams) => void;
  onSearch: () => void;
  theme?: "light" | "dark";
  onToggleTheme?: () => void;
  onOpenConsult?: () => void;
  onOpenAbout?: () => void;
  onOpenLegal?: () => void;
}) {
  const [isHomeMapOpen, setIsHomeMapOpen] = useState(false);

  return (
    <div style={{ background: "#f8fafc" }}>
      <div className="relative" style={{ minHeight: 400 }}>
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #0c1220 0%, #1e3a5f 50%, #0f2744 100%)" }}>
          <img src="https://images.unsplash.com/photo-1722191847760-8426e74d4b3d?w=1400&h=600&fit=crop&auto=format" alt="" className="w-full h-full object-cover opacity-25" />
        </div>
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(12,18,32,0.3) 0%, rgba(12,18,32,0.75) 100%)" }} />
        <div className="relative max-w-5xl mx-auto px-4 pt-12 sm:pt-20 pb-8 sm:pb-12 text-center">
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-3 leading-tight" style={{ fontFamily: "DM Serif Display, serif" }}>Encuentra tu hotel en Manta</h1>
          <p className="text-white/80 text-sm sm:text-base mb-6 sm:mb-8 max-w-lg mx-auto">
            Compara y reserva en hoteles, hostales y hosterías de Barbasquillo, El Murciélago, Tarqui, Los Esteros, San Mateo, Santa Marianita y San Lorenzo.
          </p>
          <div className="max-w-4xl mx-auto"><SearchBar params={params} onChange={onChange} onSearch={onSearch} /></div>
        </div>
      </div>
      <div className="border-b" style={{ background: "#fff", borderColor: "#e2e8f0" }}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-6 overflow-x-auto whitespace-nowrap scrollbar-none">
          {["Pago digital seguro", "Confirmación de reserva inmediata", "Cancelación flexible", "Tarifa directa sin comisiones ocultas", "Atención local en Manta"].map(text => (
            <div key={text} className="flex items-center gap-1.5 text-xs font-medium text-slate-600 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
          <div>
            <h2 className="text-xl font-bold text-slate-800" style={{ fontFamily: "DM Serif Display, serif" }}>Sectores y Playas de Manta</h2>
            <p className="text-xs text-slate-500">Distribución en las 7 parroquias del cantón Manta</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsHomeMapOpen(true)}
              className="px-3.5 py-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer hover:scale-105"
            >
              <span>🗺️</span>
              <span>Ver en Mapa</span>
            </button>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
              116 Alojamientos Catastrados
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-12">
          {DESTINATIONS.map(d => (
            <button
              key={d.city}
              onClick={() => { onChange({ ...params, destination: d.city }); onSearch(); }}
              className="relative rounded-2xl overflow-hidden transition-all hover:scale-[1.03] hover:shadow-xl cursor-pointer group text-left border border-slate-200/50"
              style={{ height: 125 }}
            >
              <img src={d.img} alt={d.city} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 mb-1 inline-block">
                  {d.type || "Manta"}
                </span>
                <p className="text-white font-bold text-sm leading-tight truncate">{d.city.replace("Manta - ", "")}</p>
                <p className="text-white/80 text-[10px] mt-0.5">{d.hotels} hoteles</p>
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
          {[
            ["Tarifa directa", "Reserva directamente con el establecimiento sin recargos adicionales de intermediarios internacionales."],
            ["Alojamientos verificados", "Establecimientos registrados y validados en el cantón Manta."],
            ["Confirmación inmediata", "Comprobante digital emitido al instante con código de reserva para validar a tu llegada."]
          ].map(([title, desc]) => (
            <div key={title} className="rounded-2xl p-5 border bg-white" style={{ borderColor: "#e2e8f0" }}>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-xs mb-3">✓</div>
              <h4 className="font-bold text-slate-800 mb-1 text-sm">{title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
      <footer className="border-t mt-10" style={{ background: "#0f172a", borderColor: "#1e293b" }}>
        <div className="max-w-5xl mx-auto px-4 py-10 flex flex-wrap gap-8 justify-between">
          <div className="max-w-xs space-y-2">
            <p className="font-bold text-white text-xl" style={{ fontFamily: "DM Serif Display, serif" }}>AlojaManta</p>
            <p className="text-xs text-slate-400 leading-relaxed">Plataforma oficial de reservas directas y comercialización para el cantón Manta, Manabí. Sin comisiones abusivas ni sobreprecios OTA.</p>
            <div className="pt-1">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                116 Alojamientos Catastrados
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-10 text-xs text-slate-400">
            <div className="space-y-2">
              <p className="font-bold text-slate-200 mb-2 uppercase tracking-wider text-[11px]">Sectores y Playas</p>
              <button
                type="button"
                onClick={() => { onChange({ ...params, destination: "Manta - Barbasquillo" }); onSearch(); }}
                className="hover:text-amber-400 text-slate-400 transition-colors text-left block cursor-pointer"
              >
                Barbasquillo & El Murciélago
              </button>
              <button
                type="button"
                onClick={() => { onChange({ ...params, destination: "Manta - Tarqui" }); onSearch(); }}
                className="hover:text-amber-400 text-slate-400 transition-colors text-left block cursor-pointer"
              >
                Tarqui & Los Esteros
              </button>
              <button
                type="button"
                onClick={() => { onChange({ ...params, destination: "Manta - Santa Marianita" }); onSearch(); }}
                className="hover:text-amber-400 text-slate-400 transition-colors text-left block cursor-pointer"
              >
                Santa Marianita & San Mateo
              </button>
              <button
                type="button"
                onClick={() => { onChange({ ...params, destination: "Manta - San Lorenzo" }); onSearch(); }}
                className="hover:text-amber-400 text-slate-400 transition-colors text-left block cursor-pointer"
              >
                San Lorenzo & Reserva Pacoche
              </button>
            </div>
            <div className="space-y-2">
              <p className="font-bold text-slate-200 mb-2 uppercase tracking-wider text-[11px]">Ayuda & Información</p>
              {onOpenAbout && (
                <button
                  type="button"
                  onClick={onOpenAbout}
                  className="hover:text-amber-400 text-slate-400 transition-colors text-left block cursor-pointer"
                >
                  Acerca de AlojaManta
                </button>
              )}
              {onOpenConsult && (
                <button
                  type="button"
                  onClick={onOpenConsult}
                  className="hover:text-amber-400 text-slate-400 transition-colors text-left block cursor-pointer"
                >
                  Consultar mi reserva
                </button>
              )}
              {onOpenLegal && (
                <button
                  type="button"
                  onClick={onOpenLegal}
                  className="hover:text-amber-400 text-slate-400 transition-colors text-left block cursor-pointer"
                >
                  Términos y Privacidad
                </button>
              )}
              <a
                href="https://wa.me/593998765432?text=Hola%2C%20requiero%20asistencia%20en%20AlojaManta"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-400 text-slate-400 transition-colors text-left flex items-center gap-1 cursor-pointer"
              >
                <span>WhatsApp: +593 99 876 5432</span>
              </a>
              <a
                href="tel:+59352628900"
                className="hover:text-amber-400 text-slate-400 transition-colors text-left flex items-center gap-1 cursor-pointer"
              >
                <span>Central: +593 5 262 8900</span>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t py-4 px-4 max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400" style={{ borderColor: "#1e293b" }}>
          <span>© 2026 AlojaManta · Red Oficial de Alojamientos del Cantón Manta · 116 Alojamientos Catastrados</span>
          <div className="flex items-center gap-4">
            {onOpenAbout && (
              <button
                type="button"
                onClick={onOpenAbout}
                className="text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
              >
                Acerca de la Plataforma
              </button>
            )}
            {onOpenLegal && (
              <button
                type="button"
                onClick={onOpenLegal}
                className="text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
              >
                Comprobantes y Contacto
              </button>
            )}
          </div>
        </div>
      </footer>

      {/* ─── Modal de Mapa Geográfico Real ─── */}
      <MantaMapModal
        isOpen={isHomeMapOpen}
        onClose={() => setIsHomeMapOpen(false)}
        onSelectDestination={dest => {
          onChange({ ...params, destination: dest });
          onSearch();
        }}
        hotels={HOTELS}
      />
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
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [voucherRes, setVoucherRes] = useState<MyReservation | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [accountInitialTab, setAccountInitialTab] = useState<"hub" | "reservations" | "personal" | "billing" | "payments" | "about">("hub");

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
                    <p className="text-[9px] text-slate-500 font-semibold leading-none">
                      Mi cuenta
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
                            <span className="inline-block text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 mt-0.5">
                              Cuenta de Huésped
                            </span>
                            <p className="text-[11px] text-slate-400 truncate mt-0.5">{user.email}</p>
                          </div>
                        </div>
                      </div>

                      {/* Enlaces del Menú (100% Asociados) */}
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
                            <p className="text-[10px] text-slate-400">Ver vouchers y códigos de reserva</p>
                          </div>
                        </button>

                        <button
                          onClick={() => { setAccountInitialTab("personal"); setView("account"); setShowProfileMenu(false); }}
                          className="w-full px-4 py-2.5 text-left hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                        >
                          <span className="text-base">👤</span>
                          <div>
                            <p className="font-semibold text-slate-800">Datos Personales del Huésped</p>
                            <p className="text-[10px] text-slate-400">Cédula, contacto y preferencias de estadía</p>
                          </div>
                        </button>

                        <button
                          onClick={() => { setAccountInitialTab("billing"); setView("account"); setShowProfileMenu(false); }}
                          className="w-full px-4 py-2.5 text-left hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                        >
                          <span className="text-base">🏛️</span>
                          <div>
                            <p className="font-semibold text-slate-800">Datos de Comprobantes y Contacto</p>
                            <p className="text-[10px] text-slate-400">Datos registrados para la reserva</p>
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
                          onClick={() => { setAccountInitialTab("about"); setView("account"); setShowProfileMenu(false); }}
                          className="w-full px-4 py-2.5 text-left hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                        >
                          <span className="text-base">ℹ️</span>
                          <div>
                            <p className="font-semibold text-slate-800">Acerca de AlojaManta</p>
                            <p className="text-[10px] text-slate-400">Información del proyecto y reserva directa</p>
                          </div>
                        </button>
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
          onOpenConsult={() => setShowConsultModal(true)}
          onOpenAbout={() => setShowAboutModal(true)}
          onOpenLegal={() => setShowLegalModal(true)}
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

      {/* Modal Acerca de AlojaManta */}
      {showAboutModal && (
        <AboutModal
          onClose={() => setShowAboutModal(false)}
          onExplore={() => {
            setShowAboutModal(false);
            handleSearch();
          }}
        />
      )}

      {/* Modal Legal & Comprobantes y Contacto */}
      {showLegalModal && (
        <LegalModal onClose={() => setShowLegalModal(false)} />
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
