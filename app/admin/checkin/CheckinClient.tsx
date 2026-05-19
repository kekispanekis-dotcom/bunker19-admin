"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { useSearchParams } from "next/navigation";

type Reservation = {
  id: number;
  code: string;
  customer: string;
  phone: string;
  email: string;
  bay: string;
  bayName: string;
  date: string;
  startTime: string;
  durationHours: number;
  guestCount: number;
  reservationStatus: string;
  paymentStatus: string;
  totalAmount: number;
};

export default function CheckinClient() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);
  const [message, setMessage] = useState("");

  async function loadReservation() {
    if (!code) {
      setMessage("No se encontró código de reserva.");
      setLoading(false);
      return;
    }

    const res = await fetch(`/api/admin/checkin?code=${encodeURIComponent(code)}`, {
      cache: "no-store",
    });

    const result = await res.json();

    if (!res.ok) {
      setMessage(result.error || "No se pudo cargar la reserva.");
      setLoading(false);
      return;
    }

    setReservation(result.reservation);
    setLoading(false);
  }

  async function doCheckin() {
    if (!code) return;

    setCheckingIn(true);

    const res = await fetch("/api/admin/checkin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });

    const result = await res.json();

    setCheckingIn(false);

    if (!res.ok) {
      setMessage(result.error || "No se pudo hacer check-in.");
      return;
    }

    setMessage("Check-in realizado correctamente.");
    await loadReservation();
  }

  useEffect(() => {
    loadReservation();
  }, []);

  return (
    <main className="min-h-screen bg-[#f4f4ef] px-6 py-10 text-[#102318]">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-[32px] bg-[#07150d] p-8 text-white shadow-2xl">
          <div className="text-xs font-black uppercase tracking-[0.3em] text-[#38a45b]">
            Bunker 19 · Check-in
          </div>

          <h1 className="mt-4 text-5xl font-black uppercase">
            Validar reserva
          </h1>

          <p className="mt-3 text-white/70">
            Escaneo de QR para hostess / recepción.
          </p>
        </div>

        <section className="mt-6 rounded-[32px] bg-white p-8 shadow-xl">
          {loading ? (
            <div className="text-xl font-black text-[#1f5c3f]">
              Cargando reserva...
            </div>
          ) : reservation ? (
            <>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.25em] text-[#728076]">
                    Código
                  </div>

                  <div className="mt-2 text-4xl font-black text-[#1f5c3f]">
                    {reservation.code}
                  </div>
                </div>

                <div className="rounded-full bg-[#eaf6e8] px-4 py-2 text-xs font-black uppercase text-[#1f5c3f]">
                  {reservation.reservationStatus}
                </div>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <Info label="Cliente" value={reservation.customer} />
                <Info label="Teléfono" value={reservation.phone || "--"} />
                <Info label="Bahía" value={`${reservation.bay} · ${reservation.bayName}`} />
                <Info label="Hora" value={`${reservation.startTime} · ${reservation.durationHours} h`} />
                <Info label="Personas" value={`${reservation.guestCount}`} />
                <Info label="Pago" value={reservation.paymentStatus} />
                <Info label="Total" value={`$${reservation.totalAmount}`} />
              </div>

              <button
                onClick={doCheckin}
                disabled={checkingIn || reservation.reservationStatus === "confirmed"}
                className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#1f5c3f] px-7 py-5 text-sm font-black uppercase tracking-[0.18em] text-white shadow-xl transition hover:scale-[1.02] hover:bg-[#28764f] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <CheckCircle2 className="h-5 w-5" />
                {checkingIn
                  ? "Validando..."
                  : reservation.reservationStatus === "checked_in"
                  ? "Check-in ya realizado"
                  : "Hacer check-in"}
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3 rounded-2xl bg-red-50 p-5 text-red-700">
              <AlertTriangle className="h-6 w-6" />
              <div className="font-bold">{message}</div>
            </div>
          )}

          {message && reservation ? (
            <div className="mt-5 rounded-2xl bg-[#eaf6e8] p-4 text-sm font-bold text-[#1f5c3f]">
              {message}
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#f4f4ef] p-5">
      <div className="text-xs font-black uppercase tracking-[0.2em] text-[#728076]">
        {label}
      </div>

      <div className="mt-2 text-xl font-black text-[#102318]">
        {value}
      </div>
    </div>
  );
}