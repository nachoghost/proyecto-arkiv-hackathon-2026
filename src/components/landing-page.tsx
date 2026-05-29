"use client";

import { useState } from "react";

export function LandingPage({ onLoginSuccess }: { onLoginSuccess?: () => void }) {
  const [view, setView] = useState<"home" | "login">("home");

  return (
    <div>
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-[rgba(244,241,233,0.82)] border-b border-med-line">
        <div className="max-w-[1180px] mx-auto px-7 h-[72px] flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer font-fraunces text-[23px] font-semibold tracking-[-0.02em]"
            onClick={() => setView("home")}
          >
            <span className="w-[34px] h-[34px] rounded-[9px] bg-med-ink grid place-items-center flex-shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="#16B886" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <rect x="4" y="3" width="12" height="18" rx="2"/>
                <path d="M10 3V7"/>
                <path d="M8 7H12"/>
                <path d="M8 11H14"/>
                <path d="M8 15H14"/>
                <path d="M8 19H12"/>
                <path d="M16 8C16 6.89543 16.8954 6 18 6C19.1046 6 20 6.89543 20 8V16C20 17.1046 19.1046 18 18 18C16.8954 18 16 17.1046 16 16"/>
                <path d="M16 8V16"/>
                <circle cx="18" cy="12" r="2"/>
              </svg>
            </span>
            InforMed
          </div>
          <div className="flex items-center gap-[30px]">
            <a onClick={() => setView("home")} className="text-med-ink-soft text-[14.5px] font-medium cursor-pointer hover:text-med-ink">Inicio</a>
            <a href="#features" className="text-med-ink-soft text-[14.5px] font-medium cursor-pointer hover:text-med-ink">Funciones</a>
            <a href="#como" className="text-med-ink-soft text-[14.5px] font-medium cursor-pointer hover:text-med-ink">Cómo funciona</a>
            <a href="#arkiv" className="text-med-ink-soft text-[14.5px] font-medium cursor-pointer hover:text-med-ink">Por qué Arkiv</a>
          </div>
          <div className="flex bg-med-primary-2 border border-med-line rounded-[999px] p-1">
            <button
              className={`px-4 py-2 rounded-[999px] text-[13.5px] font-semibold transition-[0.18s] ${view === "home" ? "bg-med-ink text-med-primary" : "bg-transparent text-med-muted"}`}
              onClick={() => setView("home")}
            >
              Home
            </button>
            <button
              className={`px-4 py-2 rounded-[999px] text-[13.5px] font-semibold transition-[0.18s] ${view === "login" ? "bg-med-ink text-med-primary" : "bg-transparent text-med-muted"}`}
              onClick={() => setView("login")}
            >
              Ingresar
            </button>
          </div>
        </div>
      </nav>

      {view === "home" && <HomeView />}
      {view === "login" && <LoginView onLoginSuccess={onLoginSuccess} />}
    </div>
  );
}

