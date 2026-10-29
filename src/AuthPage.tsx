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
  onBackToGuest?: () => void;
  theme?: "light" | "dark";
  onToggleTheme?: () => void;
}

const ADMIN_ACCOUNTS: (AdminUser & { password: string; legacyEmails?: string[] })[] = [
  { name: "Carlos Admin", email: "admin@alojamanta.ec", password: "admin123", role: "superadmin", hotelIds: [], legacyEmails: ["admin@hoteldirekt.com"] },
  { name: "Ana Administradora", email: "direccion@voyagermanta.ec", password: "hotel123", role: "admin", hotel: "Hotel Voyager Manta", hotelIds: ["hotel-voyager-manta", "mantahost-hotel", "hostal-el-naufrago"], legacyEmails: ["direccion@mantahost.ec", "direccion@laspalmeras.com"] },
  { name: "María Revenue", email: "revenue@voyagermanta.ec", password: "hotel123", role: "manager", hotel: "Hotel Voyager Manta", hotelIds: ["hotel-voyager-manta", "mantahost-hotel", "hostal-el-naufrago"], legacyEmails: ["revenue@mantahost.ec", "gerente@laspalmeras.com"] },
  { name: "Juan Recepción", email: "recepcion@voyagermanta.ec", password: "recep123", role: "receptionist", hotel: "Hotel Voyager Manta", hotelIds: ["hotel-voyager-manta", "mantahost-hotel", "hostal-el-naufrago"], legacyEmails: ["recepcion@mantahost.ec", "recepcion@laspalmeras.com"] },
];

const ROLE_LABELS: Record<AdminRole, { label: string; color: string; bg: string; border: string; desc: string }> = {
  superadmin: { label: "Superadmin Cantonal", color: "#b45309", bg: "rgba(245, 158, 11, 0.12)", border: "rgba(245, 158, 11, 0.35)", desc: "116 hoteles de Manta" },
  admin: { label: "Administrador de Hotel", color: "#7c3aed", bg: "rgba(124, 58, 237, 0.12)", border: "rgba(124, 58, 237, 0.35)", desc: "Switch 10% y equipo de su hotel" },
  manager: { label: "Revenue Manager", color: "#2563eb", bg: "rgba(37, 99, 235, 0.12)", border: "rgba(37, 99, 235, 0.35)", desc: "Tarifas, cupos web e IVA 8%" },
  receptionist: { label: "Operador Reservas / Recepción", color: "#059669", bg: "rgba(5, 150, 105, 0.12)", border: "rgba(5, 150, 105, 0.35)", desc: "Bandeja, Vouchers QR y pagos" },
};

