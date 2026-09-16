-- CreateTable
CREATE TABLE "PackageAddon" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "packageId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PackageAddon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingAddon" (
    "id" TEXT NOT NULL,
    "addonName" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "addonId" TEXT,
    "bookingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BookingAddon_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PackageAddon_packageId_idx" ON "PackageAddon"("packageId");

-- CreateIndex
CREATE INDEX "PackageAddon_isActive_idx" ON "PackageAddon"("isActive");

-- CreateIndex
CREATE INDEX "BookingAddon_bookingId_idx" ON "BookingAddon"("bookingId");

-- CreateIndex
CREATE INDEX "BookingAddon_addonId_idx" ON "BookingAddon"("addonId");

-- AddForeignKey
ALTER TABLE "PackageAddon" ADD CONSTRAINT "PackageAddon_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingAddon" ADD CONSTRAINT "BookingAddon_addonId_fkey" FOREIGN KEY ("addonId") REFERENCES "PackageAddon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingAddon" ADD CONSTRAINT "BookingAddon_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
