"use client";

import { useState } from "react";
import { Lock, ShieldCheck, ArrowRight } from "lucide-react";

export default function AdminLoginClient({
  reason,
}: {
  reason?: string;
}) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "Password incorrecto");
        setLoading(false);
        return;
      }

      window.location.href = "/admin";
    } catch {
      setError("No se pudo iniciar sesión.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(124,194,107,0.20),transparent_25%),linear-gradient(180deg,#f8faf6_0%,#eef4eb_100%)] px-4 py-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="hidden lg:block">
          <div className="rounded-[32px] border border-[rgba(31,92,63,0.10)] bg-[linear-gradient(135deg,rgba(31,92,63,0.96),rgba(22,63,44,0.92))] p-10 text-white shadow-[0_20px_60px_rgba(21,32,24,0.18)]">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-white/90">
              <ShieldCheck className="h-4 w-4" />
              Bunker 19 · Admin
            </div>

            <h1 className="mt-6 text-5xl font-black tracking-tight">
              Acceso seguro al panel operativo
            </h1>

            <p className="mt-4 max-w-xl text-base text-white/80">
              Controla agenda, reservas, estatus, cambios de bahía y operación
              diaria desde un acceso privado para el equipo de Bunker 19.
            </p>

            <div className="mt-10 grid gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <div className="text-sm font-bold text-white">Agenda visual</div>
                <div className="mt-1 text-sm text-white/75">
                  Consulta el timeline por bahía y hora.
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <div className="text-sm font-bold text-white">Operación diaria</div>
                <div className="mt-1 text-sm text-white/75">
                  Check-in, no-show, cancelaciones y edición de reservas.
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <div className="text-sm font-bold text-white">Acceso protegido</div>
                <div className="mt-1 text-sm text-white/75">
                  Solo personal autorizado puede entrar al panel.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="rounded-[32px] border border-[rgba(31,92,63,0.10)] bg-[rgba(255,255,255,0.88)] p-6 shadow-[0_20px_60px_rgba(21,32,24,0.12)] backdrop-blur-xl md:p-8">
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(31,92,63,0.10)] bg-[#eef7eb] px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-[#1f5c3f]">
                <ShieldCheck className="h-4 w-4" />
                Acceso admin
              </div>

              <h2 className="mt-5 text-3xl font-black tracking-tight text-[#1f2a21] md:text-4xl">
                Iniciar sesión
              </h2>

              <p className="mt-2 text-sm text-[#617264] md:text-base">
                Ingresa la contraseña para entrar al panel administrativo.
              </p>
            </div>

            {reason === "expired" ? (
              <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
                Tu sesión expiró. Vuelve a iniciar sesión.
              </div>
            ) : null}

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#3e5044]">
                  Contraseña
                </label>

                <div className="relative">
                  <input
                    type="password"
                    placeholder="Escribe tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl border border-[rgba(31,92,63,0.14)] bg-white px-4 py-3 pl-12 text-[#1f2a21] outline-none transition focus:border-[rgba(31,92,63,0.45)] focus:shadow-[0_0_0_4px_rgba(31,92,63,0.08)]"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleLogin();
                      }
                    }}
                  />
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#1f5c3f]" />
                </div>
              </div>

              <button
                onClick={handleLogin}
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#1f5c3f,#2d7a54)] px-5 py-3 font-bold text-white shadow-[0_10px_24px_rgba(31,92,63,0.18)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Entrando..." : "Entrar al admin"}
                <ArrowRight className="h-4 w-4" />
              </button>

              {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {error}
                </div>
              ) : null}
            </div>

            <div className="mt-6 border-t border-[rgba(31,92,63,0.08)] pt-5 text-xs text-[#7a897f]">
              Bunker 19 Social Club · Panel interno de operación
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}