import Create from "@/components/section/admin/Create";
import getUserInfo from "@/hooks/getUserInfo";
import prisma from "@/lib/db";

type Props = {
  params: Promise<{ lotId: string }>;
};

export default async function AdminLotDetailPage({ params }: Props) {
  const { lotId } = await params;

  const lot = await prisma.auctionLot.findUnique({
    where: {
      id: lotId,
    },
    include: {
      bids: true,
    },
  });

  if (!lot) {
    return <p>Lot not found</p>;
  }

  const user = await getUserInfo();
  return <Create user={user} data={lot} />;
}
