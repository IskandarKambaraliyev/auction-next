import LotCard from "@/components/LotCard";

import prisma from "@/lib/db";

export default async function AdminPage() {
  const lots = await prisma.auctionLot.findMany({
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
        <h1 className="text-2xl lg:text-3xl font-bold">All Lots</h1>
        {lots.length === 0 ? (
          <p>No lots found</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
            {lots.map((lot) => (
              <LotCard item={lot} key={lot.id} isAdmin />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
