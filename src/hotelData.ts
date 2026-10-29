import { MANTA_HOTELS } from "./mantaHotels";

// ─── Hotel Data & Rates Configuration ──────────────────────────────────────────

export interface SeasonInfo {
  name: string;
  months: string;
  multiplier: number;
  color: string;
}

export interface RoomRateInfo {
  type: string;
  basePrice: number;
  icon: string;
  capacity?: number;
  category?: string;
}

export interface ChannelCommission {
  name: string;
  commission: number;
  color: string;
  note?: string;
}

export interface HotelRatesConfig {
  hotelId: string;
  currency: string;
  currencySymbol: string;
  seasons: SeasonInfo[];
  roomTypes: RoomRateInfo[];
  channels: ChannelCommission[];
}

export interface HotelCommercialMeta {
  ruc: string;
  razonSocial: string;
  nombreComercial: string;
  dirMatriz: string;
  dirSucursal: string;
  contribuyenteEspecial?: string;
  obligadoContabilidad: "SÍ" | "NO";
  regimen: string;
  agenteRetencion?: string;
  estab: string;
  ptoEmi: string;
  phone: string;
  email: string;
  city: string;
  gravaServicio10: boolean; // Art. 41 Ley de Turismo: TRUE si grava 10% propina, FALSE si exento
}

const BASE_HOTEL_COMMERCIAL_INFO: Record<string, HotelCommercialMeta> = {
  "costa-sol": {
    ruc: "1391789456001",
    razonSocial: "OPERADORA HOTELERA COSTA SOL S.A.S.",
    nombreComercial: "Hotel Costa Sol",
    dirMatriz: "Av. Malecón Jaime Chávez Gutiérrez y Calle 15",
    dirSucursal: "Av. Malecón Jaime Chávez Gutiérrez y Calle 15, Manta - Manabí",
    contribuyenteEspecial: "Resolución Nro. NAC-DNCRASC20-00000452",
    obligadoContabilidad: "SÍ",
    regimen: "CONTRIBUYENTE RÉGIMEN GENERAL",
    agenteRetencion: "Resolución No. NAC-DNCRASC20-00000001",
    estab: "001",
    ptoEmi: "002",
    phone: "+593 5 262 8900",
    email: "reservas@hotelcostasol.ec",
    city: "Manta, Ecuador",
    gravaServicio10: true,
  },
  "las-palmeras": {
    ruc: "0992384751001",
    razonSocial: "CONSORCIO HOTELERO LAS PALMERAS S.A.",
    nombreComercial: "Hotel Las Palmeras",
    dirMatriz: "Av. Flavio Reyes y Calle 24",
    dirSucursal: "Av. Flavio Reyes y Calle 24, Manta - Manabí",
    contribuyenteEspecial: "Resolución Nro. NAC-DNCRASC20-00000318",
    obligadoContabilidad: "SÍ",
    regimen: "CONTRIBUYENTE RÉGIMEN GENERAL",
    agenteRetencion: "Resolución No. NAC-DNCRASC20-00000001",
    estab: "001",
    ptoEmi: "001",
    phone: "+593 5 262 5500",
    email: "contabilidad@laspalmeras.ec",
    city: "Manta - El Murciélago, Ecuador",
    gravaServicio10: true,
  },
  "hostal-centro": {
    ruc: "1792184920001",
    razonSocial: "HOSPEDAJE COLONIAL EL CENTRO CIA. LTDA.",
    nombreComercial: "Hostal El Centro",
    dirMatriz: "Calle 13 y Av. 4, Tarqui",
    dirSucursal: "Calle 13 y Av. 4, Tarqui, Manta - Manabí",
    obligadoContabilidad: "SÍ",
    regimen: "CONTRIBUYENTE RÉGIMEN RIMPE - EMPRENDEDOR",
    estab: "002",
    ptoEmi: "001",
    phone: "+593 5 261 1234",
    email: "reservas@hostalcentro.ec",
    city: "Manta - Tarqui, Ecuador",
    gravaServicio10: false, // Hostal 2 estrellas: no grava 10%
  },
  "mirador-alhambra": {
    ruc: "0190348291001",
    razonSocial: "HOTELERA BOUTIQUE MIRADOR S.A.S.",
    nombreComercial: "Hotel Mirador Barbasquillo",
    dirMatriz: "Vía a Barbasquillo y Calle 120",
    dirSucursal: "Vía a Barbasquillo y Calle 120, Manta - Manabí",
    contribuyenteEspecial: "Resolución Nro. NAC-DNCRASC20-00000215",
    obligadoContabilidad: "SÍ",
    regimen: "CONTRIBUYENTE RÉGIMEN GENERAL",
    agenteRetencion: "Resolución No. NAC-DNCRASC20-00000001",
    estab: "001",
    ptoEmi: "003",
    phone: "+593 5 267 3320",
    email: "info@miradorbarbasquillo.ec",
    city: "Manta - Barbasquillo, Ecuador",
    gravaServicio10: true,
  },
  "hostal-rambla": {
    ruc: "0993184927001",
    razonSocial: "INVERSIONES TURISTICAS RAMBLA S.A.",
    nombreComercial: "Hostal Rambla del Mar",
    dirMatriz: "Av. Malecón y Calle 102, Tarqui",
    dirSucursal: "Av. Malecón y Calle 102, Tarqui, Manta",
    obligadoContabilidad: "SÍ",
    regimen: "CONTRIBUYENTE RÉGIMEN RIMPE - EMPRENDEDOR",
    estab: "003",
    ptoEmi: "001",
    phone: "+593 5 262 7780",
    email: "admin@hostalrambla.ec",
    city: "Manta - Tarqui, Ecuador",
    gravaServicio10: false, // Hostal 2 estrellas: no grava 10%
  },
  "sierra-nevada": {
    ruc: "0591782341001",
    razonSocial: "HOSTERIA SIERRA NEVADA S.A.",
    nombreComercial: "Hotel Sierra Nevada",
    dirMatriz: "Sector San Lorenzo Playa Km 3",
    dirSucursal: "Sector San Lorenzo Playa Km 3, Manta",
    obligadoContabilidad: "SÍ",
    regimen: "CONTRIBUYENTE RÉGIMEN GENERAL",
    estab: "001",
    ptoEmi: "001",
    phone: "+593 5 238 4410",
    email: "reservas@hotelsierranevada.ec",
    city: "Manta - San Lorenzo, Ecuador",
    gravaServicio10: true,
  },
  "camino-real": {
    ruc: "1890284719001",
    razonSocial: "SERVICIOS TURISTICOS CAMINO REAL CIA. LTDA.",
    nombreComercial: "Hotel Camino Real",
    dirMatriz: "Av. Interbarrial y Calle 114, Los Esteros",
    dirSucursal: "Av. Interbarrial y Calle 114, Los Esteros, Manta",
    obligadoContabilidad: "SÍ",
    regimen: "CONTRIBUYENTE RÉGIMEN RIMPE - EMPRENDEDOR",
    estab: "001",
    ptoEmi: "001",
    phone: "+593 5 262 3450",
    email: "administracion@hotelcaminoreal.ec",
    city: "Manta - Los Esteros, Ecuador",
    gravaServicio10: true,
  },
  "pension-marina": {
    ruc: "0891827364001",
    razonSocial: "RESIDENCIAL TURISTICA LA MARINA",
    nombreComercial: "Hostal Pensión La Marina",
    dirMatriz: "Malecón de San Mateo y Calle Las Brisas",
    dirSucursal: "Malecón de San Mateo, Manta",
    obligadoContabilidad: "NO",
    regimen: "CONTRIBUYENTE RÉGIMEN RIMPE - NEGOCIO POPULAR",
    estab: "001",
    ptoEmi: "001",
    phone: "+593 5 238 1180",
    email: "marina.sanmateo@gmail.com",
    city: "Manta - San Mateo, Ecuador",
    gravaServicio10: false, // Pequeño hospedaje 1 estrella: no grava 10%
  },
};

