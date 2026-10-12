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

export interface HotelSriMeta {
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

export const HOTEL_SRI_INFO: Record<string, HotelSriMeta> = {
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
    email: "facturacion@hotelcostasol.ec",
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

// Asegurar que todos los 22 alojamientos de Manta tengan su ficha fiscal registrada
MANTA_HOTELS.forEach(h => {
  if (!HOTEL_SRI_INFO[h.id]) {
    HOTEL_SRI_INFO[h.id] = {
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
});

export const DEFAULT_HOTEL_RATES: Record<string, HotelRatesConfig> = {
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
      { type: "Individual Vista Mar", basePrice: 65, icon: "🛏" },
      { type: "Doble Estándar Balcón", basePrice: 85, icon: "🛏🛏" },
      { type: "Doble Superior Frente al Mar", basePrice: 115, icon: "⭐🛏🛏" },
      { type: "Suite Costa Sol Panorámica", basePrice: 165, icon: "👑🛏" },
      { type: "Villa Familiar con Piscina", basePrice: 230, icon: "🏖️👑" },
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
      { type: "Individual", basePrice: 55, icon: "🛏" },
      { type: "Doble Estándar", basePrice: 70, icon: "🛏🛏" },
      { type: "Doble Superior", basePrice: 85, icon: "⭐🛏🛏" },
      { type: "Triple", basePrice: 110, icon: "🛏🛏🛏" },
      { type: "Suite", basePrice: 150, icon: "👑🛏" },
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
      { type: "Habitación Cápsula Individual", basePrice: 32, icon: "🛏" },
      { type: "Doble Económica", basePrice: 48, icon: "🛏🛏" },
      { type: "Doble con Baño Privado", basePrice: 58, icon: "⭐🛏🛏" },
      { type: "Habitación Familiar 4 Camas", basePrice: 78, icon: "🛏🛏🛏" },
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
      { type: "Deluxe Mirador Vista al Río", basePrice: 140, icon: "⭐🛏🛏" },
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
      { type: "Habitación Alpina con Calefacción", basePrice: 75, icon: "🛏" },
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
      { type: "Individual Confort", basePrice: 48, icon: "🛏" },
      { type: "Doble Estándar", basePrice: 68, icon: "🛏🛏" },
      { type: "Doble Superior", basePrice: 88, icon: "⭐🛏🛏" },
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
      { type: "Habitación Básica Playa", basePrice: 25, icon: "🛏" },
      { type: "Doble Económica", basePrice: 38, icon: "🛏🛏" },
      { type: "Triple Frente al Mar", basePrice: 55, icon: "🛏🛏🛏" },
      { type: "Familiar 5 Personas", basePrice: 85, icon: "🏖️🛏" },
    ],
    channels: [
      { name: "Directo (Recepción/WhatsApp)", commission: 0, color: "#6ee7b7" },
      { name: "Booking.com", commission: 16, color: "#93c5fd" },
      { name: "Expedia", commission: 18, color: "#d8b4fe" },
      { name: "Airbnb", commission: 14, color: "#fcd34d" },
    ],
  },
};

// ─── SRI Clave de Acceso Generator ────────────────────────────────────────────
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

// ─── Format helper for Ecuador SRI Invoices ───────────────────────────────────
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
  const sri = HOTEL_SRI_INFO[hotelId] || HOTEL_SRI_INFO["costa-sol"];
  const estab = sri.estab;
  const pto = sri.ptoEmi;

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
        roomType: "Doble Estándar Balcón",
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
        roomType: "Individual Vista Mar",
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
        roomType: "Villa Familiar con Piscina",
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
        roomType: "Doble Superior Frente al Mar",
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
        roomType: "Doble Estándar Balcón",
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
        roomType: "Individual Vista Mar",
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
        roomType: "Doble Estándar Balcón",
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
      roomType: "Doble Estándar",
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
      roomType: "Individual",
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
      roomType: "Doble Superior",
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
      roomType: "Doble Estándar",
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
      roomType: "Individual",
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
      roomType: "Suite",
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
      roomType: "Doble Confort",
    },
  ];
}

export function getHotelInitialPayments(hotelId: string): HotelPayment[] {
  if (hotelId === "costa-sol") {
    return [
      { id: "PAY-CS-201", guest: "Carlos Méndez", amount: 219.55, method: "PayPhone Ecuador", date: "2026-08-15", status: "completed", concept: "3 noches Doble Estándar" },
      { id: "PAY-CS-202", guest: "Laura Fernández", amount: 74.75, method: "Efectivo", date: "2026-08-16", status: "completed", concept: "1 noche Individual Vista Mar" },
      { id: "PAY-CS-203", guest: "Familia Rodríguez", amount: 529.0, method: "Transferencia DeUna", date: "2026-08-16", status: "pending", concept: "Villa Familiar con Piscina" },
      { id: "PAY-CS-204", guest: "Miguel Torres", amount: 195.5, method: "Kushki Tarjeta", date: "2026-08-17", status: "pending", concept: "Doble Superior Frente al Mar" },
      { id: "PAY-CS-205", guest: "Ana Gómez", amount: 293.25, method: "Booking.com Pay", date: "2026-08-18", status: "pending", concept: "3 noches Doble Balcón" },
      { id: "PAY-CS-206", guest: "Roberto Silva", amount: 74.75, method: "Datafast Tarjeta", date: "2026-08-15", status: "completed", concept: "1 noche Individual" },
      { id: "PAY-CS-207", guest: "Javier Morales", amount: 391.0, method: "Transferencia", date: "2026-07-10", status: "failed", concept: "Estancia Julio" },
    ];
  }

  return [
    { id: "PAY-1041", guest: "Carlos Méndez", amount: 210, method: "Tarjeta / PayPhone", date: "2026-08-15", status: "completed", concept: "Reserva Alojamiento" },
    { id: "PAY-1042", guest: "Laura Fernández", amount: 55, method: "Efectivo", date: "2026-08-16", status: "completed", concept: "Estancia 1 noche" },
    { id: "PAY-1043", guest: "Familia Rodríguez", amount: 440, method: "Transferencia", date: "2026-08-16", status: "pending", concept: "Suite Familiar" },
    { id: "PAY-1044", guest: "Miguel Torres", amount: 140, method: "Tarjeta empresa", date: "2026-08-17", status: "pending", concept: "Habitación Doble" },
    { id: "PAY-1045", guest: "Ana Gómez", amount: 165, method: "Booking.com", date: "2026-08-18", status: "pending", concept: "Estancia fin de semana" },
    { id: "PAY-1046", guest: "Roberto Silva", amount: 70, method: "Tarjeta", date: "2026-08-15", status: "completed", concept: "Check-in recepción" },
    { id: "PAY-1047", guest: "Javier Morales", amount: 280, method: "Transferencia", date: "2026-07-10", status: "failed", concept: "Pago de reserva" },
  ];
}

