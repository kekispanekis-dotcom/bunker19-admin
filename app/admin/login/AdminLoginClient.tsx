"use client";

import { useState } from "react";
import Image from "next/image";
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

        {/* LADO IZQUIERDO */}
        <section className="hidden lg:block">
          <div className="rounded-[32px] border border-[rgba(31,92,63,0.10)] bg-[linear-gradient(135deg,rgba(31,92,63,0.96),rgba(22,63,44,0.92))] p-10 text-white shadow-[0_20px_60px_rgba(21,32,24,0.18)]">

            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-white/90">
              <ShieldCheck className="h-4 w-4" />
              Bunker 19 · Admin
            </div>

            <div className="mt-8 flex items-center gap-4">
              <div className="relative h-20 w-48 overflow-hidden rounded-2xl border border-white/10 bg-white/95 shadow-[0_10px_24px_rgba(0,0,0,0.10)]">
                <Image
                  src="/logo-bunker19.png"
                  alt="Bunker 19"
                  fill
                  sizes="192px"
                  className="object-contain p-3"
                  priority
                />
              </div>
            </div>

            <h1 className="mt-8 text-5xl font-black tracking-tight">
              Acceso seguro al panel operativo
            </h1>

            <p className="mt-4 max-w-xl text-base text-white/80">
              Controla agenda, reservas, estatus y operación diaria.
            </p>

          </div>
        </section>

        {/* LOGIN */}
        <section>
          <div className="rounded-[32px] border border-[rgba(31,92,63,0.10)] bg-[rgba(255,255,255,0.88)] p-6 shadow-[0_20px_60px_rgba(21,32,24,0.12)] backdrop-blur-xl md:p-8">

            <div className="mb-6 text-center">
              <div className="mx-auto mb-5 flex w-full justify-center lg:hidden">
                <div className="relative h-20 w-48 overflow-hidden rounded-2xl border bg-white">
                  <Image
                    src="/logo-bunker19.png"
                    alt="Bunker 19"
                    fill
                    className="object-contain p-3"
                  />
                </div>
              </div>

              <h2 className="text-3xl font-black text-[#1f2a21]">
                Iniciar sesión
              </h2>
            </div>

            {reason === "expired" && (
              <div className="mb-4 text-sm text-amber-600 text-center">
                Tu sesión expiró
              </div>
            )}

            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mb-4 rounded-xl border px-4 py-3"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleLogin();
              }}
            />

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-[#1f5c3f] text-white py-3 rounded-xl font-bold"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>

            {error && (
              <div className="mt-3 text-red-500 text-sm text-center">
                {error}
              </div>
            )}

          </div>
        </section>

      </div>
    </main>
  );
}