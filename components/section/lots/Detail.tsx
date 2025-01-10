"use client";

import CountdownTimer from "@/components/CountdownTimer";
import { formatAmount } from "@/hooks/format";
import { cn } from "@/lib/utils";
import { Prisma } from "@prisma/client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperClass } from "swiper/types";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { useActionState, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useFormStatus } from "react-dom";
import { Loader2Icon } from "lucide-react";
import { submitBid } from "@/actions/submitBid";
import { AnimatePresence, motion } from "motion/react";

type Item = {
  item: Prisma.AuctionLotGetPayload<{
    include: {
      bids: true;
      seller: {
        select: {
          id: true;
          name: true;
          email: true;
        };
      };
      buyer: true;
    };
  }>;
};

type User = {
  user: {
    userId: string;
    userEmail: string;
    userRole: "ADMIN" | "USER";
    userName: string;
  } | null;
};
type ClassName = {
  className?: string;
};
type Props = User & Item;
const Detail = ({ user, item }: Props) => {
  return (
    <section className="py-12">
      <div className="container max-lg:flex flex-col grid grid-cols-2 gap-8">
        <div className="flex flex-col gap-4">
          <Title item={item} className="lg:hidden" />
          <CurrentBid item={item} />
          <Images item={item} />
        </div>

        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-8 p-4 lg:p-8 bg-white rounded-xl lg:rounded-2xl">
            <Title item={item} className="max-lg:hidden" />

            <Info item={item} />
          </div>

          <Bid item={item} user={user} />
        </div>
      </div>
    </section>
  );
};

export default Detail;

const CurrentBid = ({ item }: Item) => {
  const currentBid =
    item.bids && item.bids.length > 0 ? item.bids[item.bids.length - 1] : null;
  return (
    <div className="p-4 lg:p-6 rounded-lg bg-neutral-800 text-white flex items-center gap-8">
      <div className="flex-1 flex flex-col gap-2">
        <span className="text-sm lg:text-base">
          {item.status === "DONE"
            ? "Final bid"
            : currentBid
            ? "Current bid"
            : "Starting bid"}
        </span>
        <span className="text-xl lg:text-2xl font-bold">
          {currentBid
            ? formatAmount(currentBid.amount)
            : formatAmount(item.startingBid)}
        </span>
      </div>

      <CountdownTimer date={item.auctionDate.toISOString()} />
    </div>
  );
};

const Title = ({ item, className }: Item & ClassName) => {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
        {item.title}{" "}
        {item.status === "DONE" && item.buyerId ? (
          <span className="text-red-500">- Sold</span>
        ) : item.status === "DONE" ? (
          <span className="text-orange-500">- Removed</span>
        ) : null}
      </h1>
      <Link
        href={`/categories/${item.subject.toLowerCase()}`}
        className="capitalize text-sm lg:text-base hover:underline flex w-fit"
      >{`Category: ${item.subject.toLowerCase()}`}</Link>
    </div>
  );
};