// Exportar ficha comercial dinámica para todos los establecimientos de Manta
export const HOTEL_COMMERCIAL_INFO: Record<string, HotelCommercialMeta> = new Proxy(BASE_HOTEL_COMMERCIAL_INFO, {
  get(target, prop: string) {
    if (prop in target) return target[prop];
    const h = MANTA_HOTELS.find(item => item.id === prop);
    if (h) {
      return {
        ruc: h.taxId || "1391789456001",
        razonSocial: `${h.name.toUpperCase()} OPERADORA TURISTICA C.A.`,
        nombreComercial: h.name,
        dirMatriz: h.address,
        dirSucursal: `${h.address}, Manta - Manabí`,
        obligadoContabilidad: h.stars >= 3 ? "SÍ" : "NO",
        regimen: h.stars >= 3 ? "CONTRIBUYENTE RÉGIMEN GENERAL" : "CONTRIBUYENTE RÉGIMEN RIMPE - EMPRENDEDOR",
        estab: "001",
        ptoEmi: "001",
        phone: h.phone || "+593 5 262 0000",
        email: `contacto@${h.id.replace(/-/g, "")}.ec`,
        city: h.city,
        gravaServicio10: h.gravaServicio10 ?? (h.stars >= 3),
      };
    }
    return target["costa-sol"];
  }
});

// Alias para compatibilidad de importaciones
export const HOTEL_SRI_INFO = HOTEL_COMMERCIAL_INFO;
export const HOTEL__INFO = HOTEL_COMMERCIAL_INFO;

