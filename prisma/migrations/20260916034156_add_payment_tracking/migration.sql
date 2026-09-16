-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('UNPAID', 'PARTIALLY_PAID', 'PAID');

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "depositAmount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "paymentProofId" TEXT,
ADD COLUMN     "paymentProofUrl" TEXT,
ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'UNPAID',
ADD COLUMN     "totalPayment" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Booking_paymentStatus_idx" ON "Booking"("paymentStatus");
