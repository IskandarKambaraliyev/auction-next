/*
  Warnings:

  - The values [LANDSCAPE,SEASCAPE,FIGURE,STILL_LIFE,NUDE,ABSTRACT] on the enum `Subject` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `AuctionLot` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `material` on the `AuctionLot` table. All the data in the column will be lost.
  - The primary key for the `Bid` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `Client` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `startingBid` to the `AuctionLot` table without a default value. This is not possible if the table is not empty.
  - Made the column `sellerId` on table `AuctionLot` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "AuctionStatus" AS ENUM ('PENDING', 'DONE');

-- AlterEnum
BEGIN;
CREATE TYPE "Subject_new" AS ENUM ('ANIMAL', 'CAR', 'PORTRAIT', 'BUILDING', 'ART', 'OTHER');
ALTER TABLE "AuctionLot" ALTER COLUMN "subject" TYPE "Subject_new" USING ("subject"::text::"Subject_new");
ALTER TYPE "Subject" RENAME TO "Subject_old";
ALTER TYPE "Subject_new" RENAME TO "Subject";
DROP TYPE "Subject_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "AuctionLot" DROP CONSTRAINT "AuctionLot_buyerId_fkey";

-- DropForeignKey
ALTER TABLE "AuctionLot" DROP CONSTRAINT "AuctionLot_sellerId_fkey";

-- DropForeignKey
ALTER TABLE "Bid" DROP CONSTRAINT "Bid_auctionLotId_fkey";

-- DropForeignKey
ALTER TABLE "Bid" DROP CONSTRAINT "Bid_userId_fkey";

-- AlterTable
ALTER TABLE "AuctionLot" DROP CONSTRAINT "AuctionLot_pkey",
DROP COLUMN "material",
ADD COLUMN     "startingBid" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "status" "AuctionStatus" NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "buyerId" SET DATA TYPE TEXT,
ALTER COLUMN "sellerId" SET NOT NULL,
ALTER COLUMN "sellerId" SET DATA TYPE TEXT,
ADD CONSTRAINT "AuctionLot_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "AuctionLot_id_seq";

-- AlterTable
ALTER TABLE "Bid" DROP CONSTRAINT "Bid_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ALTER COLUMN "auctionLotId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Bid_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Bid_id_seq";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- DropTable
DROP TABLE "Client";

-- DropEnum
DROP TYPE "Material";

-- AddForeignKey
ALTER TABLE "AuctionLot" ADD CONSTRAINT "AuctionLot_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuctionLot" ADD CONSTRAINT "AuctionLot_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_auctionLotId_fkey" FOREIGN KEY ("auctionLotId") REFERENCES "AuctionLot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
