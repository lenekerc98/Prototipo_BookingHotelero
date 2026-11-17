import { getPublicHotels } from "./app/roomCatalog";
import { useState, useRef, useEffect } from "react";
import type { GuestUser } from "./AuthPage";
import {
  getActiveIvaPercent,
  getIvaDecretoConfig,
  addAuditLog,
} from "./hotelData";
import {
  type Hotel,
  type RoomOffer,
} from "./mantaHotels";
import MantaMapModal from "./MantaMapModal";
import { reservationWorkflow, getRoomAvailability } from "./app/reservations";
import { useGuestReservations, useReservationSnapshot } from "./app/useGuestReservations";
import { useArrivalPolicy } from "./app/arrivalPolicy";
import { RequestDeadline } from "./features/reservations/RequestDeadline";
import { ReservationDialog } from "./features/reservations/ReservationDialog";
import { ReservationSummary, ReservationVoucherModal as InvoiceModal } from "./features/reservations/ReservationSummary";
import { canCancelReservation, getPaymentLabel, getReservationStatus, getReservationStyle } from "./features/reservations/status";
import type { MyReservation } from "./features/reservations/types";
import { useI18n, useLang, setLang, getLang, txDesc } from "./i18n";

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



// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number) {
  const locale = getLang() === "en" ? "en-US" : "es-EC";
  return new Intl.NumberFormat(locale, { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(n);
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
  return new Date(d + "T12:00:00").toLocaleDateString(getLang() === "en" ? "en-US" : "es-ES", { day: "numeric", month: "short", year: "numeric" });
}
function StarsRow({ n }: { n: number }) {
  return (
    <span className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} style={{ color: i < n ? "#f59e0b" : "var(--border)", fontSize: 11 }}>★</span>
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
  const tx = useI18n();
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
    <div className={`rounded-xl border bg-card p-3.5 shadow-sm text-left transition-all ${className}`} style={{ borderColor: "var(--border)" }}>
      {/* Resumen de precio */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold uppercase tracking-wider ttext-muted-foreground">{tx("Desglose del precio")}</span>
            {ivaPct === 8 && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                {tx("IVA 8% tarifa feriado")}
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xs ttext-muted-foreground font-medium">{tx("Precio")}</span>
            <span className="text-xl font-black text-foreground tracking-tight">US${subtotal.toFixed(2)}</span>
            {n > 1 && <span className="text-[11px] ttext-muted-foreground">({n} {tx("noches")})</span>}
          </div>
          <p className="text-[11px] font-semibold ttext-muted-foreground mt-0.5">
            + US${totalImpuestos.toFixed(2)} {tx("de impuestos")} ({ivaPct}% IVA{hasService10 ? " + 10% Serv." : ""})
          </p>
        </div>
        {showToggle && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
            className="text-xs font-semibold text-sky-600 hover:text-sky-800 transition-colors py-1 px-2.5 rounded-lg hover:bg-sky-50 border border-sky-100 flex items-center gap-1"
          >
            <span>{expanded ? tx("Ver menos") : tx("Ver desglose")}</span>
            <span className="text-[10px]">{expanded ? "▲" : "▼"}</span>
          </button>
        )}
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-border space-y-2.5 text-xs ttext-muted-foreground">
          <div className="flex items-center gap-1.5 font-bold text-foreground text-[11px]">
            <span>{tx("Detalle de impuestos y tasas")}</span>
          </div>

          <div className="rounded-lg p-3 bg-background border border-border/80 space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-foreground text-[11px] pb-1.5 border-b border-border">
              <span>{tx("Impuestos y cargos")}: US${totalImpuestos.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center ttext-muted-foreground">
              <span>
                {ivaPct}% IVA {ivaPct === 8 ? `(${decretoCfg.decretoNombre})` : ""}
              </span>
              <span className={`font-mono font-medium ${ivaPct === 8 ? "text-emerald-700 font-bold" : ""}`}>US${iva.toFixed(2)}</span>
            </div>

            {hasService10 ? (
              <div className="flex justify-between items-center text-emerald-800 font-medium bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                <span>{tx("10% Servicio turístico")}</span>
                <span className="font-mono font-bold">US${servicio.toFixed(2)}</span>
              </div>
            ) : (
              <div className="flex justify-between items-center ttext-muted-foreground italic text-[11px]">
                <span>{tx("10% Servicio turístico (no aplica)")}</span>
                <span className="font-mono">US$0.00</span>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center pt-1 font-bold text-foreground text-sm border-t border-border">
            <span>{tx("Total a pagar")}</span>
            <span className="text-base font-black text-amber-600 font-mono">US${totalPagar.toFixed(2)}</span>
          </div>

          <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900 leading-tight">
            <div>
              <strong>{tx("Voucher digital de reserva:")}</strong> {tx("Emitido con tu código de confirmación al validar el pago. Preséntalo a tu llegada a")} {hotelName ? <strong>{hotelName}</strong> : tx("el alojamiento")}.
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
  const tx = useI18n();
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
          ? "p-3 sm:p-4 rounded-2xl bg-card shadow-xl shadow-slate-900/10 border border-border/90"
          : "p-2.5 rounded-2xl border border-border bg-card shadow-xs"
      }`}
      style={{ borderColor: variant === "sticky" ? "var(--border)" : undefined }}
    >
      {/* ─── Selector de Destino Moderno (Solid Clean Popover) ─── */}
      <div className="flex-1 min-w-0 relative" ref={popoverRef}>
        <div className="mb-1">
          <label className="text-[10px] font-bold uppercase tracking-wider ttext-muted-foreground flex items-center gap-1">
            <span>📍</span>
            <span>{tx("¿A dónde vas en Manta?")}</span>
          </label>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ttext-muted-foreground">
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
            placeholder={tx("Parroquia, playa o sector de Manta...")}
            className="w-full pl-8 pr-8 py-2.5 rounded-xl border border-border bg-background hover:bg-card focus:bg-card text-sm font-semibold text-foreground placeholder:ttext-muted-foreground outline-none transition-all focus:ring-2 focus:ring-amber-500/25 focus:border-amber-400 cursor-pointer shadow-2xs"
          />

          {params.destination && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center ttext-muted-foreground hover:text-foreground cursor-pointer text-xs font-bold"
              title={tx("Borrar filtro de destino")}
            >
              ✕
            </button>
          )}
        </div>

        {/* ─── Modern Travel Explorer Popover (Airbnb Style: 100% Light, Espacioso y Visual) ─── */}
        {isPopOpen && (
          <div
            className="absolute left-0 top-full mt-2 w-full sm:w-[500px] max-w-[96vw] rounded-2xl bg-card border border-border/90 shadow-2xl shadow-slate-900/15 z-50 overflow-hidden text-left animate-in fade-in zoom-in-95 duration-150"
          >
            {/* Header Amigable y Luminoso (Sin barras negras) */}
            <div className="px-4 pt-3.5 pb-2.5 bg-card border-b border-border flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">🧭</span>
                  <h4 className="font-bold text-xs text-foreground">{tx("Explora Manta por zona")}</h4>
                  <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    {tx("116 alojamientos")}
                  </span>
                </div>
                <p className="text-[11px] ttext-muted-foreground mt-0.5">
                  {tx("Elige una parroquia oficial o una playa turística destacada")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsPopOpen(false)}
                className="w-7 h-7 rounded-full bg-muted hover:bg-slate-200 ttext-muted-foreground hover:text-foreground text-xs flex items-center justify-center cursor-pointer transition-colors"
                title={tx("Cerrar")}
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
                  <p className="font-bold text-xs text-white leading-tight">{tx("Mapa Geográfico del Cantón")}</p>
                  <p className="text-[10px] text-slate-300">{tx("Explora las 7 parroquias en el mapa interactivo real")}</p>
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
                <span>{tx("Abrir Mapa")}</span>
                <span>↗</span>
              </button>
            </div>

            {/* Chips de Categoría Rápidos */}
            <div className="px-4 py-2 bg-background/70 border-b border-border flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
              <button
                type="button"
                onClick={() => {
                  setIsPopOpen(false);
                  setIsMapModalOpen(true);
                }}
                className="py-1 px-3 rounded-full whitespace-nowrap transition-all cursor-pointer font-bold flex items-center gap-1.5 text-[11px] bg-amber-500 text-slate-950 shadow-xs hover:bg-amber-400"
              >
                <span>🗺️</span>
                <span>{tx("Ver Mapa Interactivo")}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("parroquias")}
                className={`py-1 px-2.5 rounded-full whitespace-nowrap transition-all cursor-pointer font-semibold flex items-center gap-1 text-[11px] ${
                  activeTab === "parroquias"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-card ttext-muted-foreground border border-border hover:bg-muted"
                }`}
              >
                <span>🏛️</span>
                <span>{tx("7 Parroquias Oficiales")}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("sectores")}
                className={`py-1 px-2.5 rounded-full whitespace-nowrap transition-all cursor-pointer font-semibold flex items-center gap-1 text-[11px] ${
                  activeTab === "sectores"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-card ttext-muted-foreground border border-border hover:bg-muted"
                }`}
              >
                <span>🏖️</span>
                <span>{tx("Playas & Sectores")}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("todo")}
                className={`py-1 px-2.5 rounded-full whitespace-nowrap transition-all cursor-pointer font-semibold flex items-center gap-1 text-[11px] ${
                  activeTab === "todo"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-card ttext-muted-foreground border border-border hover:bg-muted"
                }`}
              >
                <span>⭐</span>
                <span>{tx("Todo Manta")}</span>
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
                      className="p-2.5 rounded-xl border border-slate-150 hover:border-amber-300 bg-card hover:bg-amber-50/40 text-left transition-all cursor-pointer group flex flex-col justify-between hover:shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-1 mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-base group-hover:scale-110 transition-transform">{p.icon}</span>
                          <span className="font-bold text-foreground text-xs group-hover:text-amber-900">
                            {p.name}
                          </span>
                        </div>
                        <span className="text-[10px] font-semibold ttext-muted-foreground bg-muted px-1.5 py-0.2 rounded-md">
                          {p.count} {tx("hot.")}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-1 text-[10px]">
                        <span className="ttext-muted-foreground truncate max-w-[160px]">{tx(p.desc)}</span>
                        <span
                          className={`text-[8px] font-bold px-1.5 py-0.2 rounded uppercase shrink-0 ${
                            p.type.includes("Rural")
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : "bg-blue-50 text-blue-800 border border-blue-200"
                          }`}
                        >
                          {p.type.includes("Rural") ? tx("Rural") : tx("Urbana")}
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
                      className="p-2.5 rounded-xl border border-slate-150 hover:border-amber-300 bg-card hover:bg-amber-50/40 text-left transition-all cursor-pointer group flex flex-col justify-between hover:shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-1 mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-base group-hover:scale-110 transition-transform">{s.icon}</span>
                          <span className="font-bold text-foreground text-xs group-hover:text-amber-900">
                            {s.name}
                          </span>
                        </div>
                        <span className="text-[10px] font-semibold ttext-muted-foreground bg-muted px-1.5 py-0.2 rounded-md">
                          {s.count} {tx("hot.")}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-1 text-[10px]">
                        <span className="ttext-muted-foreground truncate max-w-[160px]">{tx(s.desc)}</span>
                        <span className="text-[8px] font-bold px-1.5 py-0.2 rounded uppercase shrink-0 bg-amber-50 text-amber-800 border border-amber-200">
                          {tx(s.badge)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Pestaña 3: Todo el Cantón */}
              {activeTab === "todo" && (
                <div className="p-4 text-center space-y-2 bg-background/70 rounded-xl border border-slate-150">
                  <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center text-xl mx-auto shadow-2xs">
                    🌊
                  </div>
                  <p className="font-bold text-foreground text-xs">{tx("Catálogo Completo de Manta")}</p>
                  <p className="text-[11px] ttext-muted-foreground max-w-xs mx-auto leading-relaxed">
                    {tx("Visualiza los 116 hoteles, hostales y hosterías registrados en las 7 parroquias del cantón.")}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleSelectDestination("")}
                    className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer transition-colors shadow-xs"
                  >
                    {tx("Ver los 116 Alojamientos de Manta")}
                  </button>
                </div>
              )}
            </div>

            {/* Pie del Popover */}
            <div className="px-4 py-2 bg-background border-t border-border flex items-center justify-between text-[10px] ttext-muted-foreground">
              <span>{tx("💡 También puedes escribir directamente el nombre del sector")}</span>
              {params.destination && (
                <button
                  type="button"
                  onClick={() => {
                    onChange({ ...params, destination: "" });
                    setIsPopOpen(false);
                  }}
                  className="text-amber-700 hover:underline font-semibold cursor-pointer"
                >
                  {tx("Limpiar filtro")}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ─── Fechas (Llegada & Salida) ─── */}
      <div className="grid grid-cols-2 gap-2 md:flex md:gap-2">
        <div className="min-w-0 sm:w-32">
          <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 ttext-muted-foreground text-left flex items-center gap-1">
            <span>📅</span>
            <span>{tx("Llegada")}</span>
          </label>
          <input
            type="date"
            className="w-full px-2.5 py-2.5 rounded-xl border border-border bg-background/70 hover:bg-card focus:bg-card text-xs sm:text-sm font-semibold outline-none text-foreground focus:ring-2 focus:ring-amber-500/25 focus:border-amber-400 transition-all cursor-pointer shadow-2xs"
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
          <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 ttext-muted-foreground text-left flex items-center gap-1">
            <span>📅</span>
            <span>{tx("Salida")}</span>
          </label>
          <input
            type="date"
            className="w-full px-2.5 py-2.5 rounded-xl border border-border bg-background/70 hover:bg-card focus:bg-card text-xs sm:text-sm font-semibold outline-none text-foreground focus:ring-2 focus:ring-amber-500/25 focus:border-amber-400 transition-all cursor-pointer shadow-2xs"
            style={{ colorScheme: "light" }}
            value={params.checkOut}
            min={params.checkIn ? addDays(params.checkIn, 1) : addDays(todayStr(), 1)}
            onChange={e => onChange({ ...params, checkOut: e.target.value })}
          />
        </div>
      </div>

      {/* ─── Huéspedes ─── */}
      <div className="min-w-0 md:w-32">
        <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 ttext-muted-foreground text-left flex items-center gap-1">
          <span>👥</span>
          <span>{tx("Huéspedes")}</span>
        </label>
        <select
          className="w-full px-3 py-2.5 rounded-xl border border-border bg-background/70 hover:bg-card focus:bg-card text-sm font-semibold outline-none text-foreground focus:ring-2 focus:ring-amber-500/25 focus:border-amber-400 transition-all cursor-pointer shadow-2xs"
          value={params.adults}
          onChange={e => onChange({ ...params, adults: Number(e.target.value) })}
        >
          {[1, 2, 3, 4, 5, 6].map(n => (
            <option key={n} value={n}>
              {n} {n > 1 ? tx("adultos") : tx("adulto")}
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
        <span>{tx("Buscar Hoteles")}</span>
      </button>

      {/* ─── Modal de Mapa Geográfico Real (Leaflet / CartoDB) ─── */}
      <MantaMapModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        onSelectDestination={handleSelectDestination}
        hotels={getPublicHotels()}
      />
    </div>
  );
}

// ─── Invoice modal ────────────────────────────────────────────────────────────

export { InvoiceModal };

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
  const tx = useI18n();
  const [activeTab, setActiveTab] = useState<"hub" | "reservations" | "personal" | "billing" | "payments" | "about">(initialTab);
  const [resFilter, setResFilter] = useState<"all" | MyReservation["status"]>("all");
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
      documentNumber: "",
      phone: "",
      city: "",
      roomPref: "",
      dietPref: "",
      // Datos de contacto para comprobante
      wantsInvoice: false,
      taxId: "",
      razonSocial: user.name,
      direccionFiscal: "",
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
    showToast(tx("Datos de perfil guardados para tus reservas"));
  }

  function handleSaveBilling(e: React.FormEvent) {
    e.preventDefault();
    try {
      localStorage.setItem(`alojamanta_profile_${user.email}`, JSON.stringify(profile));
    } catch {}
    showToast(tx("✓ Datos de contacto y comprobante actualizados"));
  }

  const allList = reservations.filter(reservation => reservation.guestEmail.toLowerCase() === user.email.toLowerCase());

  const filteredReservations = allList.filter(r => {
    if (resFilter === "all") return true;
    return getReservationStatus(r) === resFilter;
  });

  const totalNights = allList.reduce((s, r) => s + r.nights, 0);
  const _totalPaid = allList.reduce((s, r) => s + r.total, 0);

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
          className="text-xs sm:text-sm font-semibold ttext-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <span>←</span>
          <span>{tx("Volver a buscar hoteles")}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={onLogout}
            className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors font-medium cursor-pointer"
          >
            {tx("Cerrar sesión")}
          </button>
        </div>
      </div>

      {/* Tarjeta de Encabezado del Huésped */}
      <div className="rounded-2xl border bg-card p-5 sm:p-6 mb-6 shadow-xs" style={{ borderColor: "var(--border)" }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b" style={{ borderColor: "var(--muted)" }}>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center text-2xl font-black shadow-md shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-foreground" style={{ fontFamily: "DM Serif Display, serif" }}>
                  {profile.fullName || user.name}
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                  {tx("Cuenta de prueba local")}
                </span>
              </div>
              <p className="text-xs ttext-muted-foreground mt-0.5">{user.email} · {profile.phone}</p>
              <p className="text-[11px] ttext-muted-foreground mt-1">
                {tx("Reserva directa oficial · Sin sobreprecios ni cargos ocultos de intermediarios")}
              </p>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 bg-background sm:bg-transparent p-3 sm:p-0 rounded-xl">
            <span className="text-[11px] ttext-muted-foreground uppercase tracking-wider font-semibold">{tx("Resumen de cuenta")}</span>
            <div className="flex items-center gap-3 text-xs">
              <span className="font-bold text-foreground font-mono">{allList.length} reservas</span>
              <span className="text-slate-300">|</span>
              <span className="font-bold text-amber-600 font-mono">{totalNights} noches</span>
            </div>
          </div>
        </div>

        {/* Barra de pestañas */}
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto whitespace-nowrap scrollbar-none pt-4 text-xs font-semibold">
          {[
            { id: "hub", label: tx("Inicio") },
            { id: "reservations", label: `Mis Reservas (${allList.length})` },
            { id: "personal", label: tx("Datos personales") },
            { id: "billing", label: tx("Comprobantes") },
            { id: "payments", label: tx("Medios de pago") },
            { id: "about", label: tx("Información") },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === t.id
                  ? "bg-slate-900 text-white shadow-xs"
                  : "ttext-muted-foreground hover:bg-muted hover:text-foreground"
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
            <div className="rounded-2xl border bg-card p-5 hover:shadow-md transition-shadow" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-foreground text-base">
                  {tx("Estancias y viajes")}
                </h3>
                <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {allList.length} registradas
                </span>
              </div>
              <div className="space-y-1 divide-y divide-slate-100 text-xs">
                <button
                  onClick={() => setActiveTab("reservations")}
                  className="w-full py-2.5 flex items-center justify-between text-left hover:text-amber-600 transition-colors cursor-pointer group"
                >
                  <span className="text-foreground font-medium group-hover:text-amber-600">{tx("Mis reservas y viajes en Manta")}</span>
                  <span className="ttext-muted-foreground group-hover:translate-x-1 transition-transform">→</span>
                </button>
                <button
                  onClick={() => setActiveTab("reservations")}
                  className="w-full py-2.5 flex items-center justify-between text-left hover:text-amber-600 transition-colors cursor-pointer group"
                >
                  <span className="text-foreground font-medium group-hover:text-amber-600">{tx("Vouchers y comprobantes de reserva")}</span>
                  <span className="ttext-muted-foreground group-hover:translate-x-1 transition-transform">→</span>
                </button>
                <button
                  onClick={onBack}
                  className="w-full py-2.5 flex items-center justify-between text-left hover:text-amber-600 transition-colors cursor-pointer group"
                >
                  <span className="text-foreground font-medium group-hover:text-amber-600">{tx("Explorar alojamientos en Manta")}</span>
                  <span className="ttext-muted-foreground group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </div>

            {/* Card 2: Gestión de la cuenta y Llegada */}
            <div className="rounded-2xl border bg-card p-5 hover:shadow-md transition-shadow" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-foreground text-base">
                  {tx("Datos del titular")}
                </h3>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {tx("Llegada ágil")}
                </span>
              </div>
              <div className="space-y-1 divide-y divide-slate-100 text-xs">
                <button
                  onClick={() => setActiveTab("personal")}
                  className="w-full py-2.5 flex items-center justify-between text-left hover:text-amber-600 transition-colors cursor-pointer group"
                >
                  <span className="text-foreground font-medium group-hover:text-amber-600">{tx("Datos personales (Cédula / Pasaporte)")}</span>
                  <span className="ttext-muted-foreground group-hover:translate-x-1 transition-transform">→</span>
                </button>
                <button
                  onClick={() => setActiveTab("personal")}
                  className="w-full py-2.5 flex items-center justify-between text-left hover:text-amber-600 transition-colors cursor-pointer group"
                >
                  <span className="text-foreground font-medium group-hover:text-amber-600">{tx("Teléfono y WhatsApp de confirmación")}</span>
                  <span className="ttext-muted-foreground group-hover:translate-x-1 transition-transform">→</span>
                </button>
                <button
                  onClick={() => setActiveTab("personal")}
                  className="w-full py-2.5 flex items-center justify-between text-left hover:text-amber-600 transition-colors cursor-pointer group"
                >
                  <span className="text-foreground font-medium group-hover:text-amber-600">{tx("Preferencias de cama y habitación")}</span>
                  <span className="ttext-muted-foreground group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </div>

            {/* Card 3: Comprobantes y Contacto */}
            <div className="rounded-2xl border bg-card p-5 hover:shadow-md transition-shadow" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-foreground text-base">
                  {tx("Comprobantes de pago")}
                </h3>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {tx("Comprobante de Reserva")}
                </span>
              </div>
              <div className="space-y-1 divide-y divide-slate-100 text-xs">
                <button
                  onClick={() => setActiveTab("billing")}
                  className="w-full py-2.5 flex items-center justify-between text-left hover:text-amber-600 transition-colors cursor-pointer group"
                >
                  <span className="text-foreground font-medium group-hover:text-amber-600">{tx("Datos tributarios (RUC / Cédula)")}</span>
                  <span className="ttext-muted-foreground group-hover:translate-x-1 transition-transform">→</span>
                </button>
                <button
                  onClick={() => setActiveTab("billing")}
                  className="w-full py-2.5 flex items-center justify-between text-left hover:text-amber-600 transition-colors cursor-pointer group"
                >
                  <span className="text-foreground font-medium group-hover:text-amber-600">{tx("Razón Social y Domicilio fiscal")}</span>
                  <span className="ttext-muted-foreground group-hover:translate-x-1 transition-transform">→</span>
                </button>
                <button
                  onClick={() => setActiveTab("billing")}
                  className="w-full py-2.5 flex items-center justify-between text-left hover:text-amber-600 transition-colors cursor-pointer group"
                >
                  <span className="text-foreground font-medium group-hover:text-amber-600">{tx("Emisión en recepción del alojamiento")}</span>
                  <span className="ttext-muted-foreground group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </div>

            {/* Card 4: Medios de Pago Digitales */}
            <div className="rounded-2xl border bg-card p-5 hover:shadow-md transition-shadow" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-foreground text-base">
                  {tx("Cobro y pagos")}
                </h3>
                <span className="text-[10px] font-bold ttext-muted-foreground bg-muted px-2 py-0.5 rounded">
                  {tx("Registro local")}
                </span>
              </div>
              <div className="space-y-1 divide-y divide-slate-100 text-xs">
                <button
                  onClick={() => setActiveTab("payments")}
                  className="w-full py-2.5 flex items-center justify-between text-left hover:text-amber-600 transition-colors cursor-pointer group"
                >
                  <span className="text-foreground font-medium group-hover:text-amber-600">{tx("Cobros registrados en mis reservas")}</span>
                  <span className="ttext-muted-foreground group-hover:translate-x-1 transition-transform">→</span>
                </button>
                <button
                  onClick={() => setActiveTab("payments")}
                  className="w-full py-2.5 flex items-center justify-between text-left hover:text-amber-600 transition-colors cursor-pointer group"
                >
                  <span className="text-foreground font-medium group-hover:text-amber-600">{tx("Método registrado por recepción")}</span>
                  <span className="ttext-muted-foreground group-hover:translate-x-1 transition-transform">→</span>
                </button>
                <button
                  onClick={() => setActiveTab("payments")}
                  className="w-full py-2.5 flex items-center justify-between text-left hover:text-amber-600 transition-colors cursor-pointer group"
                >
                  <span className="text-foreground font-medium group-hover:text-amber-600">{tx("Historial de cobros de prueba")}</span>
                  <span className="ttext-muted-foreground group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </div>

            {/* Card 5: Acerca de AlojaManta */}
            <div className="rounded-2xl border bg-card p-5 hover:shadow-md transition-shadow" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-foreground text-base">
                  {tx("Acerca de AlojaManta")}
                </h3>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                  {tx("Red Manta")}
                </span>
              </div>
              <div className="space-y-1 divide-y divide-slate-100 text-xs">
                <button
                  onClick={() => setActiveTab("about")}
                  className="w-full py-2.5 flex items-center justify-between text-left hover:text-amber-600 transition-colors cursor-pointer group"
                >
                  <span className="text-foreground font-medium group-hover:text-amber-600">{tx("116 Alojamientos y validados")}</span>
                  <span className="ttext-muted-foreground group-hover:translate-x-1 transition-transform">→</span>
                </button>
                <button
                  onClick={() => setActiveTab("about")}
                  className="w-full py-2.5 flex items-center justify-between text-left hover:text-amber-600 transition-colors cursor-pointer group"
                >
                  <span className="text-foreground font-medium group-hover:text-amber-600">{tx("Modelo directo sin comisiones abusivas")}</span>
                  <span className="ttext-muted-foreground group-hover:translate-x-1 transition-transform">→</span>
                </button>
                <button
                  onClick={() => setActiveTab("billing")}
                  className="w-full py-2.5 flex items-center justify-between text-left hover:text-amber-600 transition-colors cursor-pointer group"
                >
                  <span className="text-foreground font-medium group-hover:text-amber-600">{tx("Comprobantes digitales y liquidación de reserva")}</span>
                  <span className="ttext-muted-foreground group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </div>

            {/* Card 6: Atención y Asistencia al Huésped */}
            <div className="rounded-2xl border bg-card p-5 hover:shadow-md transition-shadow" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-foreground text-base">
                  {tx("Asistencia al huésped")}
                </h3>
                <span className="text-[10px] font-bold ttext-muted-foreground bg-muted px-2 py-0.5 rounded">
                  {tx("Cantón Manta")}
                </span>
              </div>
              <div className="space-y-1 divide-y divide-slate-100 text-xs">
                <a
                  href="https://wa.me/593998765432?text=Hola%2C%20requiero%20asistencia%20en%20AlojaManta"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 flex items-center justify-between text-left hover:text-emerald-600 transition-colors cursor-pointer group"
                >
                  <span className="text-foreground font-medium group-hover:text-emerald-600">{tx("WhatsApp Manta: +593 99 876 5432")}</span>
                  <span className="text-emerald-600 font-bold group-hover:translate-x-1 transition-transform">💬</span>
                </a>
                <a
                  href="tel:+59352628900"
                  className="py-2.5 flex items-center justify-between text-left hover:text-amber-600 transition-colors cursor-pointer group"
                >
                  <span className="text-foreground font-medium group-hover:text-amber-600">{tx("Línea Cantonal: +593 5 262 8900")}</span>
                  <span className="text-amber-600 font-bold group-hover:translate-x-1 transition-transform">📞</span>
                </a>
                <button
                  onClick={() => setActiveTab("reservations")}
                  className="w-full py-2.5 flex items-center justify-between text-left hover:text-amber-600 transition-colors cursor-pointer group"
                >
                  <span className="text-foreground font-medium group-hover:text-amber-600">{tx("Consultar reservas y comprobantes")}</span>
                  <span className="ttext-muted-foreground group-hover:translate-x-1 transition-transform">→</span>
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card p-3.5 rounded-2xl border" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap text-xs font-semibold">
              {[
                { id: "all", label: tx("Todas") },
                { id: "pending", label: tx("Pendientes") },
                { id: "confirmed", label: tx("Confirmadas") },
                { id: "validated", label: tx("Validadas") },
                { id: "rejected", label: tx("Rechazadas") },
                { id: "expired", label: tx("Vencidas") },
                { id: "completed", label: tx("Completadas") },
                { id: "cancelled", label: tx("Canceladas") },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setResFilter(f.id as any)}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    resFilter === f.id
                      ? "bg-amber-500 text-slate-950 font-bold shadow-xs"
                      : "ttext-muted-foreground hover:bg-muted"
                  }`}
                >
                  {f.label} ({f.id === "all" ? allList.length : allList.filter(reservation => getReservationStatus(reservation) === f.id).length})
                </button>
              ))}
            </div>

            <span className="text-xs ttext-muted-foreground">
              Mostrando {filteredReservations.length} de {allList.length} reservas
            </span>
          </div>

          {/* Listado */}
          <div className="space-y-4">
            {filteredReservations.map(res => {
              const st = getReservationStyle(res);
              return (
                <div key={res.id} className="rounded-2xl border bg-card overflow-hidden shadow-xs hover:shadow-md transition-all" style={{ borderColor: "var(--border)" }}>
                  <div className="flex flex-col sm:flex-row">
                    <img src={res.image} alt={tx(res.room)} className="sm:w-48 w-full object-cover" style={{ height: 140 }} />
                    <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-bold text-foreground text-base">{res.hotel}</p>
                            <p className="text-xs ttext-muted-foreground font-medium">{tx(res.city)} · {tx(res.room)}</p>
                          </div>
                          <span className="mono text-[10px] px-2.5 py-1 rounded-full uppercase font-bold tracking-wider" style={{ background: st.bg, color: st.color }}>
                            {tx(st.label)}
                          </span>
                        </div>
                        <p className="text-xs ttext-muted-foreground mt-2 flex items-center gap-2">
                          <span>📅 {fmtDateShort(res.checkIn)} → {fmtDateShort(res.checkOut)}</span>
                          <span>·</span>
                          <span>🌙 {res.nights} noche{res.nights > 1 ? "s" : ""}</span>
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-3 border-t" style={{ borderColor: "var(--muted)" }}>
                        <div>
                          <p className="text-[10px] ttext-muted-foreground uppercase tracking-wider font-semibold">{tx("Código de reserva")}</p>
                          <p className="font-mono text-sm font-bold text-foreground break-all">{res.id}</p>
                          <p className="text-xs text-muted-foreground">{tx(getPaymentLabel(res))}</p>
                          <RequestDeadline reservation={res} />
                        </div>
                        <div className="flex items-center gap-2.5">
                          <p className="font-black text-lg text-foreground">{fmt(res.total)}</p>
                          <button
                            onClick={() => onViewVoucher(res)}
                            className="text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-xs cursor-pointer flex items-center gap-1"
                          >
                            <span>🧾</span>
                            <span>{tx("Ver Voucher")}</span>
                          </button>
                          {canCancelReservation(res) && (
                            <button
                              onClick={() => {
                                if (confirm(`¿Deseas cancelar la reserva ${res.id}? Recuerda que la política flexible te reintegra el valor total.`)) {
                                  onCancelReservation(res.id);
                                  showToast(`Reserva ${res.id} cancelada correctamente`);
                                }
                              }}
                              className="text-xs px-2.5 py-1.5 rounded-xl font-semibold transition-all border border-red-200 text-red-600 hover:bg-red-50 cursor-pointer"
                            >
                              {tx("Cancelar")}
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
              <div className="text-center py-12 rounded-2xl border bg-card" style={{ borderColor: "var(--border)" }}>
                <p className="text-3xl mb-2">🏖️</p>
                <p className="font-bold text-foreground text-sm">{tx("No tienes reservas con este filtro")}</p>
                <button
                  onClick={() => setResFilter("all")}
                  className="mt-3 text-xs text-amber-700 font-semibold underline cursor-pointer"
                >
                  {tx("Ver todas las reservas")}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── TAB 3: DATOS PERSONALES ─── */}
      {activeTab === "personal" && (
        <form onSubmit={handleSaveProfile} className="rounded-2xl border bg-card p-6 shadow-xs max-w-2xl" style={{ borderColor: "var(--border)" }}>
          <div className="border-b pb-4 mb-5" style={{ borderColor: "var(--muted)" }}>
            <h3 className="font-bold text-foreground text-lg" style={{ fontFamily: "DM Serif Display, serif" }}>
              {tx("Datos Personales del Huésped")}
            </h3>
            <p className="text-xs ttext-muted-foreground mt-0.5">
              {tx("Esta información agiliza la validación de tu reserva en la recepción de los hoteles de Manta.")}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">{tx("Nombre y Apellidos Completos")}</label>
              <input
                type="text"
                value={profile.fullName}
                onChange={e => setProfile({ ...profile, fullName: e.target.value })}
                className="w-full px-3 py-2 text-sm border rounded-xl outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                style={{ borderColor: "var(--border)" }}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-foreground mb-1">{tx("Tipo de Documento")}</label>
                <select
                  value={profile.documentType}
                  onChange={e => setProfile({ ...profile, documentType: e.target.value })}
                  className="w-full px-3 py-2 text-sm border rounded-xl outline-none bg-card"
                  style={{ borderColor: "var(--border)" }}
                >
                  <option value="Cédula de Identidad (Ecuador)">{tx("Cédula de Identidad (Ecuador)")}</option>
                  <option value="Pasaporte Internacional">{tx("Pasaporte Internacional")}</option>
                  <option value="RUC Personal">{tx("RUC Personal")}</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-foreground mb-1">{tx("Número de Identificación")}</label>
                <input
                  type="text"
                  value={profile.documentNumber}
                  onChange={e => setProfile({ ...profile, documentNumber: e.target.value })}
                  placeholder={tx("Ej: 1314589201")}
                  className="w-full px-3 py-2 text-sm border rounded-xl outline-none font-mono"
                  style={{ borderColor: "var(--border)" }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-foreground mb-1">{tx("Correo Electrónico")}</label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full px-3 py-2 text-sm border rounded-xl bg-background ttext-muted-foreground cursor-not-allowed"
                  style={{ borderColor: "var(--border)" }}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-foreground mb-1">{tx("Teléfono / WhatsApp")}</label>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={e => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full px-3 py-2 text-sm border rounded-xl outline-none font-mono"
                  style={{ borderColor: "var(--border)" }}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1">{tx("Ciudad o País de Residencia")}</label>
              <input
                type="text"
                value={profile.city}
                onChange={e => setProfile({ ...profile, city: e.target.value })}
                placeholder={tx("Ej: Quito, Guayaquil, Cuenca, etc.")}
                className="w-full px-3 py-2 text-sm border rounded-xl outline-none"
                style={{ borderColor: "var(--border)" }}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1">{tx("Preferencia Habitual de Habitación")}</label>
              <input
                type="text"
                value={profile.roomPref}
                onChange={e => setProfile({ ...profile, roomPref: e.target.value })}
                placeholder={tx("Ej: Cama King, piso alto, almohadas extras...")}
                className="w-full px-3 py-2 text-sm border rounded-xl outline-none"
                style={{ borderColor: "var(--border)" }}
              />
            </div>

            <div className="pt-3 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab("hub")}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-border hover:bg-background cursor-pointer"
              >
                {tx("Cancelar")}
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-xs cursor-pointer transition-colors"
              >
                {tx("Guardar Datos de Huésped")}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ─── TAB 4: COMPROBANTES Y CONTACTO ─── */}
      {activeTab === "billing" && (
        <form onSubmit={handleSaveBilling} className="rounded-2xl border bg-card p-6 shadow-xs max-w-2xl" style={{ borderColor: "var(--border)" }}>
          <div className="border-b pb-4 mb-5" style={{ borderColor: "var(--muted)" }}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-foreground text-lg flex items-center gap-2" style={{ fontFamily: "DM Serif Display, serif" }}>
                <span>🏛️</span>
                <span>{tx("Datos del Huésped y Comprobante de Reserva")}</span>
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-300">
                {tx("15% IVA")}
              </span>
            </div>
            <p className="text-xs ttext-muted-foreground mt-1">
              <strong>{tx("El establecimiento recibe tus datos verificados para agilizar la validación de tu reserva.")}</strong> Guarda aquí tus datos para que el hotel emita tus comprobantes de estancia a tu nombre o empresa.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
              <span className="text-base">ℹ️</span>
              <p>
                {tx("La plataforma de reserva procesa el cobro del anticipo y transfiere el importe neto al alojamiento. El hotel entrega tu comprobante de estancia y registro al momento de tu llegada.")}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-foreground mb-1">{tx("Cédula o Pasaporte del Huésped")}</label>
                <input
                  type="text"
                  value={profile.taxId}
                  onChange={e => setProfile({ ...profile, taxId: e.target.value })}
                  placeholder={tx("Ej: 1314589201001")}
                  className="w-full px-3 py-2 text-sm border rounded-xl outline-none font-mono"
                  style={{ borderColor: "var(--border)" }}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-foreground mb-1">{tx("Razón Social o Nombre Fiscal")}</label>
                <input
                  type="text"
                  value={profile.razonSocial}
                  onChange={e => setProfile({ ...profile, razonSocial: e.target.value })}
                  placeholder={tx("Nombre de empresa o persona natural")}
                  className="w-full px-3 py-2 text-sm border rounded-xl outline-none"
                  style={{ borderColor: "var(--border)" }}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1">{tx("Dirección Fiscal en Ecuador")}</label>
              <input
                type="text"
                value={profile.direccionFiscal}
                onChange={e => setProfile({ ...profile, direccionFiscal: e.target.value })}
                placeholder={tx("Calle, número y ciudad")}
                className="w-full px-3 py-2 text-sm border rounded-xl outline-none"
                style={{ borderColor: "var(--border)" }}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1">{tx("Correo para Envío de Comprobante")}</label>
              <input
                type="email"
                value={profile.correoComprobante}
                onChange={e => setProfile({ ...profile, correoComprobante: e.target.value })}
                className="w-full px-3 py-2 text-sm border rounded-xl outline-none font-mono"
                style={{ borderColor: "var(--border)" }}
                required
              />
            </div>

            <div className="pt-3 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab("hub")}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-border hover:bg-background cursor-pointer"
              >
                {tx("Volver")}
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-xs cursor-pointer transition-colors"
              >
                {tx("Guardar Datos de Reserva")}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ─── TAB 5: MEDIOS DE PAGO ─── */}
      {activeTab === "payments" && (
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <h3 className="text-xl text-foreground">{tx("Pagos de mis reservas")}</h3>
          <p className="text-sm text-muted-foreground">{tx("La pasarela no está conectada. Solo se muestran los cobros de prueba registrados por el hotel.")}</p>
          {allList.filter(item => item.payment).length === 0 && <p>{tx("No hay cobros registrados.")}</p>}
          {allList.filter(item => item.payment).map(item => <div key={item.id} className="border-t border-border pt-3">
            <p className="break-all">{item.hotel} · {item.id}</p>
            <p>{fmt(item.payment!.amount)} · {item.payment!.method} · {item.payment!.recordedAt.slice(0, 10)}</p>
          </div>)}
        </div>
      )}

      {/* ─── TAB 6: ACERCA DE ALOJAMANTA ─── */}
      {activeTab === "about" && (
        <div className="rounded-2xl border bg-card p-6 sm:p-8 shadow-xs max-w-3xl space-y-6" style={{ borderColor: "var(--border)" }}>
          <div className="border-b pb-5" style={{ borderColor: "var(--muted)" }}>
            <div className="flex items-center gap-3">
              <span className="text-3xl">ℹ️</span>
              <div>
                <h3 className="font-bold text-foreground text-xl sm:text-2xl" style={{ fontFamily: "DM Serif Display, serif" }}>
                  {tx("Acerca de AlojaManta")}
                </h3>
                <p className="text-xs sm:text-sm ttext-muted-foreground mt-0.5">
                  {tx("Red oficial de comercialización directa y formalización hotelera del Cantón Manta.")}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm ttext-muted-foreground leading-relaxed">
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-foreground">
              <h4 className="font-bold text-amber-950 text-sm mb-1 flex items-center gap-1.5">
                <span>🏛️</span>
                <span>{tx("Iniciativa Turística Cantonal de Hospedaje Formal")}</span>
              </h4>
              <p>
                <strong>AlojaManta</strong> {tx("es la plataforma tecnológica desarrollada para articular de forma transparente la oferta de alojamiento formal en la ciudad y cantón de Manta, Manabí, conectando a huéspedes nacionales y extranjeros directamente con los establecimientos de hospedaje.")}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="p-4 rounded-xl border border-border bg-background/80">
                <div className="flex items-center gap-2 font-bold text-foreground mb-1">
                  <span className="text-base">🏨</span>
                  <span>{tx("116 Alojamientos")}</span>
                </div>
                <p className="text-xs ttext-muted-foreground">
                  {tx("Integra hoteles, hostales, hosterías y residencias turísticas legalmente registradas e inspeccionadas en Barbasquillo, El Murciélago, Tarqui, Los Esteros, San Mateo y Santa Marianita.")}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border bg-background/80">
                <div className="flex items-center gap-2 font-bold text-foreground mb-1">
                  <span className="text-base">💰</span>
                  <span>{tx("0% Sobreprecio de Intermediarios")}</span>
                </div>
                <p className="text-xs ttext-muted-foreground">
                  {tx("Elimina el sobreprecio del 18% al 20% habitual de las agencias de viajes online (OTAs) internacionales. La tarifa que pagas va íntegramente a dinamizar el sector hotelero local.")}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border bg-background/80">
                <div className="flex items-center gap-2 font-bold text-foreground mb-1">
                  <span className="text-base">🏛️</span>
                  <span>{tx("Comprobante de Reserva y Liquidación")}</span>
                </div>
                <p className="text-xs ttext-muted-foreground">
                  {tx("La solicitud requiere aceptación del hotel. El resumen de reserva no acredita el pago ni sustituye una factura.")}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border bg-background/80">
                <div className="flex items-center gap-2 font-bold text-foreground mb-1">
                  <span className="text-base">📱</span>
                  <span>{tx("Confirmación Digital Inmediata")}</span>
                </div>
                <p className="text-xs ttext-muted-foreground">
                  {tx("Cada reserva genera un voucher oficial con código de confirmación y token de verificación instantáneo para recepción sin trámites engorrosos ni papeleo innecesario.")}
                </p>
              </div>
            </div>

            <div className="border-t pt-4 border-border">
              <h4 className="font-bold text-foreground text-xs sm:text-sm mb-1.5">{tx("Compromiso con el Huésped y la Ciudad")}</h4>
              <p className="text-xs ttext-muted-foreground">
                {tx("Al reservar mediante AlojaManta, aseguras un trato directo con los anfitriones y hoteleros de Manta, políticas de cancelación claras, seguridad en tus pagos digitales y el respaldo de establecimientos que cumplen con los estándares de hospitalidad del puerto manabita.")}
              </p>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => setActiveTab("hub")}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-border hover:bg-background cursor-pointer"
              >
                ← {tx("Volver al Panel")}
              </button>
              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-xs cursor-pointer transition-colors"
                >
                  {tx("Explorar Alojamientos Disponibles →")}
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
  const tx = useI18n();
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(5px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-2xl rounded-2xl border bg-card overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150" style={{ borderColor: "var(--border)" }}>
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">ℹ️</span>
            <div>
              <h3 className="font-bold text-foreground text-lg" style={{ fontFamily: "DM Serif Display, serif" }}>
                {tx("Acerca de AlojaManta")}
              </h3>
              <p className="text-xs ttext-muted-foreground">
                {tx("Red oficial de reservas directas y formalización hotelera del Cantón Manta")}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-border flex items-center justify-center ttext-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer text-sm"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs ttext-muted-foreground leading-relaxed">
          {/* Banner */}
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-foreground">
            <h4 className="font-bold text-amber-950 text-sm mb-1 flex items-center gap-1.5">
              <span>🏛️</span>
              <span>{tx("Iniciativa Turística y Comercial Cantonal")}</span>
            </h4>
            <p>
              <strong>AlojaManta</strong> {tx("nace como el ecosistema digital directo para que los visitantes puedan reservar con total seguridad en la planta hotelera formal del cantón Manta (Manabí, Ecuador), sin pagar sobreprecios a intermediarios internacionales.")}
            </p>
          </div>

          {/* 4 Pilares clave */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-3.5 rounded-xl border border-border bg-background/70">
              <div className="flex items-center gap-2 font-bold text-foreground mb-1">
                <span className="text-base">🏨</span>
                <span>{tx("116 Establecimientos Registrados")}</span>
              </div>
              <p className="text-[11px] ttext-muted-foreground">
                {tx("Catastro completo de hoteles, hostales, hosterías y departamentos en Barbasquillo, El Murciélago, Tarqui, Los Esteros, San Mateo y Santa Marianita.")}
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-border bg-background/70">
              <div className="flex items-center gap-2 font-bold text-foreground mb-1">
                <span className="text-base">💰</span>
                <span>{tx("0% Comisión de Intermediación (OTA)")}</span>
              </div>
              <p className="text-[11px] ttext-muted-foreground">
                {tx("A diferencia de portales foráneos que cobran entre el 18% y 20% al hotelero, aquí se garantiza la tarifa más competitiva y el dinero dinamiza directamente la economía local.")}
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-border bg-background/70">
              <div className="flex items-center gap-2 font-bold text-foreground mb-1">
                <span className="text-base">🏛️</span>
                <span>{tx("Comprobante Oficial de Reserva")}</span>
              </div>
              <p className="text-[11px] ttext-muted-foreground">
                {tx("El comprobante oficial con 15% de IVA y detalle de reserva certifica tu estancia y pago anticipado.")}
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-border bg-background/70">
              <div className="flex items-center gap-2 font-bold text-foreground mb-1">
                <span className="text-base">📲</span>
                <span>{tx("Vouchers con Código de Confirmación")}</span>
              </div>
              <p className="text-[11px] ttext-muted-foreground">
                {tx("Confirmación instantánea con código de reserva único descargable en PDF o guardado en tu cuenta para un registro ágil en recepción.")}
              </p>
            </div>
          </div>

          {/* Contacto Directo */}
          <div className="p-4 rounded-xl border border-border bg-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="font-bold text-foreground text-xs">{tx("Mesa de Asistencia Turística Manta")}</p>
              <p className="text-[11px] ttext-muted-foreground">{tx("Atención directa para consultas de reserva y orientación en el cantón.")}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a
                href="https://wa.me/593998765432?text=Hola%2C%20quisiera%20m%C3%A1s%20informaci%C3%B3n%20sobre%20AlojaManta"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 transition-colors"
              >
                <span>💬</span>
                <span>{tx("WhatsApp")}</span>
              </a>
              <a
                href="tel:+59352628900"
                className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-background text-foreground font-bold text-xs flex items-center gap-1 transition-colors"
              >
                <span>📞</span>
                <span>{tx("Llamar")}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t bg-background flex items-center justify-between text-xs" style={{ borderColor: "var(--border)" }}>
          <span className="ttext-muted-foreground">{tx("Cantón Manta · Manabí · Ecuador")}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-card border border-slate-300 rounded-lg text-foreground font-medium hover:bg-muted cursor-pointer"
            >
              {tx("Cerrar")}
            </button>
            {onExplore && (
              <button
                onClick={onExplore}
                className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg cursor-pointer transition-colors shadow-2xs"
              >
                {tx("Explorar Hoteles")}
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
  const tx = useI18n();
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(5px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-2xl rounded-2xl border bg-card overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150" style={{ borderColor: "var(--border)" }}>
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🏛️</span>
            <div>
              <h3 className="font-bold text-foreground text-lg" style={{ fontFamily: "DM Serif Display, serif" }}>
                {tx("Términos del Servicio y Privacidad LOPDP")}
              </h3>
              <p className="text-xs ttext-muted-foreground">
                {tx("Normativa tributaria y condiciones de reserva en AlojaManta")}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-border flex items-center justify-center ttext-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer text-sm"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs ttext-muted-foreground leading-relaxed">
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-foreground">
            <h4 className="font-bold text-blue-950 text-sm mb-1 flex items-center gap-1.5">
              <span>🧾</span>
              <span>{tx("Comprobante Digital de Reserva y Pagos")}</span>
            </h4>
            <p>
              {tx("La plataforma emite el comprobante de reserva y certificación de pago digital con el desglose del 15% de IVA. El establecimiento hotelero entrega el recibo y comprobante de estancia directamente presentando tu código de reserva a la llegada.")}
            </p>
          </div>

          <div className="space-y-3">
            <div className="border border-border rounded-xl p-3.5 bg-background/50">
              <h5 className="font-bold text-foreground mb-1">{tx("1. Datos Tributarios Requeridos")}</h5>
              <p className="text-[11px] ttext-muted-foreground">
                {tx("Puedes registrar previamente tu documento de identidad, nombres completos y correo electrónico desde la pestaña \"Comprobantes y Contacto\" de tu cuenta para agilizar tu registro en recepción.")}
              </p>
            </div>

            <div className="border border-border rounded-xl p-3.5 bg-background/50">
              <h5 className="font-bold text-foreground mb-1">{tx("2. Cancelación y Modificaciones")}</h5>
              <p className="text-[11px] ttext-muted-foreground">
                {tx("Las políticas de cancelación son transparentes y fijadas por cada establecimiento. Puedes anular o reprogramar tu estancia directamente desde \"Mis Reservas\" o comunicándote con el hotel a través de los canales de asistencia autorizados.")}
              </p>
            </div>

            <div className="border border-border rounded-xl p-3.5 bg-background/50">
              <h5 className="font-bold text-foreground mb-1">{tx("3. Protección y Privacidad de Datos")}</h5>
              <p className="text-[11px] ttext-muted-foreground">
                {tx("Tus datos personales y de pago se procesan bajo protocolos cifrados y no son compartidos con terceros comerciales ajenos a la estancia hotelera contratada.")}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t bg-background flex items-center justify-end text-xs" style={{ borderColor: "var(--border)" }}>
          <button
            onClick={onClose}
            className="px-5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg cursor-pointer transition-colors"
          >
            {tx("Entendido")}
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
  const tx = useI18n();
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
      <div className="w-full max-w-2xl rounded-2xl border bg-card overflow-hidden shadow-2xl flex flex-col" style={{ maxHeight: "90vh" }}>
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-foreground text-lg" style={{ fontFamily: "DM Serif Display, serif" }}>
                {tx("Consultar Reservas de Hotel")}
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold border border-amber-300">
                Manta 2026
              </span>
            </div>
            <p className="text-xs ttext-muted-foreground mt-0.5">
              {tx("Busca por código de confirmación (ej: RES-4821), correo o nombre del titular")}
            </p>
          </div>
          <button onClick={onClose} className="text-2xl ttext-muted-foreground hover:text-foreground cursor-pointer">×</button>
        </div>

        {/* Search input */}
        <div className="p-5 border-b bg-background" style={{ borderColor: "var(--border)" }}>
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={tx("Escribe RES-4821, tu correo (cmendez@gmail.com) o nombre...")}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm bg-card focus:outline-none focus:ring-2 focus:ring-amber-400"
              style={{ borderColor: "var(--border)" }}
              autoFocus
            />
            <span className="absolute left-3.5 top-3 ttext-muted-foreground text-sm">🔍</span>
            {query && (
              <button onClick={() => setQuery("")} className="absolute right-3 top-2.5 text-xs ttext-muted-foreground hover:ttext-muted-foreground cursor-pointer">
                {tx("Limpiar")}
              </button>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-1.5 mt-2.5 text-xs">
            <span className="ttext-muted-foreground">{tx("Códigos rápidos para probar:")}</span>
            {["RES-4821", "RES-5103", "RES-3970", "RES-7720", "RES-8941"].map(c => (
              <button
                key={c}
                onClick={() => setQuery(c)}
                className="font-mono text-[11px] px-2 py-0.5 rounded bg-card border border-border text-amber-800 hover:bg-amber-50 cursor-pointer font-semibold"
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
              const st = getReservationStyle(res);

              return (
                <div key={res.id} className="rounded-xl border p-4 hover:shadow-md transition-all bg-card" style={{ borderColor: "var(--border)" }}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b" style={{ borderColor: "var(--muted)" }}>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-foreground break-all">{res.id}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase" style={{ background: st.bg, color: st.color }}>
                          {tx(st.label)}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-foreground mt-0.5">{res.hotel} · {tx(res.city)}</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-xs ttext-muted-foreground">{tx("Importe de la reserva")}</p>
                      <p className="font-bold text-base text-amber-600">{fmt(res.total)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-2.5 text-xs ttext-muted-foreground">
                    <div>
                      <p className="ttext-muted-foreground text-[10px]">{tx("Huésped Titular")}</p>
                      <p className="font-medium truncate">{res.guestName}</p>
                    </div>
                    <div>
                      <p className="ttext-muted-foreground text-[10px]">{tx("Tipo de Habitación")}</p>
                      <p className="font-medium truncate">{tx(res.room)}</p>
                    </div>
                    <div>
                      <p className="ttext-muted-foreground text-[10px]">{tx("Fechas")}</p>
                      <p className="font-medium">{fmtDateShort(res.checkIn)} → {fmtDateShort(res.checkOut)}</p>
                    </div>
                    <div>
                      <p className="ttext-muted-foreground text-[10px]">{tx("Duración")}</p>
                      <p className="font-medium">{res.nights} noche{res.nights > 1 ? "s" : ""}</p>
                    </div>
                  </div>

                  <RequestDeadline reservation={res} />
                  <div className="flex items-center justify-between pt-2.5 border-t gap-2" style={{ borderColor: "var(--muted)" }}>
                    <span className="text-[11px] ttext-muted-foreground flex items-center gap-1">
                      <span aria-hidden="true">💳</span> <span>{tx(getPaymentLabel(res))}</span>
                    </span>
                    <div className="flex gap-2">
                      {canCancelReservation(res) && (
                        <button
                          onClick={() => {
                            if (confirm(`¿Estás seguro de cancelar la reserva ${res.id}?`)) {
                              onCancelReservation(res.id);
                            }
                          }}
                          className="px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg border border-red-200 cursor-pointer font-medium"
                        >
                          {tx("Cancelar")}
                        </button>
                      )}
                      <button
                        onClick={() => {
                          onViewVoucher(res);
                        }}
                        className="px-3 py-1.5 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg shadow-xs cursor-pointer flex items-center gap-1"
                      >
                        <span>🧾</span>
                        <span>{tx("Ver Voucher & Comprobante")}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12">
              <span className="text-4xl block mb-2">🔍</span>
              <p className="font-bold text-foreground">{tx("No encontramos reservas con ese término")}</p>
              <p className="text-xs ttext-muted-foreground max-w-sm mx-auto mt-1">
                {tx("Verifica haber escrito correctamente tu código de confirmación (ej: RES-4821) o el correo con el que hiciste la reserva.")}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t bg-background flex items-center justify-between text-xs ttext-muted-foreground" style={{ borderColor: "var(--border)" }}>
          <span>{tx("¿Inquietudes sobre tu estancia? Central Manta: +593 5 262 8900")}</span>
          <button onClick={onClose} className="px-4 py-1.5 bg-card border rounded-lg text-foreground font-medium hover:bg-muted cursor-pointer">
            {tx("Cerrar")}
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
  const tx = useI18n();
  const [tab, setTab] = useState<"guest" | "admin">("guest");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  function handleGuestSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      setError(tx("Completa correo y contraseña."));
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
      <div className="w-full max-w-md rounded-2xl border bg-card overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <div>
            <span className="font-bold text-amber-600 text-lg" style={{ fontFamily: "DM Serif Display, serif" }}>
              AlojaManta
            </span>
            <p className="text-xs ttext-muted-foreground">{tx("Acceso al sistema y consulta de reservas")}</p>
          </div>
          <button onClick={onClose} className="text-2xl ttext-muted-foreground hover:text-foreground cursor-pointer">×</button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b" style={{ borderColor: "var(--border)", background: "var(--background)" }}>
          <button
            onClick={() => setTab("guest")}
            className={`flex-1 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              tab === "guest" ? "border-amber-500 text-foreground bg-card" : "border-transparent ttext-muted-foreground hover:text-foreground"
            }`}
          >
            👤 Huésped / Turista
          </button>
          <button
            onClick={() => setTab("admin")}
            className={`flex-1 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              tab === "admin" ? "border-amber-500 text-foreground bg-card" : "border-transparent ttext-muted-foreground hover:text-foreground"
            }`}
          >
            {tx("🏨 Personal de Hotel / PMS")}
          </button>
        </div>

        <div className="p-6">
          {tab === "guest" ? (
            <div className="space-y-4">
              <form onSubmit={handleGuestSubmit} className="space-y-3">
                {mode === "register" && (
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">{tx("Nombre y Apellido")}</label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder={tx("Ej. Carlos Méndez")}
                      className="w-full px-3 py-2 text-sm border rounded-xl"
                      style={{ borderColor: "var(--border)" }}
                      required
                    />
                  </div>
                )}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">{tx("Correo Electrónico")}</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="tu@correo.com"
                    className="w-full px-3 py-2 text-sm border rounded-xl"
                    style={{ borderColor: "var(--border)" }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">{tx("Contraseña")}</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 text-sm border rounded-xl"
                    style={{ borderColor: "var(--border)" }}
                    required
                  />
                </div>

                {error && <p className="text-xs text-red-600">{error}</p>}

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl text-sm font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-sm cursor-pointer"
                >
                  {mode === "login" ? tx("Ingresar a mi cuenta") : tx("Crear cuenta")}
                </button>
              </form>

              <div className="flex items-center justify-between text-xs ttext-muted-foreground pt-1">
                <button
                  onClick={() => setMode(mode === "login" ? "register" : "login")}
                  className="text-amber-600 hover:underline font-medium cursor-pointer"
                >
                  {mode === "login" ? tx("¿No tienes cuenta? Regístrate gratis") : tx("¿Ya tienes cuenta? Inicia sesión")}
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
                    className="text-xs ttext-muted-foreground hover:text-amber-700 transition-colors cursor-pointer"
                  >
                    ¿Buscas una reserva con tu código? <span className="font-semibold underline text-amber-600">{tx("Consultar aquí")}</span>
                  </button>
                </div>
              )}

              {/* Acceso Rápido Demo */}
              <div className="pt-3 border-t" style={{ borderColor: "var(--muted)" }}>
                <p className="text-[11px] ttext-muted-foreground font-semibold uppercase tracking-wider mb-2">
                  {tx("Acceso Rápido de Prueba:")}
                </p>
                <button
                  onClick={() => handleDemoLogin({ name: "Carlos Méndez", email: "cmendez@gmail.com" })}
                  className="w-full py-2 px-3 text-xs rounded-xl border border-amber-300 bg-amber-50 text-amber-900 font-semibold hover:bg-amber-100 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span aria-hidden="true">⚡</span>
                  <span>{tx("Ingresar como Carlos Méndez")}</span>
                </button>
                <button
                  onClick={() => handleDemoLogin({ name: "Laura Fernández", email: "lfernandez@hotmail.com" })}
                  className="w-full mt-2 py-2 px-3 text-xs rounded-xl border border-border bg-background text-foreground font-semibold hover:bg-secondary cursor-pointer"
                >
                  {tx("Ingresar como Laura Fernández")}
                </button>
                <p className="text-xs text-muted-foreground mt-2">{tx("Cuentas de prueba sin reservas precargadas.")}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                <p className="font-bold">{tx("Panel Multi-Hotel Cantón Manta (116 Alojamientos)")}</p>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  {tx("Acceso directo con roles RBAC para los 116 establecimientos oficiales del Catastro de Manta.")}
                </p>
              </div>

              <div className="space-y-2">
                {[
                  { role: tx("Superadmin Cantonal"), name: "Carlos Admin", email: "admin@alojamanta.ec", desc: tx("Supervisión de los 116 hoteles de Manta") },
                  { role: tx("Administrador de Hotel"), name: "Ana Administradora", email: "direccion@mantahost.ec", desc: tx("MantaHost Hotel (Gestión integral)") },
                  { role: "Revenue Manager", name: "María Revenue", email: "revenue@mantahost.ec", desc: tx("Tarifas, temporadas y tipos de habitación") },
                  { role: tx("Recepcionista Mostrador"), name: "Juan Recepción", email: "recepcion@mantahost.ec", desc: tx("Operación de reservas y comprobantes digitales") },
                ].map(acc => (
                  <button
                    key={acc.email}
                    onClick={() => {
                      onClose();
                      onAdminAccess?.();
                    }}
                    className="w-full p-3 rounded-xl border text-left hover:border-amber-400 hover:bg-background transition-all flex items-center justify-between cursor-pointer"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <div>
                      <p className="text-xs font-bold text-foreground">{acc.name} <span className="text-[10px] text-amber-600 font-mono">({acc.role})</span></p>
                      <p className="text-[11px] ttext-muted-foreground">{acc.desc}</p>
                    </div>
                    <span className="text-xs text-amber-600 font-bold">{tx("Entrar →")}</span>
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
                {tx("Abrir pantalla completa de acceso hotelero")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Booking modal ────────────────────────────────────────────────────────────

type BookingStep = "auth" | "details" | "review" | "submitted";

function BookingModal({
  hotel,
  room,
  params,
  user,
  onClose,
  onGuestLogin,
}: {
  hotel: Hotel;
  room: RoomOffer;
  params: SearchParams;
  user: GuestUser | null;
  onClose: () => void;
  onGuestLogin: (u: GuestUser) => void;
}) {
  const tx = useI18n();
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
  const [requestError, setRequestError] = useState("");
  const [submittedReservation, setSubmittedReservation] = useState<MyReservation | null>(null);
  const currentReservations = useGuestReservations();
  const arrivalPolicy = useArrivalPolicy(hotel.id, params.checkIn);

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

  const [resId] = useState(() => `RES-${crypto.randomUUID().toUpperCase()}`);

  const STEPS: { k: BookingStep; l: string }[] = user
    ? [{ k: "details", l: tx("1. Datos y Tarifa") }, { k: "review", l: tx("2. Revisar solicitud") }, { k: "submitted", l: tx("3. Solicitud guardada") }]
    : [{ k: "auth", l: tx("1. Acceso / Invitado") }, { k: "details", l: tx("2. Datos y Tarifa") }, { k: "review", l: tx("3. Revisar solicitud") }, { k: "submitted", l: tx("4. Solicitud guardada") }];

  const stepIndex = STEPS.findIndex(s => s.k === step);

  function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    if (!authEmail || !authPass) { setAuthError(tx("Completa todos los campos.")); return; }
    if (authMode === "register" && !authName) { setAuthError(tx("Indica tu nombre.")); return; }
    const u: GuestUser = { name: authMode === "register" ? authName : authEmail.split("@")[0], email: authEmail };
    onGuestLogin(u);
    setForm(f => ({ ...f, name: u.name, email: u.email }));
    setAuthError("");
    setStep("details");
  }

  function handleSubmitRequest(event: React.FormEvent) {
    event.preventDefault();
    if (processing) return;
    setProcessing(true);
    setRequestError("");
    try {
      const newRes = reservationWorkflow.submitPortal({
        id: resId,
        hotel: hotel.name,
        hotelId: hotel.id,
        city: hotel.city,
        room: room.type,
        checkIn: params.checkIn,
        checkOut: params.checkOut,
        total,
        image: room.image || hotel.image,
        guestName: form.name.trim(),
        guestEmail: form.email.trim(),
        guestPhone: form.phone,
        guestDocumentType: docType,
        guestDocument: form.dni,
        guestCity: form.city,
        guestCountry: form.country,
        guestAddress: form.address,
        adults: params.adults,
        children: params.children,
        notes: form.notes,
      }, room);
      setSubmittedReservation(newRes);
      setStep("submitted");
      addAuditLog({
        usuario: newRes.guestName,
        rol: user ? "Huésped Registrado" : "Checkout Invitado",
        modulo: "Motor de Reservas Web",
        accion: "SOLICITUD_WEB_CREADA",
        detalle: `Solicitud ${newRes.id} en ${hotel.name}; pendiente de aceptación y pago`,
      });
    } catch (error) {
      setRequestError(error instanceof Error ? error.message : "No se pudo guardar la solicitud.");
    } finally {
      setProcessing(false);
    }
  }

  if (!arrivalPolicy.allowed && step !== "submitted") return (
    <ReservationDialog title={tx("Atención directa del hotel")} onClose={onClose}>
      <div className="p-5 space-y-3 text-foreground"><p>{tx(arrivalPolicy.message)}</p><p>{hotel.name}</p></div>
    </ReservationDialog>
  );

  // ── Shared backdrop
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        style={{ background: "var(--card)", maxHeight: "92vh" }}>

        {/* Step bar */}
        <div className="flex flex-shrink-0" style={{ borderBottom: "1px solid #e2e8f0" }}>
          {STEPS.map((s, i) => {
            const done = i < stepIndex;
            const active = s.k === step;
            return (
              <div key={s.k} className="flex-1 text-center py-2.5 text-[10px] font-bold uppercase tracking-wide transition-all"
                style={{ background: active ? "#fef3c7" : "var(--background)", color: active ? "#92400e" : done ? "#059669" : "var(--muted-foreground)", borderBottom: active ? "2px solid #f59e0b" : "2px solid transparent" }}>
                {done ? "✓ " : ""}{s.l}
              </div>
            );
          })}
        </div>

        {/* Room strip (not on invoice) */}
        {step !== "submitted" && (
          <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0" style={{ background: "var(--background)", borderBottom: "1px solid #e2e8f0" }}>
            <img src={room.image} alt={tx(room.type)} className="w-14 h-10 rounded-lg object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-foreground text-sm truncate">{hotel.name}</p>
              <p className="text-xs ttext-muted-foreground">{tx(room.type)} · {nights}n · {fmtDateShort(params.checkIn)} → {fmtDateShort(params.checkOut)}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="font-bold text-sm" style={{ color: "#f59e0b" }}>{fmt(total)}</p>
              <p className="text-[10px] ttext-muted-foreground">{tx("IVA incl.")}</p>
            </div>
            <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs" style={{ background: "var(--border)", color: "var(--muted-foreground)" }}>✕</button>
          </div>
        )}

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-5">

          {/* ── STEP: AUTH ── */}
          {step === "auth" && (
            <div className="space-y-4">
              <div className="text-center pb-1">
                <h3 className="font-bold text-foreground text-base" style={{ fontFamily: "DM Serif Display, serif" }}>
                  {authMode === "login" ? tx("Inicia sesión o reserva como invitado") : tx("Crea tu cuenta gratis")}
                </h3>
                <p className="text-xs ttext-muted-foreground mt-1">{tx("Accede con tu cuenta o reserva directamente sin necesidad de registrarte")}</p>
              </div>

              {/* Guest Checkout */}
              <button
                type="button"
                onClick={() => setStep("details")}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 border border-emerald-600 bg-emerald-50 text-emerald-900 hover:bg-emerald-100 cursor-pointer shadow-sm"
              >
                <span>{tx("Continuar como invitado")}</span>
              </button>

              <div className="relative flex items-center gap-2">
                <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
                <span className="text-[11px] ttext-muted-foreground uppercase font-semibold">{tx("o accede con tu cuenta")}</span>
                <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
              </div>

              <div className="flex rounded-xl overflow-hidden border" style={{ borderColor: "var(--border)" }}>
                {[{ k: "login" as const, l: tx("Iniciar sesión") }, { k: "register" as const, l: tx("Registrarme") }].map(m => (
                  <button key={m.k} onClick={() => setAuthMode(m.k)} className="flex-1 py-2 text-sm font-semibold transition-all" style={{ background: authMode === m.k ? "#f59e0b" : "var(--background)", color: authMode === m.k ? "#0c1220" : "var(--muted-foreground)" }}>{m.l}</button>
                ))}
              </div>
              <form onSubmit={handleAuth} className="space-y-3">
                {authMode === "register" && (
                  <div>
                    <label className="block text-xs ttext-muted-foreground mb-1">{tx("Nombre completo")}</label>
                    <input className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none" style={{ borderColor: "var(--border)", color: "#1e293b" }} value={authName} onChange={e => setAuthName(e.target.value)} placeholder="María García" />
                  </div>
                )}
                <div>
                  <label className="block text-xs ttext-muted-foreground mb-1">Email</label>
                  <input type="email" className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none" style={{ borderColor: "var(--border)", color: "#FFFFFF" }} value={authEmail} onChange={e => setAuthEmail(e.target.value)} placeholder="maria@email.com" />
                </div>
                <div>
                  <label className="block text-xs ttext-muted-foreground mb-1">{tx("Contraseña")}</label>
                  <input type="password" className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none" style={{ borderColor: "var(--border)", color: "#FFFFFF" }} value={authPass} onChange={e => setAuthPass(e.target.value)} placeholder="••••••••" />
                </div>
                {authError && <p className="text-xs px-3 py-2 rounded-lg" style={{ background: "#fee2e2", color: "#ef4444" }}>{authError}</p>}
                <button type="submit" className="w-full py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all" style={{ background: "#f59e0b", color: "#0c1220" }}>
                  {authMode === "login" ? tx("Entrar y continuar →") : tx("Crear cuenta y continuar →")}
                </button>
              </form>
              <button onClick={() => { const u = { name: "Usuario Google", email: "usuario@gmail.com" }; onGuestLogin(u); setForm(f => ({ ...f, ...u })); setStep("details"); }} className="w-full py-2.5 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 hover:bg-background transition-colors" style={{ borderColor: "var(--border)", color: "#475569" }}>
                <span>{tx("Continuar con Google")}</span>
              </button>
            </div>
          )}

          {/* ── STEP: DETAILS ── */}
          {step === "details" && (
            <div className="space-y-4">
              <h3 className="font-bold text-foreground">{tx("1. Datos del huésped titular")}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold ttext-muted-foreground mb-1">{tx("Nombre completo del titular *")}</label>
                  <input
                    className="w-full px-3 py-2 rounded-lg border text-sm outline-none focus:border-amber-500"
                    style={{ borderColor: "var(--border)", color: "#FFFFFF" }}
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder={tx("Ej: Carlos Mendoza")}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold ttext-muted-foreground mb-1">{tx("Email para voucher y confirmación *")}</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 rounded-lg border text-sm outline-none focus:border-amber-500"
                    style={{ borderColor: "var(--border)", color: "#FFFFFF" }}
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="cliente@correo.ec"
                    required
                  />
                </div>
              </div>

              {/* Selector dinámico de Tipo de Documento */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-background border border-border">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">{tx("Tipo de Documento *")}</label>
                  <select
                    value={docType}
                    onChange={e => {
                      const t = e.target.value as "CEDULA" | "RUC" | "PASAPORTE";
                      setDocType(t);
                      setForm(f => ({ ...f, dni: "" }));
                    }}
                    className="w-full px-3 py-2 rounded-lg border text-xs font-semibold outline-none bg-card cursor-pointer"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <option value="CEDULA">{tx("Cédula de Identidad (10 dígitos)")}</option>
                    <option value="RUC">{tx("RUC (13 dígitos / Empresa)")}</option>
                    <option value="PASAPORTE">{tx("Pasaporte Internacional (Alfanumérico)")}</option>
                  </select>
                </div>

                <div className={docType === "RUC" ? "sm:col-span-1" : "sm:col-span-2"}>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    {docType === "CEDULA" && tx("Cédula de Identidad (10 dígitos) *")}
                    {docType === "RUC" && tx("Número de RUC (13 dígitos) *")}
                    {docType === "PASAPORTE" && tx("Número de Pasaporte (Alfanumérico) *")}
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
                    className="w-full px-3 py-2 rounded-lg border text-sm outline-none font-mono bg-card"
                    style={{ borderColor: "var(--border)" }}
                    required
                  />
                  {docType === "CEDULA" && form.dni.length > 0 && form.dni.length !== 10 && (
                    <p className="text-[10px] text-amber-600 mt-0.5">{tx("La cédula debe contener exactamente 10 dígitos numéricos.")}</p>
                  )}
                  {docType === "RUC" && form.dni.length > 0 && form.dni.length !== 13 && (
                    <p className="text-[10px] text-amber-600 mt-0.5">{tx("El RUC ecuatoriano debe tener 13 dígitos numéricos (termina en 001).")}</p>
                  )}
                </div>

                {docType === "RUC" && (
                  <div className="col-span-1 sm:col-span-3">
                    <label className="block text-xs font-semibold text-foreground mb-1">{tx("Razón Social o Nombre de Empresa *")}</label>
                    <input
                      type="text"
                      value={form.razonSocial}
                      onChange={e => setForm({ ...form, razonSocial: e.target.value })}
                      placeholder="Ej: IMPORTADORA DEL PACIFICO S.A.S."
                      className="w-full px-3 py-2 rounded-lg border text-sm outline-none bg-card"
                      style={{ borderColor: "var(--border)" }}
                      required
                    />
                  </div>
                )}
              </div>

              {/* Teléfono, País, Ciudad y Dirección */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold ttext-muted-foreground mb-1">{tx("Teléfono / WhatsApp *")}</label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 rounded-lg border text-sm outline-none font-mono"
                    style={{ borderColor: "var(--border)", color: "#3 98 4" }}
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    placeholder="+593 98 421 8890"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold ttext-muted-foreground mb-1">{tx("País")}</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                    style={{ borderColor: "var(--border)", color: "#FFFFFF" }}
                    value={form.country}
                    onChange={e => setForm({ ...form, country: e.target.value })}
                    placeholder="Ecuador"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold ttext-muted-foreground mb-1">{tx("Ciudad")}</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                    style={{ borderColor: "var(--border)", color: "#FFFFFF" }}
                    value={form.city}
                    onChange={e => setForm({ ...form, city: e.target.value })}
                    placeholder="Manta, Portoviejo, Quito..."
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold ttext-muted-foreground mb-1">{tx("Dirección domiciliaria o fiscal")}</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                    style={{ borderColor: "var(--border)", color: "#FFFFFF" }}
                    value={form.address}
                    onChange={e => setForm({ ...form, address: e.target.value })}
                    placeholder="Av. 4 de Noviembre y Calle 114, Manta"
                  />
                </div>
              </div>

              {/* Selección de Plan de Tarifa */}
              <div className="rounded-xl border p-3.5 bg-background/70 space-y-2" style={{ borderColor: "var(--border)" }}>
                <p className="text-xs font-bold uppercase tracking-wider ttext-muted-foreground flex items-center justify-between">
                  <span>{tx("2. Plan de tarifa")}</span>
                  <span className="text-[10px] font-mono text-amber-700">{fmt(effectiveNightlyRate)} / noche</span>
                </p>
                <div className="grid grid-cols-1 gap-2 text-xs">
                  <label className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-all ${ratePlan === "flexible" ? "bg-amber-50 border-amber-400 text-foreground font-semibold" : "bg-card border-border ttext-muted-foreground"}`}>
                    <div className="flex items-center gap-2">
                      <input type="radio" name="ratePlan" checked={ratePlan === "flexible"} onChange={() => setRatePlan("flexible")} className="accent-amber-500" />
                      <div>
                        <p className="font-bold text-foreground">{tx("Tarifa Estándar Flexible (Reembolsable 48h)")}</p>
                        <p className="text-[10px] ttext-muted-foreground">{tx("Cancelación gratuita hasta 48h antes de la Fecha de Entrada")}</p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-foreground">{fmt(room.pricePerNight)}/n</span>
                  </label>

                  <label className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-all ${ratePlan === "non_refundable" ? "bg-emerald-50 border-emerald-400 text-foreground font-semibold" : "bg-card border-border ttext-muted-foreground"}`}>
                    <div className="flex items-center gap-2">
                      <input type="radio" name="ratePlan" checked={ratePlan === "non_refundable"} onChange={() => setRatePlan("non_refundable")} className="accent-emerald-600" />
                      <div>
                        <p className="font-bold text-emerald-800">{tx("Tarifa Promocional No Reembolsable (-10%)")}</p>
                        <p className="text-[10px] ttext-muted-foreground">{tx("10% de descuento inmediato · Pago final sin reembolso")}</p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-emerald-700">{fmt(Math.round(room.pricePerNight * 0.90 * 100) / 100)}/n</span>
                  </label>

                  {!room.breakfastIncluded && (
                    <label className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-all ${ratePlan === "breakfast_plus" ? "bg-amber-50 border-amber-400 text-foreground font-semibold" : "bg-card border-border ttext-muted-foreground"}`}>
                      <div className="flex items-center gap-2">
                        <input type="radio" name="ratePlan" checked={ratePlan === "breakfast_plus"} onChange={() => setRatePlan("breakfast_plus")} className="accent-amber-500" />
                        <div>
                          <p className="font-bold text-foreground">{tx("Plan con Desayuno Manabita Incluido (+$8/noche)")}</p>
                          <p className="text-[10px] ttext-muted-foreground">{tx("Incluye desayuno costero completo y cancelación flexible")}</p>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-foreground">{fmt(room.pricePerNight + 8)}/n</span>
                    </label>
                  )}
                </div>
              </div>

              {/* Extras y Servicios Adicionales */}
              <div className="rounded-xl border p-3.5 bg-background/70 space-y-2" style={{ borderColor: "var(--border)" }}>
                <p className="text-xs font-bold uppercase tracking-wider ttext-muted-foreground flex items-center justify-between">
                  <span>{tx("3. Servicios adicionales")}</span>
                  {extrasTotal > 0 && <span className="text-[10px] font-mono font-bold text-emerald-700">+{fmt(extrasTotal)}</span>}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[
                    { k: "airport" as const, label: tx("Traslado Aeropuerto Manta (MEC)"), price: "+$15.00" },
                    { k: "extrabed" as const, label: tx("Cama supletoria adicional"), price: "+$20.00" },
                    { k: "crib" as const, label: tx("Cuna para bebé sujeta a cupo"), price: tx("Cortesía $0") },
                    { k: "lateout" as const, label: tx("Salida extendida (hasta 16:00h)"), price: "+$15.00" },
                  ].map(ext => (
                    <label key={ext.k} className={`flex items-center justify-between p-2 rounded-lg border cursor-pointer ${selectedExtras[ext.k] ? "bg-amber-50 border-amber-400" : "bg-card border-border"}`}>
                      <span className="flex items-center gap-1.5 text-foreground font-medium">
                        <input
                          type="checkbox"
                          checked={selectedExtras[ext.k]}
                          onChange={e => setSelectedExtras(s => ({ ...s, [ext.k]: e.target.checked }))}
                          className="accent-amber-500 rounded"
                        />
                        {ext.label}
                      </span>
                      <span className="font-mono text-[11px] font-bold ttext-muted-foreground">{ext.price}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs ttext-muted-foreground mb-1">{tx("Observaciones o hora estimada de arribo")}</label>
                <textarea className="w-full px-3 py-2 rounded-lg border text-sm outline-none resize-none" style={{ borderColor: "var(--border)", color: "#FFFFFF" }} rows={2} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Ej: Llegada en vuelo de las 15:30, preferencia piso alto..." />
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
                {!user && <button onClick={() => setStep("auth")} className="px-4 py-3 rounded-xl text-sm font-medium border" style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}>{tx("← Atrás")}</button>}
                <button onClick={() => setStep("review")} className="flex-1 py-3 rounded-xl font-bold text-sm hover:opacity-90" style={{ background: "#f59e0b", color: "#0c1220" }}>
                  {tx("Revisar solicitud →")}
                </button>
              </div>
            </div>
          )}

          {step === "review" && (
            <form onSubmit={handleSubmitRequest} className="space-y-4">
              <h3 className="font-bold text-foreground">{tx("Revisar solicitud")}</h3>
              <p className="text-sm text-foreground">{hotel.name} · {tx(room.type)}</p>
              <p className="text-sm text-foreground">{params.checkIn} → {params.checkOut} · {nights} {tx("noches")}</p>
              <p className="text-sm text-foreground">{form.name} · {form.email}</p>
              <div className="rounded-xl border p-4 space-y-2 text-sm text-foreground">
                <p className="font-bold">{tx("Importe de la reserva")}: {fmt(total)}</p>
                <p>{tx("El hotel debe aceptar tu solicitud. No se cobra al enviarla.")}</p>
                <p>{tx("Pago completo en recepción, en efectivo o tarjeta. El pago con tarjeta desde el portal todavía no está disponible.")}</p>
                <p>{tx(arrivalPolicy.message)}</p>
                <p>{tx("Hora de llegada del hotel")}: {arrivalPolicy.arrivalTime} · {tx("hora de Manta")}</p>
                <p className="text-xs">{tx("Demostración local: el vencimiento se actualiza al consultar o reabrir la aplicación. No se envían avisos reales.")}</p>
              </div>
              {requestError && <p role="alert" className="text-sm text-red-600">{tx(requestError)}</p>}
              <div className="flex gap-2">
                <button type="button" onClick={() => setStep("details")} className="px-4 py-3 rounded-xl border text-sm text-foreground">{tx("← Atrás")}</button>
                <button type="submit" disabled={processing || !arrivalPolicy.allowed} className="flex-1 py-3 rounded-xl font-bold text-sm bg-amber-500 text-slate-950 disabled:opacity-60">
                  {tx(processing ? "Guardando solicitud..." : "Enviar solicitud al hotel")}
                </button>
              </div>
            </form>
          )}
          {step === "submitted" && submittedReservation && (
            <div className="space-y-4">
              <h3 className="font-bold text-foreground">{tx("Solicitud guardada")}</h3>
              <ReservationSummary reservation={currentReservations.find(item => item.id === submittedReservation.id) ?? submittedReservation} />
              <button onClick={onClose} className="w-full py-3 rounded-xl font-bold text-sm bg-amber-500 text-slate-950">{tx("Cerrar")}</button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ─── Hotel card ───────────────────────────────────────────────────────────────

function HotelCard({ hotel, nights, onSelect }: { hotel: Hotel; nights: number; onSelect: () => void }) {
  const tx = useI18n();
  const n = Math.max(nights, 1);
  return (
    <div className="rounded-2xl overflow-hidden border bg-card transition-all hover:shadow-lg cursor-pointer group" style={{ borderColor: "var(--border)" }} onClick={onSelect}>
      <div className="flex flex-col sm:flex-row">
        <div className="sm:w-64 flex-shrink-0 relative overflow-hidden" style={{ height: 200 }}>
          <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
          <div className="absolute top-3 left-3 flex flex-wrap gap-1">
            {hotel.tags.slice(0, 2).map(t => <span key={t} className="text-[10px] font-bold px-2 py-1 rounded-full" style={{ background: "rgba(0,0,0,0.55)", color: "#ffffff" }}>{tx(t)}</span>)}
          </div>
        </div>
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2 mb-1">
              <div>
                <div className="flex items-center gap-2 mb-0.5"><StarsRow n={hotel.stars} /><span className="text-xs ttext-muted-foreground">{tx(hotel.city)}</span></div>
                <h3 className="font-bold text-foreground text-base group-hover:text-amber-600 transition-colors">{hotel.name}</h3>
                <p className="text-xs ttext-muted-foreground mt-0.5">{hotel.address}</p>
              </div>
              <div className="flex-shrink-0 text-right">
                <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: "#1e3a5f" }}>
                  <span className="font-bold text-white text-sm">{hotel.rating}</span><span className="text-white/60 text-xs">/ 5</span>
                </div>
                <p className="text-[10px] ttext-muted-foreground mt-0.5">{hotel.reviews} {tx("opiniones")}</p>
              </div>
            </div>
            <p className="text-sm ttext-muted-foreground mt-1.5 leading-relaxed line-clamp-2">{txDesc(hotel.description)}</p>
            <p className="text-xs mt-1 font-medium" style={{ color: "#059669" }}>📍 {tx(hotel.distance)}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {hotel.amenities.slice(0, 5).map(a => <span key={a} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "var(--muted)", color: "#475569" }}>{tx(a)}</span>)}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mt-3 pt-3 border-t" style={{ borderColor: "var(--muted)" }}>
            <div>
              <p className="text-[10px] ttext-muted-foreground uppercase tracking-wide">{tx("Precio desde")}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-foreground leading-none">US${hotel.priceFrom}</span>
                <span className="text-xs ttext-muted-foreground font-medium">{tx("/ noche")}</span>
              </div>
              <p className="text-[11px] font-semibold ttext-muted-foreground mt-1">
                + US${(((hotel.priceFrom * n) * (getActiveIvaPercent(hotel.id) / 100)) + (hotel.gravaServicio10 ? ((hotel.priceFrom * n) * 0.10) : 0)).toFixed(2)} {tx("de impuestos")} ({n}n)
              </p>
              <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-foreground font-medium border border-border">
                  {hotel.gravaServicio10
                    ? `${getActiveIvaPercent(hotel.id)}% IVA + ${tx("10% Servicio Turístico")}`
                    : `${getActiveIvaPercent(hotel.id)}% IVA (${tx("Hostal Exento 10% Serv.")})`}
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                  ✓ {tx("Sujeta a aceptación del hotel")}
                </span>
              </div>
            </div>
            <button className="px-5 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all self-end sm:self-auto shadow-sm" style={{ background: "#f59e0b", color: "#0c1220" }}>
              {tx("Ver habitaciones →")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Hotel detail ─────────────────────────────────────────────────────────────

function HotelDetail({ hotel, params, onBack, onBook }: { hotel: Hotel; params: SearchParams; onBack: () => void; onBook: (r: RoomOffer) => void }) {
  const tx = useI18n();
  const arrivalPolicy = useArrivalPolicy(hotel.id, params.checkIn);
  const nights = Math.max(nightsBetween(params.checkIn, params.checkOut), 1);
  const gallery = [hotel.image, ...hotel.rooms.map(room => room.image)].slice(0, 4);
  const score10 = Math.min(9.9, Math.max(8.2, Number((hotel.rating * 1.98).toFixed(1))));
  const subcriteria = [
    { label: tx("Limpieza e Higiene"), val: Math.min(10, Number((score10 + 0.2).toFixed(1))) },
    { label: tx("Ubicación en Manta"), val: Math.min(10, Number((score10 + 0.1).toFixed(1))) },
    { label: tx("Atención del Personal"), val: score10 },
    { label: tx("Relación Calidad-Precio"), val: Math.max(8.0, Number((score10 - 0.2).toFixed(1))) },
    { label: tx("Conectividad WiFi"), val: Math.max(8.1, Number((score10 - 0.1).toFixed(1))) },
  ];

  const isRural = hotel.city.includes("Santa Marianita") || hotel.city.includes("San Lorenzo") || hotel.city.includes("San Mateo");
  const landmarks = isRural
    ? [
        { icon: "🏖️", place: tx("Playa local / Zona Costera"), dist: "0.2 km", time: tx("3 min a pie") },
        { icon: "🌴", place: tx("Playa El Murciélago & Malecón"), dist: "14.5 km", time: tx("20 min en auto") },
        { icon: "🛍️", place: tx("Mall del Pacífico"), dist: "15.0 km", time: tx("22 min en auto") },
        { icon: "✈️", place: tx("Aeropuerto Internacional Eloy Alfaro (MEC)"), dist: "21.0 km", time: tx("28 min en auto") },
        { icon: "🚌", place: tx("Terminal Terrestre Luis Valdiviezo Morán"), dist: "22.5 km", time: tx("30 min en auto") },
      ]
    : [
        { icon: "🌴", place: tx("Playa El Murciélago & Malecón Escénico"), dist: "0.8 km", time: tx("4 min en auto / 10 min a pie") },
        { icon: "🛍️", place: tx("Mall del Pacífico"), dist: "1.1 km", time: tx("5 min en auto") },
        { icon: "🍽️", place: tx("Zona Gastronómica Flavio Reyes / Barbasquillo"), dist: "1.4 km", time: tx("5 min en auto") },
        { icon: "✈️", place: tx("Aeropuerto Internacional Eloy Alfaro (MEC)"), dist: "6.5 km", time: tx("12 min en auto") },
        { icon: "🚌", place: tx("Terminal Terrestre Luis Valdiviezo Morán"), dist: "7.8 km", time: tx("15 min en auto") },
      ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-medium mb-5 hover:opacity-70 transition-opacity" style={{ color: "var(--muted-foreground)" }}>{tx("← Volver a resultados")}</button>
      <div className="rounded-2xl overflow-hidden border mb-6 bg-card" style={{ borderColor: "var(--border)" }}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 bg-muted">
          {gallery.map((image, index) => (
            <div key={`${image}-${index}`} className={`${index === 0 ? "col-span-2 row-span-2" : ""} overflow-hidden`} style={{ minHeight: index === 0 ? 260 : 128 }}>
              <img
                src={image}
                alt={index === 0 ? tx("Vista principal de {name}", { name: hotel.name }) : tx("{name}, vista {n}", { name: hotel.name, n: index + 1 })}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          ))}
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-1"><StarsRow n={hotel.stars} /><span className="text-xs ttext-muted-foreground">{tx(hotel.city)}</span></div>
              <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "DM Serif Display, serif" }}>{hotel.name}</h1>
              <p className="text-sm ttext-muted-foreground mt-0.5">📍 {hotel.address} · {tx(hotel.distance)}</p>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl" style={{ background: "#1e3a5f" }}>
              <span className="text-white font-bold text-xl">{score10}</span>
              <div><p className="text-amber-300 font-bold text-xs">{tx("Excelente (/10)")}</p><p className="text-white/60 text-[10px]">{hotel.reviews} {tx("reseñas verificadas")}</p></div>
            </div>
          </div>
          <p className="text-sm ttext-muted-foreground mt-3 leading-relaxed">{txDesc(hotel.description)}</p>
          <div className="mt-5 pt-4 border-t" style={{ borderColor: "var(--muted)" }}>
            <p className="text-xs font-bold uppercase tracking-wider ttext-muted-foreground mb-3">{tx("Servicios del alojamiento")}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {hotel.amenities.map(a => (
                <div key={a} className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium" style={{ background: "var(--background)", color: "#475569" }}>
                  <span className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "#d1fae5", color: "#047857" }}>✓</span>
                  {tx(a)}
                </div>
              ))}
            </div>
          </div>

          {/* Puntos de referencia y tiempos de traslado en Manta */}
          <div className="mt-5 pt-4 border-t grid grid-cols-1 md:grid-cols-2 gap-4" style={{ borderColor: "var(--muted)" }}>
            <div className="rounded-xl p-4 border bg-background/70" style={{ borderColor: "var(--border)" }}>
              <p className="text-xs font-bold uppercase tracking-wider text-foreground mb-2.5">
                {tx("Lugares de interés cercanos")}
              </p>
              <div className="space-y-2 text-xs">
                {landmarks.map(lm => (
                  <div key={lm.place} className="flex items-center justify-between gap-2 py-1 border-b border-border/60 last:border-0">
                    <span className="text-foreground font-medium">
                      {lm.place}
                    </span>
                    <span className="text-[11px] font-mono ttext-muted-foreground whitespace-nowrap">{lm.dist} · {lm.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reseñas y Valoraciones Verificadas */}
            <div className="rounded-xl p-4 border bg-background/70" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center justify-between mb-2.5">
                <p className="text-xs font-bold uppercase tracking-wider text-foreground">
                  {tx("Puntuación de los huéspedes")}
                </p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">{tx("Opiniones verificadas")}</span>
              </div>
              <div className="space-y-2 text-xs">
                {subcriteria.map(sc => (
                  <div key={sc.label}>
                    <div className="flex justify-between text-[11px] mb-0.5">
                      <span className="ttext-muted-foreground font-medium">{sc.label}</span>
                      <span className="font-mono font-bold text-foreground">{sc.val} / 10</span>
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
          <span>{tx("Entrada")}: {fmtDateShort(params.checkIn)} → {tx("Salida")}: {fmtDateShort(params.checkOut)}</span>
          <span>{nights} {nights > 1 ? tx("noches") : tx("noche")}</span>
          <span>{params.adults + params.children} {params.adults + params.children > 1 ? tx("huéspedes") : tx("huésped")}</span>
        </div>
        <p className="text-xs text-amber-700">{tx("Aceptación manual del hotel · Pago pendiente hasta registrar el cobro")}</p>
      </div>
      <h2 className="text-lg font-bold text-foreground mb-4" style={{ fontFamily: "DM Serif Display, serif" }}>{tx("Tipos de Habitación y Cupos para Venta Web")}</h2>
      <div className="space-y-4">
        {hotel.rooms.filter(r => r.capacity >= params.adults).map(room => (
          <div key={room.id} className="rounded-2xl overflow-hidden border bg-card hover:shadow-md transition-all" style={{ borderColor: "var(--border)" }}>
            <div className="flex flex-col sm:flex-row">
              <div className="sm:w-52 flex-shrink-0" style={{ height: 160 }}>
                <img src={room.image} alt={tx(room.type)} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-foreground">{tx(room.type)}</h3>
                      <p className="text-xs ttext-muted-foreground mt-0.5">{tx(room.beds)} · {room.size} m² · {tx("hasta")} {room.capacity} {tx("pers.")}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      {room.originalPrice && <p className="text-xs line-through ttext-muted-foreground">{fmt(room.originalPrice)}</p>}
                      <p className="text-xl font-bold" style={{ color: "#f59e0b" }}>{fmt(room.pricePerNight)}</p>
                      <p className="text-[10px] ttext-muted-foreground">{tx("/ noche base")}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {room.amenities.map(a => <span key={a} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "var(--muted)", color: "#475569" }}>{tx(a)}</span>)}
                    {room.breakfastIncluded && <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: "#d1fae5", color: "#065f46" }}>{tx("Desayuno incluido")}</span>}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t space-y-3" style={{ borderColor: "var(--muted)" }}>
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
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${getRoomAvailability(hotel.id, room, params) <= 2 ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"}`}>
                        {getRoomAvailability(hotel.id, room, params) <= 2 ? tx("Últimas {n} habitaciones disponibles", { n: getRoomAvailability(hotel.id, room, params) }) : tx("{n} habitaciones disponibles", { n: getRoomAvailability(hotel.id, room, params) })}
                      </span>
                    </div>
                    <button aria-label={tx("Solicitar habitación: {room}", { room: room.type })} disabled={!arrivalPolicy.allowed || getRoomAvailability(hotel.id, room, params) <= 0} onClick={() => onBook(room)} className="px-6 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 active:scale-95 transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed" style={{ background: "#f59e0b", color: "#0c1220" }}>
                      {!arrivalPolicy.allowed ? tx("Atención directa del hotel") : getRoomAvailability(hotel.id, room, params) <= 0 ? tx("Agotado") : tx("Reservar Cupo →")}
                    </button>
                  </div>
                  <div className="rounded-lg border border-border bg-card text-foreground p-3 text-sm space-y-1">
                    {arrivalPolicy.arrivalTime && <p>{tx("Hora de llegada del hotel")}: {arrivalPolicy.arrivalTime} · {tx("hora de Manta")}</p>}
                    <p>{tx(arrivalPolicy.message)}</p>
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
  const tx = useI18n();
  const [stars, setStars] = useState<number[]>([]);
  const [maxPrice, setMaxPrice] = useState(250);
  const [classification, setClassification] = useState<string>("all");
  const [parish, setParish] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"price" | "rating">("rating");
  const [showResultsMap, setShowResultsMap] = useState(false);
  const nights = nightsBetween(params.checkIn, params.checkOut);
  let results = getPublicHotels().filter(h => {
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
    <div style={{ background: "var(--background)", minHeight: "100vh" }}>
      <div className="sticky top-0 z-20 border-b shadow-sm" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <div className="max-w-5xl mx-auto px-4 py-3">
          <SearchBar params={params} onChange={onChange} onSearch={onSearch} variant="sticky" />
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-6 flex gap-5">
        <aside className="w-56 flex-shrink-0 hidden lg:block space-y-4">
          <div className="rounded-xl p-4 border bg-card" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-foreground text-sm">{tx("Categoría")}</h4>
              {stars.length > 0 && (
                <button onClick={() => setStars([])} className="text-[11px] text-amber-600 hover:underline">{tx("Limpiar")}</button>
              )}
            </div>
            {[5, 4, 3, 2, 1].map(s => (
              <label key={s} className="flex items-center justify-between gap-1 mb-2 cursor-pointer hover:bg-background p-1 rounded transition-colors">
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
                  <span className="text-[11px] ttext-muted-foreground font-medium">
                    {s === 5 ? tx("5★ Lujo") : s === 4 ? tx("4★ Primera") : s === 3 ? tx("3★ Superior") : s === 2 ? tx("2★ Turista") : tx("1★ Económico")}
                  </span>
                </div>
                <span className="text-[10px] ttext-muted-foreground font-mono">({getPublicHotels().filter(h => h.stars === s).length})</span>
              </label>
            ))}
          </div>

          <div className="rounded-xl p-4 border bg-card" style={{ borderColor: "var(--border)" }}>
            <h4 className="font-bold text-foreground text-sm mb-2">{tx("Clasificación")}</h4>
            <div className="space-y-1">
              {[
                { id: "all", label: tx("Todos los tipos"), count: getPublicHotels().length },
                { id: "Hotel", label: "Hotel", count: getPublicHotels().filter(h => h.classification === "Hotel").length },
                { id: "Hostal", label: "Hostal", count: getPublicHotels().filter(h => h.classification === "Hostal").length },
                { id: "Hostería", label: "Hostería", count: getPublicHotels().filter(h => h.classification === "Hostería").length },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setClassification(item.id)}
                  className={`w-full flex items-center justify-between text-xs px-2.5 py-1.5 rounded-lg text-left transition-all ${
                    classification === item.id ? "bg-amber-100 text-amber-900 font-bold" : "ttext-muted-foreground hover:bg-background"
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="font-mono text-[10px] ttext-muted-foreground">({item.count})</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl p-4 border bg-card" style={{ borderColor: "var(--border)" }}>
            <h4 className="font-bold text-foreground text-sm mb-2">{tx("Parroquia")}</h4>
            <select
              value={parish}
              onChange={e => setParish(e.target.value)}
              className="w-full text-xs rounded-lg border p-2 bg-background border-border text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="all">{tx("Todas las parroquias (116)")}</option>
              {Array.from(new Set(getPublicHotels().map(h => h.parish).filter(Boolean))).sort().map(p => (
                <option key={p} value={p}>{p} ({getPublicHotels().filter(h => h.parish === p).length})</option>
              ))}
            </select>
          </div>

          <div className="rounded-xl p-4 border bg-card" style={{ borderColor: "var(--border)" }}>
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-bold text-foreground text-sm">{tx("Precio máx./noche")}</h4>
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
            <div className="flex justify-between text-[11px] ttext-muted-foreground mt-1">
              <span>$25</span>
              <span>$150</span>
              <span>$300+</span>
            </div>
          </div>
        </aside>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <h2 className="font-bold text-foreground">{results.length} {results.length !== 1 ? tx("alojamientos") : tx("alojamiento")}{params.destination ? ` ${tx("en")} ${params.destination}` : ""}</h2>
              {nights > 0 && <p className="text-xs ttext-muted-foreground">{nights} {nights > 1 ? tx("noches") : tx("noche")} · {params.adults} {params.adults > 1 ? tx("adultos") : tx("adulto")}</p>}
            </div>
            <div className="flex gap-1.5 text-xs items-center">
              <button onClick={() => setShowResultsMap(true)} className="px-3 py-1.5 rounded-lg font-semibold border bg-card hover:bg-background transition-all" style={{ borderColor: "var(--border)", color: "#334155" }}>🗺️ {tx("Ver en mapa")}</button>
              <span className="ttext-muted-foreground self-center">{tx("Ordenar:")}</span>
              {[{ k: "rating" as const, l: tx("Valoración") }, { k: "price" as const, l: tx("Precio") }].map(s => (
                <button key={s.k} onClick={() => setSortBy(s.k)} className="px-3 py-1.5 rounded-lg font-semibold border transition-all" style={{ background: sortBy === s.k ? "#f59e0b" : "var(--card)", color: sortBy === s.k ? "#0c1220" : "var(--muted-foreground)", borderColor: sortBy === s.k ? "#f59e0b" : "var(--border)" }}>{s.l}</button>
              ))}
            </div>
          </div>
          <MantaMapModal
            isOpen={showResultsMap}
            onClose={() => setShowResultsMap(false)}
            onSelectDestination={dest => {
              setShowResultsMap(false);
              onChange({ ...params, destination: dest });
            }}
            hotels={results}
          />
          <div className="space-y-4">
            {results.map(h => <HotelCard key={h.id} hotel={h} nights={nights} onSelect={() => onSelect(h)} />)}
            {results.length === 0 && (
              <div className="text-center py-16 rounded-2xl border bg-card" style={{ borderColor: "var(--border)" }}>
                <p className="text-4xl mb-3">🏨</p>
                <p className="font-semibold text-foreground">{tx("No encontramos alojamientos con estos filtros.")}</p>
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
  theme: _theme,
  onToggleTheme: _onToggleTheme,
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
  const tx = useI18n();
  const [isHomeMapOpen, setIsHomeMapOpen] = useState(false);

  return (
    <div style={{ background: "var(--background)" }}>
      <div className="relative" style={{ minHeight: 400 }}>
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #0c1220 0%, #1e3a5f 50%, #0f2744 100%)" }}>
          <img src="https://images.unsplash.com/photo-1722191847760-8426e74d4b3d?w=1400&h=600&fit=crop&auto=format" alt="" className="w-full h-full object-cover opacity-25" />
        </div>
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(12,18,32,0.3) 0%, rgba(12,18,32,0.75) 100%)" }} />
        <div className="relative max-w-5xl mx-auto px-4 pt-12 sm:pt-20 pb-8 sm:pb-12 text-center">
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-3 leading-tight" style={{ fontFamily: "DM Serif Display, serif" }}>{tx("Encuentra tu hotel en Manta")}</h1>
          <p className="text-white/80 text-sm sm:text-base mb-6 sm:mb-8 max-w-lg mx-auto">
            {tx("Compara y reserva en hoteles, hostales y hosterías de Barbasquillo, El Murciélago, Tarqui, Los Esteros, San Mateo, Santa Marianita y San Lorenzo.")}
          </p>
          <div className="max-w-4xl mx-auto"><SearchBar params={params} onChange={onChange} onSearch={onSearch} /></div>
        </div>
      </div>
      <div className="border-b" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-6 overflow-x-auto whitespace-nowrap scrollbar-none">
          {[tx("Pago en recepción"), tx("Aceptación manual del hotel"), tx("Solicitud sin cobro"), tx("Tarifa directa sin comisiones ocultas"), tx("Atención local en Manta")].map(text => (
            <div key={text} className="flex items-center gap-1.5 text-xs font-medium ttext-muted-foreground shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
          <div>
            <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "DM Serif Display, serif" }}>{tx("Sectores y Playas de Manta")}</h2>
            <p className="text-xs ttext-muted-foreground">{tx("Distribución en las 7 parroquias del cantón Manta")}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsHomeMapOpen(true)}
              className="px-3.5 py-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer hover:scale-105"
            >
              <span>🗺️</span>
              <span>{tx("Ver en Mapa")}</span>
            </button>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-muted text-foreground">
              {tx("116 Alojamientos")}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-12">
          {DESTINATIONS.map(d => (
            <button
              key={d.city}
              onClick={() => { onChange({ ...params, destination: d.city }); onSearch(); }}
              className="relative rounded-2xl overflow-hidden transition-all hover:scale-[1.03] hover:shadow-xl cursor-pointer group text-left border border-border/50"
              style={{ height: 125 }}
            >
              <img src={d.img} alt={d.city} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 mb-1 inline-block">
                  {tx(d.type || "Manta")}
                </span>
                <p className="text-white font-bold text-sm leading-tight truncate">{d.city.replace("Manta - ", "")}</p>
                <p className="text-white/80 text-[10px] mt-0.5">{d.hotels} {tx("hoteles")}</p>
              </div>
            </button>
          ))}
        </div>
        <h2 className="text-xl font-bold text-foreground mb-5" style={{ fontFamily: "DM Serif Display, serif" }}>{tx("Alojamientos Destacados de Manta")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {getPublicHotels().filter(h => h.rating >= 4.4).slice(0, 6).map(h => (
            <button key={h.id} onClick={() => { onChange({ ...params, destination: h.city }); onSearch(); }} className="rounded-2xl overflow-hidden border bg-card text-left hover:shadow-lg group transition-all cursor-pointer" style={{ borderColor: "var(--border)" }}>
              <div style={{ height: 160 }} className="overflow-hidden"><img src={h.image} alt={h.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" /></div>
              <div className="p-3">
                <div className="flex items-center justify-between mb-0.5"><StarsRow n={h.stars} /><span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ background: "#1e3a5f", color: "#93c5fd" }}>{h.rating}</span></div>
                <p className="font-bold text-foreground text-sm group-hover:text-amber-600 transition-colors">{h.name}</p>
                <p className="text-xs ttext-muted-foreground">{h.city}</p>
                <div className="flex items-baseline gap-1 mt-2"><span className="font-bold" style={{ color: "#f59e0b" }}>{tx("desde")} {fmt(h.priceFrom)}</span><span className="text-xs ttext-muted-foreground">{tx("/ noche")}</span></div>
              </div>
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            [tx("Tarifa directa"), tx("Reserva directamente con el establecimiento sin recargos adicionales de intermediarios internacionales.")],
            [tx("Alojamientos verificados"), tx("Establecimientos registrados y validados en el cantón Manta.")],
            [tx("Aceptación manual del hotel"), tx("Consulta el estado de tu solicitud con su código. La aceptación no acredita el pago.")]
          ].map(([title, desc]) => (
            <div key={title} className="rounded-2xl p-5 border bg-card" style={{ borderColor: "var(--border)" }}>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-xs mb-3">✓</div>
              <h4 className="font-bold text-foreground mb-1 text-sm">{title}</h4>
              <p className="text-xs ttext-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
      <footer className="portal-footer border-t mt-10">
        <div className="max-w-5xl mx-auto px-4 py-10 flex flex-wrap gap-8 justify-between">
          <div className="max-w-xs space-y-2">
            <p className="font-bold footer-title text-xl" style={{ fontFamily: "DM Serif Display, serif" }}>AlojaManta</p>
            <p className="text-xs footer-muted leading-relaxed">{tx("Plataforma oficial de reservas directas y comercialización para el cantón Manta, Manabí. Sin comisiones abusivas ni sobreprecios OTA.")}</p>
            <div className="pt-1">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                {tx("116 Alojamientos")}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-10 text-xs footer-muted">
            <div className="space-y-2">
              <p className="font-bold footer-title mb-2 uppercase tracking-wider text-[11px]">{tx("Sectores y Playas")}</p>
              <button
                type="button"
                onClick={() => { onChange({ ...params, destination: "Manta - Barbasquillo" }); onSearch(); }}
                className="hover:text-amber-400 footer-muted transition-colors text-left block cursor-pointer"
              >
                Barbasquillo & El Murciélago
              </button>
              <button
                type="button"
                onClick={() => { onChange({ ...params, destination: "Manta - Tarqui" }); onSearch(); }}
                className="hover:text-amber-400 footer-muted transition-colors text-left block cursor-pointer"
              >
                Tarqui & Los Esteros
              </button>
              <button
                type="button"
                onClick={() => { onChange({ ...params, destination: "Manta - Santa Marianita" }); onSearch(); }}
                className="hover:text-amber-400 footer-muted transition-colors text-left block cursor-pointer"
              >
                Santa Marianita & San Mateo
              </button>
              <button
                type="button"
                onClick={() => { onChange({ ...params, destination: "Manta - San Lorenzo" }); onSearch(); }}
                className="hover:text-amber-400 footer-muted transition-colors text-left block cursor-pointer"
              >
                San Lorenzo & Reserva Pacoche
              </button>
            </div>
            <div className="space-y-2">
              <p className="font-bold footer-title mb-2 uppercase tracking-wider text-[11px]">{tx("Ayuda & Información")}</p>
              {onOpenAbout && (
                <button
                  type="button"
                  onClick={onOpenAbout}
                  className="hover:text-amber-400 footer-muted transition-colors text-left block cursor-pointer"
                >
                  {tx("Acerca de AlojaManta")}
                </button>
              )}
              {onOpenConsult && (
                <button
                  type="button"
                  onClick={onOpenConsult}
                  className="hover:text-amber-400 footer-muted transition-colors text-left block cursor-pointer"
                >
                  {tx("Consultar mi reserva")}
                </button>
              )}
              {onOpenLegal && (
                <button
                  type="button"
                  onClick={onOpenLegal}
                  className="hover:text-amber-400 footer-muted transition-colors text-left block cursor-pointer"
                >
                  {tx("Términos y Privacidad")}
                </button>
              )}
              <a
                href="https://wa.me/593998765432?text=Hola%2C%20requiero%20asistencia%20en%20AlojaManta"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-400 footer-muted transition-colors text-left flex items-center gap-1 cursor-pointer"
              >
                <span>WhatsApp: +593 99 876 5432</span>
              </a>
              <a
                href="tel:+59352628900"
                className="hover:text-amber-400 footer-muted transition-colors text-left flex items-center gap-1 cursor-pointer"
              >
                <span>Central: +593 5 262 8900</span>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t py-4 px-4 max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] footer-muted" style={{ borderColor: "var(--footer-border)" }}>
          <span>{tx("© 2026 AlojaManta · Red Oficial de Alojamientos del Cantón Manta · 116 Alojamientos")}</span>
          <div className="flex items-center gap-4">
            {onOpenAbout && (
              <button
                type="button"
                onClick={onOpenAbout}
                className="footer-muted hover:text-amber-400 transition-colors cursor-pointer"
              >
                {tx("Acerca de la Plataforma")}
              </button>
            )}
            {onOpenLegal && (
              <button
                type="button"
                onClick={onOpenLegal}
                className="footer-muted hover:text-amber-400 transition-colors cursor-pointer"
              >
                {tx("Comprobantes y Contacto")}
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
        hotels={getPublicHotels()}
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
  adminSessionActive = false,
  theme = "light",
  onToggleTheme,
}: {
  user: GuestUser | null;
  onGuestLogin: (u: GuestUser) => void;
  onLogout: () => void;
  onAdminAccess?: () => void;
  adminSessionActive?: boolean;
  theme?: "light" | "dark";
  onToggleTheme?: () => void;
}) {
  const tx = useI18n();
  const lang = useLang();
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
  const { reservations, syncError } = useReservationSnapshot();
  const [reservationError, setReservationError] = useState("");

  function handleCancelReservation(resId: string) {
    setReservationError("");
    try {
      reservationWorkflow.cancel(resId);
    } catch (error) {
      setReservationError(error instanceof Error ? error.message : "No se pudo cancelar la solicitud.");
    }
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
    <div className="min-h-screen overflow-x-hidden w-full max-w-full" style={{ background: "var(--background)" }}>
      {syncError && <p role="alert" className="bg-card text-destructive p-3 text-sm">{tx(syncError)}</p>}
      {reservationError && <p role="alert" className="fixed bottom-4 left-4 right-4 z-[60] rounded-xl bg-red-100 p-4 text-sm text-red-800">{tx(reservationError)}</p>}
      {/* Nav */}
      <header className="sticky top-0 z-30 border-b shadow-xs" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <div className="max-w-5xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2">
          <button onClick={handleLogoClick} className="flex items-center gap-1.5 sm:gap-2 cursor-pointer shrink-0">
            <span className="font-bold text-lg sm:text-xl" style={{ fontFamily: "DM Serif Display, serif", color: "var(--foreground)" }}>
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
                  className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full border border-border hover:border-amber-400 bg-card hover:bg-background transition-all cursor-pointer shadow-2xs"
                  title={tx("Menú de perfil y cuenta")}
                >
                  <span className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 text-xs flex items-center justify-center font-black shadow-2xs">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-bold text-foreground leading-tight truncate max-w-[110px]">
                      {user.name.split(" ")[0]}
                    </p>
                    <p className="text-[9px] ttext-muted-foreground font-semibold leading-none">
                      {tx("Mi cuenta")}
                    </p>
                  </div>
                  <span className="text-xs ttext-muted-foreground">▾</span>
                </button>

                {showProfileMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowProfileMenu(false)}
                    />
                    <div
                      className="absolute right-0 mt-2 w-72 rounded-2xl border bg-card shadow-2xl z-50 overflow-hidden divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-100"
                      style={{ borderColor: "var(--border)" }}
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
                              {tx("Cuenta de Huésped")}
                            </span>
                            <p className="text-[11px] ttext-muted-foreground truncate mt-0.5">{user.email}</p>
                          </div>
                        </div>
                      </div>

                      {/* Enlaces del Menú (100% Asociados) */}
                      <div className="py-1.5 text-xs text-foreground font-medium">
                        <button
                          onClick={() => { setAccountInitialTab("hub"); setView("account"); setShowProfileMenu(false); }}
                          className="w-full px-4 py-2.5 text-left hover:bg-background flex items-center gap-2.5 transition-colors cursor-pointer"
                        >
                          <span className="text-base">🏠</span>
                          <div>
                            <p className="font-semibold text-foreground">{tx("Centro de mi cuenta")}</p>
                            <p className="text-[10px] ttext-muted-foreground">{tx("Panel general de perfil y servicios")}</p>
                          </div>
                        </button>

                        <button
                          onClick={() => { setAccountInitialTab("reservations"); setView("account"); setShowProfileMenu(false); }}
                          className="w-full px-4 py-2.5 text-left hover:bg-background flex items-center gap-2.5 transition-colors cursor-pointer"
                        >
                          <span className="text-base">🛎️</span>
                          <div>
                            <p className="font-semibold text-foreground">{tx("Mis Reservas y Viajes")}</p>
                            <p className="text-[10px] ttext-muted-foreground">{tx("Ver vouchers y códigos de reserva")}</p>
                          </div>
                        </button>

                        <button
                          onClick={() => { setAccountInitialTab("personal"); setView("account"); setShowProfileMenu(false); }}
                          className="w-full px-4 py-2.5 text-left hover:bg-background flex items-center gap-2.5 transition-colors cursor-pointer"
                        >
                          <span className="text-base">👤</span>
                          <div>
                            <p className="font-semibold text-foreground">{tx("Datos Personales del Huésped")}</p>
                            <p className="text-[10px] ttext-muted-foreground">{tx("Cédula, contacto y preferencias de estadía")}</p>
                          </div>
                        </button>

                        <button
                          onClick={() => { setAccountInitialTab("billing"); setView("account"); setShowProfileMenu(false); }}
                          className="w-full px-4 py-2.5 text-left hover:bg-background flex items-center gap-2.5 transition-colors cursor-pointer"
                        >
                          <span className="text-base">🏛️</span>
                          <div>
                            <p className="font-semibold text-foreground">{tx("Datos de Comprobantes y Contacto")}</p>
                            <p className="text-[10px] ttext-muted-foreground">{tx("Datos registrados para la reserva")}</p>
                          </div>
                        </button>

                        <button
                          onClick={() => { setAccountInitialTab("payments"); setView("account"); setShowProfileMenu(false); }}
                          className="w-full px-4 py-2.5 text-left hover:bg-background flex items-center gap-2.5 transition-colors cursor-pointer"
                        >
                          <span className="text-base">💳</span>
                          <div>
                            <p className="font-semibold text-foreground">{tx("Medios de Pago")}</p>
                            <p className="text-[10px] ttext-muted-foreground">{tx("Consultar registros del hotel")}</p>
                          </div>
                        </button>

                        <button
                          onClick={() => { setAccountInitialTab("about"); setView("account"); setShowProfileMenu(false); }}
                          className="w-full px-4 py-2.5 text-left hover:bg-background flex items-center gap-2.5 transition-colors cursor-pointer"
                        >
                          <span className="text-base">ℹ️</span>
                          <div>
                            <p className="font-semibold text-foreground">{tx("Acerca de AlojaManta")}</p>
                            <p className="text-[10px] ttext-muted-foreground">{tx("Información del proyecto y reserva directa")}</p>
                          </div>
                        </button>
                      </div>

                      {onAdminAccess && <button type="button"
                        onClick={() => { setShowProfileMenu(false); onAdminAccess(); }}
                        className="w-full px-4 py-3 text-left text-xs text-foreground hover:bg-secondary cursor-pointer">
                        {tx(adminSessionActive ? "Volver al panel hotelero" : "Personal de Hotel / PMS")}
                      </button>}
                      {/* Cerrar Sesión */}
                      <div className="p-2 bg-background">
                        <button
                          onClick={() => { setShowProfileMenu(false); setView("home"); onLogout(); }}
                          className="w-full px-3 py-2 rounded-xl text-left text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <span>🚪</span>
                          <span>{tx("Cerrar sesión")}</span>
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
                <span className="hidden sm:inline">{tx("Iniciar sesión")}</span>
                <span className="sm:hidden text-xs font-semibold">{tx("Iniciar sesión")}</span>
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
      {view === "hotel" && selectedHotel && <HotelDetail hotel={getPublicHotels().find(hotel => hotel.id === selectedHotel.id) ?? selectedHotel} params={params} onBack={() => setView("results")} onBook={r => setBookingRoom(r)} />}
      {view === "account" && user && (
        <AccountView
          key={user.email}
          user={user}
          reservations={reservations}
          onLogout={() => { setView("home"); onLogout(); }}
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
        <InvoiceModal res={reservations.find(reservation => reservation.id === voucherRes.id) ?? voucherRes} onClose={() => setVoucherRes(null)} />
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

      {/* Selector de idioma Español / English */}
      <button
        type="button"
        onClick={() => setLang(lang === "es" ? "en" : "es")}
        className="fixed bottom-5 left-5 z-40 h-11 px-3.5 rounded-full shadow-xl border flex items-center gap-1.5 text-xs font-bold transition-transform hover:scale-110 active:scale-90 cursor-pointer bg-card text-foreground border-slate-300 hover:bg-muted"
        style={{ boxShadow: "0 10px 25px -5px rgba(0,0,0,0.25)" }}
        title={tx("Cambiar idioma")}
        aria-label={tx("Cambiar idioma")}
      >
        <span style={{ color: lang === "es" ? "#b45309" : "var(--muted-foreground)" }}>ES</span>
        <span className="text-slate-300">|</span>
        <span style={{ color: lang === "en" ? "#b45309" : "var(--muted-foreground)" }}>EN</span>
      </button>

      {/* Botón flotante para cambiar tema (Modo Claro / Modo Oscuro) */}
      {onToggleTheme && (
        <button
          type="button"
          onClick={onToggleTheme}
          className="fixed bottom-5 right-5 z-40 w-11 h-11 rounded-full shadow-xl border flex items-center justify-center text-lg transition-transform hover:scale-110 active:scale-90 cursor-pointer bg-card text-foreground border-slate-300 hover:bg-muted"
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
