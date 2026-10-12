import { useState } from "react";

export type AdminRole = "superadmin" | "admin" | "manager" | "receptionist";

export interface AdminUser {
  name: string;
  email: string;
  role: AdminRole;
  hotel?: string;
  hotelIds?: string[];
}

export interface GuestUser {
  name: string;
  email: string;
}

interface Props {
  onAdminLogin: (user: AdminUser) => void;
  onGuestLogin: (user: GuestUser) => void;
  defaultTab?: "admin" | "guest";
}

const ADMIN_ACCOUNTS: (AdminUser & { password: string })[] = [
  { name: "Carlos Admin", email: "admin@hoteldirekt.com", password: "admin123", role: "superadmin", hotelIds: [] },
  { name: "Ana Administradora", email: "direccion@laspalmeras.com", password: "hotel123", role: "admin", hotel: "Hotel Las Palmeras", hotelIds: ["las-palmeras"] },
  { name: "María Gerente", email: "gerente@laspalmeras.com", password: "hotel123", role: "manager", hotel: "Hotel Las Palmeras", hotelIds: ["las-palmeras"] },
  { name: "Juan Recepción", email: "recepcion@laspalmeras.com", password: "recep123", role: "receptionist", hotel: "Hotel Las Palmeras", hotelIds: ["las-palmeras"] },
];

const ROLE_LABELS: Record<AdminRole, { label: string; color: string; bg: string; desc: string }> = {
  superadmin: { label: "Superadmin", color: "#f59e0b", bg: "#451a03", desc: "Toda la plataforma" },
  admin: { label: "Administrador", color: "#c4b5fd", bg: "#3b1f5e", desc: "Todo su hotel" },
  manager: { label: "Gerente", color: "#93c5fd", bg: "#1e3a5f", desc: "Gestión limitada" },
  receptionist: { label: "Recepcionista", color: "#6ee7b7", bg: "#064e3b", desc: "Operación diaria" },
};

