import React, { useState } from "react";
import { fmtUsd } from "./hotelData";

export interface NewPaymentLinkData {
  id: string;
  guest: string;
  amount: number;
  method: string;
  date: string;
  status: "completed" | "pending" | "failed";
  linkUrl: string;
  expiresAt: string;
  concept: string;
  phone?: string;
  email?: string;
  gateway: string;
}

interface PaymentLinkModalProps {
  hotelName: string;
  initialGuest?: string;
  initialAmount?: number;
  initialConcept?: string;
  onClose: () => void;
  onPaymentCreated: (payment: NewPaymentLinkData) => void;
}

const GATEWAYS = [
  { id: "payphone", name: "PayPhone Ecuador", tag: "Recomendado EC", icon: "📱", desc: "Cobro con tarjeta y App PayPhone" },
  { id: "kushki", name: "Kushki Pagos", tag: "Ecuador / Latam", icon: "💳", desc: "Tarjetas y transferencias bancarias" },
  { id: "datafast", name: "Datafast / Dataweb", tag: "Diners/Visa/MC", icon: "🏦", desc: "Botón de pagos multicrédito" },
  { id: "deuna", name: "DeUna (Banco Pichincha)", tag: "Transferencia QR", icon: "📲", desc: "Cobro instantáneo sin comisiones altas" },
  { id: "placetopay", name: "Placetopay", tag: "Produbanco/Pichincha", icon: "🌐", desc: "Pasarela bancaria regional" },
  { id: "stripe", name: "Tarjeta Internacional (Stripe)", tag: "Internacional", icon: "💳", desc: "Visa, Mastercard, Amex del exterior" },
  { id: "paypal", name: "PayPal", tag: "Turistas Globales", icon: "🅿️", desc: "Pago en USD directo desde cuenta PayPal" },
];

