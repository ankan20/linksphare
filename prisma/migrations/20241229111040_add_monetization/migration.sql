-- AlterTable
ALTER TABLE "Link" ADD COLUMN     "clicks" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "customDomain" TEXT,
ADD COLUMN     "isMonetized" BOOLEAN NOT NULL DEFAULT false;