export default function AuthPage({ onAdminLogin, onGuestLogin, defaultTab = "guest" }: Props) {
  const [tab, setTab] = useState<"guest" | "admin">(defaultTab);
  const [guestMode, setGuestMode] = useState<"login" | "register">("login");

  // Guest form
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPass, setGuestPass] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestError, setGuestError] = useState("");

  // Admin form
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [adminError, setAdminError] = useState("");

  function handleGuestSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!guestEmail || !guestPass) { setGuestError("Completa todos los campos."); return; }
    if (guestMode === "register" && !guestName) { setGuestError("Indica tu nombre."); return; }
    setGuestError("");
    onGuestLogin({ name: guestName || guestEmail.split("@")[0], email: guestEmail });
  }

  function handleAdminSubmit(e: React.FormEvent) {
    e.preventDefault();
    const account = ADMIN_ACCOUNTS.find(a => a.email === adminEmail && a.password === adminPass);
    if (!account) { setAdminError("Credenciales incorrectas. Prueba con admin@hoteldirekt.com / admin123"); return; }
    setAdminError("");
    onAdminLogin({ name: account.name, email: account.email, role: account.role, hotel: account.hotel, hotelIds: account.hotelIds });
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#0c1220" }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "#1e2d47" }}>
        <span className="font-bold text-xl" style={{ fontFamily: "DM Serif Display, serif", color: "#f59e0b" }}>HotelDirekt</span>
        <span className="mono text-xs px-2 py-1 rounded" style={{ background: "#1e2d47", color: "#64748b" }}>v1.0 beta</span>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Tab switcher */}
          <div className="flex rounded-xl overflow-hidden border mb-6" style={{ borderColor: "#1e2d47" }}>
            <button
              onClick={() => setTab("guest")}
              className="flex-1 py-3 text-sm font-semibold transition-all"
              style={{
                background: tab === "guest" ? "#f59e0b" : "#131c2e",
                color: tab === "guest" ? "#0c1220" : "#64748b",
              }}
            >
              👤 Soy cliente
            </button>
            <button
              onClick={() => setTab("admin")}
              className="flex-1 py-3 text-sm font-semibold transition-all"
              style={{
                background: tab === "admin" ? "#f59e0b" : "#131c2e",
                color: tab === "admin" ? "#0c1220" : "#64748b",
              }}
            >
              🏨 Acceso hotel
            </button>
          </div>

          {/* ── GUEST ── */}
          {tab === "guest" && (
            <div className="rounded-2xl border p-6" style={{ background: "#131c2e", borderColor: "#1e2d47" }}>
              <h2 className="text-xl font-bold mb-1" style={{ fontFamily: "DM Serif Display, serif", color: "#e8edf5" }}>
                {guestMode === "login" ? "Accede a tu cuenta" : "Crea tu cuenta"}
              </h2>
              <p className="text-xs mb-5" style={{ color: "#64748b" }}>
                {guestMode === "login" ? "Consulta tus reservas, facturas y más." : "Regístrate gratis para reservar y gestionar tus estancias."}
              </p>

              <form onSubmit={handleGuestSubmit} className="space-y-3">
                {guestMode === "register" && (
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: "#94a3b8" }}>Nombre completo</label>
                    <input
                      className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition-colors"
                      style={{ background: "#1a2540", borderColor: "#1e2d47", color: "#e8edf5" }}
                      value={guestName} onChange={e => setGuestName(e.target.value)}
                      placeholder="María García López"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "#94a3b8" }}>Email</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
                    style={{ background: "#1a2540", borderColor: "#1e2d47", color: "#e8edf5" }}
                    value={guestEmail} onChange={e => setGuestEmail(e.target.value)}
                    placeholder="maria@ejemplo.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "#94a3b8" }}>Contraseña</label>
                  <input
                    type="password"
                    className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
                    style={{ background: "#1a2540", borderColor: "#1e2d47", color: "#e8edf5" }}
                    value={guestPass} onChange={e => setGuestPass(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
                {guestMode === "register" && (
                  <div className="flex items-start gap-2 pt-1">
                    <input type="checkbox" className="mt-0.5 accent-amber-400" id="terms" />
                    <label htmlFor="terms" className="text-xs leading-relaxed" style={{ color: "#64748b" }}>
                      Acepto los <span style={{ color: "#f59e0b" }}>Términos de uso</span> y la <span style={{ color: "#f59e0b" }}>Política de privacidad</span>
                    </label>
                  </div>
                )}
                {guestError && (
                  <p className="text-xs px-3 py-2 rounded-lg" style={{ background: "#450a0a", color: "#fca5a5" }}>{guestError}</p>
                )}
                <button type="submit" className="w-full py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all mt-1" style={{ background: "#f59e0b", color: "#0c1220" }}>
                  {guestMode === "login" ? "Iniciar sesión" : "Crear cuenta gratis"}
                </button>
              </form>

              <div className="mt-4 text-center">
                <button onClick={() => setGuestMode(guestMode === "login" ? "register" : "login")} className="text-xs transition-colors" style={{ color: "#64748b" }}>
                  {guestMode === "login" ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
                  <span style={{ color: "#f59e0b" }}>{guestMode === "login" ? "Regístrate gratis" : "Inicia sesión"}</span>
                </button>
              </div>

              <div className="mt-4 pt-4 border-t" style={{ borderColor: "#1e2d47" }}>
                <p className="text-[10px] text-center mb-2" style={{ color: "#64748b" }}>O continúa con</p>
                <div className="flex gap-2">
                  {["Google", "Apple"].map(p => (
                    <button key={p} onClick={() => onGuestLogin({ name: "Usuario " + p, email: `usuario@${p.toLowerCase()}.com` })} className="flex-1 py-2 rounded-lg border text-xs font-medium transition-colors hover:brightness-110" style={{ background: "#1a2540", borderColor: "#1e2d47", color: "#94a3b8" }}>
                      {p === "Google" ? "🌐" : "🍎"} {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── ADMIN ── */}
          {tab === "admin" && (
            <div className="rounded-2xl border p-6" style={{ background: "#131c2e", borderColor: "#1e2d47" }}>
              <h2 className="text-xl font-bold mb-1" style={{ fontFamily: "DM Serif Display, serif", color: "#e8edf5" }}>
                Panel de gestión
              </h2>
              <p className="text-xs mb-5" style={{ color: "#64748b" }}>Acceso exclusivo para hoteles y administradores de la plataforma.</p>

              {/* Role preview cards */}
              <div className="grid grid-cols-2 gap-2 mb-5">
                {(Object.entries(ROLE_LABELS) as [AdminRole, typeof ROLE_LABELS[AdminRole]][]).map(([key, val]) => (
                  <div key={key} className="rounded-lg p-2 text-center border" style={{ background: val.bg + "55", borderColor: val.bg }}>
                    <p className="text-[9px] font-bold uppercase tracking-wide leading-tight" style={{ color: val.color }}>{val.label}</p>
                    <p className="text-[8px] mt-0.5" style={{ color: val.color + "88" }}>{val.desc}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAdminSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "#94a3b8" }}>Email corporativo</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
                    style={{ background: "#1a2540", borderColor: "#1e2d47", color: "#e8edf5" }}
                    value={adminEmail} onChange={e => setAdminEmail(e.target.value)}
                    placeholder="usuario@mihotel.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "#94a3b8" }}>Contraseña</label>
                  <input
                    type="password"
                    className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
                    style={{ background: "#1a2540", borderColor: "#1e2d47", color: "#e8edf5" }}
                    value={adminPass} onChange={e => setAdminPass(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
                {adminError && (
                  <p className="text-xs px-3 py-2 rounded-lg" style={{ background: "#450a0a", color: "#fca5a5" }}>{adminError}</p>
                )}
                <button type="submit" className="w-full py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all" style={{ background: "#f59e0b", color: "#0c1220" }}>
                  Entrar al panel
                </button>
              </form>

              <div className="mt-4 pt-4 border-t space-y-1.5" style={{ borderColor: "#1e2d47" }}>
                <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#64748b" }}>Cuentas demo disponibles</p>
                {ADMIN_ACCOUNTS.map(a => {
                  const role = ROLE_LABELS[a.role];
                  return (
                    <button key={a.email} onClick={() => { setAdminEmail(a.email); setAdminPass(a.password); }} className="w-full flex items-center justify-between px-3 py-2 rounded-lg border text-left transition-all hover:brightness-110" style={{ background: role.bg + "44", borderColor: role.bg + "66" }}>
                      <div>
                        <p className="text-xs font-semibold" style={{ color: "#e8edf5" }}>{a.name}</p>
                        <p className="mono text-[10px]" style={{ color: "#64748b" }}>{a.email}</p>
                      </div>
                      <span className="mono text-[9px] px-2 py-0.5 rounded uppercase" style={{ background: role.bg, color: role.color }}>{role.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
