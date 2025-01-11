import Auctions from "@/components/section/main/Auctions";
import Hero from "@/components/section/main/Hero";
import Subjects from "@/components/Subjects";

import getUserInfo from "@/hooks/getUserInfo";

import prisma from "@/lib/db";

export default async function HomePage() {
  const user = await getUserInfo();

  const auctionLots = await prisma.auctionLot.findMany({
    include: {
      bids: {
        orderBy: {
          amount: "desc",
        },
        take: 1,
      },
    },
    where: {
      status: "PENDING",
    },
  });
  const closesAuction = await prisma.auctionLot.findMany({
    where: {
      auctionDate: {
        gte: new Date(),
      },
      status: "PENDING",
    },
    orderBy: {
      auctionDate: "asc",
    },
    take: 1,
  });

  return (
    <>
      <Hero data={closesAuction[0]} />
      <section className="relative]">
        <Subjects />
        <Auctions data={auctionLots} user={user} />
      </section>
    </>
  );
}
