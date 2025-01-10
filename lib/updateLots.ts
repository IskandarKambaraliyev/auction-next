import prisma from "./db";

export default async function updateLots() {
  const lots = await prisma.auctionLot.findMany({
    where: {
      auctionDate: {
        lte: new Date(),
      },
      status: "PENDING",
    },
    include: {
      bids: {
        orderBy: {
          amount: "desc",
        },
        take: 1,
      },
      buyer: true,
    },
  });

  if (lots.length === 0) {
    console.log("No lots to update.");
  }

  for (const lot of lots) {
    if (!lot.buyerId) {
      if (lot.bids.length > 0) {
        await prisma.auctionLot.update({
          where: {
            id: lot.id,
          },
          data: {
            buyerId: lot.bids[0].userId,
            status: "DONE",
          },
        });
      } else {
        await prisma.auctionLot.update({
          where: {
            id: lot.id,
          },
          data: {
            status: "DONE",
          },
        });
      }

      console.log(`Lot ${lot.id} updated.`);
    }
  }
}
