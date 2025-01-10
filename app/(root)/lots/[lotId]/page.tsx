import Detail from "@/components/section/lots/Detail";
import getUserInfo from "@/hooks/getUserInfo";
import prisma from "@/lib/db";
import { Metadata } from "next";

const getLot = async (lotId: string) => {
  return await prisma.auctionLot.findUnique({
    where: {
      id: lotId,
    },
    include: {
      bids: {
        orderBy: {
          amount: "asc",
        },
      },
      seller: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      buyer: true,
    },
  });
};

export async function generateStaticParams() {
  const lots = await prisma.auctionLot.findMany({
    select: {
      id: true,
    },
  });

  return lots.map((lot) => ({
    lotId: lot.id,
  }));
}

type Props = {
  params: Promise<{ lotId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lotId } = await params;

  const lot = await getLot(lotId);

  if (!lot) {
    return {
      title: "Lot not found",
    };
  }

  return {
    title: lot.title,
    description: lot.description,
    openGraph: {
      images: lot.images,
    },
  };
}
export default async function LotDetailPage({ params }: Props) {
  const { lotId } = await params;
  const user = await getUserInfo();

  const lot = await getLot(lotId);

  if (!lot) {
    return <div>Lot not found</div>;
  }

  return (
    <>
      <Detail user={user} item={lot} />
    </>
  );
}