export default function AuthPage({
  onAdminLogin,
  onGuestLogin,
  defaultTab = "guest",
  onBackToGuest,
  theme = "light",
  onToggleTheme,
}: Props) {
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
    const account = ADMIN_ACCOUNTS.find(
      a => (a.email.toLowerCase() === adminEmail.toLowerCase() || a.legacyEmails?.includes(adminEmail.toLowerCase())) &&
      a.password === adminPass
    );
    if (!account) { setAdminError("Credenciales incorrectas. Prueba con admin@alojamanta.ec / admin123 o clic en las cuentas demo"); return; }
    setAdminError("");
    onAdminLogin({ name: account.name, email: account.email, role: account.role, hotel: account.hotel, hotelIds: account.hotelIds });
  }

  return (
    <div className="min-h-screen flex flex-col transition-colors" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-4 border-b transition-colors shadow-2xs" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <div className="flex items-center gap-3">
          <span className="font-bold text-2xl tracking-tight" style={{ fontFamily: "DM Serif Display, serif", color: "var(--primary)" }}>
            AlojaManta
          </span>
          <span className="mono text-[11px] px-2 py-0.5 rounded border font-semibold" style={{ background: "var(--muted)", borderColor: "var(--border)", color: "var(--muted-foreground)" }}>
            v1.0 beta
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {onBackToGuest && (
            <button
              onClick={onBackToGuest}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all hover:bg-slate-100 hover:border-slate-300 cursor-pointer flex items-center gap-1.5 shadow-2xs"
              style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--foreground)" }}
            >
              <span>🌐</span>
              <span className="hidden sm:inline">Web de Huéspedes</span>
            </button>
          )}

          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className="px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all flex items-center gap-1.5 hover:bg-slate-100 cursor-pointer shadow-2xs"
              style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--foreground)" }}
              title="Cambiar tema claro / oscuro"
            >
              <span>{theme === "dark" ? "☀️" : "🌙"}</span>
              <span className="hidden sm:inline">{theme === "dark" ? "Modo Claro" : "Modo Oscuro"}</span>
            </button>
          )}
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 transition-colors">
        <div className="w-full max-w-md my-auto">
          {/* Tab switcher */}
          <div className="flex rounded-xl overflow-hidden border p-1 mb-6 shadow-xs transition-colors" style={{ background: "var(--muted)", borderColor: "var(--border)" }}>
            <button
              type="button"
              onClick={() => setTab("guest")}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5"
              style={{
                background: tab === "guest" ? "var(--card)" : "transparent",
                color: tab === "guest" ? "var(--foreground)" : "var(--muted-foreground)",
                boxShadow: tab === "guest" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
              }}
            >
              <span>👤</span>
              <span>Soy cliente</span>
            </button>
            <button
              type="button"
              onClick={() => setTab("admin")}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5"
              style={{
                background: tab === "admin" ? "var(--card)" : "transparent",
                color: tab === "admin" ? "var(--foreground)" : "var(--muted-foreground)",
                boxShadow: tab === "admin" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
              }}
            >
              <span>🏨</span>
              <span>Acceso hotel</span>
            </button>
          </div>

          {/* ── GUEST ── */}
          {tab === "guest" && (
            <div className="rounded-2xl border p-6 sm:p-7 shadow-sm transition-colors" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              <h2 className="text-xl sm:text-2xl font-bold mb-1" style={{ fontFamily: "DM Serif Display, serif", color: "var(--foreground)" }}>
                {guestMode === "login" ? "Accede a tu cuenta" : "Crea tu cuenta"}
              </h2>
              <p className="text-xs mb-5" style={{ color: "var(--muted-foreground)" }}>
                {guestMode === "login" ? "Consulta tus reservas, vouchers de pago y más." : "Regístrate gratis para reservar y gestionar tus estancias en Manta."}
              </p>

              <form onSubmit={handleGuestSubmit} className="space-y-3.5">
                {guestMode === "register" && (
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: "var(--foreground)" }}>Nombre completo</label>
                    <input
                      className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all focus:ring-2 focus:ring-amber-500/20"
                      style={{ background: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                      value={guestName} onChange={e => setGuestName(e.target.value)}
                      placeholder="María García López"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "var(--foreground)" }}>Email</label>
                  <input
                    type="email"
                    className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all focus:ring-2 focus:ring-amber-500/20"
                    style={{ background: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                    value={guestEmail} onChange={e => setGuestEmail(e.target.value)}
                    placeholder="maria@ejemplo.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "var(--foreground)" }}>Contraseña</label>
                  <input
                    type="password"
                    className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all focus:ring-2 focus:ring-amber-500/20"
                    style={{ background: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                    value={guestPass} onChange={e => setGuestPass(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
                {guestMode === "register" && (
                  <div className="flex items-start gap-2 pt-1">
                    <input type="checkbox" className="mt-0.5 accent-amber-500" id="terms" />
                    <label htmlFor="terms" className="text-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                      Acepto los <span className="font-semibold" style={{ color: "var(--primary)" }}>Términos de uso</span> y la <span className="font-semibold" style={{ color: "var(--primary)" }}>Política de privacidad</span>
                    </label>
                  </div>
                )}
                {guestError && (
                  <p className="text-xs px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-600">{guestError}</p>
                )}
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-bold text-sm hover:opacity-90 active:scale-98 transition-all mt-1 bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer shadow-xs"
                >
                  {guestMode === "login" ? "Iniciar sesión" : "Crear cuenta gratis"}
                </button>
              </form>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => setGuestMode(guestMode === "login" ? "register" : "login")}
                  className="text-xs transition-colors cursor-pointer"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {guestMode === "login" ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
                  <span className="font-semibold text-amber-600 hover:underline">{guestMode === "login" ? "Regístrate gratis" : "Inicia sesión"}</span>
                </button>
              </div>

              <div className="mt-4 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
                <p className="text-[10px] text-center mb-2.5 font-medium uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>O continúa con</p>
                <div className="flex gap-2">
                  {["Google", "Apple"].map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => onGuestLogin({ name: "Usuario " + p, email: `usuario@${p.toLowerCase()}.com` })}
                      className="flex-1 py-2 rounded-xl border text-xs font-semibold transition-all hover:bg-slate-100 cursor-pointer flex items-center justify-center gap-1.5"
                      style={{ background: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                    >
                      <span>{p === "Google" ? "🌐" : "🍎"}</span>
                      <span>{p}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── ADMIN ── */}
          {tab === "admin" && (
            <div className="rounded-2xl border p-6 sm:p-7 shadow-sm transition-colors" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-xl sm:text-2xl font-bold" style={{ fontFamily: "DM Serif Display, serif", color: "var(--foreground)" }}>
                  Panel de gestión
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase" style={{ background: "rgba(217, 119, 6, 0.15)", color: "#d97706" }}>
                  Extranet
                </span>
              </div>
              <p className="text-xs mb-5" style={{ color: "var(--muted-foreground)" }}>Acceso exclusivo para hoteles y administradores de la plataforma.</p>

              {/* Role preview cards */}
              <div className="grid grid-cols-2 gap-2 mb-5">
                {(Object.entries(ROLE_LABELS) as [AdminRole, typeof ROLE_LABELS[AdminRole]][]).map(([key, val]) => (
                  <div key={key} className="rounded-xl p-2.5 text-center border transition-all" style={{ background: val.bg, borderColor: val.border }}>
                    <p className="text-[10px] font-bold uppercase tracking-wider leading-tight" style={{ color: val.color }}>{val.label}</p>
                    <p className="text-[9px] mt-0.5 font-medium opacity-85" style={{ color: val.color }}>{val.desc}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAdminSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "var(--foreground)" }}>Email corporativo</label>
                  <input
                    type="email"
                    className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all focus:ring-2 focus:ring-amber-500/20"
                    style={{ background: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                    value={adminEmail} onChange={e => setAdminEmail(e.target.value)}
                    placeholder="usuario@mihotel.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "var(--foreground)" }}>Contraseña</label>
                  <input
                    type="password"
                    className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all focus:ring-2 focus:ring-amber-500/20"
                    style={{ background: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                    value={adminPass} onChange={e => setAdminPass(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
                {adminError && (
                  <p className="text-xs px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-600">{adminError}</p>
                )}
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-bold text-sm hover:opacity-90 active:scale-98 transition-all bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer shadow-xs"
                >
                  Entrar al panel
                </button>
              </form>

              <div className="mt-5 pt-4 border-t space-y-2" style={{ borderColor: "var(--border)" }}>
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>Cuentas demo disponibles (clic para autocompletar)</p>
                {ADMIN_ACCOUNTS.map(a => {
                  const role = ROLE_LABELS[a.role];
                  return (
                    <button
                      key={a.email}
                      type="button"
                      onClick={() => { setAdminEmail(a.email); setAdminPass(a.password); }}
                      className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-left transition-all hover:border-amber-400 hover:shadow-xs cursor-pointer group"
                      style={{ background: "var(--background)", borderColor: "var(--border)" }}
                    >
                      <div>
                        <p className="text-xs font-bold transition-colors group-hover:text-amber-600" style={{ color: "var(--foreground)" }}>{a.name}</p>
                        <p className="mono text-[10px]" style={{ color: "var(--muted-foreground)" }}>{a.email}</p>
                      </div>
                      <span
                        className="mono text-[9px] px-2 py-0.5 rounded-md font-bold uppercase border"
                        style={{ background: role.bg, color: role.color, borderColor: role.border }}
                      >
                        {role.label}
                      </span>
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