const BASE_HOTEL_RATES: Record<string, HotelRatesConfig> = {
  "costa-sol": {
    hotelId: "costa-sol",
    currency: "USD",
    currencySymbol: "$",
    seasons: [
      { name: "Temporada Baja", months: "Nov – Feb", multiplier: 0.75, color: "#1e3a5f" },
      { name: "Temporada Media", months: "Mar – May, Oct", multiplier: 1.0, color: "#064e3b" },
      { name: "Temporada Alta", months: "Jun – Sep, Feriados", multiplier: 1.45, color: "#451a03" },
    ],
    roomTypes: [
      { type: "Habitación Individual Vista Mar", basePrice: 65, icon: "🛏" },
      { type: "Habitación Matrimonial con Balcón", basePrice: 85, icon: "🛏🛏" },
      { type: "Habitación King Frente al Mar", basePrice: 115, icon: "⭐🛏🛏" },
      { type: "Suite Costa Sol Panorámica", basePrice: 165, icon: "👑🛏" },
      { type: "Habitación Familiar (Queen + 2 Twin)", basePrice: 230, icon: "🏖️👑" },
    ],
    channels: [
      { name: "Directo (web/teléfono)", commission: 0, color: "#6ee7b7" },
      { name: "Booking.com", commission: 14, color: "#93c5fd", note: "Programa Preferente" },
      { name: "Expedia", commission: 17, color: "#d8b4fe" },
      { name: "Airbnb", commission: 12, color: "#fcd34d" },
    ],
  },
  "las-palmeras": {
    hotelId: "las-palmeras",
    currency: "USD",
    currencySymbol: "$",
    seasons: [
      { name: "Temporada Baja", months: "Nov – Mar", multiplier: 0.75, color: "#1e3a5f" },
      { name: "Temporada Media", months: "Abr – Jun, Oct", multiplier: 1.0, color: "#064e3b" },
      { name: "Temporada Alta", months: "Jul – Sep", multiplier: 1.35, color: "#451a03" },
    ],
    roomTypes: [
      { type: "1 Cama Individual", basePrice: 55, icon: "🛏" },
      { type: "1 Cama Matrimonial (Queen)", basePrice: 70, icon: "🛏🛏" },
      { type: "1 Cama King Superior", basePrice: 85, icon: "⭐🛏🛏" },
      { type: "Triple", basePrice: 110, icon: "🛏🛏🛏" },
      { type: "1 Cama King Suite", basePrice: 150, icon: "👑🛏" },
    ],
    channels: [
      { name: "Directo (web/teléfono)", commission: 0, color: "#6ee7b7" },
      { name: "Booking.com", commission: 15, color: "#93c5fd" },
      { name: "Expedia", commission: 18, color: "#d8b4fe" },
      { name: "Airbnb", commission: 12, color: "#fcd34d" },
    ],
  },
  "hostal-centro": {
    hotelId: "hostal-centro",
    currency: "USD",
    currencySymbol: "$",
    seasons: [
      { name: "Temporada Baja", months: "Ene – Feb", multiplier: 0.8, color: "#1e3a5f" },
      { name: "Temporada Media", months: "Mar – Jun, Nov", multiplier: 1.0, color: "#064e3b" },
      { name: "Temporada Alta", months: "Jul – Oct, Diciembre", multiplier: 1.3, color: "#451a03" },
    ],
    roomTypes: [
      { type: "Habitación Individual Cápsula", basePrice: 32, icon: "🛏" },
      { type: "Habitación Doble Twin", basePrice: 48, icon: "🛏🛏" },
      { type: "Habitación Matrimonial con Baño Privado", basePrice: 58, icon: "⭐🛏🛏" },
      { type: "Habitación Familiar 4 Personas", basePrice: 78, icon: "🛏🛏🛏" },
    ],
    channels: [
      { name: "Directo (web/teléfono)", commission: 0, color: "#6ee7b7" },
      { name: "Booking.com", commission: 18, color: "#93c5fd" },
      { name: "Hostelworld", commission: 12, color: "#f97316" },
      { name: "Airbnb", commission: 14, color: "#fcd34d" },
    ],
  },
  "mirador-alhambra": {
    hotelId: "mirador-alhambra",
    currency: "USD",
    currencySymbol: "$",
    seasons: [
      { name: "Temporada Baja", months: "Ene – Feb, Jun", multiplier: 0.85, color: "#1e3a5f" },
      { name: "Temporada Media", months: "Mar – May, Sep", multiplier: 1.0, color: "#064e3b" },
      { name: "Temporada Alta", months: "Semana Santa & Fiestas", multiplier: 1.4, color: "#451a03" },
    ],
    roomTypes: [
      { type: "Habitación Clásica Colonial", basePrice: 95, icon: "🛏" },
      { type: "Habitación Deluxe Vista al Río", basePrice: 140, icon: "⭐🛏🛏" },
      { type: "Junior Suite Patrimonial", basePrice: 195, icon: "👑🛏" },
      { type: "Suite Imperial con Balcón", basePrice: 280, icon: "👑✨" },
    ],
    channels: [
      { name: "Directo (web/teléfono)", commission: 0, color: "#6ee7b7" },
      { name: "Booking.com", commission: 12, color: "#93c5fd" },
      { name: "Expedia", commission: 15, color: "#d8b4fe" },
      { name: "Relais & Châteaux", commission: 8, color: "#fcd34d" },
    ],
  },
  "hostal-rambla": {
    hotelId: "hostal-rambla",
    currency: "USD",
    currencySymbol: "$",
    seasons: [
      { name: "Temporada Baja", months: "May – Jun", multiplier: 0.8, color: "#1e3a5f" },
      { name: "Temporada Media", months: "Ene – Abr, Sep", multiplier: 1.0, color: "#064e3b" },
      { name: "Temporada Alta", months: "Jul – Ago, Fiestas", multiplier: 1.35, color: "#451a03" },
    ],
    roomTypes: [
      { type: "Individual Express", basePrice: 40, icon: "🛏" },
      { type: "Doble Estándar Rambla", basePrice: 60, icon: "🛏🛏" },
      { type: "Doble Superior Vista Río", basePrice: 75, icon: "⭐🛏🛏" },
      { type: "Triple Familiar", basePrice: 95, icon: "🛏🛏🛏" },
    ],
    channels: [
      { name: "Directo (web/teléfono)", commission: 0, color: "#6ee7b7" },
      { name: "Booking.com", commission: 16, color: "#93c5fd" },
      { name: "Expedia", commission: 18, color: "#d8b4fe" },
      { name: "Airbnb", commission: 13, color: "#fcd34d" },
    ],
  },
  "sierra-nevada": {
    hotelId: "sierra-nevada",
    currency: "USD",
    currencySymbol: "$",
    seasons: [
      { name: "Temporada Baja", months: "Abr – May, Sep – Oct", multiplier: 0.7, color: "#1e3a5f" },
      { name: "Temporada Media", months: "Feb – Mar, Jun – Jul", multiplier: 1.0, color: "#064e3b" },
      { name: "Temporada Alta", months: "Jul – Ago, Dic – Ene", multiplier: 1.5, color: "#451a03" },
    ],
    roomTypes: [
      { type: "1 Cama Matrimonial Alpina", basePrice: 75, icon: "🛏" },
      { type: "Doble Superior Vista Volcán", basePrice: 110, icon: "⭐🛏🛏" },
      { type: "Cabaña Rústica con Chimenea", basePrice: 165, icon: "🪵🔥" },
      { type: "Chalet de Montaña con Hidromasaje", basePrice: 245, icon: "👑🏔️" },
    ],
    channels: [
      { name: "Directo (web/teléfono)", commission: 0, color: "#6ee7b7" },
      { name: "Booking.com", commission: 15, color: "#93c5fd" },
      { name: "Expedia", commission: 17, color: "#d8b4fe" },
      { name: "Paquetes de Aventura", commission: 10, color: "#fcd34d" },
    ],
  },
  "camino-real": {
    hotelId: "camino-real",
    currency: "USD",
    currencySymbol: "$",
    seasons: [
      { name: "Temporada Baja", months: "Ene – Feb", multiplier: 0.8, color: "#1e3a5f" },
      { name: "Temporada Media", months: "Mar – Jun, Oct", multiplier: 1.0, color: "#064e3b" },
      { name: "Temporada Alta", months: "Fiestas de las Flores y Frutas", multiplier: 1.4, color: "#451a03" },
    ],
    roomTypes: [
      { type: "Habitación Individual Confort", basePrice: 48, icon: "🛏" },
      { type: "Habitación Matrimonial Queen", basePrice: 68, icon: "🛏🛏" },
      { type: "Habitación King Superior", basePrice: 88, icon: "⭐🛏🛏" },
      { type: "Suite Ejecutiva", basePrice: 125, icon: "👑🛏" },
    ],
    channels: [
      { name: "Directo (web/teléfono)", commission: 0, color: "#6ee7b7" },
      { name: "Booking.com", commission: 15, color: "#93c5fd" },
      { name: "Expedia", commission: 16, color: "#d8b4fe" },
      { name: "Airbnb", commission: 12, color: "#fcd34d" },
    ],
  },
  "pension-marina": {
    hotelId: "pension-marina",
    currency: "USD",
    currencySymbol: "$",
    seasons: [
      { name: "Temporada Baja", months: "May – Jun, Oct – Nov", multiplier: 0.75, color: "#1e3a5f" },
      { name: "Temporada Media", months: "Abr, Sep", multiplier: 1.0, color: "#064e3b" },
      { name: "Temporada Alta", months: "Jul – Ago, Carnaval & Feriados", multiplier: 1.45, color: "#451a03" },
    ],
    roomTypes: [
      { type: "Habitación Individual Playa", basePrice: 25, icon: "🛏" },
      { type: "Habitación Doble Económica", basePrice: 38, icon: "🛏🛏" },
      { type: "Habitación Triple Frente al Mar", basePrice: 55, icon: "🛏🛏🛏" },
      { type: "Habitación Familiar 5 Personas", basePrice: 85, icon: "🏖️🛏" },
    ],
    channels: [
      { name: "Directo (Recepción/WhatsApp)", commission: 0, color: "#6ee7b7" },
      { name: "Booking.com", commission: 16, color: "#93c5fd" },
      { name: "Expedia", commission: 18, color: "#d8b4fe" },
      { name: "Airbnb", commission: 14, color: "#fcd34d" },
    ],
  },
};


