import { Skeleton } from "@/components/ui/skeleton";

const DashboardCardSkeleton = () => {
  return (
    <div
      className="space-y-2 relative p-6 bg-white rounded-sm border-gray-100 border"
      style={{ boxShadow: "#2123260a 0px 8px 16px" }}
    >
      <div className="heading flex gap-3 items-center">
        <Skeleton className="w-8 h-8 rounded" />
        <Skeleton className="h-4 flex-1" />
      </div>
      <Skeleton className="h-6 w-32" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
};

export default DashboardCardSkeleton;
