// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Seed Users
  const hashedAdminPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || "no-password",
    10
  );
  const adminUser = await prisma.user.upsert({
    where: { email: "human.aow.official@gmail.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "human.aow.official@gmail.com",
      password: hashedAdminPassword,
      role: "ADMIN",
    },
  });

  const hashedUserPassword = await bcrypt.hash(
    process.env.USER_PASSWORD || "no-password",
    10
  );
  const regularUser = await prisma.user.upsert({
    where: { email: "human.github@gmail.com" },
    update: {},
    create: {
      name: "Regular User",
      email: "human.github@gmail.com",
      password: hashedUserPassword,
      role: "USER",
    },
  });

  // Seed Auction Lots
  const auctionLot1 = await prisma.auctionLot.create({
    data: {
      lotNumber: "10000001",
      title: "The Starry Night",
      artistName: "Vincent van Gogh",
      yearOfCreation: 1889,
      subject: "PORTRAIT",
      description: "The Starry Night, one of the most famous paintings.",
      estimatedPrice: 50000000,
      startingBid: 45000000,
      auctionDate: new Date("2025-03-01"),
      images: [
        "https://images.unsplash.com/photo-1683219220230-2dd016c5e5e9?q=80&w=2370&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1652172264794-a83fe7c190f3?q=80&w=2535&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      ],
      height: 73.7,
      width: 92.1,
      depth: null,
      seller: {
        connect: { id: adminUser.id }, // Admin user is the seller
      },
      status: "PENDING",
    },
  });

  const auctionLot2 = await prisma.auctionLot.create({
    data: {
      lotNumber: "10000002",
      title: "The Mona Lisa",
      artistName: "Leonardo da Vinci",
      yearOfCreation: 1503,
      subject: "PORTRAIT",
      description: "The Mona Lisa, a masterpiece of Renaissance art.",
      estimatedPrice: 70000000,
      startingBid: 65000000,
      auctionDate: new Date("2025-04-15"),
      images: [
        "https://images.unsplash.com/photo-1637329097076-5d0209af3ef9?q=80&w=2507&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1634320714682-ae8b9c9cee60?q=80&w=2100&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      ],
      height: 77,
      width: 53,
      depth: null,
      seller: {
        connect: { id: adminUser.id },
      },
      status: "PENDING",
    },
  });

  // Seed Bids
  await prisma.bid.create({
    data: {
      amount: 51000000,
      userId: regularUser.id,
      auctionLotId: auctionLot1.id,
    },
  });

  // await prisma.bid.create({
  //   data: {
  //     amount: 72000000,
  //     userId: regularUser.id,
  //     auctionLotId: auctionLot2.id,
  //   },
  // });

  console.log("Database has been seeded!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
