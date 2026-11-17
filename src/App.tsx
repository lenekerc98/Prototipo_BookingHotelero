import { Dashboard, ReservationsView, RoomsView, RevenueView, GuestsView, BillingView, PaymentsView } from "./features/reservations/OperationsViews";
import { getRoomOffers, useRoomCatalogRevision } from "./app/roomCatalog";
import { hotelMetrics } from "./features/reservations/operations";
import { tx, useLang, setLang } from "./i18n";
import { useState, useMemo, useEffect } from "react";
import GuestPage from "./GuestPage";
import AuthPage, { type AdminRole, type AdminUser, type GuestUser } from "./AuthPage";
import { useGuestReservations } from "./app/useGuestReservations";
import {
  MANTA_HOTELS,
} from "./mantaHotels";
import {
  DEFAULT_HOTEL_RATES,
  fmtUsd,
  getIvaDecretoConfig,
  setIvaDecretoConfig,
  getAuditLogs,
  addAuditLog,
  type HotelRatesConfig,
  type RoomRateInfo,
  type AuditLogEntry,
} from "./hotelData";

// ─── Types ────────────────────────────────────────────────────────────────────

type View = "hotels" | "users" | "dashboard" | "reservations" | "rooms" | "revenue" | "guests" | "billing" | "payments" | "rates";

// ─── Helpers ──────────────────────────────────────────────────────────────────


