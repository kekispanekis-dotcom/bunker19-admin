import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

function toMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const time = searchParams.get("time");

    if (!date || !time) {
      return NextResponse.json(
        { error: "Fecha y hora requeridas." },
        { status: 400 }
      );
    }

    const reservationDate = new Date(date + "T00:00:00");
    const nowMinutes = toMinutes(time);

    const bays = await prisma.bay.findMany({
      orderBy: { displayOrder: "asc" },
    });

    const reservations = await prisma.reservation.findMany({
      where: { reservationDate },
      include: { bay: true, customer: true },
      orderBy: { startTime: "asc" },
    });

    const activeReservations = reservations.filter(
      (r) => r.reservationStatus !== "cancelled"
    );

    const bayStatus = bays.map((bay) => {
      const bayReservations = activeReservations.filter(
        (r) => r.bayId === bay.id
      );

      const current = bayReservations.find((r) => {
        const start = toMinutes(r.startTime);
        const end = start + r.durationHours * 60;
        return nowMinutes >= start && nowMinutes < end;
      });

      const next = bayReservations.find((r) => {
        return toMinutes(r.startTime) > nowMinutes;
      });

      return {
        bayCode: bay.code,
        bayName: bay.name,
        isOccupied: Boolean(current),
        current: current
          ? {
              code: current.reservationCode,
              customer:
                current.customer?.fullName || `Cliente ${current.customerId}`,
              startTime: current.startTime,
              durationHours: current.durationHours,
              endTimeMinutes:
                toMinutes(current.startTime) + current.durationHours * 60,
            }
          : null,
        next: next
          ? {
              code: next.reservationCode,
              customer: next.customer?.fullName || `Cliente ${next.customerId}`,
              startTime: next.startTime,
              durationHours: next.durationHours,
            }
          : null,
      };
    });

    return NextResponse.json({
      date,
      time,
      bayStatus,
    });
  } catch (error) {
    console.error("LIVE TV ERROR:", error);

    return NextResponse.json(
      {
        error: "No se pudo cargar pantalla TV.",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 400 }
    );
  }
}