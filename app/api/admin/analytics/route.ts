import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

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

    const bays = await prisma.bay.findMany({
      orderBy: { displayOrder: "asc" },
    });

    const reservations = await prisma.reservation.findMany({
      where: {
        reservationDate,
      },
      include: {
        bay: true,
        customer: true,
      },
      orderBy: {
        startTime: "asc",
      },
    });

    const activeReservations = reservations.filter(
      (reservation) => reservation.reservationStatus !== "cancelled"
    );

    const totalReservations = activeReservations.length;

    const totalRevenue = activeReservations.reduce(
      (sum, reservation) => sum + Number(reservation.totalAmount),
      0
    );

    const totalReservedHours = activeReservations.reduce(
      (sum, reservation) => sum + Number(reservation.durationHours),
      0
    );

    const operatingHours = 13;
    const totalAvailableHours = bays.length * operatingHours;

    const occupancyRate =
      totalAvailableHours > 0
        ? Math.round((totalReservedHours / totalAvailableHours) * 100)
        : 0;

    const averageTicket =
      totalReservations > 0
        ? Math.round(totalRevenue / totalReservations)
        : 0;

    const bayUsage = bays.map((bay) => {
      const bayReservations = activeReservations.filter(
        (reservation) => reservation.bayId === bay.id
      );

      const hours = bayReservations.reduce(
        (sum, reservation) => sum + Number(reservation.durationHours),
        0
      );

      const revenue = bayReservations.reduce(
        (sum, reservation) => sum + Number(reservation.totalAmount),
        0
      );

      return {
        bayCode: bay.code,
        bayName: bay.name,
        reservations: bayReservations.length,
        hours,
        revenue,
      };
    });

    const topBay =
      [...bayUsage].sort((a, b) => b.hours - a.hours)[0] || null;

    const upcomingReservations = activeReservations.slice(0, 8).map(
      (reservation) => ({
        id: reservation.id,
        code: reservation.reservationCode,
        customer:
          reservation.customer?.fullName ||
          `Cliente ${reservation.customerId}`,
        bay: reservation.bay.code,
        startTime: reservation.startTime,
        durationHours: reservation.durationHours,
        reservationStatus: reservation.reservationStatus,
        paymentStatus: reservation.paymentStatus,
        totalAmount: reservation.totalAmount,
      })
    );

    return NextResponse.json({
      date,
      kpis: {
        totalReservations,
        totalRevenue,
        totalReservedHours,
        occupancyRate,
        averageTicket,
        topBay,
      },
      bayUsage,
      upcomingReservations,
    });
  } catch (error) {
    console.error("ADMIN ANALYTICS ERROR:", error);

    return NextResponse.json(
      {
        error: "No se pudo cargar analytics.",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 400 }
    );
  }
}