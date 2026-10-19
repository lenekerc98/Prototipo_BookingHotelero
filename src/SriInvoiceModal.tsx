import React, { useState } from "react";
import { HOTEL_SRI_INFO, fmtUsd } from "./hotelData";

export interface InvoiceData {
  id: string;
  resId: string;
  guest: string;
  hotel: string;
  hotelId?: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  base: number;
  iva: number;
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
  hotelInvoiceNumber?: string; // Nº de Factura fiscal emitida directamente por el hotel
}

interface SriInvoiceModalProps {
  invoice: InvoiceData;
  hotelId: string;
  onClose: () => void;
  onMarkPaid?: () => void;
  onReissue?: () => void;
  onRegisterHotelInvoice?: (hotelInvoiceNumber: string) => void;
}

// Generate visual Code 128 style barcode lines SVG
function BarcodeSvg({ code }: { code: string }) {
  const bars: { width: number; isBlack: boolean }[] = [];
  for (let i = 0; i < code.length; i++) {
    const digit = parseInt(code[i], 10) || 1;
    bars.push({ width: (digit % 3) + 1, isBlack: i % 2 === 0 });
    bars.push({ width: ((digit * 2) % 3) + 1, isBlack: false });
  }

  let currentX = 5;
  const rects = bars.map((b, idx) => {
    const x = currentX;
    currentX += b.width + 1.2;
    if (!b.isBlack) return null;
    return <rect key={idx} x={x} y={0} width={b.width * 1.3} height={32} fill="currentColor" />;
  });

  return (
    <div className="w-full flex flex-col items-center my-1">
      <svg width="100%" height="32" viewBox={`0 0 ${Math.max(currentX + 10, 320)} 32`} preserveAspectRatio="none" className="max-w-xs">
        {rects}
      </svg>
      <span className="mono text-[9px] tracking-widest text-center select-all text-slate-500">{code}</span>
    </div>
  );
}

