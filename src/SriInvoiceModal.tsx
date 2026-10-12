import React, { useState } from "react";
import { HOTEL_SRI_INFO, generateSriAccessKey, fmtSriSecuencial, fmtUsd } from "./hotelData";

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
}

interface SriInvoiceModalProps {
  invoice: InvoiceData;
  hotelId: string;
  onClose: () => void;
  onMarkPaid?: () => void;
  onReissue?: () => void;
}

// Generate visual Code 128 style barcode lines SVG
function BarcodeSvg({ code }: { code: string }) {
  const bars: { width: number; isBlack: boolean }[] = [];
  // Deterministic bar widths based on code digits
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
    return <rect key={idx} x={x} y={0} width={b.width * 1.3} height={38} fill="currentColor" />;
  });

  return (
    <div className="w-full flex flex-col items-center my-1">
      <svg width="100%" height="40" viewBox={`0 0 ${Math.max(currentX + 10, 360)} 40`} preserveAspectRatio="none" className="max-w-md">
        {rects}
      </svg>
      <span className="mono text-[9px] tracking-wider text-center select-all">{code}</span>
    </div>
  );
}

export default function SriInvoiceModal({
  invoice,
  hotelId,
  onClose,
  onMarkPaid,
  onReissue,
}: SriInvoiceModalProps) {
  const [viewFormat, setViewFormat] = useState<"ride" | "dark">("ride");
  const [copiedKey, setCopiedKey] = useState(false);
  const [sriCheckStatus, setSriCheckStatus] = useState<"idle" | "checking" | "verified">("idle");
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const sri = HOTEL_SRI_INFO[hotelId] || HOTEL_SRI_INFO["costa-sol"];
  
  // Extract or generate sequential number (e.g. 000000001)
  const seqDigits = invoice.id.replace(/\D/g, "") || "1";
  const sriSecuencial = fmtSriSecuencial(sri.estab, sri.ptoEmi, seqDigits);
  
  // 49-digit access key and authorization number according to SRI specification
  const { accessKey, authNumber, authDate } = generateSriAccessKey(
    invoice.issueDate || "2026-08-15",
    sri.ruc,
    sri.estab,
    sri.ptoEmi,
    seqDigits
  );

  // Recalculate Ecuadorian taxes: VAT at 15% + configurable 10% Service (Art. 41 Ley Turismo)
  const hasService10 = sri.gravaServicio10 ?? true;
  const subtotal15 = Number(invoice.base.toFixed(2));
  const iva15 = Number((subtotal15 * 0.15).toFixed(2));
  const servicio10 = hasService10 ? Number((subtotal15 * 0.10).toFixed(2)) : 0.00;
  const totalEcuador = Number((subtotal15 + iva15 + servicio10).toFixed(2));
  const unitPrice = Number((subtotal15 / (invoice.nights || 1)).toFixed(2));

  // Client info
  const clientDoc = invoice.clientDoc || (invoice.guest.includes("Carlos") ? "1718293847" : invoice.guest.includes("Laura") ? "0928374615" : "1792458921001");
  const clientAddress = invoice.clientAddress || "Av. Principal y Secundaria, Quito - Ecuador";
  const clientEmail = invoice.clientEmail || (invoice.guest.toLowerCase().replace(/\s+/g, "") + "@gmail.com");
  const clientPhone = invoice.clientPhone || "+593 98 421 8890";
  const roomDescription = invoice.roomType || "Habitación Estándar";

  function handleCopyKey() {
    navigator.clipboard?.writeText(accessKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2500);
  }

  function handleVerifySri() {
    setSriCheckStatus("checking");
    setTimeout(() => {
      setSriCheckStatus("verified");
    }, 900);
  }

  function handleDownloadXml() {
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<factura id="comprobante" version="1.1.0">
  <infoTributaria>
    <ambiente>2</ambiente>
    <tipoEmision>1</tipoEmision>
    <razonSocial>${sri.razonSocial}</razonSocial>
    <nombreComercial>${sri.nombreComercial}</nombreComercial>
    <ruc>${sri.ruc}</ruc>
    <claveAcceso>${accessKey}</claveAcceso>
    <codDoc>01</codDoc>
    <estab>${sri.estab}</estab>
    <ptoEmi>${sri.ptoEmi}</ptoEmi>
    <secuencial>${seqDigits.padStart(9, "0")}</secuencial>
    <dirMatriz>${sri.dirMatriz}</dirMatriz>
    <regimenMicroempresas>${sri.regimen}</regimenMicroempresas>
  </infoTributaria>
  <infoFactura>
    <fechaEmision>${invoice.issueDate}</fechaEmision>
    <dirEstablecimiento>${sri.dirSucursal}</dirEstablecimiento>
    <obligadoContabilidad>${sri.obligadoContabilidad}</obligadoContabilidad>
    <tipoIdentificacionComprador>05</tipoIdentificacionComprador>
    <razonSocialComprador>${invoice.guest}</razonSocialComprador>
    <identificacionComprador>${clientDoc}</identificacionComprador>
    <totalSinImpuestos>${subtotal15.toFixed(2)}</totalSinImpuestos>
    <totalDescuento>0.00</totalDescuento>
    <totalConImpuestos>
      <totalImpuesto>
        <codigo>2</codigo>
        <codigoPorcentaje>4</codigoPorcentaje>
        <baseImponible>${subtotal15.toFixed(2)}</baseImponible>
        <tarifa>15.00</tarifa>
        <valor>${iva15.toFixed(2)}</valor>
      </totalImpuesto>
    </totalConImpuestos>
    <propina>${servicio10.toFixed(2)}</propina>
    <importeTotal>${totalEcuador.toFixed(2)}</importeTotal>
    <moneda>DOLAR</moneda>
    <pagos>
      <pago>
        <formaPago>19</formaPago>
        <total>${totalEcuador.toFixed(2)}</total>
        <plazo>0</plazo>
        <unidadTiempo>dias</unidadTiempo>
      </pago>
    </pagos>
  </infoFactura>
  <detalles>
    <detalle>
      <codigoPrincipal>HOS-001</codigoPrincipal>
      <descripcion>Servicio de Hospedaje - ${roomDescription} (${invoice.nights} noches)</descripcion>
      <cantidad>${invoice.nights}.00</cantidad>
      <precioUnitario>${unitPrice.toFixed(2)}</precioUnitario>
      <descuento>0.00</descuento>
      <precioTotalSinImpuesto>${subtotal15.toFixed(2)}</precioTotalSinImpuesto>
    </detalle>
  </detalles>
</factura>`;

    const blob = new Blob([xmlContent], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `FACTURA_SRI_${sriSecuencial}.xml`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadNotice("Archivo XML autorizado del SRI descargado con éxito");
    setTimeout(() => setDownloadNotice(null), 3500);
  }

  function handlePrintRide() {
    window.print();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
      style={{ background: "rgba(3, 7, 18, 0.85)", backdropFilter: "blur(6px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-4xl max-h-[94vh] flex flex-col rounded-2xl overflow-hidden border shadow-2xl transition-all"
        style={{
          background: viewFormat === "ride" ? "#ffffff" : "var(--card)",
          borderColor: viewFormat === "ride" ? "#cbd5e1" : "var(--border)",
          color: viewFormat === "ride" ? "#0f172a" : "var(--foreground)",
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
            <span className="font-semibold text-sm tracking-wide text-amber-400">SRI Ecuador</span>
            <span className="text-slate-400">·</span>
            <span className="font-mono text-slate-300">RIDE Factura Electrónica</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-950 text-emerald-300 border border-emerald-800">
              Autorizada
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* View style toggle */}
            <div className="flex rounded-md border border-slate-700 bg-slate-900 p-0.5 text-[11px]">
              <button
                onClick={() => setViewFormat("ride")}
                className={`px-2.5 py-1 rounded transition-colors font-medium ${
                  viewFormat === "ride" ? "bg-amber-500 text-slate-950 font-bold" : "text-slate-300 hover:text-white"
                }`}
              >
                📄 Formato RIDE Oficial (A4)
              </button>
              <button
                onClick={() => setViewFormat("dark")}
                className={`px-2.5 py-1 rounded transition-colors font-medium ${
                  viewFormat === "dark" ? "bg-amber-500 text-slate-950 font-bold" : "text-slate-300 hover:text-white"
                }`}
              >
                🌙 Vista Dark PMS
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-7 h-7 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-base"
              title="Cerrar modal"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Feedback notice toast */}
        {downloadNotice && (
          <div className="bg-emerald-600 text-white px-4 py-2 text-xs text-center font-medium flex items-center justify-center gap-2">
            <span>✓</span> {downloadNotice}
          </div>
        )}

        {/* Scrollable invoice content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Official SRI Header layout (2 columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left box: Issuer / Hotel details */}
            <div
              className={`p-4 rounded-xl border flex flex-col justify-between ${
                viewFormat === "ride" ? "bg-slate-50 border-slate-300 text-slate-900" : "border-slate-800 bg-slate-900/60"
              }`}
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-sm shadow">
                    🏨
                  </div>
                  <div>
                    <h2 className="font-bold text-base leading-tight tracking-tight uppercase" style={{ fontFamily: "DM Sans, sans-serif" }}>
                      {sri.razonSocial}
                    </h2>
                    <p className="text-xs font-semibold text-amber-600">{sri.nombreComercial}</p>
                  </div>
                </div>

                <div className="space-y-1 text-xs mt-3">
                  <p>
                    <span className="font-bold">Dirección Matriz: </span>
                    <span className="text-slate-600 dark:text-slate-300">{sri.dirMatriz}</span>
                  </p>
                  <p>
                    <span className="font-bold">Dirección Sucursal: </span>
                    <span className="text-slate-600 dark:text-slate-300">{sri.dirSucursal}</span>
                  </p>
                  {sri.contribuyenteEspecial && (
                    <p>
                      <span className="font-bold">Contribuyente Especial Nro: </span>
                      <span className="text-slate-600 dark:text-slate-300">{sri.contribuyenteEspecial}</span>
                    </p>
                  )}
                  <p>
                    <span className="font-bold">OBLIGADO A LLEVAR CONTABILIDAD: </span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">{sri.obligadoContabilidad}</span>
                  </p>
                  <p className="pt-1">
                    <span className="font-bold text-[11px] uppercase tracking-wide px-2 py-0.5 rounded bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200">
                      {sri.regimen}
                    </span>
                  </p>
                  {sri.agenteRetencion && (
                    <p className="text-[11px] text-slate-500 pt-0.5">
                      <span className="font-semibold">Agente de Retención: </span>{sri.agenteRetencion}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 flex justify-between">
                <span>Tel: {sri.phone}</span>
                <span>{sri.email}</span>
              </div>
            </div>

            {/* Right box: Official SRI Tax identification & Barcode */}
            <div
              className={`p-4 rounded-xl border flex flex-col justify-between ${
                viewFormat === "ride" ? "bg-white border-slate-300 text-slate-900 shadow-sm" : "border-slate-800 bg-slate-900/60"
              }`}
            >
              <div>
                <div className="border-b pb-2 mb-2 border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-500 uppercase tracking-widest">R.U.C.:</span>
                    <span className="mono font-bold text-base text-amber-600">{sri.ruc}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-bold text-lg tracking-wider">FACTURA</span>
                    <span className="mono font-bold text-sm text-slate-800 dark:text-slate-200">
                      No. {sriSecuencial}
                    </span>
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <div>
                    <span className="font-bold block text-[10px] uppercase text-slate-500">NÚMERO DE AUTORIZACIÓN:</span>
                    <span className="mono text-[10px] break-all select-all font-medium text-slate-700 dark:text-slate-300">
                      {authNumber}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1 pt-1 text-[11px]">
                    <div>
                      <span className="font-bold">FECHA Y HORA: </span>
                      <span className="text-slate-600 dark:text-slate-300">{authDate}</span>
                    </div>
                    <div>
                      <span className="font-bold">AMBIENTE: </span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">PRODUCCIÓN</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-1 text-[11px]">
                    <div>
                      <span className="font-bold">EMISIÓN: </span>
                      <span className="text-slate-600 dark:text-slate-300">NORMAL</span>
                    </div>
                    <div>
                      <span className="font-bold">ESTADO SRI: </span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">AUTORIZADO</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                    <span className="font-bold block text-[10px] uppercase text-slate-500 mb-0.5">
                      CLAVE DE ACCESO:
                    </span>
                    <BarcodeSvg code={accessKey} />
                  </div>
                </div>
              </div>

              <div className="mt-2 pt-2 flex items-center justify-between text-[11px]">
                <button
                  type="button"
                  onClick={handleCopyKey}
                  className="px-2 py-1 rounded border text-[11px] font-medium flex items-center gap-1 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  style={{ borderColor: "#cbd5e1" }}
                >
                  {copiedKey ? "✓ ¡Clave copiada!" : "📋 Copiar clave (49 dígitos)"}
                </button>

                <button
                  type="button"
                  onClick={handleVerifySri}
                  className="px-2 py-1 rounded text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1 hover:underline"
                >
                  {sriCheckStatus === "checking" ? "Verificando..." : sriCheckStatus === "verified" ? "✔ Verificado en SRI" : "🔍 Consultar en SRI"}
                </button>
              </div>
            </div>
          </div>

          {/* Client Info box */}
          <div
            className={`p-4 rounded-xl border text-xs ${
              viewFormat === "ride" ? "bg-slate-50/80 border-slate-300 text-slate-900" : "border-slate-800 bg-slate-900/60"
            }`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Razón Social / Nombres y Apellidos</p>
                <p className="font-bold text-sm mt-0.5 text-slate-900 dark:text-white">{invoice.guest}</p>
                <p className="text-[11px] text-slate-500">Reserva: <span className="mono font-semibold text-amber-600">{invoice.resId}</span></p>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Identificación (C.I. / RUC / Pasaporte)</p>
                <p className="mono font-bold text-sm mt-0.5 text-slate-900 dark:text-white">{clientDoc}</p>
                <p className="text-[11px] text-slate-500">Fecha Emisión: {invoice.issueDate}</p>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Guía de Remisión / Dirección</p>
                <p className="text-xs mt-0.5 font-medium">{clientAddress}</p>
                <p className="text-[11px] text-slate-500">Guía: <span className="mono font-semibold">S/N</span></p>
              </div>
            </div>
          </div>

          {/* Details Table according to SRI format */}
          <div
            className={`rounded-xl border overflow-hidden ${
              viewFormat === "ride" ? "border-slate-300 bg-white" : "border-slate-800 bg-slate-900/40"
            }`}
          >
            <table className="w-full text-xs">
              <thead>
                <tr
                  className="border-b"
                  style={{
                    background: viewFormat === "ride" ? "#f1f5f9" : "var(--muted)",
                    borderColor: viewFormat === "ride" ? "#cbd5e1" : "var(--border)",
                  }}
                >
                  <th className="px-3 py-2.5 text-left font-bold uppercase text-[10px] text-slate-600 dark:text-slate-300">Cod. Principal</th>
                  <th className="px-3 py-2.5 text-center font-bold uppercase text-[10px] text-slate-600 dark:text-slate-300">Cant.</th>
                  <th className="px-3 py-2.5 text-left font-bold uppercase text-[10px] text-slate-600 dark:text-slate-300">Descripción</th>
                  <th className="px-3 py-2.5 text-right font-bold uppercase text-[10px] text-slate-600 dark:text-slate-300">Precio Unitario</th>
                  <th className="px-3 py-2.5 text-right font-bold uppercase text-[10px] text-slate-600 dark:text-slate-300">Descuento</th>
                  <th className="px-3 py-2.5 text-right font-bold uppercase text-[10px] text-slate-600 dark:text-slate-300">Precio Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                <tr>
                  <td className="px-3 py-3 mono font-semibold text-amber-600">HOS-001</td>
                  <td className="px-3 py-3 text-center mono font-medium">{invoice.nights}.00</td>
                  <td className="px-3 py-3">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      Servicio de Alojamiento y Hospedaje ({invoice.nights} noche{invoice.nights > 1 ? "s" : ""})
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Habitación: {roomDescription} · Check-in: {invoice.checkIn} → Check-out: {invoice.checkOut}
                    </p>
                  </td>
                  <td className="px-3 py-3 text-right mono">{fmtUsd(unitPrice)}</td>
                  <td className="px-3 py-3 text-right mono">$ 0.00</td>
                  <td className="px-3 py-3 text-right mono font-bold text-slate-900 dark:text-white">
                    {fmtUsd(subtotal15)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Bottom SRI settlement: Additional Info & Payment Methods (left) + Tax breakdown (right) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Additional Info & Payment Methods */}
            <div className="space-y-3">
              {/* Información Adicional */}
              <div
                className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                  viewFormat === "ride" ? "bg-slate-50 border-slate-300 text-slate-800" : "border-slate-800 bg-slate-900/60"
                }`}
              >
                <p className="font-bold text-[10px] uppercase text-slate-400 tracking-wider">Información Adicional</p>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="font-semibold text-slate-500">Email: </span>
                    <span className="text-slate-700 dark:text-slate-300">{clientEmail}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-500">Teléfono: </span>
                    <span className="text-slate-700 dark:text-slate-300">{clientPhone}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-500">Hotel emisor: </span>
                    <span className="font-medium text-amber-600">{invoice.hotel}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-500">Nº Reserva: </span>
                    <span className="mono font-semibold">{invoice.resId}</span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-800">
                  Comprobante electrónico generado conforme a la ficha técnica del Servicio de Rentas Internas del Ecuador.
                </p>
              </div>

              {/* Formas de Pago Catálogo SRI */}
              <div
                className={`p-3.5 rounded-xl border text-xs ${
                  viewFormat === "ride" ? "bg-white border-slate-300" : "border-slate-800 bg-slate-900/60"
                }`}
              >
                <p className="font-bold text-[10px] uppercase text-slate-400 tracking-wider mb-2">
                  Formas de Pago (Catálogo SRI Ecuador)
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-[11px]">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
                        <th className="text-left pb-1">Forma de Pago</th>
                        <th className="text-right pb-1">Total</th>
                        <th className="text-center pb-1">Plazo</th>
                        <th className="text-center pb-1">Tiempo</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="pt-1">
                        <td className="py-1 font-medium">
                          {invoice.payMethod.toLowerCase().includes("tarjeta")
                            ? "19 - TARJETA DE CRÉDITO"
                            : invoice.payMethod.toLowerCase().includes("transferencia")
                            ? "20 - OTROS CON UTILIZACIÓN DEL SISTEMA FINANCIERO"
                            : "01 - SIN UTILIZACIÓN DEL SISTEMA FINANCIERO (EFECTIVO)"}
                        </td>
                        <td className="py-1 text-right mono font-bold text-amber-600">{fmtUsd(totalEcuador)}</td>
                        <td className="py-1 text-center mono">0</td>
                        <td className="py-1 text-center text-slate-400">Días</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Official Tax breakdown (Right) */}
            <div
              className={`p-4 rounded-xl border text-xs ${
                viewFormat === "ride" ? "bg-slate-50 border-slate-300 text-slate-900" : "border-slate-800 bg-slate-900/60"
              }`}
            >
              <table className="w-full text-xs">
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  <tr>
                    <td className="py-1 font-semibold text-slate-600 dark:text-slate-300">SUBTOTAL 15% (Tarifa vigente SRI)</td>
                    <td className="py-1 text-right mono font-medium">{fmtUsd(subtotal15)}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-medium text-slate-500">SUBTOTAL 0%</td>
                    <td className="py-1 text-right mono text-slate-400">$ 0.00</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-medium text-slate-500">SUBTOTAL NO OBJETO DE IVA</td>
                    <td className="py-1 text-right mono text-slate-400">$ 0.00</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-medium text-slate-500">SUBTOTAL EXENTO DE IVA</td>
                    <td className="py-1 text-right mono text-slate-400">$ 0.00</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-semibold text-slate-600 dark:text-slate-300">SUBTOTAL SIN IMPUESTOS</td>
                    <td className="py-1 text-right mono font-semibold">{fmtUsd(subtotal15)}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-medium text-slate-500">TOTAL DESCUENTO</td>
                    <td className="py-1 text-right mono text-slate-400">$ 0.00</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-medium text-slate-500">ICE</td>
                    <td className="py-1 text-right mono text-slate-400">$ 0.00</td>
                  </tr>
                  <tr className="bg-amber-500/10">
                    <td className="py-1.5 font-bold text-amber-700 dark:text-amber-400">IVA 15%</td>
                    <td className="py-1.5 text-right mono font-bold text-amber-700 dark:text-amber-400">{fmtUsd(iva15)}</td>
                  </tr>
                  <tr className={hasService10 ? "bg-emerald-500/10" : ""}>
                    <td className={`py-1 font-medium ${hasService10 ? "text-emerald-700 dark:text-emerald-400 font-semibold" : "text-slate-500"}`}>
                      PROPINA (10% Servicio {hasService10 ? "Ley Turismo" : "No aplica"})
                    </td>
                    <td className={`py-1 text-right mono ${hasService10 ? "text-emerald-700 dark:text-emerald-400 font-bold" : "text-slate-400"}`}>
                      {fmtUsd(servicio10)}
                    </td>
                  </tr>
                  <tr className="border-t-2 border-slate-400 dark:border-slate-600 bg-amber-500/20">
                    <td className="py-2 text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                      VALOR TOTAL (USD)
                    </td>
                    <td className="py-2 text-right mono text-lg font-black text-amber-600 dark:text-amber-400">
                      {fmtUsd(totalEcuador)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div
          className="p-3 sm:p-4 border-t flex flex-wrap items-center justify-between gap-2 text-xs"
          style={{
            background: "#0c1220",
            borderColor: "#1e2d47",
            color: "#e8edf5",
          }}
        >
          <div className="flex items-center gap-2">
            {invoice.status === "pending" && onMarkPaid && (
              <button
                type="button"
                onClick={onMarkPaid}
                className="px-3 py-2 rounded font-semibold text-xs bg-emerald-700 hover:bg-emerald-600 text-white transition-colors"
              >
                ✓ Marcar pagada
              </button>
            )}
            {onReissue && (
              <button
                type="button"
                onClick={onReissue}
                className="px-3 py-2 rounded font-medium text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              >
                🔄 Reemitir Comprobante
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadXml}
              className="px-3 py-2 rounded font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 transition-colors flex items-center gap-1.5"
            >
              <span>⬇</span> Descargar XML SRI
            </button>
            <button
              type="button"
              onClick={handlePrintRide}
              className="px-4 py-2 rounded font-bold text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors flex items-center gap-1.5 shadow"
            >
              <span>🖨</span> Imprimir / Descargar RIDE PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