function HomeView() {
  return (
    <div>
      {/* Hero Section */}
      <header className="relative py-[84px] pb-[70px] overflow-hidden" style={{ backgroundImage: "radial-gradient(var(--med-line) 1px,transparent 1px)", backgroundSize: "22px 22px" }}>
        <div className="absolute inset-0 z-0 bg-[radial-gradient(120%_90%_at_80%_-10%,rgba(22,184,134,.16),transparent_55%),radial-gradient(90%_70%_at_0%_100%,rgba(14,46,41,.06),transparent_60%)]"></div>
        <div className="relative z-1 max-w-[1180px] mx-auto px-7 grid grid-cols-[1.05fr_0.95fr] gap-[54px] items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-[12.5px] font-semibold tracking-[0.04em] text-med-secondary bg-med-secondary-soft px-3 py-1.5 rounded-[999px] mb-[22px]">
              <span className="w-[7px] h-[7px] rounded-full bg-med-secondary-hover shadow-[0_0_0_4px_rgba(22,184,134,.25)]"></span>
              Fácil acceso a tu historial clínico
            </span>
            <h1 className="font-fraunces text-[clamp(38px,5.4vw,62px)] font-medium leading-[1.04] tracking-[-0.015em]">
              Tu historia clínica, <em className="font-italic text-med-secondary">siempre accesible</em> y verificable.
            </h1>
            <p className="text-[19px] text-med-ink-soft max-w-[30em] my-6">
              InforMed conecta médicos y pacientes en una plataforma segura donde registrar y acceder a historiales clínicos con respaldo verificable e imborrable. Sin perder el archivo, sin depender de un solo servidor.
            </p>
            <div className="flex gap-3.5 flex-wrap items-center">
              <button className="inline-flex items-center gap-2 cursor-pointer border-none font-hanken text-[14.5px] font-semibold px-5.5 py-2.5 rounded-[999px] transition-[transform_0.18s,box-shadow_0.18s] bg-med-secondary text-white shadow-[0_8px_22px_-10px_var(--med-secondary)] hover:translate-y-[-2px] hover:shadow-[0_14px_28px_-10px_var(--med-secondary)]">
                Empezar ahora
                <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6"/>
                </svg>
              </button>
              <button className="inline-flex items-center gap-2 cursor-pointer border-none font-hanken text-[14.5px] font-semibold px-5.5 py-2.5 rounded-[999px] transition-[transform_0.18s,box-shadow_0.18s] bg-transparent text-med-ink border border-med-line-strong hover:bg-med-primary-2">
                Ver cómo funciona
              </button>
            </div>
            <div className="flex gap-2 items-center mt-[26px] text-[13.5px] text-med-muted">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-med-secondary">
                <path d="M9 12l2 2 4-4"/>
                <circle cx="12" cy="12" r="9"/>
              </svg>
              Cada registro queda firmado, fechado y verificable on-chain.
            </div>
          </div>

          {/* Floating Record Card */}
          <div className="relative">
            <div className="absolute top-[-22px] left-[-30px] bg-white border border-med-line rounded-[14px] px-3.5 py-2.5 shadow-[0_24px_60px_-28px_rgba(14,46,41,.45)] flex items-center gap-2.5 text-[13px] font-semibold animate-[bob_5s_ease-in-out_infinite]">
              <span className="w-[30px] h-[30px] rounded-[9px] grid place-items-center text-white" style={{ background: "var(--med-coral)" }}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M12 9v4M12 17h.01"/>
                  <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>
                </svg>
              </span>
              Alerta de alergia
            </div>
            <div className="absolute bottom-[-26px] right-[-22px] bg-white border border-med-line rounded-[14px] px-3.5 py-2.5 shadow-[0_24px_60px_-28px_rgba(14,46,41,.45)] flex items-center gap-2.5 text-[13px] font-semibold animate-[bob_5s_ease-in-out_infinite]" style={{ animationDelay: "1.2s" }}>
              <span className="w-[30px] h-[30px] rounded-[9px] grid place-items-center text-white bg-med-secondary">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5"/>
                </svg>
              </span>
              Verificado on-chain
            </div>

            <div className="bg-white border border-med-line rounded-[20px] shadow-[0_24px_60px_-28px_rgba(14,46,41,.45)] p-6 relative">
              <div className="flex items-center gap-3 pb-4 border-b border-dashed border-med-line">
                <div className="w-[46px] h-[46px] rounded-[13px] bg-gradient-to-br from-med-ink to-med-secondary text-white grid place-items-center font-fraunces text-[18px] flex-shrink-0">MG</div>
                <div>
                  <b className="text-[15.5px] block">María González</b>
                  <span className="text-[12.5px] text-med-muted">HC 04821 · 47 años · F</span>
                </div>
                <div className="ml-auto flex items-center gap-1.5 text-[11px] font-semibold text-med-secondary bg-med-secondary-soft px-2.5 py-1 rounded-[999px] whitespace-nowrap">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                    <path d="M20 6 9 17l-5-5"/>
                  </svg>
                  Verificado
                </div>
              </div>
              <div className="flex justify-between items-start py-3 border-b border-med-line">
                <span className="text-[11.5px] uppercase tracking-[0.08em] text-med-muted font-semibold">Ingreso</span>
                <span className="text-[14.5px] text-right max-w-[62%]">29/05/2026 · Guardia · Dr. Pérez</span>
              </div>
              <div className="flex justify-between items-start py-3 border-b border-med-line">
                <span className="text-[11.5px] uppercase tracking-[0.08em] text-med-muted font-semibold">Alergias</span>
                <span className="text-[14.5px] text-right max-w-[62%]">
                  <div className="flex gap-1.5 flex-wrap justify-end">
                    <span className="text-[11.5px] font-semibold px-2.5 py-0.5 rounded-[999px] bg-[rgba(224,101,76,.13)] text-med-coral">Penicilina</span>
                    <span className="text-[11.5px] font-semibold px-2.5 py-0.5 rounded-[999px] bg-[rgba(224,101,76,.13)] text-med-coral">AINEs</span>
                  </div>
                </span>
              </div>
              <div className="flex justify-between items-start py-3 border-b border-med-line">
                <span className="text-[11.5px] uppercase tracking-[0.08em] text-med-muted font-semibold">Diagnóstico</span>
                <span className="text-[14.5px] text-right max-w-[62%]">Hipertensión · seguimiento</span>
              </div>
              <div className="flex justify-between items-start py-3">
                <span className="text-[11.5px] uppercase tracking-[0.08em] text-med-muted font-semibold">Estado</span>
                <span className="text-[14.5px] text-right max-w-[62%]">
                  <div className="flex gap-1.5 flex-wrap justify-end">
                    <span className="text-[11.5px] font-semibold px-2.5 py-0.5 rounded-[999px] bg-[rgba(14,140,107,.12)] text-med-secondary">Estable</span>
                  </div>
                </span>
              </div>
              <div className="mt-4 font-mono text-[11px] text-med-muted bg-med-primary rounded-[10px] px-3 py-2 flex items-center gap-2 border border-med-line">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3 text-med-secondary flex-shrink-0">
                  <path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18"/>
                </svg>
                0x7af3…e29c · bloque #1,284,907 · Arkiv
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Trust Strip */}
      <div className="border-t border-b border-med-line bg-med-primary-2">
        <div className="max-w-[1180px] mx-auto px-7 flex flex-wrap gap-3.5 10 justify-between items-center py-5.5">
          <span className="text-[13.5px] text-med-ink-soft font-medium flex items-center gap-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] text-med-secondary">
              <rect x="3" y="11" width="18" height="11" rx="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            Datos cifrados y verificables
          </span>
          <span className="text-[13.5px] text-med-ink-soft font-medium flex items-center gap-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] text-med-secondary">
              <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0z"/>
              <path d="M12 7v5l3 2"/>
            </svg>
            Historial imborrable
          </span>
          <span className="text-[13.5px] text-med-ink-soft font-medium flex items-center gap-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] text-med-secondary">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            Disponible siempre, sin un único servidor
          </span>
          <span className="text-[13.5px] text-med-ink-soft font-medium flex items-center gap-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] text-med-secondary">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
            </svg>
            Portable entre instituciones
          </span>
        </div>
      </div>

      {/* Features Section - Both Roles */}
      <section className="py-[100px] relative overflow-hidden" id="features" style={{ backgroundImage: "radial-gradient(var(--med-line) 1px,transparent 1px)", backgroundSize: "22px 22px" }}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-med-primary-2/30 to-transparent pointer-events-none"></div>
        <div className="max-w-[1180px] mx-auto px-7 relative z-1">
          <div className="text-center mb-[70px]">
            <div className="inline-flex items-center gap-2 text-[12.5px] font-semibold tracking-[0.14em] uppercase text-med-secondary bg-med-secondary-soft px-4 py-2 rounded-[999px] mb-[20px]">
              <span className="w-[8px] h-[8px] rounded-full bg-med-secondary-hover shadow-[0_0_0_4px_rgba(22,184,134,.25)]"></span>
              Para médicos y pacientes
            </div>
            <h2 className="font-fraunces text-[clamp(32px,4vw,48px)] font-medium leading-[1.04] tracking-[-0.015em] mb-6">
              Una plataforma para <em className="font-italic text-med-secondary">todos</em>.
            </h2>
            <p className="text-[18px] text-med-ink-soft max-w-[600px] mx-auto">
              InforMed conecta médicos y pacientes en una sola plataforma segura donde registrar y acceder a historiales clínicos con respaldo verificable.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-16">
            {/* Doctors Column */}
            <div className="relative">
              <div className="absolute -top-8 -left-8 w-32 h-32 bg-med-secondary/10 rounded-full blur-3xl"></div>
              <div className="relative">
                <div className="mb-8 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-med-secondary to-med-secondary-hover flex items-center justify-center shadow-lg">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-fraunces text-[26px] font-medium">Para el equipo médico</h3>
                    <p className="text-[15px] text-med-ink-soft">Todo el registro clínico, en un solo flujo simple.</p>
                  </div>
                </div>
                <div className="space-y-5">
                  <div className="group bg-white border border-med-line rounded-[20px] p-7 transition-all duration-300 relative overflow-hidden hover:shadow-[0_20px_50px_-20px_rgba(14,46,41,.3)] hover:border-med-secondary/30 hover:-translate-y-1">
                    <div className="absolute inset-0 bg-gradient-to-br from-med-secondary/0 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="flex items-start gap-5 relative z-1">
                      <div className="w-[52px] h-[52px] rounded-[14px] bg-gradient-to-br from-med-secondary to-med-secondary-hover grid place-items-center text-white flex-shrink-0 shadow-lg">
                        <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <path d="M14 2v6h6M12 18v-6M9 15h6"/>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-fraunces text-[20px] font-medium mb-2 text-med-ink">Crear registros</h4>
                        <p className="text-[15px] text-med-ink-soft leading-relaxed">Ingresos, consultas y evolución del paciente con campos claros. Un caso nuevo se carga en pocos toques.</p>
                      </div>
                    </div>
                  </div>
                  <div className="group bg-white border border-med-line rounded-[20px] p-7 transition-all duration-300 relative overflow-hidden hover:shadow-[0_20px_50px_-20px_rgba(14,46,41,.3)] hover:border-med-secondary/30 hover:-translate-y-1">
                    <div className="absolute inset-0 bg-gradient-to-br from-med-secondary/0 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="flex items-start gap-5 relative z-1">
                      <div className="w-[52px] h-[52px] rounded-[14px] bg-gradient-to-br from-med-coral to-[#e05a4a] grid place-items-center text-white flex-shrink-0 shadow-lg">
                        <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                          <path d="M12 9v4M12 17h.01"/>
                          <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-fraunces text-[20px] font-medium mb-2 text-med-ink">Alergias y alertas</h4>
                        <p className="text-[15px] text-med-ink-soft leading-relaxed">Marcá alergias y contraindicaciones que saltan visibles para cualquier médico antes de medicar.</p>
                      </div>
                    </div>
                  </div>
                  <div className="group bg-white border border-med-line rounded-[20px] p-7 transition-all duration-300 relative overflow-hidden hover:shadow-[0_20px_50px_-20px_rgba(14,46,41,.3)] hover:border-med-secondary/30 hover:-translate-y-1">
                    <div className="absolute inset-0 bg-gradient-to-br from-med-secondary/0 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="flex items-start gap-5 relative z-1">
                      <div className="w-[52px] h-[52px] rounded-[14px] bg-gradient-to-br from-med-ink to-[#1a3a2e] grid place-items-center text-white flex-shrink-0 shadow-lg">
                        <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                          <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0z"/>
                          <path d="M12 7v5l3 2"/>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-fraunces text-[20px] font-medium mb-2 text-med-ink">Historial completo</h4>
                        <p className="text-[15px] text-med-ink-soft leading-relaxed">Lo que existe hoy y todo lo que venga después, ordenado en una línea de tiempo que no se puede manipular.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Patients Column */}
            <div className="relative">
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-med-secondary/10 rounded-full blur-3xl"></div>
              <div className="relative">
                <div className="mb-8 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-med-coral to-[#e05a4a] flex items-center justify-center shadow-lg">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-fraunces text-[26px] font-medium">Para pacientes</h3>
                    <p className="text-[15px] text-med-ink-soft">Tu historial clínico, siempre a tu alcance.</p>
                  </div>
                </div>
                <div className="space-y-5">
                  <div className="group bg-white border border-med-line rounded-[20px] p-7 transition-all duration-300 relative overflow-hidden hover:shadow-[0_20px_50px_-20px_rgba(14,46,41,.3)] hover:border-med-secondary/30 hover:-translate-y-1">
                    <div className="absolute inset-0 bg-gradient-to-br from-med-secondary/0 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="flex items-start gap-5 relative z-1">
                      <div className="w-[52px] h-[52px] rounded-[14px] bg-gradient-to-br from-med-secondary to-med-secondary-hover grid place-items-center text-white flex-shrink-0 shadow-lg">
                        <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                          <circle cx="12" cy="7" r="4"/>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-fraunces text-[20px] font-medium mb-2 text-med-ink">Acceso total</h4>
                        <p className="text-[15px] text-med-ink-soft leading-relaxed">Consultá todos tus registros médicos, desde consultas hasta internaciones, en una sola plataforma segura.</p>
                      </div>
                    </div>
                  </div>
                  <div className="group bg-white border border-med-line rounded-[20px] p-7 transition-all duration-300 relative overflow-hidden hover:shadow-[0_20px_50px_-20px_rgba(14,46,41,.3)] hover:border-med-secondary/30 hover:-translate-y-1">
                    <div className="absolute inset-0 bg-gradient-to-br from-med-secondary/0 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="flex items-start gap-5 relative z-1">
                      <div className="w-[52px] h-[52px] rounded-[14px] bg-gradient-to-br from-med-coral to-[#e05a4a] grid place-items-center text-white flex-shrink-0 shadow-lg">
                        <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                          <circle cx="9" cy="7" r="4"/>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-fraunces text-[20px] font-medium mb-2 text-med-ink">Compartir con médicos</h4>
                        <p className="text-[15px] text-med-ink-soft leading-relaxed">Autorizá a profesionales de confianza para que accedan a tu historial cuando te atiendan.</p>
                      </div>
                    </div>
                  </div>
                  <div className="group bg-white border border-med-line rounded-[20px] p-7 transition-all duration-300 relative overflow-hidden hover:shadow-[0_20px_50px_-20px_rgba(14,46,41,.3)] hover:border-med-secondary/30 hover:-translate-y-1">
                    <div className="absolute inset-0 bg-gradient-to-br from-med-secondary/0 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="flex items-start gap-5 relative z-1">
                      <div className="w-[52px] h-[52px] rounded-[14px] bg-gradient-to-br from-med-ink to-[#1a3a2e] grid place-items-center text-white flex-shrink-0 shadow-lg">
                        <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-fraunces text-[20px] font-medium mb-2 text-med-ink">Datos seguros</h4>
                        <p className="text-[15px] text-med-ink-soft leading-relaxed">Tu información está protegida con respaldo verificable. Solo vos decidís quién puede verla.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-[84px] bg-med-primary-2" id="como" style={{ backgroundImage: "radial-gradient(var(--med-line) 1px,transparent 1px)", backgroundSize: "22px 22px" }}>
        <div className="max-w-[1180px] mx-auto px-7">
          <div className="max-w-[44em] mb-[50px]">
            <div className="text-[12.5px] font-semibold tracking-[0.14em] uppercase text-med-secondary mb-[14px]">Cómo funciona</div>
            <h2 className="font-fraunces text-[clamp(28px,3.6vw,42px)] font-medium leading-[1.04] tracking-[-0.015em]">De la consulta al respaldo verificable en tres pasos.</h2>
          </div>
          <div className="grid grid-cols-3 gap-0 border border-med-line rounded-[20px] overflow-hidden bg-white">
            <div className="p-8 border-r border-med-line relative">
              <div className="font-fraunces text-[14px] text-med-secondary font-semibold border-[1.5px] border-med-secondary w-[34px] h-[34px] rounded-full grid place-items-center mb-[18px]">1</div>
              <h3 className="font-fraunces text-[19px] font-medium mb-2">El médico carga</h3>
              <p className="text-[14px] text-med-ink-soft">Iniciás sesión y registrás el ingreso, las alergias o la evolución del paciente desde la web o el celular.</p>
            </div>
            <div className="p-8 border-r border-med-line relative">
              <div className="font-fraunces text-[14px] text-med-secondary font-semibold border-[1.5px] border-med-secondary w-[34px] h-[34px] rounded-full grid place-items-center mb-[18px]">2</div>
              <h3 className="font-fraunces text-[19px] font-medium mb-2">Arkiv lo guarda</h3>
              <p className="text-[14px] text-med-ink-soft">El registro se escribe en la capa de datos de Arkiv: firmado, fechado y consultable, sin un servidor central que pueda caerse.</p>
            </div>
            <div className="p-8 relative">
              <div className="font-fraunces text-[14px] text-med-secondary font-semibold border-[1.5px] border-med-secondary w-[34px] h-[34px] rounded-full grid place-items-center mb-[18px]">3</div>
              <h3 className="font-fraunces text-[19px] font-medium mb-2">Todos lo ven igual</h3>
              <p className="text-[14px] text-med-ink-soft">El próximo profesional accede al mismo historial verificado, idéntico para todos y a prueba de manipulación.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Arkiv Band Section */}
      <section className="py-[84px]" id="arkiv">
        <div className="max-w-[1180px] mx-auto px-7">
          <div className="bg-med-ink text-med-primary rounded-[26px] p-14 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,.06)_1px,transparent_1px)] bg-[size:26px_26px] pointer-events-none"></div>
            <div className="relative z-1 grid grid-cols-[1.1fr_0.9fr] gap-12 items-center">
              <div>
                <span className="inline-flex items-center gap-2 text-[12px] tracking-[0.1em] uppercase text-med-secondary-hover mb-[18px] font-semibold">
                  <span className="w-[7px] h-[7px] rounded-full bg-med-secondary-hover inline-block"></span>
                  Construido sobre Arkiv
                </span>
                <h2 className="font-fraunces text-[clamp(26px,3vw,36px)] font-medium leading-[1.04] tracking-[-0.015em] text-white">Una historia clínica solo sirve si podés confiar en ella.</h2>
                <p className="text-[rgba(244,241,233,.78)] text-[16.5px] mt-4">Por eso InforMed no usa una base de datos común. Arkiv es una capa de datos descentralizada con la usabilidad de la web tradicional y la confianza de la blockchain: cada dato es verificable, determinístico y siempre disponible.</p>
              </div>
              <div className="flex flex-col gap-3">
                <div className="bg-[rgba(255,255,255,.06)] border border-[rgba(255,255,255,.13)] rounded-[14px] p-4">
                  <b className="flex items-center gap-2 font-fraunces text-[16px] text-white font-medium">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-[17px] h-[17px] text-med-secondary-hover">
                      <path d="M20 6 9 17l-5-5"/>
                    </svg>
                    Verificable y determinístico
                  </b>
                  <span className="text-[13.5px] text-[rgba(244,241,233,.7)] block mt-1 ml-7">La misma consulta siempre da el mismo resultado. Nadie reescribe el pasado.</span>
                </div>
                <div className="bg-[rgba(255,255,255,.06)] border border-[rgba(255,255,255,.13)] rounded-[14px] p-4">
                  <b className="flex items-center gap-2 font-fraunces text-[16px] text-white font-medium">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-[17px] h-[17px] text-med-secondary-hover">
                      <path d="M21 12a9 9 0 1 1-6.2-8.5"/>
                      <path d="M21 4v6h-6"/>
                    </svg>
                    Consultable como una BD
                  </b>
                  <span className="text-[13.5px] text-[rgba(244,241,233,.7)] block mt-1 ml-7">CRUD e índices reales: lo guardás y lo buscás como en cualquier base de datos.</span>
                </div>
                <div className="bg-[rgba(255,255,255,.06)] border border-[rgba(255,255,255,.13)] rounded-[14px] p-4">
                  <b className="flex items-center gap-2 font-fraunces text-[16px] text-white font-medium">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-[17px] h-[17px] text-med-secondary-hover">
                      <path d="M12 2v20M2 12h20"/>
                    </svg>
                    Siempre disponible
                  </b>
                  <span className="text-[13.5px] text-[rgba(244,241,233,.7)] block mt-1 ml-7">Sin un único punto de falla — el historial no desaparece si se cae un servidor.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-med-line py-12 mt-[30px]">
        <div className="max-w-[1180px] mx-auto px-7 flex justify-between items-center flex-wrap gap-4.5">
          <div className="flex items-center gap-3 cursor-pointer font-fraunces text-[19px] font-semibold tracking-[-0.02em]">
            <span className="w-[34px] h-[34px] rounded-[9px] bg-med-ink grid place-items-center flex-shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="#16B886" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <rect x="4" y="3" width="12" height="18" rx="2"/>
                <path d="M10 3V7"/>
                <path d="M8 7H12"/>
                <path d="M8 11H14"/>
                <path d="M8 15H14"/>
                <path d="M8 19H12"/>
                <path d="M16 8C16 6.89543 16.8954 6 18 6C19.1046 6 20 6.89543 20 8V16C20 17.1046 19.1046 18 18 18C16.8954 18 16 17.1046 16 16"/>
                <path d="M16 8V16"/>
                <circle cx="18" cy="12" r="2"/>
              </svg>
            </span>
            InforMed
          </div>
          <small className="text-med-muted text-[13px]">Hackathon Arkiv · Salto, Argentina · 2026 · Hecho por 5</small>
        </div>
      </footer>
    </div>
  );
}

