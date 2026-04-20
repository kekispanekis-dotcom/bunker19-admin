"use client";

import { useMemo, useState } from "react";
import { CalendarDays } from "lucide-react";

type AvailableBay = {
  code: "B1" | "B2" | "B3" | "B4" | "B19";
  name: string;
  type: "standard" | "vip";
  capacity: number;
  price: number;
};

const timeSlots = [
  "10:00","11:00","12:00","13:00","14:00","15:00",
  "16:00","17:00","18:00","19:00","20:00","21:00","22:00"
];

export default function ReservePage() {
  const [date, setDate] = useState(() => {
    const now = new Date();
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
  });
  const [startTime, setStartTime] = useState("18:00");
  const [durationHours, setDurationHours] = useState("2");
  const [guestCount, setGuestCount] = useState("4");

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [availableBays, setAvailableBays] = useState<AvailableBay[]>([]);
  const [selectedBay, setSelectedBay] = useState<AvailableBay | null>(null);

  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [createdReservation, setCreatedReservation] = useState<null | {
    code: string;
    totalAmount: number;
    bay: string;
    customer: string;
    status: string;
  }>(null);

  const totalPreview = useMemo(() => {
    if (!selectedBay) return 0;
    return selectedBay.price * Number(durationHours || 0);
  }, [selectedBay, durationHours]);

  async function checkAvailability() {
    setMessage("");
    setCreatedReservation(null);
    setSelectedBay(null);

    const res = await fetch("/api/public/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date,
        startTime,
        durationHours: Number(durationHours),
        guestCount: Number(guestCount),
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      setMessage(result.error || "No se pudo consultar disponibilidad.");
      setAvailableBays([]);
      return;
    }

    setAvailableBays(result.bays || []);

    if (result.bays?.length) {
      setMessage(`Se encontraron ${result.bays.length} bahía(s) disponibles.`);
    } else {
      setMessage("No hay bahías disponibles para ese horario.");
    }
  }

  async function createReservation() {
    if (!selectedBay) {
      alert("Selecciona una bahía.");
      return;
    }

    if (!fullName.trim()) {
      alert("Escribe el nombre del cliente.");
      return;
    }

    setSaving(true);
    setMessage("");

    const res = await fetch("/api/public/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName,
        phone,
        email,
        bayId:
          selectedBay.code === "B1" ? 1 :
          selectedBay.code === "B2" ? 2 :
          selectedBay.code === "B3" ? 3 :
          selectedBay.code === "B4" ? 4 : 5,
        date,
        startTime,
        durationHours: Number(durationHours),
        guestCount: Number(guestCount),
        totalAmount: selectedBay.price * Number(durationHours),
      }),
    });

    const result = await res.json();
    setSaving(false);

    if (!res.ok) {
      alert(result.error || "No se pudo crear la reservación.");
      setMessage(result.error || "No se pudo crear la reservación.");
      return;
    }

    setCreatedReservation({
      code: result.reservation.code,
      totalAmount: result.reservation.totalAmount,
      bay: result.reservation.bay,
      customer: result.reservation.customer,
      status: result.reservation.status,
    });

    setMessage("Reservación guardada correctamente.");
    setSelectedBay(null);
    await checkAvailability();
    setFullName("");
    setPhone("");
    setEmail("");
  }

  return (
    <main className="bunker-page">
      <section className="bunker-hero p-8 md:p-10">
        <div className="bunker-pill bg-white/10 text-white">
          Bunker 19 · Reservaciones
        </div>
        <h1 className="mt-5 text-4xl font-black tracking-tight md:text-5xl">
          Reserva tu bahía
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-white/85 md:text-base">
          Un flujo más limpio, más claro y más agradable para cerrar reservas.
        </p>
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <section className="bunker-card p-6">
            <h2 className="text-2xl font-black text-[#1f5c3f]">Datos del cliente</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nombre completo"
                className="bunker-input"
              />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Teléfono"
                className="bunker-input"
              />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Correo"
                className="bunker-input"
              />
            </div>
          </section>

          <section className="bunker-card p-6">
            <h2 className="text-2xl font-black text-[#1f5c3f]">Datos de la reserva</h2>

            <div className="mt-4 grid gap-4 md:grid-cols-4">
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bunker-input pr-12"
                />
                <CalendarDays className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#1f5c3f]" />
              </div>

              <select
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="bunker-input"
              >
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>

              <select
                value={durationHours}
                onChange={(e) => setDurationHours(e.target.value)}
                className="bunker-input"
              >
                <option value="1">1 hora</option>
                <option value="2">2 horas</option>
                <option value="3">3 horas</option>
                <option value="4">4 horas</option>
              </select>

              <select
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value)}
                className="bunker-input"
              >
                {["2", "3", "4", "5", "6", "8", "10"].map((qty) => (
                  <option key={qty} value={qty}>{qty} personas</option>
                ))}
              </select>
            </div>

            <button onClick={checkAvailability} className="bunker-button-primary mt-5">
              Ver disponibilidad
            </button>
          </section>

          {message ? (
            <div className="bunker-card p-4 text-sm bunker-muted">
              {message}
            </div>
          ) : null}

          <section className="space-y-4">
            {availableBays.map((bay) => {
              const isSelected = selectedBay?.code === bay.code;

              return (
                <button
                  key={bay.code}
                  type="button"
                  onClick={() => setSelectedBay(bay)}
                  className={`w-full rounded-[24px] border p-5 text-left transition ${
                    isSelected
                      ? "border-[#1f5c3f] bg-[#eef7eb]"
                      : "border-[rgba(31,92,63,0.10)] bg-white hover:bg-[#f7fbf5]"
                  }`}
                  style={{ boxShadow: "var(--bunker-shadow)" }}
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="text-2xl font-black tracking-tight text-[#1f5c3f]">{bay.code}</div>
                      <div className="text-sm bunker-muted">{bay.name}</div>
                      <div className="mt-2 text-sm text-[#617264]">
                        {bay.type} · {bay.capacity} personas
                      </div>
                    </div>

                    <div className="text-left md:text-right">
                      <div className="text-2xl font-black text-[#152018]">${bay.price}</div>
                      <div className="text-sm text-[#617264]">por hora</div>
                      {isSelected ? (
                        <div className="mt-2 text-xs font-bold uppercase tracking-wide text-[#1f5c3f]">
                          Seleccionada
                        </div>
                      ) : null}
                    </div>
                  </div>
                </button>
              );
            })}
          </section>
        </div>

        <aside className="space-y-6">
          <section className="bunker-card-strong sticky top-24 p-6">
            <h2 className="text-2xl font-black text-[#1f5c3f]">Resumen</h2>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="bunker-muted">Cliente</span>
                <span className="font-semibold">{fullName || "--"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="bunker-muted">Fecha</span>
                <span className="font-semibold">{date}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="bunker-muted">Hora</span>
                <span className="font-semibold">{startTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="bunker-muted">Duración</span>
                <span className="font-semibold">{durationHours} h</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="bunker-muted">Personas</span>
                <span className="font-semibold">{guestCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="bunker-muted">Bahía</span>
                <span className="font-semibold">{selectedBay?.code || "--"}</span>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-[#eef7eb] p-4">
              <div className="text-sm bunker-muted">Total estimado</div>
              <div className="mt-1 text-3xl font-black text-[#1f5c3f]">${totalPreview}</div>
            </div>

            <button
              onClick={createReservation}
              disabled={!selectedBay || saving}
              className="bunker-button-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-40"
            >
              {saving ? "Guardando..." : "Confirmar reservación"}
            </button>
          </section>

          {createdReservation ? (
            <section className="bunker-card p-6">
              <div className="text-xs font-bold uppercase tracking-[0.25em] text-[#1f5c3f]">
                Reservación creada
              </div>
              <div className="mt-3 text-2xl font-black text-[#1f5c3f]">
                {createdReservation.code}
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="bunker-muted">Cliente</span>
                  <span className="font-semibold">{createdReservation.customer}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="bunker-muted">Bahía</span>
                  <span className="font-semibold">{createdReservation.bay}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="bunker-muted">Estatus</span>
                  <span className="font-semibold">{createdReservation.status}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="bunker-muted">Total</span>
                  <span className="font-semibold">${createdReservation.totalAmount}</span>
                </div>
              </div>
            </section>
          ) : null}
        </aside>
      </div>
    </main>
  );
}