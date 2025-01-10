import Create from "@/components/section/admin/Create";
import getUserInfo from "@/hooks/getUserInfo";
import prisma from "@/lib/db";

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

export default async function AdminLotDetailPage({ params }: Props) {
  const { lotId } = await params;

  const lot = await getLot(lotId);

  if (!lot) {
    return <p>Lot not found</p>;
  }

  const user = await getUserInfo();
  return <Create user={user} data={lot} />;
}
