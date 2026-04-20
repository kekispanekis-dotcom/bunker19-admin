import { NextResponse } from "next/server";
import { prisma } from "../../../../../../lib/prisma";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const current = await prisma.reservation.findUnique({
      where: { id: Number(id) },
    });

    if (!current) {
      return NextResponse.json(
        { error: "Reservación no encontrada." },
        { status: 404 }
      );
    }

    const reservation = await prisma.reservation.update({
      where: { id: Number(id) },
      data: {
        reservationStatus:
          current.paymentStatus === "paid" ? "paid" : "confirmed",
      },
    });

    return NextResponse.json({ ok: true, reservation });
  } catch (error) {
    return NextResponse.json(
      { error: "No se pudo hacer check-in." },
      { status: 400 }
    );
  }
}