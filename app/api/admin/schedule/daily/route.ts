import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

type BayItem = {
  id: number;
  code: string;
  name: string;
};

type ReservationItem = {
  id: number;
  reservationCode: string;
  customerId: number;
  bayId: number;
  startTime: string;
  durationHours: number;
  reservationStatus: string;
  paymentStatus: string;
  totalAmount: number;
  customer: {
    fullName: string | null;
  } | null;
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    if (!date) {
      return NextResponse.json(
        { error: "La fecha es obligatoria." },
        { status: 400 }
      );
    }

    const reservationDate = new Date(date + "T00:00:00");

    const bays = (await prisma.bay.findMany({
      orderBy: { displayOrder: "asc" },
    })) as BayItem[];

    const reservations = (await prisma.reservation.findMany({
      where: {
        reservationDate,
      },
      orderBy: {
        startTime: "asc",
      },
      include: {
        customer: true,
      },
    })) as ReservationItem[];

    const schedule = bays.map((bay: BayItem) => ({
      bayCode: bay.code,
      bayName: bay.name,
      entries: reservations
        .filter((reservation: ReservationItem) => reservation.bayId === bay.id)
        .map((reservation: ReservationItem) => ({
          id: reservation.id,
          code: reservation.reservationCode,
          customer:
            reservation.customer?.fullName || `Cliente ${reservation.customerId}`,
          startTime: reservation.startTime,
          durationHours: reservation.durationHours,
          status: reservation.reservationStatus,
          paymentStatus: reservation.paymentStatus,
          totalAmount: reservation.totalAmount,
        })),
    }));

    return NextResponse.json({
      date,
      schedule,
    });
   } catch (error) {
    console.error("ADMIN SCHEDULE ERROR:", error);

    return NextResponse.json(
      {
        error: "No se pudo cargar la agenda.",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 400 }
    );
  }