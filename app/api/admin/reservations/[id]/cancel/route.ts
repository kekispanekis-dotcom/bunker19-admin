import { NextResponse } from "next/server";
import { prisma } from "../../../../../../lib/prisma";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const reservation = await prisma.reservation.update({
      where: { id: Number(id) },
      data: {
        reservationStatus: "cancelled",
      },
    });

    return NextResponse.json({ ok: true, reservation });
  } catch (error) {
    return NextResponse.json(
      { error: "No se pudo cancelar la reservación." },
      { status: 400 }
    );
  }
}