"use client";

import Link from "next/link";
import { format } from "date-fns";

import { EditIcon } from "lucide-react";

import { formatAmount } from "@/hooks/format";

import { Prisma } from "@prisma/client";

type Props = {
  item: Prisma.AuctionLotGetPayload<{
    include: {
      bids: true;
    };
  }>;
  isAdmin?: boolean;
};
const LotCard = ({ item, isAdmin = false }: Props) => {
  return (
    <div className="relative">
      {isAdmin && (
        <Link
          href={`/admin/lots/${item.id}`}
          className="absolute z-1 top-6 right-6 size-8 rounded-full bg-white hover:bg-gray-200 flex-center"
          title="Edit lot"
        >
          <EditIcon className="size-4" />
        </Link>
      )}
      <Link
        href={`/lots/${item.id}`}
        className="relative flex flex-col gap-2 p-4 bg-white rounded-xl group"
      >
        <div className="aspect-square w-full overflow-hidden rounded-sm">
          <img
            src={item.images[0]}
            alt={`Lot image for - ${item.title}`}
            width={300}
            height={300}
            className="size-full object-cover group-hover:scale-105 transition-transform"
          />
        </div>

        <span className="text-lg md:text-xl font-medium">
          {item.title}
          {item.status === "DONE" && item.bids.length > 0 ? (
            <span className="text-red-500"> Sold</span>
          ) : item.status === "DONE" ? (
            <span className="text-orange-500"> Removed</span>
          ) : (
            ""
          )}
        </span>

        <span className="text-sm">
          {`Until: ${format(item.auctionDate, "dd MMM yyyy, HH:mm")}`}
        </span>

        <span className="text-sm text-stone-400">
          {item.bids && item.bids.length > 0
            ? `Current bid: ${formatAmount(item.bids[0].amount)}`
            : `Starting bid: ${formatAmount(item.startingBid)}`}
        </span>
      </Link>
    </div>
  );
};

export default LotCard;
