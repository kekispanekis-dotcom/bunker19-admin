"use client";

import { useEffect, useState } from "react";

type BayStatus = {
  bayCode: string;
  bayName: string;
  isOccupied: boolean;
  current: null | {
    code: string;
    customer: string;
    startTime: string;
    durationHours: number;
    endTimeMinutes: number;
  };
  next: null | {
    code: string;
    customer: string;
    startTime: string;
    durationHours: number;
  };
};

function getLocalDate() {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function getLocalTime() {
  const now = new Date();
  return now.toTimeString().slice(0, 5);
}

function formatClock() {
  return new Date().toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function TvClient() {
  const [bays, setBays] = useState<BayStatus[]>([]);
  const [clock, setClock] = useState(formatClock());
  const [loading, setLoading] = useState(true);

  async function loadTv() {
    const date = getLocalDate();
    const time = getLocalTime();

    const res = await fetch(
      `/api/admin/live-tv?date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}`,
      { cache: "no-store" }
    );

    const result = await res.json();

    if (res.ok) {
      setBays(result.bayStatus || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadTv();

    const interval = setInterval(() => {
      setClock(formatClock());
      loadTv();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const occupiedCount = bays.filter((bay) => bay.isOccupied).length;
  const freeCount = bays.length - occupiedCount;

  return (
    <main className="min-h-screen bg-[#07150d] p-8 text-white">
      <header className="flex items-center justify-between">
        <div>
          <div className="text-sm font-black uppercase tracking-[0.35em] text-[#38a45b]">
            Bunker 19 Live
          </div>
          <h1 className="mt-2 text-5xl font-black uppercase">
            Estado de bahías
          </h1>
        </div>

        <div className="text-right">
          <div className="text-6xl font-black">{clock}</div>
          <div className="mt-2 text-sm font-black uppercase tracking-[0.25em] text-white/50">
            Pantalla recepción
          </div>
        </div>
      </header>

      <section className="mt-8 grid gap-5 md:grid-cols-3">
        <div className="rounded-[28px] bg-white/10 p-6">
          <div className="text-sm uppercase tracking-[0.25em] text-white/50">
            Total
          </div>
          <div className="mt-2 text-5xl font-black">{bays.length}</div>
        </div>

        <div className="rounded-[28px] bg-[#17833d] p-6">
          <div className="text-sm uppercase tracking-[0.25em] text-white/70">
            Libres
          </div>
          <div className="mt-2 text-5xl font-black">{freeCount}</div>
        </div>

        <div className="rounded-[28px] bg-[#d92d20] p-6">
          <div className="text-sm uppercase tracking-[0.25em] text-white/70">
            Ocupadas
          </div>
          <div className="mt-2 text-5xl font-black">{occupiedCount}</div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-5">
        {loading ? (
          <div className="col-span-full rounded-[32px] bg-white/10 p-10 text-center text-2xl font-black">
            Cargando...
          </div>
        ) : (
          bays.map((bay) => (
            <div
              key={bay.bayCode}
              className={`min-h-[420px] rounded-[34px] border p-6 shadow-2xl ${
                bay.isOccupied
                  ? "border-red-400/30 bg-red-500/20"
                  : "border-[#38a45b]/30 bg-[#17833d]/25"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="text-5xl font-black">{bay.bayCode}</div>

                <div
                  className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.18em] ${
                    bay.isOccupied
                      ? "bg-red-500 text-white"
                      : "bg-[#38a45b] text-white"
                  }`}
                >
                  {bay.isOccupied ? "Ocupada" : "Libre"}
                </div>
              </div>

              <div className="mt-2 text-lg font-bold text-white/70">
                {bay.bayName}
              </div>

              <div className="mt-8 rounded-[26px] bg-black/25 p-5">
                <div className="text-xs font-black uppercase tracking-[0.25em] text-white/45">
                  Ahora
                </div>

                {bay.current ? (
                  <>
                    <div className="mt-4 text-3xl font-black">
                      {bay.current.customer}
                    </div>
                    <div className="mt-2 text-white/65">
                      {bay.current.startTime} · {bay.current.durationHours} h
                    </div>
                    <div className="mt-2 text-xs font-bold uppercase tracking-wide text-white/45">
                      {bay.current.code}
                    </div>
                  </>
                ) : (
                  <div className="mt-4 text-3xl font-black text-[#38a45b]">
                    Disponible
                  </div>
                )}
              </div>

              <div className="mt-5 rounded-[26px] bg-white/10 p-5">
                <div className="text-xs font-black uppercase tracking-[0.25em] text-white/45">
                  Próxima reserva
                </div>

                {bay.next ? (
                  <>
                    <div className="mt-4 text-2xl font-black">
                      {bay.next.customer}
                    </div>
                    <div className="mt-2 text-white/65">
                      {bay.next.startTime} · {bay.next.durationHours} h
                    </div>
                  </>
                ) : (
                  <div className="mt-4 text-xl font-black text-white/50">
                    Sin próximas reservas
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </section>
    </main>
  );
}