import LotCard from "@/components/LotCard";

import getUserInfo from "@/hooks/getUserInfo";

import prisma from "@/lib/db";

export default async function BidsPage() {
  const user = await getUserInfo();

  if (!user) {
    return <p>You need to be logged in to view this page</p>;
  }

  const lots = await prisma.auctionLot.findMany({
    where: {
      bids: {
        some: {
          userId: user.userId,
        },
      },
    },
    orderBy: {
      auctionDate: "asc",
    },
    include: {
      bids: true,
    },
  });
  return (
    <section className="py-12">
      <div className="container space-y-8">
        <h1 className="text-2xl lg:text-3xl font-bold">My bids</h1>
        {lots.length === 0 ? (
          <p>No bids yet</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
            {lots.map((lot) => (
              <LotCard item={lot} key={lot.id} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
