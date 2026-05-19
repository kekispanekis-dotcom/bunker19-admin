import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json(
        { error: "Código requerido." },
        { status: 400 }
      );
    }

    const reservation = await prisma.reservation.findFirst({
      where: {
        reservationCode: code,
      },
      include: {
        customer: true,
        bay: true,
      },
    });

    if (!reservation) {
      return NextResponse.json(
        { error: "Reservación no encontrada." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      reservation: {
        id: reservation.id,
        code: reservation.reservationCode,
        customer: reservation.customer?.fullName || "Cliente",
        phone: reservation.customer?.phone || "",
        email: reservation.customer?.email || "",
        bay: reservation.bay.code,
        bayName: reservation.bay.name,
        date: reservation.reservationDate,
        startTime: reservation.startTime,
        durationHours: reservation.durationHours,
        guestCount: reservation.guestCount,
        reservationStatus: reservation.reservationStatus,
        paymentStatus: reservation.paymentStatus,
        totalAmount: reservation.totalAmount,
      },
    });
  } catch (error) {
    console.error("CHECKIN GET ERROR:", error);

    return NextResponse.json(
      { error: "No se pudo consultar la reservación." },
      { status: 400 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json(
        { error: "Código requerido." },
        { status: 400 }
      );
    }

    const reservation = await prisma.reservation.findFirst({
      where: {
        reservationCode: code,
      },
    });

    if (!reservation) {
      return NextResponse.json(
        { error: "Reservación no encontrada." },
        { status: 404 }
      );
    }

    const updated = await prisma.reservation.update({
      where: {
        id: reservation.id,
      },
      data: {
        reservationStatus: "confirmed",
      },
    });

    return NextResponse.json({
      ok: true,
      reservation: updated,
    });
  } catch (error) {
    console.error("CHECKIN POST ERROR:", error);

    return NextResponse.json(
      { error: "No se pudo hacer check-in." },
      { status: 400 }
    );
  }
}