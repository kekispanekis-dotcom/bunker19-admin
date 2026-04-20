import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

function toMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function addHours(time: string, hoursToAdd: number): string {
  const totalMinutes = toMinutes(time) + hoursToAdd * 60;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function rangesOverlap(startA: string, endA: string, startB: string, endB: string): boolean {
  return toMinutes(startA) < toMinutes(endB) && toMinutes(startB) < toMinutes(endA);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const date = new Date(body.date + "T00:00:00");
    const startTime = String(body.startTime);
    const durationHours = Number(body.durationHours);
    const guestCount = Number(body.guestCount);
    const requestedEnd = addHours(startTime, durationHours);

    const bays = await prisma.bay.findMany({
      where: {
        isActive: true,
        capacity: { gte: guestCount },
      },
      orderBy: { displayOrder: "asc" },
    });

    const activeReservations = await prisma.reservation.findMany({
      where: {
        reservationDate: date,
        reservationStatus: { in: ["pending", "confirmed", "paid"] },
      },
    });

    const availableBays = bays.filter((bay) => {
      const reservationConflict = activeReservations.some((reservation) => {
        if (reservation.bayId !== bay.id) return false;
        const reservationEnd = addHours(reservation.startTime, reservation.durationHours);
        return rangesOverlap(startTime, requestedEnd, reservation.startTime, reservationEnd);
      });

      return !reservationConflict;
    });

    return NextResponse.json({
      available: availableBays.length > 0,
      bays: availableBays.map((bay) => ({
        code: bay.code,
        name: bay.name,
        type: bay.bayType,
        capacity: bay.capacity,
        price: Number(bay.basePrice),
      })),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "No se pudo validar disponibilidad." },
      { status: 400 },
    );
  }
}