const Images = ({ item }: Item) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
  return (
    <div className="w-full space-y-2">
      <Swiper
        loop={true}
        spaceBetween={16}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper2"
      >
        {item.images.map((img) => (
          <SwiperSlide key={img} className="!relative">
            <img
              src={img}
              alt={`Lot image for - ${item.title}`}
              width={500}
              height={500}
              className="aspect-square w-full object-cover"
            />
            <div className="absolute inset-0 bg-neutral-800/20 backdrop-blur-lg"></div>
            <img
              src={img}
              alt={`Lot image for - ${item.title}`}
              width={500}
              height={500}
              className="absolute inset-0 size-full object-contain"
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <Swiper
        onSwiper={setThumbsSwiper}
        loop={item.images.length > 4}
        spaceBetween={10}
        slidesPerView={Math.min(item.images.length, 4)}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper"
      >
        {item.images.map((img) => (
          <SwiperSlide key={img}>
            <img
              src={img}
              alt={`Lot image for - ${item.title}`}
              width={160}
              height={90}
              className="aspect-video w-full object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

const Info = ({ item }: Item) => {
  const lotInfo = [
    {
      title: "Lot Number",
      value: item.lotNumber,
    },
    {
      title: "Lot ID",
      value: item.id,
    },
    {
      title: "Artist",
      value: item.artistName,
    },
    {
      title: "Subject",
      value: item.subject.toLocaleLowerCase(),
    },
    {
      title: "Year of Creation",
      value: item.yearOfCreation,
    },
    {
      title: "Starting Bid",
      value: formatAmount(item.startingBid),
    },
    {
      title: "Estimated Price",
      value: formatAmount(item.estimatedPrice),
    },
    {
      title: "Dimensions",
      value: `${item.width} x ${item.height} cm`,
    },
    {
      title: "Description",
      value: item.description,
    },
    {
      title: "Auction Date",
      value: format(new Date(item.auctionDate), "dd MMMM yyyy, HH:mm"),
    },
    {
      title: "Seller",
      value: item.seller.name,
    },
  ];

  if (item.status === "DONE") {
    if (item.bids.length > 0) {
      lotInfo.push({
        title: "Final Bid",
        value: formatAmount(item.bids[item.bids.length - 1].amount),
      });
    }
    lotInfo.push({
      title: "Buyer",
      value: item.buyer?.name || "Lot is removed from auction",
    });
  }
  return (
    <div className="flex flex-col gap-2">
      <h5 className="text-xl lg:text-2xl font-medium">Lot Info</h5>

      <ul className="flex flex-col divide-y divide-gray-200">
        {lotInfo.map((info, index) => (
          <li
            key={index}
            className="flex flex-wrap items-center justify-between py-2"
          >
            <span className="text-gray-500">{info.title}</span>
            <span className="font-medium">{info.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Bid = ({ item, user }: Item & User) => {
  const pathname = usePathname();

  const isPending = item.status === "PENDING" && item.sellerId !== user?.userId;
  if (!isPending && (item.bids === null || item.bids.length === 0)) {
    return null;
  }
  return (
    <div className="flex flex-col gap-4 p-4 lg:p-8 bg-white rounded-xl lg:rounded-2xl">
      {isPending && (
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <h5 className="text-xl lg:text-2xl font-medium">Bid now</h5>
          {!user && (
            <Button asChild>
              <Link href={`/auth?redirect=${pathname}`}>Join</Link>
            </Button>
          )}
        </div>
      )}

      {item.bids && item.bids.length > 0 && (
        <ul className="flex flex-col gap-1">
          <p className="lg:text-lg font-medium">
            {isPending ? "Recent Bids" : "Bids history"}
          </p>
          {item.bids.map((bid) => {
            const myBid = bid.userId === user?.userId;
            return (
              <li
                key={bid.id}
                className={cn(
                  "p-2 flex flex-wrap items-center gap-4 justify-between rounded-sm",
                  {
                    "border border-gray-100": !myBid,
                    "bg-gray-100": myBid,
                  }
                )}
              >
                <div>
                  <span className="font-bold">{formatAmount(bid.amount)}</span>
                  {myBid && <span className="text-gray-500"> (your bid)</span>}
                </div>
                <span className="text-gray-500">
                  {format(bid.createdAt, "dd MMM yyyy")}
                </span>
              </li>
            );
          })}
        </ul>
      )}

      {user && isPending && <SubmitBidForm item={item} />}
    </div>
  );
};

type StateErrors = {
  amountError: string | null;
  formError: string | null;
  success: boolean;
};
const initialState: StateErrors = {
  amountError: null,
  formError: null,
  success: false,
};
const SubmitBidForm = ({ item }: Item) => {
  const [state, formAction] = useActionState(submitBid, initialState);
  const [currentBid, setCurrentBid] = useState<number | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (state.success) {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    }
  }, [state.success]);

  const isPending = item.status === "PENDING";
  if (!isPending && (item.bids === null || item.bids.length === 0)) {
    return null;
  }

  const minimumBid =
    item.bids && item.bids.length > 0
      ? item.bids[item.bids.length - 1].amount + 100
      : item.startingBid;

  const variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };
  return (
    <AnimatePresence mode="wait">
      {isSuccess ? (
        <motion.p
          variants={variants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="text-lg font-medium text-green-500"
          key="success"
        >
          Your bid is submitted successfully
        </motion.p>
      ) : (
        <motion.form
          variants={variants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="flex flex-col gap-1"
          action={formAction}
          key="form"
        >
          <input type="hidden" name="lotId" defaultValue={item.id} />
          <div className="flex items-center gap-2">
            <Input
              name="amount"
              type="number"
              placeholder={`Minimum bid: ${formatAmount(minimumBid)}`}
              onChange={(e) => setCurrentBid(+e.target.value)}
              required
              className={cn({
                "!ring-red-500 !border-red-500": state.amountError,
              })}
            />
            <SubmitBtn
              disabled={
                !currentBid ||
                currentBid < minimumBid ||
                currentBid > item.estimatedPrice + 100000000
              }
            />
          </div>
          {(state.formError || state.amountError) && (
            <p className="text-red-500">
              {state.formError || state.amountError}
            </p>
          )}
        </motion.form>
      )}
    </AnimatePresence>
  );
};

type SubmitBtnProps = {
  disabled: boolean;
};
const SubmitBtn = ({ disabled }: SubmitBtnProps) => {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={disabled || pending}>
      {pending && <Loader2Icon className="animate-spin" />}
      Send
    </Button>
  );
};
