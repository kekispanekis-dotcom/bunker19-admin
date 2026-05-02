import { NextResponse } from "next/server";
import { prisma } from "../../../../../../lib/prisma";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = Number(params.id);

    if (!id) {
      return NextResponse.json(
        { error: "ID de reservación inválido." },
        { status: 400 }
      );
    }

    const reservation = await prisma.reservation.update({
      where: { id },
      data: {
        paymentStatus: "paid",
        reservationStatus: "confirmed",
      },
    });

    return NextResponse.json({
      ok: true,
      reservation,
    });
  } catch (error) {
    console.error("MARK PAID ERROR:", error);

    return NextResponse.json(
      { error: "No se pudo marcar como pagada." },
      { status: 400 }
    );
  }
}