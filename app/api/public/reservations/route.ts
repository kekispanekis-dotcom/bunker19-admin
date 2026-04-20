import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

function generateCode() {
  return "RES-" + Math.floor(Math.random() * 1000000);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const date = new Date(body.date + "T00:00:00");

    let customer = null;

    if (body.email) {
      customer = await prisma.customer.findFirst({
        where: {
          email: body.email,
        },
      });
    }

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          fullName: body.fullName,
          phone: body.phone || null,
          email: body.email || null,
        },
      });
    }

    const reservation = await prisma.reservation.create({
      data: {
        reservationCode: generateCode(),
        customerId: customer.id,
        bayId: body.bayId,
        reservationDate: date,
        startTime: body.startTime,
        durationHours: body.durationHours,
        guestCount: body.guestCount,
        reservationType: "reserve_only",
        reservationStatus: "confirmed",
        paymentStatus: "unpaid",
        totalAmount: body.totalAmount,
      },
    });

    return NextResponse.json({
      ok: true,
      reservation,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "No se pudo crear la reservación." },
      { status: 400 }
    );
  }
}