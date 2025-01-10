import LotCard from "@/components/LotCard";

import { Prisma } from "@prisma/client";

import { User } from "@/types";

type Props = {
  data: Prisma.AuctionLotGetPayload<{
    include: {
      bids: true;
    };
  }>[];
  user: User;
};
const Auctions = ({ data, user }: Props) => {
  return (
    <div className="container py-8 space-y-8">
      <h1 className="text-3xl lg:text-4xl font-bold">Upcoming auctions</h1>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8">
        {data.map((item) => (
          <LotCard
            item={item}
            key={item.lotNumber}
            isAdmin={user?.userRole === "ADMIN"}
          />
        ))}
      </div>
    </div>
  );
};

export default Auctions;
