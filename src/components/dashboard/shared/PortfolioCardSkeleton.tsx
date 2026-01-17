import { Skeleton } from "@/components/ui/skeleton";

const PortfolioCardSkeleton = () => {
  return (
    <div className="card min-h-[200px] bg-white w-full rounded-md flex flex-col justify-between px-8 py-6 border border-gray-100">
      <div className="flex flex-1 items-center justify-between">
        <div className="space-y-3 flex-1">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-6 w-40" />
        </div>
        <Skeleton className="rounded-full w-10 h-10" />
      </div>
      <div className="flex mt-3 justify-center flex-col flex-1">
        <Skeleton className="w-full h-2.5 rounded-full" />
        <div className="flex my-3 gap-3">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    </div>
  );
};

export default PortfolioCardSkeleton;
