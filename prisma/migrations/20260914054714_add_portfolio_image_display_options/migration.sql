-- CreateEnum
CREATE TYPE "ImageOrientation" AS ENUM ('PORTRAIT', 'LANDSCAPE', 'SQUARE');

-- CreateEnum
CREATE TYPE "ImagePosition" AS ENUM ('TOP', 'CENTER', 'BOTTOM');

-- AlterTable
ALTER TABLE "Portfolio" ADD COLUMN     "imageOrientation" "ImageOrientation" NOT NULL DEFAULT 'PORTRAIT',
ADD COLUMN     "imagePosition" "ImagePosition" NOT NULL DEFAULT 'CENTER';
