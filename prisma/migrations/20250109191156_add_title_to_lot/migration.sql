/*
  Warnings:

  - Added the required column `title` to the `AuctionLot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AuctionLot" ADD COLUMN     "title" TEXT NOT NULL;