export default function PaymentLinkModal({
  hotelName,
  initialGuest = "",
  initialAmount = 150,
  initialConcept = "Estancia y Alojamiento",
  onClose,
  onPaymentCreated,
}: PaymentLinkModalProps) {
  const [guest, setGuest] = useState(initialGuest || "Carlos Méndez");
  const [amount, setAmount] = useState<number>(initialAmount || 150);
  const [concept, setConcept] = useState(initialConcept || "Estancia y Alojamiento");
  const [gateway, setGateway] = useState("payphone");
  const [phone, setPhone] = useState("+593 98 421 8890");
  const [email, setEmail] = useState("cliente@gmail.com");
  const [expiryHours, setExpiryHours] = useState<number>(48);

  // Link state
  const [linkGenerated, setLinkGenerated] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const [copied, setCopied] = useState(false);
  const [simulatedSuccess, setSimulatedSuccess] = useState(false);

  function handleGenerateLink(e: React.FormEvent) {
    e.preventDefault();
    const id = `PAY-${Math.floor(1000 + Math.random() * 9000)}`;
    const randomHash = Math.random().toString(36).substring(2, 9);
    const link = `https://pago.alojamanta.ec/pay/${randomHash}`;
    
    setPaymentId(id);
    setGeneratedLink(link);
    setLinkGenerated(true);

    const now = new Date();
    const expiryDate = new Date(now.getTime() + expiryHours * 3600 * 1000).toISOString().split("T")[0];

    const newPayment: NewPaymentLinkData = {
      id,
      guest,
      amount: Number(amount),
      method: GATEWAYS.find(g => g.id === gateway)?.name || "Link de Pago",
      date: new Date().toISOString().split("T")[0],
      status: "pending",
      linkUrl: link,
      expiresAt: expiryDate,
      concept,
      phone,
      email,
      gateway,
    };

    onPaymentCreated(newPayment);
  }

  function handleCopy() {
    navigator.clipboard?.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  function getWhatsAppUrl() {
    const text = encodeURIComponent(
      `Hola ${guest}, un cordial saludo de ${hotelName}. Le compartimos su enlace de pago seguro por el valor de ${fmtUsd(amount)} correspondiente a "${concept}".\n\nPuede realizar el pago de forma segura aquí: ${generatedLink}\n\n¡Gracias por su preferencia!`
    );
    const cleanPhone = phone.replace(/\D/g, "");
    return `https://wa.me/${cleanPhone}?text=${text}`;
  }

  function handleSimulatePayment() {
    setSimulatedSuccess(true);
    const newPayment: NewPaymentLinkData = {
      id: paymentId,
      guest,
      amount: Number(amount),
      method: GATEWAYS.find(g => g.id === gateway)?.name || "Link de Pago",
      date: new Date().toISOString().split("T")[0],
      status: "completed",
      linkUrl: generatedLink,
      expiresAt: "Completado hoy",
      concept,
      phone,
      email,
      gateway,
    };
    onPaymentCreated(newPayment);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      style={{ background: "rgba(3, 7, 18, 0.82)", backdropFilter: "blur(6px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-xl rounded-2xl overflow-hidden border shadow-2xl transition-all"
        style={{ background: "var(--card)", borderColor: "var(--border)" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: "var(--border)", background: "rgba(12, 18, 32, 0.6)" }}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center text-base">
              🔗
            </div>
            <div>
              <h2 className="text-base font-bold" style={{ color: "var(--foreground)" }}>
                {linkGenerated ? "Link de Pago Generado" : "Crear Link de Pago Seguro"}
              </h2>
              <p className="text-xs text-amber-500 font-medium">{hotelName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded flex items-center justify-center text-sm hover:bg-slate-800 transition-colors"
            style={{ color: "var(--muted-foreground)" }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        {!linkGenerated ? (
          <form onSubmit={handleGenerateLink} className="p-6 space-y-4 text-xs">
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium mb-1" style={{ color: "var(--muted-foreground)" }}>
                  Huésped / Titular del pago *
                </label>
                <input
                  type="text"
                  required
                  value={guest}
                  onChange={e => setGuest(e.target.value)}
                  placeholder="Ej: Carlos Méndez"
                  className="w-full rounded-lg border px-3 py-2 text-xs outline-none focus:border-amber-500 transition-colors"
                  style={{ background: "var(--muted)", borderColor: "var(--border)", color: "var(--foreground)" }}
                />
              </div>

              <div>
                <label className="block font-medium mb-1" style={{ color: "var(--muted-foreground)" }}>
                  Importe a cobrar (USD) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 font-bold text-amber-500">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    value={amount}
                    onChange={e => setAmount(Number(e.target.value))}
                    className="w-full rounded-lg border pl-7 pr-3 py-2 text-xs font-mono font-bold outline-none focus:border-amber-500 transition-colors"
                    style={{ background: "var(--muted)", borderColor: "var(--border)", color: "var(--foreground)" }}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block font-medium mb-1" style={{ color: "var(--muted-foreground)" }}>
                Concepto del cobro *
              </label>
              <input
                type="text"
                required
                value={concept}
                onChange={e => setConcept(e.target.value)}
                placeholder="Ej: Garantía de reserva estancia 3 noches"
                className="w-full rounded-lg border px-3 py-2 text-xs outline-none focus:border-amber-500 transition-colors"
                style={{ background: "var(--muted)", borderColor: "var(--border)", color: "var(--foreground)" }}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium mb-1" style={{ color: "var(--muted-foreground)" }}>
                  Teléfono WhatsApp (+593 para Ecuador)
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+593 98 421 8890"
                  className="w-full rounded-lg border px-3 py-2 text-xs outline-none focus:border-amber-500 transition-colors"
                  style={{ background: "var(--muted)", borderColor: "var(--border)", color: "var(--foreground)" }}
                />
              </div>

              <div>
                <label className="block font-medium mb-1" style={{ color: "var(--muted-foreground)" }}>
                  Email para recibo / factura
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="cliente@email.com"
                  className="w-full rounded-lg border px-3 py-2 text-xs outline-none focus:border-amber-500 transition-colors"
                  style={{ background: "var(--muted)", borderColor: "var(--border)", color: "var(--foreground)" }}
                />
              </div>
            </div>

            {/* Pasarelas de Pago de Ecuador e Internacionales */}
            <div>
              <label className="block font-medium mb-1.5" style={{ color: "var(--muted-foreground)" }}>
                Pasarela de Pago Habilitada
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {GATEWAYS.map(g => (
                  <div
                    key={g.id}
                    onClick={() => setGateway(g.id)}
                    className={`p-2.5 rounded-lg border cursor-pointer transition-all flex items-start gap-2.5 ${
                      gateway === g.id
                        ? "border-amber-500 bg-amber-500/10 shadow-sm"
                        : "hover:border-slate-700 bg-slate-900/40 border-slate-800"
                    }`}
                  >
                    <span className="text-base mt-0.5">{g.icon}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-semibold text-xs truncate" style={{ color: "var(--foreground)" }}>
                          {g.name}
                        </span>
                        <span className="mono text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold whitespace-nowrap">
                          {g.tag}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">{g.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <label className="text-slate-400 text-xs">Vigencia:</label>
                <select
                  value={expiryHours}
                  onChange={e => setExpiryHours(Number(e.target.value))}
                  className="rounded border px-2 py-1 text-xs outline-none"
                  style={{ background: "var(--muted)", borderColor: "var(--border)", color: "var(--foreground)" }}
                >
                  <option value={24}>24 Horas</option>
                  <option value={48}>48 Horas</option>
                  <option value={72}>3 Días</option>
                  <option value={168}>7 Días</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded text-xs font-medium text-slate-400 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg font-bold text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-lg shadow-amber-500/20 flex items-center gap-1.5"
                >
                  <span>⚡</span> Generar Link de Pago
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* Link Generated Result view */
          <div className="p-6 space-y-5 text-xs">
            {simulatedSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-center space-y-2">
                <span className="text-3xl">🎉</span>
                <h3 className="font-bold text-base text-emerald-300">¡Pago Recibido con Éxito!</h3>
                <p className="text-xs text-emerald-200">
                  El cliente {guest} ha completado el pago de {fmtUsd(amount)} mediante {GATEWAYS.find(g => g.id === gateway)?.name}.
                </p>
                <p className="mono text-[11px] text-emerald-400">ID de Transacción: {paymentId}</p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-2 px-5 py-2 rounded-lg font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                >
                  Cerrar y Ver Movimientos
                </button>
              </div>
            ) : (
              <>
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                  <div>
                    <span className="mono text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                      Enlace de Pago Creado
                    </span>
                    <span className="font-bold text-base text-white">{fmtUsd(amount)}</span>
                    <span className="text-slate-400 text-xs ml-2">· {concept}</span>
                  </div>
                  <span className="mono text-xs px-2.5 py-1 rounded bg-amber-950 text-amber-300 border border-amber-700 font-semibold">
                    Pendiente
                  </span>
                </div>

                {/* The Link with copy button */}
                <div>
                  <label className="block text-[11px] text-slate-400 font-medium mb-1">
                    URL directa para el cliente:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      readOnly
                      value={generatedLink}
                      className="flex-1 rounded-lg border px-3 py-2.5 text-xs font-mono select-all outline-none"
                      style={{ background: "var(--muted)", borderColor: "var(--border)", color: "var(--primary)" }}
                    />
                    <button
                      type="button"
                      onClick={handleCopy}
                      className={`px-4 py-2.5 rounded-lg font-bold text-xs transition-colors flex items-center gap-1.5 ${
                        copied ? "bg-emerald-600 text-white" : "bg-amber-500 text-slate-950 hover:bg-amber-400"
                      }`}
                    >
                      {copied ? "✓ ¡Copiado!" : "📋 Copiar"}
                    </button>
                  </div>
                </div>

                {/* Quick Share buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <a
                    href={getWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl border border-emerald-800 bg-emerald-950/40 hover:bg-emerald-900/60 transition-colors flex items-center gap-3 text-emerald-300"
                  >
                    <span className="text-xl">💬</span>
                    <div>
                      <p className="font-bold text-xs">Enviar por WhatsApp</p>
                      <p className="text-[10px] text-emerald-400/80">Mensaje con link al {phone}</p>
                    </div>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      alert(`Enlace enviado por correo electrónico a: ${email}`);
                    }}
                    className="p-3 rounded-xl border border-blue-800 bg-blue-950/40 hover:bg-blue-900/60 transition-colors flex items-center gap-3 text-blue-300 text-left"
                  >
                    <span className="text-xl">✉️</span>
                    <div>
                      <p className="font-bold text-xs">Enviar por Correo</p>
                      <p className="text-[10px] text-blue-400/80">Recibo digital a {email}</p>
                    </div>
                  </button>
                </div>

                {/* QR Code and Simulation */}
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {/* Visual QR SVG representation */}
                    <div className="w-16 h-16 rounded-lg bg-white p-1.5 flex items-center justify-center flex-shrink-0 shadow">
                      <svg viewBox="0 0 24 24" className="w-full h-full text-slate-900 fill-current">
                        <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 0h2v2h-2v-2zm-4 0h2v2h-2v-2zm2 2h2v2h-2v-2zm2 2h2v2h-2v-2zm-6 0h2v2h-2v-2zm2-4h2v2h-2v-2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-white">QR de Cobro Inmediato</p>
                      <p className="text-[10px] text-slate-400">Escaneable en el counter de recepción con PayPhone o cámara.</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSimulatePayment}
                    className="w-full sm:w-auto px-4 py-2 rounded-lg font-semibold text-xs border border-emerald-500/40 bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900 transition-colors whitespace-nowrap"
                  >
                    🧪 Simular Pago Exitoso
                  </button>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                  >
                    Listo
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