export const DEFAULT_HOTEL_RATES: Record<string, HotelRatesConfig> = new Proxy(BASE_HOTEL_RATES, {
  get(target, prop: string) {
    if (prop in target) return target[prop];
    const hotel = MANTA_HOTELS.find(h => h.id === prop);
    const baseP = hotel?.priceFrom || 55;
    return {
      hotelId: prop,
      currency: "USD",
      currencySymbol: "$",
      seasons: [
        { name: "Temporada Baja", months: "May – Jun, Oct – Nov", multiplier: 0.8, color: "#1e3a5f" },
        { name: "Temporada Media", months: "Ene – Abr, Sep", multiplier: 1.0, color: "#064e3b" },
        { name: "Temporada Alta (Feriados / Verano)", months: "Jul – Ago, Dic – Feriados Manta", multiplier: 1.35, color: "#451a03" },
      ],
      roomTypes: hotel?.rooms?.map(r => ({
        type: r.type,
        basePrice: r.pricePerNight,
        icon: r.type.includes("King") || r.type.includes("Suite") ? "👑🛏️" : r.type.includes("Doble") || r.type.includes("Twin") ? "🛏️🛏️" : "🛏️",
        capacity: r.capacity
      })) || [
        { type: "Habitación Individual", basePrice: Math.round(baseP * 0.75), icon: "🛏️", capacity: 1 },
        { type: "Habitación Matrimonial", basePrice: baseP, icon: "⭐🛏️", capacity: 2 },
        { type: "Habitación Doble Twin", basePrice: Math.round(baseP * 0.9), icon: "🛏️🛏️", capacity: 2 },
      ],
      channels: [
        { name: "Portal Oficial AlojaManta", commission: 0, color: "#6ee7b7", note: "0% intermediación directa" },
        { name: "Booking.com", commission: 17, color: "#93c5fd" },
        { name: "Expedia", commission: 19, color: "#d8b4fe" },
        { name: "Airbnb", commission: 14, color: "#fcd34d" },
      ],
    };
  }
});

// ───  Clave de Acceso Generator ────────────────────────────────────────────
// Format: 49 digits numeric
// [Fecha: 8 ddmmaaaa][Tipo Comp: 2 (01)][RUC: 13][Ambiente: 1 (1 o 2)][Estab: 3][PtoEmi: 3][Secuencial: 9][Codigo Numerico: 8][Tipo Emision: 1][Digito Verificador: 1]
export function generateSriAccessKey(
  dateIso: string,
  ruc: string,
  estab: string,
  ptoEmi: string,
  secuencialNum: string | number
): { accessKey: string; authNumber: string; authDate: string } {
  const d = new Date(dateIso + "T12:00:00");
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = String(d.getFullYear());
  const dateStr = `${dd}${mm}${yyyy}`;
  const cleanRuc = ruc.replace(/\D/g, "").padEnd(13, "0").slice(0, 13);
  const cleanEstab = String(estab).replace(/\D/g, "").padStart(3, "0").slice(0, 3);
  const cleanPto = String(ptoEmi).replace(/\D/g, "").padStart(3, "0").slice(0, 3);
  const cleanSec = String(secuencialNum).replace(/\D/g, "").padStart(9, "0").slice(-9);

  const partial = `${dateStr}01${cleanRuc}2${cleanEstab}${cleanPto}${cleanSec}123456781`;
  
  // Calculate modulo 11 check digit
  let factor = 2;
  let sum = 0;
  for (let i = partial.length - 1; i >= 0; i--) {
    sum += parseInt(partial[i], 10) * factor;
    factor = factor === 7 ? 2 : factor + 1;
  }
  const mod = 11 - (sum % 11);
  const verifier = mod === 11 ? 0 : mod === 10 ? 1 : mod;
  const accessKey = `${partial}${verifier}`;

  return {
    accessKey,
    authNumber: accessKey,
    authDate: `${dd}/${mm}/${yyyy} 15:42:08`,
  };
}

