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
    // <div>
    //   <li className="p-4 border border-gray-200">
    //     <p>Id - {comingAuction[0].id}</p>
    //     <p>Artist name - {comingAuction[0].artistName}</p>
    //     <p>Auction Date - {`${comingAuction[0].auctionDate}`}</p>
    //     <p>Buyer Id - {comingAuction[0].buyerId}</p>
    //     <p>Description - {comingAuction[0].description}</p>
    //     <p>Estimated Price - {comingAuction[0].estimatedPrice}</p>
    //     <p>Height - {comingAuction[0].height}</p>
    //     <p>Width - {comingAuction[0].width}</p>
    //     <p>Images - {`${comingAuction[0].images}`}</p>
    //     <p>Lot number - {comingAuction[0].lotNumber}</p>
    //     <p>Seller Id - {comingAuction[0].sellerId}</p>
    //     <p>Subject - {comingAuction[0].subject}</p>
    //     <p>Year of creation - {comingAuction[0].yearOfCreation}</p>
    //   </li>
    //   <ul className="p-4 space-y-4">
    //     {auctionLots.map((item) => (
    //       <li key={item.id} className="p-4 border border-gray-200">
    //         <p>Id - {item.id}</p>
    //         <p>Artist name - {item.artistName}</p>
    //         <p>Auction Date - {`${item.auctionDate}`}</p>
    //         <p>Buyer Id - {item.buyerId}</p>
    //         <p>Description - {item.description}</p>
    //         <p>Estimated Price - {item.estimatedPrice}</p>
    //         <p>Height - {item.height}</p>
    //         <p>Width - {item.width}</p>
    //         <p>Images - {`${item.images}`}</p>
    //         <p>Lot number - {item.lotNumber}</p>
    //         <p>Seller Id - {item.sellerId}</p>
    //         <p>Subject - {item.subject}</p>
    //         <p>Year of creation - {item.yearOfCreation}</p>
    //       </li>
    //     ))}
    //   </ul>
    // </div>
  );
}
