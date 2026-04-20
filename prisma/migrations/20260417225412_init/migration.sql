-- CreateTable
CREATE TABLE "Bay" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bayType" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "basePrice" REAL NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fullName" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT
);

-- CreateTable
CREATE TABLE "Reservation" (
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
    "totalAmount" REAL NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Bay_code_key" ON "Bay"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_reservationCode_key" ON "Reservation"("reservationCode");
