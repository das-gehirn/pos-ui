import { Skeleton } from "@/components/ui/skeleton";
import { FC } from "react";

interface ChartSkeletonProps {
  height?: number;
  showHeader?: boolean;
  headerTitle?: string;
}

const ChartSkeleton: FC<ChartSkeletonProps> = ({ 
  height = 400, 
  showHeader = false 
}) => {
  return (
    <div className="p-3 bg-white">
      {showHeader && (
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-[180px]" />
        </div>
      )}
      <Skeleton className="w-full" style={{ height: `${height}px` }} />
    </div>
  );
};

export default ChartSkeleton;
