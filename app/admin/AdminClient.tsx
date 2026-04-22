"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

type Entry = {
  id: number;
  code: string;
  customer: string;
  startTime: string;
  durationHours: number;
  status: string;
  paymentStatus: string;
  totalAmount: number;
};

type BayRow = {
  bayCode: string;
  bayName: string;
  entries: Entry[];
};

const HOURS = [
  "10:00","11:00","12:00","13:00","14:00","15:00",
  "16:00","17:00","18:00","19:00","20:00","21:00","22:00",
];

function toMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function startOffset(time: string) {
  return (toMinutes(time) - toMinutes("10:00")) / 60;
}

function statusClass(status: string) {
  switch (status) {
    case "confirmed":
      return "border-[#1f5c3f]/25 bg-[#eaf6e8] text-[#1f5c3f]";
    case "paid":
      return "border-lime-400/30 bg-lime-50 text-lime-700";
    case "cancelled":
      return "border-red-300 bg-red-50 text-red-700";
    case "no_show":
      return "border-amber-300 bg-amber-50 text-amber-700";
    default:
      return "border-gray-200 bg-white text-gray-700";
  }
}

function paymentClass(status: string) {
  switch (status) {
    case "paid":
      return "text-lime-700";
    case "unpaid":
      return "text-gray-500";
    default:
      return "text-gray-700";
  }
}

export default function AdminClient() {
  const router = useRouter();

  const [date, setDate] = useState(() => {
    const now = new Date();
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
  });

  const [schedule, setSchedule] = useState<BayRow[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login?reason=expired";
  }

  async function fetchSchedule() {
    setLoading(true);
    const res = await fetch(`/api/admin/schedule/daily?date=${date}`);
    const data = await res.json();
    setSchedule(data.schedule || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchSchedule();
  }, []);

  return (
    <main className="p-6">
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#1f5c3f]">
            Agenda
          </h1>
        </div>

        <div className="flex gap-3">
          <div className="relative">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border px-3 py-2 rounded-xl"
            />
            <CalendarDays className="absolute right-2 top-2 h-4 w-4" />
          </div>

          <button
            onClick={fetchSchedule}
            className="bg-[#1f5c3f] text-white px-4 py-2 rounded-xl"
          >
            Actualizar
          </button>

          <button
            onClick={handleLogout}
            className="border px-4 py-2 rounded-xl"
          >
            Logout
          </button>
        </div>
      </div>

      {/* GRID */}
      <div className="overflow-x-auto">
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: `120px repeat(${schedule.length}, 240px)`
          }}
        >
          {/* HEADER */}
          <div>Hora</div>
          {schedule.map((bay) => (
            <div key={bay.bayCode} className="font-bold">
              {bay.bayCode}
            </div>
          ))}

          {/* HOURS */}
          <div>
            {HOURS.map((h) => (
              <div key={h} className="h-24 border-b text-sm">
                {h}
              </div>
            ))}
          </div>

          {/* BAYS */}
          {schedule.map((bay) => (
            <div key={bay.bayCode} className="relative">
              {bay.entries.map((entry) => {
                const top = startOffset(entry.startTime) * 96;
                const height = entry.durationHours * 96;

                return (
                  <div
                    key={entry.id}
                    className={`absolute left-2 right-2 overflow-y-auto rounded-xl border p-2 ${statusClass(entry.status)}`}
                    style={{ top, height }}
                  >
                    <div className="text-xs font-bold truncate">
                      {entry.customer}
                    </div>

                    <div className="text-[10px] opacity-70">
                      {entry.code}
                    </div>

                    <div className="text-[10px] mt-1">
                      {entry.startTime} · {entry.durationHours}h
                    </div>

                    <div className="text-[10px] mt-1">
                      ${entry.totalAmount}
                    </div>

                    <div className="mt-2 flex flex-wrap gap-1">
                      <button className="text-[10px] bg-white px-2 py-1 rounded">
                        Editar
                      </button>
                      <button className="text-[10px] bg-green-600 text-white px-2 py-1 rounded">
                        Check
                      </button>
                      <button className="text-[10px] bg-yellow-500 text-white px-2 py-1 rounded">
                        No-show
                      </button>
                      <button className="text-[10px] bg-red-500 text-white px-2 py-1 rounded">
                        Cancelar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}