export default function SriInvoiceModal({
  invoice,
  hotelId,
  onClose,
  onMarkPaid,
  onRegisterHotelInvoice,
}: SriInvoiceModalProps) {
  const [viewTab, setViewTab] = useState<"voucher" | "reception">("voucher");
  const [copiedData, setCopiedData] = useState(false);
  const [hotelInvoiceInput, setHotelInvoiceInput] = useState(invoice.hotelInvoiceNumber || "");
  const [savedHotelInvoice, setSavedHotelInvoice] = useState(invoice.hotelInvoiceNumber || "");
  const [isEditingInvoiceNum, setIsEditingInvoiceNum] = useState(!invoice.hotelInvoiceNumber);

  const sri = HOTEL_SRI_INFO[hotelId] || HOTEL_SRI_INFO["costa-sol"];
  
  // Extract or generate sequential number
  const seqDigits = invoice.id.replace(/\D/g, "") || "1041";
  const voucherCode = `REC-2026-${seqDigits.padStart(6, "0")}`;
  const authCode = `AUTH-PP-${(parseInt(seqDigits, 10) * 83 + 120491).toString().slice(-6)}`;

  // Ecuadorian tax breakdown (Reference for hotel fiscal invoice)
  const hasService10 = sri.gravaServicio10 ?? true;
  const subtotal15 = Number(invoice.base.toFixed(2));
  const iva15 = Number((subtotal15 * 0.15).toFixed(2));
  const servicio10 = hasService10 ? Number((subtotal15 * 0.10).toFixed(2)) : 0.00;
  const unitPrice = Number((subtotal15 / (invoice.nights || 1)).toFixed(2));

  // Client info
  const clientDoc = invoice.clientDoc || (invoice.guest.includes("Carlos") ? "1718293847" : invoice.guest.includes("Laura") ? "0928374615" : "1792458921001");
  const clientAddress = invoice.clientAddress || "Av. Flavio Reyes y Calle 20, Manta - Manabí";
  const clientEmail = invoice.clientEmail || (invoice.guest.toLowerCase().replace(/\s+/g, "") + "@gmail.com");
  const clientPhone = invoice.clientPhone || "+593 98 421 8890";
  const roomDescription = invoice.roomType || "Habitación Matrimonial Queen";

  function handleSaveHotelInvoice(e: React.FormEvent) {
    e.preventDefault();
    if (!hotelInvoiceInput.trim()) return;
    setSavedHotelInvoice(hotelInvoiceInput.trim());
    setIsEditingInvoiceNum(false);
    onRegisterHotelInvoice?.(hotelInvoiceInput.trim());
  }

  function handleCopyGuestBillingData() {
    const text = `DATOS DE FACTURACIÓN FISCAL - HUÉSPED
Huésped / Razón Social: ${invoice.guest}
C.I. / RUC: ${clientDoc}
Email: ${clientEmail}
Teléfono: ${clientPhone}
Dirección: ${clientAddress}
Reserva: ${invoice.resId} (${roomDescription}, ${invoice.nights} noches)
Subtotal Hospedaje: $${subtotal15.toFixed(2)}
IVA 15%: $${iva15.toFixed(2)}
10% Servicio Turístico: $${servicio10.toFixed(2)}
Total Pagado en Pasarela: $${invoice.total.toFixed(2)} USD
Comprobante Pago: ${voucherCode} (Aut: ${authCode})`;

    navigator.clipboard?.writeText(text);
    setCopiedData(true);
    setTimeout(() => setCopiedData(false), 2500);
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
      style={{ background: "rgba(3, 7, 18, 0.85)", backdropFilter: "blur(6px)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden my-4 border flex flex-col max-h-[92vh]"
        style={{
          background: "#ffffff",
          borderColor: "#cbd5e1",
          color: "#0f172a",
        }}
      >
        {/* Top bar controls */}
        <div
          className="flex flex-wrap items-center justify-between px-4 sm:px-6 py-3 border-b gap-2 text-xs"
          style={{
            background: "#0c1220",
            borderColor: "#1e2d47",
            color: "#e8edf5",
          }}
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-sm tracking-wide text-amber-400">Comprobante de Pago Digital</span>
            <span className="text-slate-400">·</span>
            <span className="font-mono text-slate-300">Pasarela PayPhone / DeUna</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-950 text-emerald-300 border border-emerald-800">
              ✓ Cobro Aprobado
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* View tab toggle */}
            <div className="flex rounded-lg border border-slate-700 bg-slate-900 p-0.5 text-[11px]">
              <button
                onClick={() => setViewTab("voucher")}
                className={`px-3 py-1 rounded transition-colors font-medium cursor-pointer ${
                  viewTab === "voucher" ? "bg-amber-500 text-slate-950 font-bold" : "text-slate-300 hover:text-white"
                }`}
              >
                🧾 Voucher de Pago (Huésped)
              </button>
              <button
                onClick={() => setViewTab("reception")}
                className={`px-3 py-1 rounded transition-colors font-medium cursor-pointer ${
                  viewTab === "reception" ? "bg-amber-500 text-slate-950 font-bold" : "text-slate-300 hover:text-white"
                }`}
              >
                🏨 Ficha para Facturación en Hotel
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-7 h-7 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-base cursor-pointer"
              title="Cerrar modal"
            >
              ×
            </button>
          </div>
        </div>

        {/* Notice: El hotel es el que factura */}
        <div className="px-5 py-2.5 bg-amber-50 border-b border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-amber-950">
          <div className="flex items-center gap-2">
            <span className="text-base">🏛️</span>
            <div>
              <p className="font-bold text-[11px] leading-tight">
                Emisión de Factura Fiscal (SRI): A cargo directo del Hotel {sri.nombreComercial} (RUC: {sri.ruc})
              </p>
              <p className="text-[10px] text-amber-800 mt-0.5">
                La plataforma procesa y certifica el pago online. El hotel entrega la Factura Electrónica fiscal al huésped en recepción.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {savedHotelInvoice ? (
              <span className="mono text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                <span>✓</span> Factura Hotel: #{savedHotelInvoice}
              </span>
            ) : (
              <span className="mono text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200/80 text-amber-900 border border-amber-400">
                Factura Hotel: Pendiente en Recepción
              </span>
            )}
          </div>
        </div>

        {/* Modal scrollable body */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-5 bg-slate-50/60">
          
          {/* TAB 1: VOUCHER DE PAGO DIGITAL */}
          {viewTab === "voucher" && (
            <div className="max-w-2xl mx-auto rounded-2xl border bg-white shadow-md overflow-hidden" style={{ borderColor: "#e2e8f0" }}>
              {/* Voucher header */}
              <div className="p-6 text-center border-b relative" style={{ background: "linear-gradient(135deg, #0c1220 0%, #1e3a5f 100%)", color: "#ffffff" }}>
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center text-xl mx-auto mb-2">
                  ✓
                </div>
                <p className="mono text-[10px] uppercase tracking-widest text-amber-400 font-bold">Comprobante Oficial de Pago Digital</p>
                <h2 className="text-2xl font-bold mt-1 text-white" style={{ fontFamily: "DM Serif Display, serif" }}>{sri.nombreComercial}</h2>
                <p className="text-xs text-slate-300">{sri.razonSocial} · RUC: {sri.ruc}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">📍 {sri.dirMatriz} · Manta, Ecuador</p>

                <div className="inline-flex items-center gap-2 mt-3 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs text-slate-200">
                  <span>Autorización Pasarela:</span>
                  <span className="font-mono font-bold text-amber-300">{authCode}</span>
                </div>
              </div>

              {/* Voucher body */}
              <div className="p-6 space-y-4 text-xs">
                {/* Identification block */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Nº Comprobante</span>
                    <p className="font-mono font-bold text-slate-800 text-sm">{voucherCode}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Código Reserva</span>
                    <p className="font-mono font-bold text-amber-600 text-sm">{invoice.resId}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Fecha de Pago</span>
                    <p className="font-medium text-slate-700">{invoice.issueDate || "2026-08-15"}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Método de Pago</span>
                    <p className="font-medium text-slate-700 flex items-center gap-1">
                      <span>💳</span>
                      <span>{invoice.payMethod}</span>
                    </p>
                  </div>
                </div>

                {/* Guest and Stay Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                    <p className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <span>👤</span> Datos del Huésped
                    </p>
                    <div className="space-y-1 text-slate-600">
                      <p><strong className="text-slate-800">Nombre:</strong> {invoice.guest}</p>
                      <p><strong className="text-slate-800">C.I. / Pasaporte / RUC:</strong> <span className="font-mono">{clientDoc}</span></p>
                      <p><strong className="text-slate-800">Email:</strong> {clientEmail}</p>
                      <p><strong className="text-slate-800">Teléfono:</strong> {clientPhone}</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                    <p className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <span>🛏️</span> Detalle de la Estancia
                    </p>
                    <div className="space-y-1 text-slate-600">
                      <p><strong className="text-slate-800">Tipo de Habitación:</strong> {roomDescription}</p>
                      <p><strong className="text-slate-800">Check-in:</strong> <span className="font-mono">{invoice.checkIn} (14:00h)</span></p>
                      <p><strong className="text-slate-800">Check-out:</strong> <span className="font-mono">{invoice.checkOut} (12:00h)</span></p>
                      <p><strong className="text-slate-800">Duración:</strong> {invoice.nights} noche{invoice.nights > 1 ? "s" : ""}</p>
                    </div>
                  </div>
                </div>

                {/* Price Table Breakdown */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-500">
                      <tr>
                        <th className="px-3.5 py-2">Concepto</th>
                        <th className="px-3.5 py-2 text-center">Noches</th>
                        <th className="px-3.5 py-2 text-right">Precio/noche</th>
                        <th className="px-3.5 py-2 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="px-3.5 py-2.5 font-medium text-slate-800">
                          Servicio de Hospedaje ({roomDescription})
                        </td>
                        <td className="px-3.5 py-2.5 text-center font-mono">{invoice.nights}</td>
                        <td className="px-3.5 py-2.5 text-right font-mono">{fmtUsd(unitPrice)}</td>
                        <td className="px-3.5 py-2.5 text-right font-mono font-semibold">{fmtUsd(subtotal15)}</td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex flex-col items-end gap-1 font-mono text-xs">
                    <div className="flex justify-between w-64 text-slate-600">
                      <span>Subtotal Hospedaje:</span>
                      <span>{fmtUsd(subtotal15)}</span>
                    </div>
                    <div className="flex justify-between w-64 text-slate-600">
                      <span>IVA 15% (Base para factura hotel):</span>
                      <span>{fmtUsd(iva15)}</span>
                    </div>
                    {hasService10 && (
                      <div className="flex justify-between w-64 text-slate-600">
                        <span>10% Servicio Turístico (Ley Turismo):</span>
                        <span>{fmtUsd(servicio10)}</span>
                      </div>
                    )}
                    <div className="flex justify-between w-64 text-slate-600">
                      <span>Tasa GAD Manta / Transacción:</span>
                      <span>$2.50</span>
                    </div>
                    <div className="flex justify-between w-64 pt-2 mt-1 border-t border-slate-300 font-bold text-slate-900 text-sm">
                      <span>TOTAL PAGADO (USD):</span>
                      <span className="text-amber-600">{fmtUsd(invoice.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Fiscal Note Box */}
                <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 leading-relaxed text-[11px]">
                  <p className="font-bold flex items-center gap-1.5 mb-1 text-xs">
                    <span>📌</span> Facturación Fiscal Electrónica (SRI)
                  </p>
                  <p>
                    Este comprobante certifica la recepción de su pago mediante pasarela digital. <strong>La Factura Electrónica fiscal autorizada por el SRI será emitida y entregada directamente por {sri.nombreComercial}</strong> al momento de su atención presencial en recepción (check-in / check-out).
                  </p>
                </div>

                {/* QR Code and Barcode */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 p-1 rounded-lg border border-slate-300 bg-white flex items-center justify-center">
                      <div className="grid grid-cols-6 gap-0.5 w-12 h-12">
                        {Array.from({ length: 36 }).map((_, i) => (
                          <div key={i} className="rounded-xs" style={{ background: (i % 2 === 0 || i % 5 === 0) ? "#0c1220" : "transparent" }} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-[11px]">Código QR de Validación</p>
                      <p className="text-[10px] text-slate-400">Presenta este código en la recepción del hotel.</p>
                      <p className="font-mono text-[10px] text-emerald-700 font-semibold mt-0.5">ESTADO: PAGADO EN LÍNEA</p>
                    </div>
                  </div>
                  <div className="w-full sm:w-auto">
                    <BarcodeSvg code={`VOUCHER${seqDigits}MANTA`} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FICHA PARA FACTURACIÓN EN RECEPCIÓN (EL HOTEL ES EL QUE FACTURA) */}
          {viewTab === "reception" && (
            <div className="max-w-2xl mx-auto space-y-4">
              {/* Hotel Action Box: Register Invoice Number */}
              <div className="p-4 rounded-xl border bg-white shadow-sm" style={{ borderColor: "#cbd5e1" }}>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <span>🧾</span> Registro de Factura Emitida por el Hotel
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Como la facturación fiscal corresponde al hotel, ingrese aquí el número de factura que recepción emitió en el SRI para este huésped.
                    </p>
                  </div>
                  {savedHotelInvoice && (
                    <span className="mono text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                      ✓ Facturado
                    </span>
                  )}
                </div>

                {isEditingInvoiceNum ? (
                  <form onSubmit={handleSaveHotelInvoice} className="flex gap-2 items-center flex-wrap sm:flex-nowrap">
                    <input
                      type="text"
                      required
                      placeholder="Ej: 001-002-000045812"
                      value={hotelInvoiceInput}
                      onChange={(e) => setHotelInvoiceInput(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border text-xs font-mono outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50 border-slate-300"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-sm cursor-pointer whitespace-nowrap"
                    >
                      Guardar Nº Factura Hotel
                    </button>
                    {savedHotelInvoice && (
                      <button
                        type="button"
                        onClick={() => setIsEditingInvoiceNum(false)}
                        className="px-3 py-2 rounded-lg text-xs text-slate-500 hover:text-slate-800"
                      >
                        Cancelar
                      </button>
                    )}
                  </form>
                ) : (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                    <div>
                      <p className="text-xs font-bold text-emerald-900">
                        Factura Fiscal del Hotel Registrada:
                      </p>
                      <p className="font-mono text-sm font-bold text-emerald-700">
                        #{savedHotelInvoice}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsEditingInvoiceNum(true)}
                      className="text-xs text-emerald-800 underline font-medium hover:text-emerald-950 cursor-pointer"
                    >
                      Editar número
                    </button>
                  </div>
                )}
              </div>

              {/* Data card ready to copy to hotel's SRI software */}
              <div className="p-4 rounded-xl border bg-white shadow-sm space-y-3" style={{ borderColor: "#cbd5e1" }}>
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                    Datos del Cliente para Emitir Factura en el Sistema del Hotel
                  </h4>
                  <button
                    onClick={handleCopyGuestBillingData}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{copiedData ? "✓ Copiado" : "📋"}</span>
                    <span>{copiedData ? "¡Datos copiados al portapapeles!" : "Copiar Ficha Fiscal"}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Razón Social / Huésped</span>
                    <p className="font-bold text-slate-800 text-sm select-all">{invoice.guest}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Cédula / RUC / Pasaporte</span>
                    <p className="font-mono font-bold text-slate-800 text-sm select-all">{clientDoc}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Correo Electrónico (Facturación)</span>
                    <p className="font-medium text-slate-700 select-all">{clientEmail}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Teléfono de Contacto</span>
                    <p className="font-medium text-slate-700 select-all">{clientPhone}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 sm:col-span-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Dirección del Cliente</span>
                    <p className="font-medium text-slate-700 select-all">{clientAddress}</p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-100 border border-slate-200 text-xs">
                  <p className="font-bold text-slate-800 mb-1">Desglose Referencial para el Software Contable:</p>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded bg-white">
                      <p className="text-[10px] text-slate-400">Subtotal 15%</p>
                      <p className="font-mono font-bold text-slate-800">{fmtUsd(subtotal15)}</p>
                    </div>
                    <div className="p-2 rounded bg-white">
                      <p className="text-[10px] text-slate-400">IVA 15%</p>
                      <p className="font-mono font-bold text-slate-800">{fmtUsd(iva15)}</p>
                    </div>
                    <div className="p-2 rounded bg-white">
                      <p className="text-[10px] text-slate-400">10% Servicio Turístico</p>
                      <p className="font-mono font-bold text-slate-800">{fmtUsd(servicio10)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal footer */}
        <div className="px-6 py-3.5 border-t flex flex-wrap items-center justify-between gap-3 bg-white" style={{ borderColor: "#cbd5e1" }}>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>🛡️ Transacción procesada por pasarela segura</span>
            <span>·</span>
            <span className="mono">{authCode}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 hover:bg-slate-100 text-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>🖨️</span> Imprimir Comprobante
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-colors cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