// ─── Format helper for Ecuador  Invoices ───────────────────────────────────
export function fmtSriSecuencial(estab: string, ptoEmi: string, seq: string | number): string {
  const cleanEstab = String(estab).replace(/\D/g, "").padStart(3, "0").slice(0, 3);
  const cleanPto = String(ptoEmi).replace(/\D/g, "").padStart(3, "0").slice(0, 3);
  const cleanSec = String(seq).replace(/\D/g, "").padStart(9, "0").slice(-9);
  return `${cleanEstab}-${cleanPto}-${cleanSec}`;
}

export function fmtUsd(amount: number): string {
  return new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

// ─── Initial Invoices & Payments per Hotel ────────────────────────────────────

export interface HotelInvoice {
  id: string;
  resId: string;
  guest: string;
  hotel: string;
  hotelId: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  base: number;
  iva: number;
  ivaPercent?: number; // 15 (Ordinario) u 8 (Feriado por Decreto)
  servicio10?: number; // 10% Propina / Servicio (Art. 41 Ley Turismo)
  total: number;
  status: "paid" | "pending" | "overdue" | "refunded";
  issueDate: string;
  payMethod: string;
  deliveryStatus?: "issued" | "error" | "returned";
  clientDoc?: string;
  clientAddress?: string;
  clientEmail?: string;
  clientPhone?: string;
  roomType?: string;
  hotelInvoiceNumber?: string; // Código de recibo o comprobante directo emitido por el hotel
}

export interface HotelPayment {
  id: string;
  guest: string;
  amount: number;
  method: string;
  date: string;
  status: "completed" | "pending" | "failed";
  concept?: string;
  linkUrl?: string;
  expiresAt?: string;
}

export function getHotelInitialInvoices(hotelId: string, hotelName: string): HotelInvoice[] {
  const hotelMeta = HOTEL_COMMERCIAL_INFO[hotelId] || HOTEL_COMMERCIAL_INFO["costa-sol"];
  const estab = hotelMeta.estab;
  const pto = hotelMeta.ptoEmi;

  if (hotelId === "costa-sol") {
    return [
      {
        id: `${estab}-${pto}-000000001`,
        resId: "RES-CS-101",
        guest: "Carlos Méndez",
        hotel: hotelName,
        hotelId,
        checkIn: "2026-08-15",
        checkOut: "2026-08-18",
        nights: 3,
        base: 190.91,
        iva: 28.64,
        total: 219.55,
        status: "paid",
        issueDate: "2026-08-15",
        payMethod: "PayPhone Ecuador / Tarjeta",
        deliveryStatus: "issued",
        clientDoc: "1718293847",
        clientAddress: "Av. Shyris y Naciones Unidas, Quito",
        clientEmail: "cmendez@gmail.com",
        clientPhone: "+593 98 421 8890",
        roomType: "1 Cama Queen Matrimonial con Balcón",
        hotelInvoiceNumber: "001-002-000014290",
      },
      {
        id: `${estab}-${pto}-000000002`,
        resId: "RES-CS-102",
        guest: "Laura Fernández",
        hotel: hotelName,
        hotelId,
        checkIn: "2026-08-15",
        checkOut: "2026-08-16",
        nights: 1,
        base: 65.0,
        iva: 9.75,
        total: 74.75,
        status: "paid",
        issueDate: "2026-08-16",
        payMethod: "Efectivo recepción",
        deliveryStatus: "issued",
        clientDoc: "0928374615",
        clientAddress: "Cdla. Urdesa Norte, Guayaquil",
        clientEmail: "lfernandez@hotmail.com",
        clientPhone: "+593 99 123 4567",
        roomType: "1 Cama Individual Vista Mar",
        hotelInvoiceNumber: "001-001-000008311",
      },
      {
        id: `${estab}-${pto}-000000003`,
        resId: "RES-CS-103",
        guest: "Familia Rodríguez",
        hotel: hotelName,
        hotelId,
        checkIn: "2026-08-16",
        checkOut: "2026-08-20",
        nights: 4,
        base: 460.0,
        iva: 69.0,
        total: 529.0,
        status: "pending",
        issueDate: "2026-08-16",
        payMethod: "Transferencia DeUna / Produbanco",
        deliveryStatus: "issued",
        clientDoc: "1792458921001",
        clientAddress: "Cumbayá, Sector San Juan, Quito",
        clientEmail: "jrodriguez@empresa.ec",
        clientPhone: "+593 98 765 4321",
        roomType: "Familiar: 1 Cama Queen + 2 Twin",
      },
      {
        id: `${estab}-${pto}-000000004`,
        resId: "RES-CS-104",
        guest: "Miguel Torres",
        hotel: hotelName,
        hotelId,
        checkIn: "2026-08-17",
        checkOut: "2026-08-19",
        nights: 2,
        base: 170.0,
        iva: 25.5,
        total: 195.5,
        status: "pending",
        issueDate: "2026-08-17",
        payMethod: "Tarjeta Corporativa (Datafast)",
        deliveryStatus: "issued",
        clientDoc: "0103948572",
        clientAddress: "Av. Remigio Crespo, Cuenca",
        clientEmail: "mtorres@corp.ec",
        clientPhone: "+593 99 888 1234",
        roomType: "1 Cama King Size Frente al Mar",
      },
      {
        id: `${estab}-${pto}-000000005`,
        resId: "RES-CS-105",
        guest: "Ana Gómez",
        hotel: hotelName,
        hotelId,
        checkIn: "2026-08-18",
        checkOut: "2026-08-21",
        nights: 3,
        base: 255.0,
        iva: 38.25,
        total: 293.25,
        status: "pending",
        issueDate: "2026-08-18",
        payMethod: "Link de Pago PayPhone",
        deliveryStatus: "issued",
        clientDoc: "1308492018",
        clientAddress: "Barrio Murciélago, Manta",
        clientEmail: "anagomez.ec@gmail.com",
        clientPhone: "+593 97 111 2233",
        roomType: "1 Cama Queen Matrimonial con Balcón",
      },
      {
        id: `${estab}-${pto}-000000006`,
        resId: "RES-CS-106",
        guest: "Roberto Silva",
        hotel: hotelName,
        hotelId,
        checkIn: "2026-08-14",
        checkOut: "2026-08-15",
        nights: 1,
        base: 65.0,
        iva: 9.75,
        total: 74.75,
        status: "paid",
        issueDate: "2026-08-15",
        payMethod: "Kushki Tarjeta Débito",
        deliveryStatus: "issued",
        clientDoc: "1102938475",
        clientAddress: "Loja, Ecuador",
        clientEmail: "rsilva@loja.net",
        clientPhone: "+593 96 333 4444",
        roomType: "1 Cama Individual Vista Mar",
      },
      {
        id: `${estab}-${pto}-000000007`,
        resId: "RES-CS-107",
        guest: "Patricia Ruiz",
        hotel: hotelName,
        hotelId,
        checkIn: "2026-08-19",
        checkOut: "2026-08-22",
        nights: 3,
        base: 495.0,
        iva: 74.25,
        total: 569.25,
        status: "pending",
        issueDate: "2026-08-19",
        payMethod: "Transferencia Banco Pichincha",
        deliveryStatus: "issued",
        clientDoc: "1720394851",
        clientAddress: "Av. González Suárez, Quito",
        clientEmail: "pruiz@uio.ec",
        clientPhone: "+593 98 555 7777",
        roomType: "Suite Costa Sol Panorámica",
      },
      {
        id: `${estab}-${pto}-000000008`,
        resId: "RES-CS-088",
        guest: "Javier Morales",
        hotel: hotelName,
        hotelId,
        checkIn: "2026-07-10",
        checkOut: "2026-07-14",
        nights: 4,
        base: 340.0,
        iva: 51.0,
        total: 391.0,
        status: "overdue",
        issueDate: "2026-07-10",
        payMethod: "Transferencia Bancaria",
        deliveryStatus: "error",
        clientDoc: "0918273645",
        clientAddress: "Samborondón, Guayas",
        clientEmail: "jmorales@gye.com",
        clientPhone: "+593 99 777 8899",
        roomType: "1 Cama Queen Matrimonial con Balcón",
      },
    ];
  }

  // Generic generator for other hotels
  return [
    {
      id: `${estab}-${pto}-000000001`,
      resId: "RES-001",
      guest: "Carlos Méndez",
      hotel: hotelName,
      hotelId,
      checkIn: "2026-08-15",
      checkOut: "2026-08-18",
      nights: 3,
      base: 190.91,
      iva: 28.64,
      total: 219.55,
      status: "paid",
      issueDate: "2026-08-15",
      payMethod: "Tarjeta de Crédito",
      deliveryStatus: "issued",
      clientDoc: "1718293847",
      clientAddress: "Quito, Ecuador",
      clientEmail: "cmendez@gmail.com",
      clientPhone: "+593 98 421 8890",
      roomType: "1 Cama Matrimonial (Queen)",
    },
    {
      id: `${estab}-${pto}-000000002`,
      resId: "RES-002",
      guest: "Laura Fernández",
      hotel: hotelName,
      hotelId,
      checkIn: "2026-08-15",
      checkOut: "2026-08-16",
      nights: 1,
      base: 50.0,
      iva: 7.5,
      total: 57.5,
      status: "paid",
      issueDate: "2026-08-16",
      payMethod: "Efectivo",
      deliveryStatus: "issued",
      clientDoc: "0928374615",
      clientAddress: "Guayaquil, Ecuador",
      clientEmail: "lfernandez@hotmail.com",
      clientPhone: "+593 99 123 4567",
      roomType: "1 Cama Individual",
    },
    {
      id: `${estab}-${pto}-000000003`,
      resId: "RES-003",
      guest: "Familia Rodríguez",
      hotel: hotelName,
      hotelId,
      checkIn: "2026-08-16",
      checkOut: "2026-08-20",
      nights: 4,
      base: 400.0,
      iva: 60.0,
      total: 460.0,
      status: "pending",
      issueDate: "2026-08-16",
      payMethod: "Transferencia bancaria",
      deliveryStatus: "issued",
      clientDoc: "1792458921001",
      clientAddress: "Quito, Ecuador",
      clientEmail: "jrodriguez@empresa.ec",
      clientPhone: "+593 98 765 4321",
      roomType: "Suite Familiar",
    },
    {
      id: `${estab}-${pto}-000000004`,
      resId: "RES-004",
      guest: "Miguel Torres",
      hotel: hotelName,
      hotelId,
      checkIn: "2026-08-17",
      checkOut: "2026-08-19",
      nights: 2,
      base: 140.0,
      iva: 21.0,
      total: 161.0,
      status: "pending",
      issueDate: "2026-08-17",
      payMethod: "Tarjeta corporativa",
      deliveryStatus: "issued",
      clientDoc: "0103948572",
      clientAddress: "Cuenca, Ecuador",
      clientEmail: "mtorres@corp.ec",
      clientPhone: "+593 99 888 1234",
      roomType: "1 Cama King Superior",
    },
    {
      id: `${estab}-${pto}-000000005`,
      resId: "RES-005",
      guest: "Ana Gómez",
      hotel: hotelName,
      hotelId,
      checkIn: "2026-08-18",
      checkOut: "2026-08-21",
      nights: 3,
      base: 165.0,
      iva: 24.75,
      total: 189.75,
      status: "pending",
      issueDate: "2026-08-18",
      payMethod: "Booking.com",
      deliveryStatus: "returned",
      clientDoc: "1308492018",
      clientAddress: "Manta, Ecuador",
      clientEmail: "anagomez.ec@gmail.com",
      clientPhone: "+593 97 111 2233",
      roomType: "1 Cama Matrimonial (Queen)",
    },
    {
      id: `${estab}-${pto}-000000006`,
      resId: "RES-006",
      guest: "Roberto Silva",
      hotel: hotelName,
      hotelId,
      checkIn: "2026-08-14",
      checkOut: "2026-08-15",
      nights: 1,
      base: 70.0,
      iva: 10.5,
      total: 80.5,
      status: "paid",
      issueDate: "2026-08-15",
      payMethod: "Tarjeta",
      deliveryStatus: "issued",
      clientDoc: "1102938475",
      clientAddress: "Loja, Ecuador",
      clientEmail: "rsilva@loja.net",
      clientPhone: "+593 96 333 4444",
      roomType: "1 Cama Individual",
    },
    {
      id: `${estab}-${pto}-000000007`,
      resId: "RES-007",
      guest: "Patricia Ruiz",
      hotel: hotelName,
      hotelId,
      checkIn: "2026-08-19",
      checkOut: "2026-08-22",
      nights: 3,
      base: 330.0,
      iva: 49.5,
      total: 379.5,
      status: "pending",
      issueDate: "2026-08-19",
      payMethod: "Directo",
      deliveryStatus: "issued",
      clientDoc: "1720394851",
      clientAddress: "Quito, Ecuador",
      clientEmail: "pruiz@uio.ec",
      clientPhone: "+593 98 555 7777",
      roomType: "1 Cama King Suite",
    },
    {
      id: `${estab}-${pto}-000000088`,
      resId: "RES-088",
      guest: "Javier Morales",
      hotel: hotelName,
      hotelId,
      checkIn: "2026-07-10",
      checkOut: "2026-07-14",
      nights: 4,
      base: 280.0,
      iva: 42.0,
      total: 322.0,
      status: "overdue",
      issueDate: "2026-07-10",
      payMethod: "Transferencia",
      deliveryStatus: "error",
      clientDoc: "0918273645",
      clientAddress: "Guayaquil, Ecuador",
      clientEmail: "jmorales@gye.com",
      clientPhone: "+593 99 777 8899",
      roomType: "1 Cama Matrimonial Confort",
    },
  ];
}

export function getHotelInitialPayments(hotelId: string): HotelPayment[] {
  if (hotelId === "costa-sol") {
    return [
      { id: "PAY-CS-201", guest: "Carlos Méndez", amount: 219.55, method: "PayPhone Ecuador", date: "2026-08-15", status: "completed", concept: "3 noches 1 Cama Queen" },
      { id: "PAY-CS-202", guest: "Laura Fernández", amount: 74.75, method: "Efectivo", date: "2026-08-16", status: "completed", concept: "1 noche 1 Cama Individual" },
      { id: "PAY-CS-203", guest: "Familia Rodríguez", amount: 529.0, method: "Transferencia DeUna", date: "2026-08-16", status: "pending", concept: "Familiar: 1 Cama Queen + 2 Twin" },
      { id: "PAY-CS-204", guest: "Miguel Torres", amount: 195.5, method: "Kushki Tarjeta", date: "2026-08-17", status: "pending", concept: "1 Cama King Size Frente al Mar" },
      { id: "PAY-CS-205", guest: "Ana Gómez", amount: 293.25, method: "Booking.com Pay", date: "2026-08-18", status: "pending", concept: "3 noches 1 Cama Queen" },
      { id: "PAY-CS-206", guest: "Roberto Silva", amount: 74.75, method: "Datafast Tarjeta", date: "2026-08-15", status: "completed", concept: "1 noche 1 Cama Individual" },
      { id: "PAY-CS-207", guest: "Javier Morales", amount: 391.0, method: "Transferencia", date: "2026-07-10", status: "failed", concept: "Estancia Julio" },
    ];
  }

  return [
    { id: "PAY-1041", guest: "Carlos Méndez", amount: 210, method: "Tarjeta / PayPhone", date: "2026-08-15", status: "completed", concept: "Reserva Alojamiento" },
    { id: "PAY-1042", guest: "Laura Fernández", amount: 55, method: "Efectivo", date: "2026-08-16", status: "completed", concept: "Estancia 1 noche" },
    { id: "PAY-1043", guest: "Familia Rodríguez", amount: 440, method: "Transferencia", date: "2026-08-16", status: "pending", concept: "Suite Familiar" },
    { id: "PAY-1044", guest: "Miguel Torres", amount: 140, method: "Tarjeta empresa", date: "2026-08-17", status: "pending", concept: "1 Cama Queen" },
    { id: "PAY-1045", guest: "Ana Gómez", amount: 165, method: "Booking.com", date: "2026-08-18", status: "pending", concept: "Estancia fin de semana" },
    { id: "PAY-1046", guest: "Roberto Silva", amount: 70, method: "Tarjeta", date: "2026-08-15", status: "completed", concept: "Liquidación reserva" },
    { id: "PAY-1047", guest: "Javier Morales", amount: 280, method: "Transferencia", date: "2026-07-10", status: "failed", concept: "Pago de reserva" },
  ];
}

// ─── Conmutador Rápido de Emergencia IVA 15% / 8% por Decreto (RF-21) ─────────

export interface IvaDecretoConfig {
  enabledGlobal: boolean;
  hotelOverrides: Record<string, boolean>;
  decretoNombre: string;
  fechaInicio: string;
  fechaFin: string;
  updatedBy: string;
  updatedAt: string;
}

const DEFAULT_IVA_CONFIG: IvaDecretoConfig = {
  enabledGlobal: false,
  hotelOverrides: {},
  decretoNombre: "Decreto Ejecutivo N° 418 - Feriado Turístico Nacional",
  fechaInicio: "2026-10-30",
  fechaFin: "2026-11-04",
  updatedBy: "Sistema Cantonal Manta",
  updatedAt: "2026-10-28 08:30",
};

export function getIvaDecretoConfig(): IvaDecretoConfig {
  try {
    const raw = localStorage.getItem("alojamanta.iva_decreto_config");
    if (raw) return { ...DEFAULT_IVA_CONFIG, ...JSON.parse(raw) };
  } catch {}
  return DEFAULT_IVA_CONFIG;
}

export function setIvaDecretoConfig(next: Partial<IvaDecretoConfig>): IvaDecretoConfig {
  const current = getIvaDecretoConfig();
  const updated: IvaDecretoConfig = {
    ...current,
    ...next,
    updatedAt: new Date().toLocaleString("es-EC", { hour12: false }),
  };
  try {
    localStorage.setItem("alojamanta.iva_decreto_config", JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("alojamanta-iva-change", { detail: updated }));
  } catch {}
  return updated;
}

export function getActiveIvaRate(hotelId?: string): number {
  const cfg = getIvaDecretoConfig();
  if (hotelId && hotelId in cfg.hotelOverrides) {
    return cfg.hotelOverrides[hotelId] ? 0.08 : 0.15;
  }
  return cfg.enabledGlobal ? 0.08 : 0.15;
}

export function getActiveIvaPercent(hotelId?: string): 15 | 8 {
  return getActiveIvaRate(hotelId) === 0.08 ? 8 : 15;
}

// ─── Bitácora Inalterable de Auditoría LOPDP Ecuador (RF-30 / RNF-07) ─────────

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  hotelId: string;
  hotelName: string;
  module: "RESERVAS" | "VOUCHERS" | "TARIFAS_IVA" | "SERVICIO_10" | "PAGOS" | "USUARIOS_LOPDP";
  action: string;
  detail: string;
  ip: string;
}

