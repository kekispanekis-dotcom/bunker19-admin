import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const bays = [
    {
      code: "B1",
      name: "Bahía B1",
      bayType: "standard",
      capacity: 6,
      basePrice: 600,
      displayOrder: 1,
    },
    {
      code: "B2",
      name: "Bahía B2",
      bayType: "standard",
      capacity: 6,
      basePrice: 600,
      displayOrder: 2,
    },
    {
      code: "B3",
      name: "Bahía B3",
      bayType: "standard",
      capacity: 6,
      basePrice: 600,
      displayOrder: 3,
    },
    {
      code: "B4",
      name: "Bahía B4",
      bayType: "standard",
      capacity: 6,
      basePrice: 600,
      displayOrder: 4,
    },
    {
      code: "B19",
      name: "Bahía B19 VIP",
      bayType: "vip",
      capacity: 10,
      basePrice: 950,
      displayOrder: 5,
    },
  ] as const;

  for (const bay of bays) {
    await prisma.bay.upsert({
      where: { code: bay.code },
      update: {
        name: bay.name,
        bayType: bay.bayType,
        capacity: bay.capacity,
        basePrice: bay.basePrice,
        displayOrder: bay.displayOrder,
        isActive: true,
      },
      create: {
        code: bay.code,
        name: bay.name,
        bayType: bay.bayType,
        capacity: bay.capacity,
        basePrice: bay.basePrice,
        displayOrder: bay.displayOrder,
        isActive: true,
      },
    });
  }

  console.log("Bahías cargadas correctamente.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });