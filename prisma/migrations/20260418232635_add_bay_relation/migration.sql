-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Reservation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reservationCode" TEXT NOT NULL,
    "customerId" INTEGER NOT NULL,
    "bayId" INTEGER NOT NULL,
    "reservationDate" DATETIME NOT NULL,
    "startTime" TEXT NOT NULL,
    "durationHours" INTEGER NOT NULL,
    "guestCount" INTEGER NOT NULL,
    "reservationType" TEXT NOT NULL,
    "reservationStatus" TEXT NOT NULL,
    "paymentStatus" TEXT NOT NULL,
    "totalAmount" REAL NOT NULL,
    CONSTRAINT "Reservation_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Reservation_bayId_fkey" FOREIGN KEY ("bayId") REFERENCES "Bay" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Reservation" ("bayId", "customerId", "durationHours", "guestCount", "id", "paymentStatus", "reservationCode", "reservationDate", "reservationStatus", "reservationType", "startTime", "totalAmount") SELECT "bayId", "customerId", "durationHours", "guestCount", "id", "paymentStatus", "reservationCode", "reservationDate", "reservationStatus", "reservationType", "startTime", "totalAmount" FROM "Reservation";
DROP TABLE "Reservation";
ALTER TABLE "new_Reservation" RENAME TO "Reservation";
CREATE UNIQUE INDEX "Reservation_reservationCode_key" ON "Reservation"("reservationCode");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
