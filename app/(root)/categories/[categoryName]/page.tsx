import LotCard from "@/components/LotCard";
import Subjects from "@/components/Subjects";
import { allSubjects } from "@/data";
import prisma from "@/lib/db";

type Props = {
  params: Promise<{ categoryName: string }>;
};
export default async function CategoryDetailPage({ params }: Props) {
  const { categoryName } = await params;

  if (!allSubjects.includes(categoryName.toUpperCase())) {
    return <p>Category not found</p>;
  }

  const lots = await prisma.auctionLot.findMany({
    where: {
      subject: categoryName.toUpperCase() as any,
    },
    orderBy: {
      auctionDate: "asc",
    },
    include: {
      bids: true,
    },
  });
  return (
    <section className="relative">
      <Subjects />
      <div className="py-12">
        <div className="container space-y-8">
          <h1 className="text-2xl lg:text-3xl font-bold">
            Category: {categoryName}
          </h1>
          {lots.length === 0 ? (
            <p>No lots found for this category</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
              {lots.map((lot) => (
                <LotCard item={lot} key={lot.id} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
