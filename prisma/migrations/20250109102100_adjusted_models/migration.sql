-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "Subject" AS ENUM ('LANDSCAPE', 'SEASCAPE', 'PORTRAIT', 'FIGURE', 'STILL_LIFE', 'NUDE', 'ANIMAL', 'ABSTRACT', 'OTHER');

-- CreateEnum
CREATE TYPE "Material" AS ENUM ('PENCIL', 'INK', 'CHARCOAL', 'OIL', 'ACRYLIC', 'WATERCOLOR', 'BRONZE', 'MARBLE', 'PEWTER', 'OAK', 'BEECH', 'PINE', 'WILLOW', 'OTHER');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuctionLot" (
    "id" SERIAL NOT NULL,
    "lotNumber" TEXT NOT NULL,
    "artistName" TEXT NOT NULL,
    "yearOfCreation" INTEGER NOT NULL,
    "subject" "Subject" NOT NULL,
    "description" TEXT NOT NULL,
    "estimatedPrice" DOUBLE PRECISION NOT NULL,
    "auctionDate" TIMESTAMP(3) NOT NULL,
    "images" TEXT[],
    "material" "Material",
    "height" DOUBLE PRECISION NOT NULL,
    "width" DOUBLE PRECISION NOT NULL,
    "depth" DOUBLE PRECISION,
    "buyerId" INTEGER,
    "sellerId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuctionLot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bid" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "userId" INTEGER NOT NULL,
    "auctionLotId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AuctionLot_lotNumber_key" ON "AuctionLot"("lotNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Client_email_key" ON "Client"("email");

-- AddForeignKey
ALTER TABLE "AuctionLot" ADD CONSTRAINT "AuctionLot_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuctionLot" ADD CONSTRAINT "AuctionLot_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_auctionLotId_fkey" FOREIGN KEY ("auctionLotId") REFERENCES "AuctionLot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