// Conmutador Rápido de Tarifa de IVA 15% / 8% (Feriados)
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
      enabledGlobal: enable8,
      updatedBy: `${userName} (${new Date().toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" })})`,
    };
    setIvaDecretoConfig(updated);
    setIvaCfgState(updated);
    addAuditLog({
      usuario: userName,
      rol: "Administración",
      modulo: "Motor Tributario",
      accion: enable8 ? "ACTIVAR_IVA_8_FERIADO" : "RESTAURAR_IVA_15_ORDINARIO",
      detalle: enable8
        ? `Activada tarifa reducida de IVA 8% (${updated.decretoNombre})`
        : "Restaurada tarifa ordinaria de IVA 15%",
    });
  }

  return (
    <div
      className="rounded-xl border p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3"
      style={{
        background: ivaCfg.enabledGlobal ? "rgba(16, 185, 129, 0.08)" : "var(--card)",
        borderColor: ivaCfg.enabledGlobal ? "rgba(16, 185, 129, 0.4)" : "var(--border)",
      }}
    >
      <div className="flex items-start gap-3">
        <div className="text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-sm" style={{ color: "var(--foreground)" }}>
              {tx("Tarifa de IVA aplicable")}
            </span>
            <span
              className={`mono text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                ivaCfg.enabledGlobal
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
              }`}
            >
              {ivaCfg.enabledGlobal ? "Tarifa feriado: IVA 8%" : "Tarifa general: IVA 15%"}
            </span>
          </div>
          <p className="mt-0.5" style={{ color: "var(--muted-foreground)" }}>
            {ivaCfg.enabledGlobal
              ? `Aplicando reducción temporal al 8% en el motor de reservas (${ivaCfg.decretoNombre}).`
              : tx("Aplicando tarifa de IVA al 15% más 10% de servicio turístico en alojamientos aplicables.")}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button
          type="button"
          onClick={() => toggleIva(false)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
            !ivaCfg.enabledGlobal
              ? "bg-amber-500 text-slate-950 border-amber-400 shadow-sm"
              : "bg-transparent text-slate-400 border-slate-700 hover:text-white"
          }`}
        >
          15% General
        </button>
        <button
          type="button"
          onClick={() => toggleIva(true)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
            ivaCfg.enabledGlobal
              ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-sm"
              : "bg-transparent text-slate-400 border-slate-700 hover:text-white"
          }`}
        >
          {tx("8% Feriado turístico")}
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
        {tx(label)}
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
            <h1 className="text-2xl" style={{ color: "var(--foreground)" }}>{tx("Tarifas & Precios")}</h1>
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
          {tx("+ Nueva tarifa especial")}
        </button>
      </div>

      {/* RF-21: Conmutador Rápido de Emergencia IVA 15% / 8% */}
      <IvaEmergencySwitchBanner userName="Revenue Manager" />

      {/* Season multipliers */}
      <div>
        <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "var(--muted-foreground)" }}>{tx("Temporadas")}</p>
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
        <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "var(--muted-foreground)" }}>{tx("Matriz de tarifas por temporada")}</p>
        <div className="rounded-md border overflow-hidden" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                <th className="mono text-left px-4 py-3 text-[10px] uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>{tx("Tipo de habitación")}</th>
                <th className="mono text-left px-4 py-3 text-[10px] uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>{tx("Precio base")}</th>
                {seasons.map(s => <th key={s.name} className="mono text-left px-4 py-3 text-[10px] uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>{s.name}</th>)}
                <th className="mono text-left px-4 py-3 text-[10px] uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>{tx("Acciones")}</th>
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
                      {tx("Editar")}
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
        <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "var(--muted-foreground)" }}>{tx("Comisiones por canal")}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {channels.map(ch => (
            <div key={ch.name} className="rounded-md border p-4" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              <p className="text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>{ch.name}</p>
              <div className="flex items-end gap-1">
                <p className="mono text-2xl font-bold leading-none" style={{ color: ch.commission === 0 ? ch.color : "#e8edf5" }}>{ch.commission}%</p>
                <p className="text-xs mb-0.5" style={{ color: "var(--muted-foreground)" }}>{tx("comisión")}</p>
              </div>
              {ch.commission === 0 ? (
                <p className="text-xs mt-1.5 font-semibold" style={{ color: ch.color }}>{tx("✓ Sin comisión")}</p>
              ) : (
                <p className="text-xs mt-1.5" style={{ color: "var(--muted-foreground)" }}>
                  {tx("Sobre precio neto. Por $100 → cobras ${n}", { n: 100 - ch.commission })}
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
              <label className="block text-xs mb-1 text-slate-400">{tx("Nuevo Precio Base (USD / noche)")}</label>
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
              <button onClick={() => setEditingRoom(null)} className="px-3 py-1.5 text-xs text-slate-400 hover:text-white">{tx("Cancelar")}</button>
              <button
                onClick={() => {
                  const input = document.getElementById("editPriceInput") as HTMLInputElement;
                  if (input) handleSaveRoomPrice(Number(input.value));
                }}
                className="px-4 py-1.5 rounded font-bold text-xs bg-amber-500 hover:bg-amber-400 text-slate-950"
              >
                {tx("Guardar")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Tariff Modal */}
      {showNewTariffModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(3, 7, 18, 0.8)", backdropFilter: "blur(4px)" }}>
          <form onSubmit={handleAddRoom} className="w-full max-w-sm rounded-xl border p-5 space-y-4" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <h3 className="font-bold text-sm" style={{ color: "var(--foreground)" }}>{tx("Nueva Tarifa por Tipo de Habitación")}</h3>
            <p className="text-xs text-amber-500 font-medium">{hotel.name}</p>
            <div>
              <label className="block text-xs mb-1 text-slate-400">{tx("Nombre de la Habitación / Tarifa *")}</label>
              <input
                type="text"
                required
                value={newRoomType}
                onChange={e => setNewRoomType(e.target.value)}
                placeholder={tx("Ej: Habitación Matrimonial Frente al Mar")}
                className="w-full rounded border px-3 py-2 text-xs outline-none"
                style={{ background: "var(--muted)", borderColor: "var(--border)", color: "var(--foreground)" }}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs mb-1 text-slate-400">{tx("Icono")}</label>
                <select
                  value={newRoomIcon}
                  onChange={e => setNewRoomIcon(e.target.value)}
                  className="w-full rounded border px-2 py-2 text-xs outline-none"
                  style={{ background: "var(--muted)", borderColor: "var(--border)", color: "var(--foreground)" }}
                >
                  <option value="🛏️">{tx("🛏️ Estándar")}</option>
                  <option value="⭐🛏️">⭐ Superior</option>
                  <option value="👑🛏️">👑 Suite</option>
                  <option value="🏖️👑">🏖️ Villa</option>
                </select>
              </div>
              <div>
                <label className="block text-xs mb-1 text-slate-400">{tx("Precio Base (USD) *")}</label>
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
              <button type="button" onClick={() => setShowNewTariffModal(false)} className="px-3 py-1.5 text-xs text-slate-400 hover:text-white">{tx("Cancelar")}</button>
              <button type="submit" className="px-4 py-1.5 rounded font-bold text-xs bg-amber-500 hover:bg-amber-400 text-slate-950">{tx("Agregar Tarifa")}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

const ALL_ROLES: AdminRole[] = ["superadmin", "admin", "manager", "receptionist"];

function NavIcon({ view }: { view: View }) {
  const common = "w-4 h-4 stroke-current";
  switch (view) {
    case "hotels":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16M9 9h1M9 13h1M9 17h1M14 9h1M14 13h1M14 17h1" />
        </svg>
      );
    case "users":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case "dashboard":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="9" rx="1" />
          <rect x="14" y="3" width="7" height="5" rx="1" />
          <rect x="14" y="12" width="7" height="9" rx="1" />
          <rect x="3" y="16" width="7" height="5" rx="1" />
        </svg>
      );
    case "rooms":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9" />
        </svg>
      );
    case "reservations":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18M9 16l2 2 4-4" />
        </svg>
      );
    case "guests":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="7" r="4" />
          <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
        </svg>
      );
    case "billing":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <line x1="10" y1="9" x2="8" y2="9" />
        </svg>
      );
    case "payments":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="4" width="22" height="16" rx="2" />
          <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
      );
    case "rates":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
          <line x1="7" y1="7" x2="7.01" y2="7" />
        </svg>
      );
    case "revenue":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      );
    default:
      return null;
  }
}

