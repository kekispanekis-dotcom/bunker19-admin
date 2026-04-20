"use client";

import { useState } from "react";

type AvailableBay = {
  code: "B1" | "B2" | "B3" | "B4" | "B19";
  name: string;
  type: "standard" | "vip";
  capacity: number;
  price: number;
};

const timeSlots = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"];

export default function ReservePage() {
  const [date, setDate] = useState("2026-04-18");
  const [startTime, setStartTime] = useState("18:00");
  const [durationHours, setDurationHours] = useState("2");
  const [guestCount, setGuestCount] = useState("4");
  const [availableBays, setAvailableBays] = useState<AvailableBay[]>([]);
  const [message, setMessage] = useState("");

  async function checkAvailability() {
    setMessage("");

    const response = await fetch("/api/public/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date,
        startTime,
        durationHours: Number(durationHours),
        guestCount: Number(guestCount),
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      setMessage(result.error || "No se pudo validar disponibilidad.");
      return;
    }

    setAvailableBays(result.bays || []);
    setMessage(
      result.bays?.length
        ? `Hay ${result.bays.length} bahía(s) disponibles.`
        : "No hay bahías disponibles en ese horario."
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h1 className="text-3xl font-semibold">Reservar bahía</h1>
          <p className="mt-2 text-zinc-400">Primer preview real de disponibilidad.</p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white"
            />

            <select
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white"
            >
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>

            <select
              value={durationHours}
              onChange={(e) => setDurationHours(e.target.value)}
              className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white"
            >
              <option value="1">1 hora</option>
              <option value="2">2 horas</option>
              <option value="3">3 horas</option>
              <option value="4">4 horas</option>
            </select>

            <select
              value={guestCount}
              onChange={(e) => setGuestCount(e.target.value)}
              className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white"
            >
              {["2", "3", "4", "5", "6", "8", "10"].map((qty) => (
                <option key={qty} value={qty}>
                  {qty} personas
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={checkAvailability}
            className="mt-4 rounded-2xl bg-emerald-500 px-5 py-3 font-medium text-black hover:bg-emerald-400"
          >
            Ver disponibilidad
          </button>

          {message ? (
            <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-3 text-sm text-zinc-200">
              {message}
            </div>
          ) : null}
        </div>

        <div className="grid gap-4">
          {availableBays.map((bay) => (
            <div key={bay.code} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-semibold text-white">{bay.name}</div>
                  <div className="text-sm text-zinc-400">
                    Tipo: {bay.type} · Capacidad: {bay.capacity}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-white">${bay.price}</div>
                  <div className="text-sm text-zinc-500">por hora</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}