function LoginView({ onLoginSuccess }: { onLoginSuccess?: (role: "doctor" | "patient") => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"doctor" | "patient">("doctor");
  const [error, setError] = useState("");

  const isFormValid = email.includes("@") && password.length >= 4;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.includes("@")) {
      setError("Email inválido");
      return;
    }
    if (password.length < 4) {
      setError("La contraseña debe tener al menos 4 caracteres");
      return;
    }

    if (onLoginSuccess) {
      onLoginSuccess(role);
    }
  };

  return (
    <div className="min-h-[calc(100vh-72px)] grid grid-cols-[1.05fr_1fr]">
      <div className="bg-med-ink text-med-primary p-14 relative overflow-hidden flex flex-col justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,.05)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="relative z-1">
          <div className="flex items-center gap-3 cursor-pointer font-fraunces text-[23px] font-semibold tracking-[-0.02em] text-white">
            <span className="w-[34px] h-[34px] rounded-[9px] bg-[rgba(255,255,255,.1)] grid place-items-center flex-shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="#16B886" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <rect x="4" y="3" width="12" height="18" rx="2"/>
                <path d="M10 3V7"/>
                <path d="M8 7H12"/>
                <path d="M8 11H14"/>
                <path d="M8 15H14"/>
                <path d="M8 19H12"/>
                <path d="M16 8C16 6.89543 16.8954 6 18 6C19.1046 6 20 6.89543 20 8V16C20 17.1046 19.1046 18 18 18C16.8954 18 16 17.1046 16 16"/>
                <path d="M16 8V16"/>
                <circle cx="18" cy="12" r="2"/>
              </svg>
            </span>
            InforMed
          </div>
        </div>
        <div className="relative z-1">
          <h2 className="font-fraunces text-[clamp(30px,3.4vw,44px)] font-medium leading-[1.04] tracking-[-0.015em] text-white max-w-[13em]">
            Tu historial clínico, <em className="font-italic text-med-secondary-hover">verificable</em> y siempre a mano.
          </h2>
          <p className="text-[rgba(244,241,233,.75)] text-[16px] mt-[18px] max-w-[26em]">
            Ingresá como médico o paciente para registrar y consultar historiales clínicos respaldados sobre Arkiv.
          </p>
          <div className="relative z-1 bg-[rgba(255,255,255,.05)] border border-[rgba(255,255,255,.13)] rounded-[16px] p-4.5 mt-2.5 flex items-center gap-3">
            <div className="w-[40px] h-[40px] rounded-[11px] bg-gradient-to-br from-med-ink to-med-secondary text-white grid place-items-center font-fraunces text-[15px] flex-shrink-0">MG</div>
            <div>
              <b className="text-[14px] text-white block">María González</b>
              <span className="text-[12px] text-[rgba(244,241,233,.65)]">Último registro · hoy 14:20</span>
            </div>
            <div className="ml-auto flex items-center gap-1.5 text-[11px] font-semibold text-med-secondary-hover bg-[rgba(22,184,134,.18)] px-2.5 py-1 rounded-[999px]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                <path d="M20 6 9 17l-5-5"/>
              </svg>
              on-chain
            </div>
          </div>
        </div>
        <div className="relative z-1">
          <small className="text-[rgba(244,241,233,.55)] text-[12.5px]">🔒 Conexión cifrada · cada acceso queda registrado de forma auditable.</small>
        </div>
      </div>

      <div className="flex items-center justify-center p-10">
        <div className="w-full max-w-[380px]">
          <div className="text-[12.5px] font-semibold tracking-[0.12em] uppercase text-med-secondary mb-3">Acceso a la plataforma</div>
          <h2 className="font-fraunces text-[30px] font-medium mb-1.5">Bienvenido a InforMed</h2>
          <p className="text-med-ink-soft text-[14.5px] mb-7">Ingresá como médico o paciente para acceder a tu historial clínico.</p>

          <div className="flex gap-2 mb-5">
            <button
              type="button"
              onClick={() => setRole("doctor")}
              className={`flex-1 px-3 py-2.5 border border-med-line-strong rounded-[12px] font-hanken text-[13.5px] font-semibold cursor-pointer transition-[0.15s] flex items-center justify-center gap-1.5 ${
                role === "doctor" ? "border-med-secondary bg-med-secondary-soft text-med-ink" : "bg-white text-med-muted"
              }`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path d="M19 14c1.5-1.5 2-3.5 2-5a9 9 0 1 0-18 0c0 1.5.5 3.5 2 5"/>
                <circle cx="12" cy="13" r="3"/>
              </svg>
              Médico/a
            </button>
            <button
              type="button"
              onClick={() => setRole("patient")}
              className={`flex-1 px-3 py-2.5 border border-med-line-strong rounded-[12px] font-hanken text-[13.5px] font-semibold cursor-pointer transition-[0.15s] flex items-center justify-center gap-1.5 ${
                role === "patient" ? "border-med-secondary bg-med-secondary-soft text-med-ink" : "bg-white text-med-muted"
              }`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              </svg>
              Paciente
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[13px] font-semibold mb-1.5 text-med-ink-soft">Correo o matrícula</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-med-line-strong rounded-[12px] bg-white font-hanken text-[14.5px] text-med-ink transition-[0.15s] focus:outline-none focus:border-med-secondary focus:shadow-[0_0_0_4px_rgba(14,140,107,.13)]"
                placeholder="dr.perez@hospital.gov.ar"
                required
              />
            </div>
            <div>
              <label className="block text-[13px] font-semibold mb-1.5 text-med-ink-soft">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-med-line-strong rounded-[12px] bg-white font-hanken text-[14.5px] text-med-ink transition-[0.15s] focus:outline-none focus:border-med-secondary focus:shadow-[0_0_0_4px_rgba(14,140,107,.13)]"
                placeholder="••••••••••"
                required
              />
              <div className="text-[11.5px] text-med-muted mt-1">Mínimo 8 caracteres.</div>
            </div>

            <div className="flex justify-between items-center mt-2 mb-5 text-[13px]">
              <label className="flex items-center gap-1.5 text-med-ink-soft cursor-pointer">
                <input type="password" className="accent-med-secondary" /> Mantener sesión
              </label>
              <a href="#" className="text-med-secondary font-semibold">¿Olvidaste tu clave?</a>
            </div>

            <button
              type="submit"
              className={`w-full py-3.5 px-5.5 text-[15px] font-semibold rounded-[999px] transition-all focus:outline-none focus:ring-2 focus:ring-med-secondary focus:ring-offset-2 flex items-center justify-center gap-2 ${
                isFormValid
                  ? "bg-med-secondary text-white shadow-[0_8px_22px_-10px_var(--med-secondary)] hover:translate-y-[-2px] hover:shadow-[0_14px_28px_-10px_var(--med-secondary)]"
                  : "bg-med-secondary/50 cursor-not-allowed"
              }`}
            >
              Ingresar
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6"/>
              </svg>
            </button>

            <div className="flex items-center gap-3.5 my-6 text-med-muted text-[12.5px]">
              <div className="flex-1 h-px bg-med-line"></div>
              o
              <div className="flex-1 h-px bg-med-line"></div>
            </div>

            <button
              type="button"
              className="w-full py-3 px-5 bg-white border border-med-line-strong text-med-ink text-[14px] font-semibold rounded-[12px] flex items-center justify-center gap-2.5 cursor-pointer hover:bg-med-primary-2"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] text-med-secondary">
                <rect x="2" y="7" width="20" height="14" rx="2"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
              Acceder con billetera / Arkiv ID
            </button>

            <div className="text-center mt-5.5 text-[13.5px] text-med-ink-soft">
              ¿No tenés cuenta todavía? <a href="#" className="text-med-secondary font-semibold">Solicitar acceso</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
