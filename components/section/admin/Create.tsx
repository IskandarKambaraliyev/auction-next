"use client";

import { useState, useRef, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Prisma } from "@prisma/client";
import { format, formatDistanceToNow } from "date-fns";
import { CalendarIcon, Loader2Icon, XIcon } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperClass } from "swiper/types";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { PopoverClose } from "@radix-ui/react-popover";

import { CustomInput } from "@/components/custom";
import { User } from "@/types";
import { allSubjects } from "@/data";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { formatAmount } from "@/hooks/format";
import CountdownTimer from "@/components/CountdownTimer";
import { useToast } from "@/hooks/use-toast";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

type State = {
  title: string;
  artist: string;
  year: number;
  subject: string;
  description: string;
  estimated: number;
  starting: number;
  auctionDate: Date;
  width: number;
  height: number;
  images: string[];
};

type Props = {
  user: User;
  data: Prisma.AuctionLotGetPayload<{
    include: {
      bids: true;
    };
  }>;
};
const Create = ({ user, data }: Props) => {
  const [state, setState] = useState<State>({
    title: data.title,
    artist: data.artistName,
    year: data.yearOfCreation,
    subject: data.subject,
    description: data.description,
    estimated: data.estimatedPrice,
    starting: data.startingBid,
    auctionDate: data.auctionDate,
    width: data.width,
    height: data.height,
    images: data.images,
  });

  const updateState = <K extends keyof State>(key: K, value: State[K]) => {
    setState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  return (
    <section className="py-12 max-w-full">
      <div className="container grid lg:grid-cols-2 gap-8">
        <Form
          state={state}
          setState={setState}
          updateState={updateState}
          data={data}
        />

        <Preview state={state} user={user} />
      </div>
    </section>
  );
};

export default Create;

const Preview = ({ state, user }: { state: State; user: User }) => {
  const lotInfo = [
    {
      title: "Artist",
      value: state.artist,
      placeholder: "No artist name",
    },
    {
      title: "Year of Creation",
      value: state.year,
      placeholder: "No year",
    },
    {
      title: "Estimated Price",
      value: state.estimated ? formatAmount(state.estimated) : "",
      placeholder: "No estimated price",
    },
    {
      title: "Starting Bid",
      value: state.starting ? formatAmount(state.starting) : "",
      placeholder: "No starting price",
    },
    {
      title: "Dimensions",
      value:
        state.width && state.height
          ? `${state.width} x ${state.height} cm`
          : "",
      placeholder: "No Dimensions",
    },
    {
      title: "Description",
      value: state.description,
      placeholder: "No description",
    },
    {
      title: "Seller",
      value: user?.userName,
      placeholder: "No seller",
    },
    {
      title: "Auction Date",
      value: format(state.auctionDate, "dd MMMM yyyy, HH:mm"),
      placeholder: "No date",
    },
  ];
  return (
    <div className="max-w-full overflow-hidden p-4 rounded-xl bg-white flex flex-col gap-4">
      <h2 className="text-xl lg:text-2xl font-bold">Preview</h2>

      {state.images.length > 0 ? (
        <Images images={state.images} />
      ) : (
        <div className="w-full aspect-square border border-gray-200 bg-gray-100 flex-center text-red-500">
          No images to display
        </div>
      )}

      <div className="flex flex-wrap gap-4">
        <div className="flex-1">
          <div
            className={cn("text-xl lg:text-xl font-bold", {
              "text-red-500": !state.title,
            })}
          >
            {state.title || "No title"}
          </div>
          <div className="capitalize hover:underline cursor-pointer w-fit">{`Category: ${state.subject.toLowerCase()}`}</div>
        </div>

        <CountdownTimer date={state.auctionDate.toISOString()} />
      </div>

      <ul className="flex flex-col divide-y divide-gray-200">
        {lotInfo.map((info, index) => (
          <li
            key={index}
            className="flex flex-wrap items-center justify-between py-2"
          >
            <span className="text-gray-500">{info.title}</span>
            <span
              className={cn("font-medium", {
                "text-red-500": !info.value,
              })}
            >
              {info.value || info.placeholder}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
const Images = ({ images }: { images: string[] }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
  return (
    <div className="max-w-full space-y-2">
      <Swiper
        loop={images.length > 1}
        spaceBetween={16}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
      >
        {images.map((img) => (
          <SwiperSlide key={img} className="!relative">
            <img
              src={img}
              alt={`Could not load image`}
              width={500}
              height={500}
              className="aspect-square w-full object-cover select-none"
            />
            <div className="absolute inset-0 bg-neutral-800/20 backdrop-blur-lg"></div>
            <img
              src={img}
              alt={`Could not load image`}
              width={500}
              height={500}
              className="absolute inset-0 size-full object-contain"
            />
          </SwiperSlide>
        ))}
      </Swiper>
      {images.length > 1 && (
        <Swiper
          onSwiper={setThumbsSwiper}
          loop={images.length > 4}
          spaceBetween={10}
          slidesPerView={Math.min(images.length, 4)}
          freeMode={true}
          watchSlidesProgress={true}
          modules={[FreeMode, Navigation, Thumbs]}
        >
          {images.map((img) => (
            <SwiperSlide key={img}>
              <img
                src={img}
                alt={`Could not load image`}
                width={160}
                height={90}
                className="aspect-video w-full object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

const Form = ({
  state,
  setState,
  updateState,
  data,
}: {
  state: State;
  setState: (state: State) => void;
  updateState: <K extends keyof State>(key: K, value: State[K]) => void;
  data: Prisma.AuctionLotGetPayload<{
    include: {
      bids: true;
    };
  }>;
}) => {
  const currentYear = new Date().getFullYear();
  const [errors, setErrors] = useState<{ field: string; message: string }[]>(
    []
  );
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();
  const isDone = data.status === "DONE";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/lots/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...state,
          auctionDate: state.auctionDate.toISOString(),
          id: data.id,
        }),
      });

      const resData = await res.json();
      console.log(resData);

      if (res.ok) {
        toast({
          title: "The lot has been updated successfully",
          description: "You will be redirected to the lot page after 3 seconds",
          duration: 6000,
        });
        setTimeout(() => {
          router.push(`/lots/${resData.id}`);
        }, 3000);
      } else {
        setErrors(resData.errors);
      }
    } catch (error) {
      console.log(error);
      setErrors([{ field: "form", message: "An error occurred" }]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsDone = async () => {
    try {
      const res = await fetch("/api/admin/lots/done", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: data.id,
        }),
      });

      const resData = await res.json();
      console.log(resData);

      if (res.ok) {
        toast({
          title: "The lot has been marked as DONE successfully",
          description: "You will be redirected to the lot page after 3 seconds",
          duration: 6000,
        });
        setTimeout(() => {
          router.push(`/lots/${data.id}`);
        }, 3000);
      } else {
        setErrors(resData.errors);
      }
    } catch (error) {
      console.log(error);
      setErrors([{ field: "form", message: "An error occurred" }]);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch("/api/admin/lots/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: data.id,
        }),
      });

      const resData = await res.json();
      console.log(resData);

      if (res.ok) {
        toast({
          title: "The lot has been deleted successfully",
          description:
            "You will be redirected to the admin page after 3 seconds",
          duration: 6000,
        });
        setTimeout(() => {
          router.push("/admin");
        }, 3000);
      } else {
        setErrors(resData.errors);
      }
    } catch (error) {
      console.log(error);
      setErrors([{ field: "form", message: "An error occurred" }]);
    }
  };
  return (
    <form
      className="p-4 rounded-xl bg-white flex flex-col gap-4"
      onSubmit={handleSubmit}
    >
      <div>
        <h1 className="text-xl lg:text-2xl font-bold">
          Update the Auction Lot
        </h1>
        <p className="text-gray-500">
          Please change the information below to update the auction lot. You can
          also see a live preview of your lot as you fill out the form.
        </p>
        {errors.length > 0 &&
          errors.map((error, index) => (
            <p key={index} className="text-red-500">
              <span className="capitalize">{error.field}:</span>{" "}
              <span>{error.message}</span>
            </p>
          ))}
      </div>

      <CustomInput
        id="title"
        label="Title"
        onChange={(e) => {
          updateState("title", e.target.value);
        }}
        value={state.title}
        maxLength={50}
        minLength={5}
      />
      <CustomInput
        id="artist"
        label="Artist Name"
        onChange={(e) => {
          updateState("artist", e.target.value);
        }}
        value={state.artist}
        maxLength={50}
        minLength={5}
      />
      <CustomInput
        id="year"
        type="number"
        label="Year of creation"
        onChange={(e) => {
          updateState("year", +e.target.value);
        }}
        value={state.year.toString()}
        error={
          state.year > currentYear
            ? "Year cannot be in the future"
            : state.year < 0
            ? "Year cannot be negative"
            : ""
        }
      />
      <Field id="subject" label="Subject">
        <Select
          onValueChange={(value) => updateState("subject", value)}
          defaultValue={state.subject}
        >
          <SelectTrigger className="w-full capitalize">
            <SelectValue placeholder="Subject" />
          </SelectTrigger>
          <SelectContent>
            {allSubjects.map((subject) => (
              <SelectItem key={subject} value={subject} className="capitalize">
                {subject.toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <CustomInput
        id="description"
        label="Description"
        onChange={(e) => {
          updateState("description", e.target.value);
        }}
        value={state.description}
        maxLength={250}
        minLength={5}
      />
      <CustomInput
        id="estimatedPrice"
        type="number"
        label="Estimated Price"
        onChange={(e) => {
          updateState("estimated", +e.target.value);
        }}
        value={state.estimated.toString()}
        error={state.estimated < 0 ? "Price cannot be negative" : ""}
      />
      <CustomInput
        id="startingPrice"
        type="number"
        label="Starting Price"
        onChange={(e) => {
          updateState("starting", +e.target.value);
        }}
        value={state.starting.toString()}
        error={state.starting < 0 ? "Price cannot be negative" : ""}
      />
      <Field label="Auction Date" id="auctionDate">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !state.auctionDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {state.auctionDate ? (
                `${format(state.auctionDate, "PPP")} (${formatDistanceToNow(
                  state.auctionDate
                )})`
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              id="auctionDate"
              mode="single"
              selected={state.auctionDate}
              onSelect={(date) => {
                if (date) updateState("auctionDate", date);
              }}
              initialFocus
              disabled={(date) => {
                const tomorrow = new Date();

                const sixMonthsFromNow = new Date();
                sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 3);

                return date < tomorrow || date > sixMonthsFromNow;
              }}
            />
          </PopoverContent>
        </Popover>
      </Field>
      <AddImages state={state} setState={setState} />
      <CustomInput
        id="width"
        type="number"
        label="Width"
        onChange={(e) => {
          updateState("width", +e.target.value);
        }}
        value={state.width.toString()}
        error={state.width < 0 ? "Width cannot be negative" : ""}
      />
      <CustomInput
        id="height"
        type="number"
        label="Height"
        onChange={(e) => {
          updateState("height", +e.target.value);
        }}
        value={state.height.toString()}
        error={state.height < 0 ? "Height cannot be negative" : ""}
      />

      <Button
        type="submit"
        size="lg"
        disabled={loading || data.status === "DONE"}
      >
        {loading && <Loader2Icon className="animate-spin size-4" />}
        {data.status === "DONE" ? "Lot is DONE" : "Update"}
      </Button>

      <div
        className={cn("grid gap-4", {
          "grid-cols-2": !isDone,
          "grid-cols-1": isDone,
        })}
      >
        <Popover>
          <PopoverTrigger asChild>
            <Button type="button" variant={"destructive"}>
              Delete
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <p className="text-center mb-4">
              Are you sure you want to delete this lot?
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={"destructive"}
                onClick={handleDelete}
              >
                Yes, delete
              </Button>

              <PopoverClose asChild>
                <Button type="button">Cancel</Button>
              </PopoverClose>
            </div>
          </PopoverContent>
        </Popover>
        {!isDone && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                className="bg-orange-500 hover:bg-orange-400"
              >
                Mark as DONE
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <p className="text-center mb-4">
                Are you sure you want to mark this lot as DONE?
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  className="bg-orange-500 hover:bg-orange-400"
                  onClick={handleMarkAsDone}
                >
                  Yes, mark
                </Button>

                <PopoverClose asChild>
                  <Button type="button">Cancel</Button>
                </PopoverClose>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </form>
  );
};

const AddImages = ({
  state,
  setState,
}: {
  state: State;
  setState: (state: State) => void;
}) => {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <Field id="images" label="Images">
      <ul className="flex flex-wrap gap-x-4 gap-y-2">
        {state.images.map((image, index) => (
          <li
            key={index}
            className="max-w-full text-sm text-gray-500 flex items-center gap-1 p-1 border border-gray-100 rounded-lg"
          >
            <span className="max-w-full break-all">{image}</span>
            <button
              type="button"
              className="shrink-0 size-5 rounded-md bg-gray-100 flex-center"
              onClick={() => {
                setState({
                  ...state,
                  images: state.images.filter((_, i) => i !== index),
                });
              }}
            >
              <XIcon className="size-3" />
            </button>
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-2">
        <Input
          placeholder="Image url"
          id="images"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setError("");
          }}
          type="url"
          ref={inputRef}
        />
        <Button
          type="button"
          onClick={() => {
            const isValidUrl = (string: string) => {
              try {
                new URL(string);
                return true;
              } catch (_) {
                return false;
              }
            };

            if (url && isValidUrl(url) && !state.images.includes(url)) {
              setState({
                ...state,
                images: [...state.images, url],
              });
              setUrl("");
              setError("");
            } else {
              inputRef.current?.focus();
              setError("Please enter a valid url");
            }
          }}
        >
          Add
        </Button>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </Field>
  );
};

const Field = ({
  children,
  id,
  label,
}: {
  children: ReactNode;
  id: string;
  label: string;
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id}>{label}</label>
      {children}
    </div>
  );
};
