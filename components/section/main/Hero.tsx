import { Prisma } from "@prisma/client";
import Image from "next/image";
import CountdownTimer from "@/components/CountdownTimer";
import { format } from "date-fns";
import Link from "next/link";

type Props = {
  data: Prisma.AuctionLotGetPayload<{}>;
};
const Hero = ({ data }: Props) => {
  return (
    <section className="relative w-full">
      <img
        src={data.images[0]}
        alt={"Auction image"}
        width={1920}
        height={600}
        className="absolute inset-0 object-cover size-full"
      />

      <div className="absolute inset-0 size-full bg-gradient-to-r from-neutral-900/90 from-20% to-gray-700/10" />
      <div className="relative container py-20 text-white flex flex-col gap-6 md:gap-8">
        <div className="flex flex-wrap items-center gap-x-2 text-lg lg:text-xl font-medium">
          <span>{format(data.auctionDate, "dd MMMM yyyy")}</span>
          <Divider />
          <span>{data.artistName}</span>
          <Divider />
          <span className="capitalize">{data.subject.toLowerCase()}</span>
        </div>

        <h2 className="text-4xl lg:text-5xl font-bold">{data.title}</h2>

        <Link
          href={`/lots/${data.id}`}
          className="w-fit py-3 px-10 md:py-4 md:px-16 bg-white text-black hover:bg-gray-200 text-xl mt-8 md:mt-12 text-center"
        >
          View Auction
        </Link>
      </div>
      <div className="relative text-center py-4 md:py-6 bg-neutral-800 text-white">
        <CountdownTimer date={data.auctionDate.toISOString()} />
      </div>
    </section>
  );
};

export default Hero;

const Divider = () => {
  return <div className="h-5 w-0.5 bg-white" />;
};
