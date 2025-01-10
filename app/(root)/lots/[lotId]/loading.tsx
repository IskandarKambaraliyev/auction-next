import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="py-12">
      <div className="container max-lg:flex flex-col grid grid-cols-2 gap-8">
        <div className="flex flex-col gap-4">
          <Skeleton className="w-full h-28 rounded-lg" />

          <Skeleton className="w-full h-[50rem] rounded-lg" />
        </div>

        <div className="flex flex-col gap-8">
          <Skeleton className="w-full h-[40rem] rounded-lg" />

          <Skeleton className="w-full h-[12rem] rounded-lg" />
        </div>
      </div>
    </div>
  );
}