const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: "AUD-2026-0905",
    timestamp: "2026-10-28 11:45:12",
    user: "Juan Recepción",
    role: "Operador de Reservas",
    hotelId: "hotel-voyager-manta",
    hotelName: "Hotel Voyager Manta",
    module: "VOUCHERS",
    action: "VALIDAR_VOUCHER",
    detail: "Voucher #RES-8941 (Miguel Torres) validado por código de confirmación",
    ip: "186.46.120.44",
  },
  {
    id: "AUD-2026-0904",
    timestamp: "2026-10-28 10:20:05",
    user: "Ana Administradora",
    role: "Admin Hotel",
    hotelId: "hotel-voyager-manta",
    hotelName: "Hotel Voyager Manta",
    module: "SERVICIO_10",
    action: "PARAMETRO_SERVICIO_10",
    detail: "Verificación de Tasa 10% Servicio Turístico (Art. 41 Ley de Turismo): ACTIVA",
    ip: "186.46.120.41",
  },
  {
    id: "AUD-2026-0903",
    timestamp: "2026-10-28 09:15:39",
    user: "María Revenue",
    role: "Revenue Manager",
    hotelId: "hotel-voyager-manta",
    hotelName: "Hotel Voyager Manta",
    module: "TARIFAS_IVA",
    action: "AJUSTE_CUPOS_WEB",
    detail: "Actualización de cupos web para Habitación Matrimonial Queen (4 cupos disponibles)",
    ip: "186.46.120.48",
  },
  {
    id: "AUD-2026-0902",
    timestamp: "2026-10-27 18:04:22",
    user: "Cliente Web (Consentimiento LOPDP)",
    role: "Huésped",
    hotelId: "mantahost-hotel",
    hotelName: "MantaHost Hotel",
    module: "USUARIOS_LOPDP",
    action: "CONSENTIMIENTO_LOPDP",
    detail: "Aceptación explícita de Política de Privacidad LOPDP en reserva #RES-4821",
    ip: "190.152.84.19",
  },
  {
    id: "AUD-2026-0901",
    timestamp: "2026-10-27 16:30:00",
    user: "Carlos Admin",
    role: "Superadmin Cantonal",
    hotelId: "GLOBAL-MANTA",
    hotelName: "Plataforma Cantonal Manta",
    module: "USUARIOS_LOPDP",
    action: "SINCRONIZACION_CATASTRO",
    detail: "Verificación de los 116 alojamientos del Catastro Turístico de Manta 2026",
    ip: "186.46.118.10",
  },
];

export function getAuditLogs(): AuditLogEntry[] {
  try {
    const raw = localStorage.getItem("alojamanta.audit_logs");
    if (raw) return JSON.parse(raw);
  } catch {}
  return INITIAL_AUDIT_LOGS;
}

export function addAuditLog(entry: Omit<AuditLogEntry, "id" | "timestamp" | "ip">): AuditLogEntry {
  const logs = getAuditLogs();
  const newEntry: AuditLogEntry = {
    ...entry,
    id: `AUD-2026-${String(logs.length + 901).padStart(4, "0")}`,
    timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
    ip: "186.46.120." + Math.floor(10 + Math.random() * 200),
  };
  const updated = [newEntry, ...logs].slice(0, 100);
  try {
    localStorage.setItem("alojamanta.audit_logs", JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("alojamanta-audit-change", { detail: updated }));
  } catch {}
  return newEntry;
}

// ─── Alerta Sonora para Nuevas Reservas Entrantes (RF-11) ─────────────────────

export function playNewBookingSound() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    [659.25, 830.61, 987.77].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);
      gain.gain.setValueAtTime(0.18, now + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.45);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 0.46);
    });
  } catch {}
}