const NAV_ITEMS: { view: View; label: string; divider?: boolean; roles: AdminRole[] }[] = [
  { view: "hotels", label: "Catastro Hotelero", roles: ["superadmin"] },
  { view: "users", label: "Usuarios y accesos", roles: ["superadmin", "admin"], divider: true },
  { view: "dashboard", label: "Panel general", roles: ["superadmin", "admin", "manager"], divider: true },
  { view: "rooms", label: "Tipos de habitación", roles: ALL_ROLES },
  { view: "reservations", label: "Bandeja de reservas", roles: ALL_ROLES },
  { view: "guests", label: "Directorio de huéspedes", roles: ["superadmin", "admin", "receptionist"] },
  { view: "billing", label: "Comprobantes y vouchers", roles: ["superadmin", "admin", "receptionist"], divider: true },
  { view: "payments", label: "Pasarela y cobros", roles: ["superadmin", "admin", "receptionist"] },
  { view: "rates", label: "Tarifas por temporada", roles: ["superadmin", "admin", "manager"] },
  { view: "revenue", label: "Métricas e ingresos", roles: ["superadmin", "admin", "manager"] },
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
  rooms: h.rooms.reduce((sum, room) => sum + room.available, 0),
  occupancy: 0,
  monthRevenue: 0,
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
      <label className="block text-xs mb-1" style={{ color: "var(--muted-foreground)" }}>{tx(label)}</label>
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
            <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>{tx("Catastro Hotelero Oficial de Manta")}</h1>
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
                if (confirm(tx("¿Restaurar todo el Catastro oficial de Manta con los 116 hoteles del archivo consolidado?"))) {
                  onResetCatalog();
                }
              }}
              title={tx("Restaurar y sincronizar todos los 116 hoteles de Manta desde el archivo oficial")}
              className="px-3 py-2 rounded text-xs font-semibold border flex items-center gap-1.5 transition-colors hover:bg-amber-500/10 cursor-pointer"
              style={{ borderColor: "rgba(245, 158, 11, 0.4)", color: "#f59e0b" }}
            >
              {tx("Restablecer catálogo oficial (116)")}
            </button>
          )}
          {canDelete && (
            <button
              onClick={() => setEditing({ id: "", name: "", city: "Manta - Barbasquillo", stars: 3, rooms: 0, occupancy: 0, monthRevenue: 0, rating: 0, status: "active", address: "", phone: "", taxId: "", description: "", amenities: [], gallery: [] })}
              className="px-4 py-2 rounded text-xs font-bold hover:opacity-90 transition-opacity flex items-center gap-1 cursor-pointer"
              style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
            >
              <span>+</span> {tx("Añadir Hotel")}
            </button>
          )}
        </div>
      </div>

      {/* Platform KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="Alojamientos registrados" value={String(activeCount)} sub={`${hotels.length} ${tx("en el Catastro Cantonal 2026")}`} />
        <KpiCard label="Cobros registrados del mes" value={fmtUsd(totalRevenue)} sub="operaciones de este navegador" accent />
        <KpiCard label={tx("Promedio de cupos apartados hoy")} value={`${avgOccupancy}%`} sub="reservas y solicitudes activas" />
        <KpiCard label={tx("Cupos configurados")} value={String(hotels.reduce((s, h) => s + h.rooms, 0))} sub="capacidad de prueba editable" />
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
              placeholder={tx("Buscar por nombre de hotel, sector, dirección, propietario o RUC...")}
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
              <option value="all">{tx("Todas las Modalidades")}</option>
              <option value="Hotel">Hoteles</option>
              <option value="Hostal">{tx("Hostales")}</option>
              <option value="Hostería">{tx("Hosterías")}</option>
            </select>

            {/* Stars / Category */}
            <select
              value={categoryFilter}
              onChange={e => { setCategoryFilter(e.target.value); setPage(1); }}
              className="rounded-lg border px-2.5 py-2 text-xs outline-none cursor-pointer"
              style={{ background: "var(--muted)", borderColor: "var(--border)", color: "var(--foreground)" }}
            >
              <option value="all">{tx("Todas las Categorías")}</option>
              <option value="5">{tx("5 Estrellas (Lujo)")}</option>
              <option value="4">{tx("4 Estrellas (Primera)")}</option>
              <option value="3">{tx("3 Estrellas (Superior)")}</option>
              <option value="2">{tx("2 Estrellas (Turista)")}</option>
              <option value="1">{tx("1 Estrella (Económico)")}</option>
            </select>

            {/* Sector */}
            <select
              value={sectorFilter}
              onChange={e => { setSectorFilter(e.target.value); setPage(1); }}
              className="rounded-lg border px-2.5 py-2 text-xs outline-none cursor-pointer"
              style={{ background: "var(--muted)", borderColor: "var(--border)", color: "var(--foreground)" }}
            >
              <option value="all">{tx("Todos los Sectores")}</option>
              {sectors.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            {/* Page Size */}
            <select
              value={pageSize}
              onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
              className="rounded-lg border px-2.5 py-2 text-xs outline-none cursor-pointer"
              style={{ background: "var(--muted)", borderColor: "var(--border)", color: "var(--foreground)" }}
            >
              <option value={25}>{tx("25 por pág.")}</option>
              <option value={50}>{tx("50 por pág.")}</option>
              <option value={0}>{tx("Ver todos (116)")}</option>
            </select>
          </div>
        </div>

        {/* Filters summary & clear */}
        <div className="flex items-center justify-between text-xs pt-1 border-t" style={{ borderColor: "var(--border)" }}>
          <span style={{ color: "var(--muted-foreground)" }}>
            {tx("Mostrando")} <strong>{paginatedHotels.length}</strong> {tx("de")} <strong>{filteredHotels.length}</strong> {tx("establecimientos encontrados")} ({tx("Total cantón")}: {hotels.length})
          </span>
          {(search || categoryFilter !== "all" || classificationFilter !== "all" || sectorFilter !== "all") && (
            <button
              onClick={() => { setSearch(""); setCategoryFilter("all"); setClassificationFilter("all"); setSectorFilter("all"); setPage(1); }}
              className="text-amber-400 hover:underline font-medium cursor-pointer"
            >
              {tx("Limpiar filtros")}
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
                {["Alojamiento", "Sector / Parroquia", "Modalidad / Cat.", "10% Servicio", "Cupos", "Apartados hoy", "Cobros del mes", "Rating", "Estado", ""].map(h => (
                  <th key={h} className="mono text-left px-4 py-3 text-[10px] uppercase tracking-widest font-medium" style={{ color: "var(--muted-foreground)" }}>{tx(h)}</th>
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
                          <div className="w-12 h-10 rounded bg-slate-800 flex items-center justify-center text-slate-400 flex-shrink-0">
                            <svg className="w-5 h-5 stroke-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                              <path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16M9 9h1M9 13h1M9 17h1M14 9h1M14 13h1M14 17h1" />
                            </svg>
                          </div>
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
                        title={tx("Clic para activar/desactivar 10% servicio (Art. 41 Ley de Turismo Ecuador)")}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer border ${
                          hasServ10
                            ? "bg-emerald-950/70 text-emerald-300 border-emerald-700 hover:bg-emerald-900"
                            : "bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${hasServ10 ? "bg-emerald-400" : "bg-slate-500"}`} />
                        {tx(hasServ10 ? "+10% Activo" : "Sin Servicio")}
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
                      <span className="mono text-[10px] font-medium px-2 py-0.5 rounded uppercase tracking-wide" style={{ background: ss.bg, color: ss.color }}>{tx(ss.label)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => onSelect(h.id)} className="text-xs px-2 py-1.5 rounded font-medium transition-colors cursor-pointer" style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>{tx("Gestionar")}</button>
                        <button onClick={() => setEditing({ ...h })} className="text-xs px-2 py-1.5 rounded border cursor-pointer hover:border-amber-400" style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}>{tx("Editar")}</button>
                        {canDelete && <button onClick={() => { if (confirm(tx("¿Eliminar {name}?", { name: h.name }))) onDelete(h.id); }} className="text-xs px-2 py-1.5 rounded border cursor-pointer" style={{ borderColor: "#7f1d1d", color: "#fca5a5" }}>{tx("Eliminar")}</button>}
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
              {tx("Página")} <strong>{page}</strong> {tx("de")} <strong>{totalPages}</strong>
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
                {tx("Siguiente →")}
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
                <p className="mono text-[10px] uppercase tracking-widest" style={{ color: "var(--primary)" }}>{tx("Propiedad")}</p>
                <h2 className="text-xl">{editing.id ? tx("Editar hotel") : tx("Nueva propiedad")}</h2>
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
              <Field label={tx("Servicios (separados por comas)")} value={(editing.amenities ?? []).join(", ")} onChange={value => setEditing({ ...editing, amenities: value.split(",").map(item => item.trim()).filter(Boolean) })} />
              <Field label={tx("Galería (URLs separadas por comas)")} value={(editing.gallery ?? []).join(", ")} onChange={value => setEditing({ ...editing, gallery: value.split(",").map(item => item.trim()).filter(Boolean) })} />
              <div>
                <label className="block text-xs mb-1" style={{ color: "var(--muted-foreground)" }}>{tx("Estado")}</label>
                <select value={editing.status} onChange={e => setEditing({ ...editing, status: e.target.value as PlatformHotel["status"] })} className="w-full rounded border px-3 py-2.5 text-sm outline-none" style={{ background: "var(--muted)", borderColor: "var(--border)" }}>
                  <option value="active">{tx("Activo")}</option><option value="paused">{tx("Pausado")}</option><option value="pending">{tx("Pendiente")}</option>
                </select>
              </div>
              <Field label={tx("Capacidad de Habitaciones / Plazas")} type="number" value={String(editing.rooms)} onChange={rooms => setEditing({ ...editing, rooms: Number(rooms) })} required />
              <div>
                <label className="block text-xs mb-1" style={{ color: "var(--muted-foreground)" }}>{tx("Categoría Estrellas (1–5)")}</label>
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
                  <strong className="text-amber-400">{tx("Gravar 10% de Servicio Turístico (Art. 41 Ley de Turismo)")}</strong>
                  <span className="block text-[11px] text-slate-400">{tx("Actívalo para hoteles que cobran la propina legal; desactívalo para hostales o pensiones exentas.")}</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
              <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 rounded text-sm" style={{ color: "var(--muted-foreground)" }}>{tx("Cancelar")}</button>
              <button type="submit" className="px-5 py-2 rounded text-sm font-semibold" style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>{tx("Guardar propiedad")}</button>
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
          <p className="mono text-[10px] uppercase tracking-[.18em] mb-1" style={{ color: "var(--primary)" }}>{tx("Control de accesos y seguridad")}</p>
          <h1 className="text-2xl">{tx("Usuarios, Permisos y Registro de Auditoría")}</h1>
          <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>{tx("Asigna cada cuenta a una propiedad, gestiona permisos por rol y revisa el registro de actividad.")}</p>
        </div>
        <button onClick={startNewUser} className="px-4 py-2.5 rounded text-sm font-semibold cursor-pointer" style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>{tx("+ Crear usuario")}</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="Usuarios" value={String(users.length)} sub="cuentas registradas" />
        <KpiCard label="Activos" value={String(activeUsers)} sub={tx("con acceso habilitado")} accent />
        <KpiCard label="Invitaciones" value={String(users.filter(u => u.status === "invited").length)} sub={tx("pendientes de aceptar")} />
        <KpiCard label="Eventos Auditados" value={String(auditLogs.length)} sub={tx("registros de actividad")} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
        <div className="rounded-md border overflow-hidden" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <div className="p-3 border-b flex items-center gap-3" style={{ borderColor: "var(--border)" }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder={tx("Buscar nombre, email o rol...")} className="w-full max-w-sm rounded border px-3 py-2 text-xs outline-none" style={{ background: "var(--muted)", borderColor: "var(--border)" }} />
            <span className="mono text-[10px] ml-auto whitespace-nowrap" style={{ color: "var(--muted-foreground)" }}>{visibleUsers.length} cuentas</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Usuario", "Rol", "Hotel asignado", "Estado", "Último acceso", ""].map(label => <th key={label} className="mono text-left px-4 py-3 text-[10px] uppercase tracking-widest font-medium" style={{ color: "var(--muted-foreground)" }}>{tx(label)}</th>)}
              </tr></thead>
              <tbody>
                {visibleUsers.map((user, index) => {
                  const role = ROLE_INFO[user.role];
                  const assignedNames = user.role === "superadmin" ? tx("Todas las propiedades") : user.hotelIds.map(id => hotels.find(h => h.id === id)?.name).filter(Boolean).join(", ") || tx("Sin asignar");
                  return (
                    <tr key={user.id} style={{ borderBottom: index < visibleUsers.length - 1 ? "1px solid var(--border)" : "none" }}>
                      <td className="px-4 py-3">
                        <p className="font-medium">{user.name}</p>
                        <p className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>{user.email}</p>
                      </td>
                      <td className="px-4 py-3"><span className="mono text-[9px] uppercase px-2 py-1 rounded" style={{ color: role.color, background: role.bg }}>{tx(role.label)}</span></td>
                      <td className="px-4 py-3 text-xs max-w-48" style={{ color: "var(--muted-foreground)" }}>{assignedNames}</td>
                      <td className="px-4 py-3"><span className="text-[10px] font-semibold uppercase" style={{ color: user.status === "active" ? "#6ee7b7" : user.status === "invited" ? "#fcd34d" : "#fca5a5" }}>{tx(user.status === "active" ? "Activo" : user.status === "invited" ? "Invitado" : "Bloqueado")}</span></td>
                      <td className="px-4 py-3 mono text-[10px]" style={{ color: "var(--muted-foreground)" }}>{relDate(user.lastAccess)}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button onClick={() => setEditing({ ...user })} className="px-2 py-1 rounded border text-xs" style={{ borderColor: "var(--border)" }}>{tx("Editar")}</button>
                          {user.role !== "superadmin" && <button onClick={() => { if (confirm(tx("¿Eliminar la cuenta de {name}?", { name: user.name }))) onDelete(user.id); }} className="px-2 py-1 rounded border text-xs" style={{ borderColor: "#7f1d1d", color: "#fca5a5" }}>{tx("Eliminar")}</button>}
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
          <p className="mono text-[10px] uppercase tracking-widest mb-4" style={{ color: "var(--primary)" }}>{tx("Permisos por rol")}</p>
          {[
            ["Superadministrador", "Acceso a todos los establecimientos, configuración de tarifas de IVA y catálogo general."],
            ["Administrador de Hotel", "Gestión de su establecimiento, configuración de servicios adicionales y equipo."],
            ["Revenue Manager", "Gestión de tarifas por temporada, planes tarifarios y disponibilidad de cupos."],
            ["Operador / Recepción", "Bandeja de reservas, validación de llegadas por código y emisión de comprobantes."],
          ].map(([role, description]) => <div key={role} className="pb-3 mb-3 border-b last:border-0 last:mb-0 last:pb-0" style={{ borderColor: "var(--border)" }}><p className="text-xs font-semibold">{tx(role)}</p><p className="text-[11px] mt-1 leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{tx(description)}</p></div>)}
        </div>
      </div>

      {/* Registro de Auditoría */}
      <div className="rounded-md border overflow-hidden" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
              {tx("Registro de actividad del sistema")}
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
              {tx("Historial cronológico de cambios de tarifa, validaciones de voucher y nuevas reservas.")}
            </p>
          </div>
          <span className="mono text-[10px] px-2 py-1 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            {tx("Solo lectura")}
          </span>
        </div>
        <div className="overflow-x-auto max-h-72">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["ID", "Fecha y Hora", "Usuario", "Rol", "Módulo", "Acción", "Detalle de la Operación", "IP"].map(h => (
                  <th key={h} className="mono text-left px-3.5 py-2.5 text-[10px] uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>{tx(h)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log, i) => (
                <tr key={log.id} style={{ borderBottom: i < auditLogs.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <td className="px-3.5 py-2.5 mono text-[10px] text-amber-400">{log.id}</td>
                  <td className="px-3.5 py-2.5 mono text-[11px] whitespace-nowrap" style={{ color: "var(--muted-foreground)" }}>{log.timestamp}</td>
                  <td className="px-3.5 py-2.5 font-medium" style={{ color: "var(--foreground)" }}>{log.user}</td>
                  <td className="px-3.5 py-2.5 text-[11px]" style={{ color: "var(--muted-foreground)" }}>{tx(log.role)}</td>
                  <td className="px-3.5 py-2.5 text-[11px] font-semibold text-sky-400">{tx(log.module)}</td>
                  <td className="px-3.5 py-2.5 mono text-[10px] font-bold text-emerald-400">{log.action}</td>
                  <td className="px-3.5 py-2.5 text-[11px]" style={{ color: "var(--foreground)" }}>{log.detail}</td>
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
              <div><p className="mono text-[10px] uppercase tracking-widest" style={{ color: "var(--primary)" }}>{tx("Cuenta de personal")}</p><h2 className="text-xl">{editing.id ? "Editar usuario" : "Nuevo usuario"}</h2></div>
              <button type="button" onClick={() => setEditing(null)} className="text-xl" style={{ color: "var(--muted-foreground)" }}>×</button>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label={tx("Nombre completo")} value={editing.name} onChange={name => setEditing({ ...editing, name })} required />
              <Field label={tx("Email corporativo")} type="email" value={editing.email} onChange={email => setEditing({ ...editing, email })} required />
              <Field label="Teléfono" value={editing.phone} onChange={phone => setEditing({ ...editing, phone })} />
              <div><label className="block text-xs mb-1" style={{ color: "var(--muted-foreground)" }}>{tx("Rol")}</label><select value={editing.role} onChange={e => setEditing({ ...editing, role: e.target.value as AdminRole, hotelIds: e.target.value === "superadmin" ? [] : editing.hotelIds })} className="w-full rounded border px-3 py-2.5 text-sm" style={{ background: "var(--muted)", borderColor: "var(--border)" }}>{roleOptions.map(role => <option key={role} value={role}>{ROLE_INFO[role].label}</option>)}</select></div>
              {editing.role !== "superadmin" && <div><label className="block text-xs mb-1" style={{ color: "var(--muted-foreground)" }}>{tx("Hotel asignado")}</label><select required value={editing.hotelIds[0] ?? ""} onChange={e => setEditing({ ...editing, hotelIds: [e.target.value] })} className="w-full rounded border px-3 py-2.5 text-sm" style={{ background: "var(--muted)", borderColor: "var(--border)" }}><option value="">{tx("Seleccionar hotel")}</option>{hotels.map(hotel => <option key={hotel.id} value={hotel.id}>{hotel.name}</option>)}</select></div>}
              <div><label className="block text-xs mb-1" style={{ color: "var(--muted-foreground)" }}>{tx("Estado")}</label><select value={editing.status} onChange={e => setEditing({ ...editing, status: e.target.value as StaffUser["status"] })} className="w-full rounded border px-3 py-2.5 text-sm" style={{ background: "var(--muted)", borderColor: "var(--border)" }}><option value="active">{tx("Activo")}</option><option value="invited">{tx("Invitación pendiente")}</option><option value="blocked">{tx("Bloqueado")}</option></select></div>
            </div>
            <div className="rounded p-3 mt-4 text-[11px] leading-relaxed" style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}>{tx("Al guardar, el usuario recibirá una invitación para crear su contraseña. Los permisos se aplican automáticamente según su rol y hotel asignado.")}</div>
            <div className="flex justify-end gap-2 mt-5"><button type="button" onClick={() => setEditing(null)} className="px-4 py-2 text-sm" style={{ color: "var(--muted-foreground)" }}>{tx("Cancelar")}</button><button type="submit" className="px-5 py-2 rounded text-sm font-semibold" style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>{tx("Guardar usuario")}</button></div>
          </form>
        </div>
      )}
    </div>
  );
}

// ─── App root ─────────────────────────────────────────────────────────────────

function relDate(s: string): string {
  return s.replace(/^Hoy/, tx("Hoy")).replace(/^Ayer/, tx("Ayer")).replace(/^Pendiente$/, tx("Pendiente"));
}

export default function App() {
  const operations = useGuestReservations();
  useRoomCatalogRevision();
  const lang = useLang();
  const [theme, setTheme] = usePersistentState<"light" | "dark">("hoteldirekt.theme", "light");
  const [appMode, setAppMode] = useState<"auth" | "guest" | "admin">("guest");
  const [authDefaultTab, setAuthDefaultTab] = useState<"guest" | "admin">("guest");
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [guestUser, setGuestUser] = useState<GuestUser | null>(null);
  const [view, setView] = useState<View>("hotels");
  const [activeHotelId, setActiveHotelId] = useState<string>("hotel-voyager-manta");
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
        onAdminAccess={() => {
          if (adminUser) {
            setAppMode("admin");
            return;
          }
          setAuthDefaultTab("admin");
          setAppMode("auth");
        }}
        adminSessionActive={adminUser !== null}
        theme={theme}
        onToggleTheme={() => setTheme(t => t === "light" ? "dark" : "light")}
      />
    );
  }

  const role = adminUser?.role ?? "receptionist";
  const currentHotels = hotels.map(hotel => {
    const metrics = hotelMetrics(operations, hotel.id);
    const capacity = getRoomOffers(hotel.id).reduce((sum, room) => sum + room.available, 0);
    return { ...hotel, rooms: capacity, occupancy: capacity ? Math.round(metrics.heldToday / capacity * 100) : 0, monthRevenue: metrics.monthCollected };
  });
  const allowedHotels = role === "superadmin" ? currentHotels : currentHotels.filter(h => adminUser?.hotelIds?.includes(h.id));
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
          <p className="text-[10px] text-slate-400 mt-0.5">{tx("Portal Cantonal de Alojamientos")}</p>
          {adminUser && (
            <div className="mt-1.5 flex items-center gap-1.5">
              <span className="mono text-[9px] px-1.5 py-0.5 rounded uppercase font-bold" style={{ background: ROLE_INFO[adminUser.role].bg, color: ROLE_INFO[adminUser.role].color }}>
                {tx(ROLE_INFO[adminUser.role].label)}
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
            <span>{tx("Ver portal de huéspedes")}</span>
          </button>
        </div>

        {/* Hotel selector */}
        {view !== "hotels" && view !== "users" && activeHotel && (
          <div className="px-3 pt-3 pb-2 border-b" style={{ borderColor: "var(--border)" }}>
            <p className="mono text-[9px] uppercase tracking-widest mb-1" style={{ color: "var(--muted-foreground)" }}>
              {tx(role === "superadmin" ? "Hotel supervisado" : "Mi Hotel")}
            </p>
            <select
              aria-label={tx(role === "superadmin" ? "Hotel supervisado" : "Mi Hotel")}
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
                <span className="w-6 h-6 rounded flex items-center justify-center text-slate-400 group-hover:text-amber-400" style={{ background: "var(--muted)" }}>
                  <NavIcon view={item.view} />
                </span>
                <span className="font-medium text-xs">{tx(item.label)}</span>
              </button>
            </div>
          ))}
        </nav>

        {/* Ver web + tema + logout */}
        <div className="px-2 pb-1 space-y-1.5">
          {/* Selector de idioma Español / English */}
          <button
            type="button"
            onClick={() => setLang(lang === "es" ? "en" : "es")}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all border cursor-pointer hover:border-amber-500/50 shadow-xs"
            style={{ background: "var(--muted)", borderColor: "var(--border)", color: "var(--foreground)" }}
            title={tx("Cambiar idioma")}
            aria-label={tx("Cambiar idioma")}
          >
            <span className="flex items-center gap-1.5">
              <span>🌐</span>
              <span>{tx("Idioma")}</span>
            </span>
            <span className="mono text-[10px] px-1.5 py-0.5 rounded font-bold uppercase" style={{ background: "var(--secondary)", color: "var(--primary)" }}>
              {lang === "es" ? "ES" : "EN"}
            </span>
          </button>
          {/* Botón de cambio de tema Claro / Oscuro */}
          <button
            onClick={() => setTheme(t => (t === "light" ? "dark" : "light"))}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all border cursor-pointer hover:border-amber-500/50 shadow-xs"
            style={{ background: "var(--muted)", borderColor: "var(--border)", color: "var(--foreground)" }}
            title={tx("Alternar entre modo claro y modo oscuro")}
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
            {tx("Ver web cliente")}
          </button>
          <button
            onClick={() => { setAdminUser(null); setAppMode("auth"); }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer"
            style={{ background: "var(--muted)", color: "#fca5a5" }}
          >
            {tx("← Cerrar sesión")}
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
                <span style={{ color: "var(--muted-foreground)" }}>{tx("Gestionando:")}</span>
                <span className="font-semibold" style={{ color: "var(--primary)" }}>{activeHotel?.name}</span>
                <span style={{ color: "var(--muted-foreground)" }}>·</span>
                <span style={{ color: "var(--muted-foreground)" }}>{activeHotel?.city}</span>
              </div>
              <Dashboard hotelId={activeHotel.id} canReset={role === "superadmin"} />
            </div>
          )}
          {view === "reservations" && activeHotel && <ReservationsView key={activeHotel.id} hotelId={activeHotel.id} hotelName={activeHotel.name} operator={adminUser?.name ?? "Operador local"} canManagePayments={role !== "manager"} canConfigureArrival={role === "superadmin" || role === "admin"} />}
          {view === "rooms" && activeHotel && (
            <RoomsView
              key={activeHotel.id}
              hotelId={activeHotel.id}
              onGoToGuestWeb={() => setAppMode("guest")}
              operator={adminUser?.name ?? "Operador local"}
              canManagePayments={role !== "manager"}
            />
          )}
          {view === "revenue" && <RevenueView hotelId={activeHotel.id} />}
          {view === "guests" && activeHotel && <GuestsView key={activeHotel.id} hotelId={activeHotel.id} />}
          {view === "billing" && activeHotel && <BillingView key={activeHotel.id} hotelId={activeHotel.id} operator={adminUser?.name ?? "Operador local"} />}
          {view === "payments" && activeHotel && <PaymentsView key={activeHotel.id} hotelId={activeHotel.id} operator={adminUser?.name ?? "Operador local"} />}
          {view === "rates" && activeHotel && <RatesView key={activeHotel.id} hotelId={activeHotel.id} hotel={activeHotel} />}
        </main>
      </div>

    </div>
  );
}
