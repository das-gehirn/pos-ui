import { DashboardStats, DashboardStatistics } from "@/interfaces/dashboard";
import { useGeneralQuery } from "./useGeneralQuery";

export const useDashboardStats = () => {
  const { data, isFetching, isRefetching, error, refetch } = useGeneralQuery<DashboardStats>({
    queryKey: ["dashboard-stats"],
    url: "/dashboard-data",
    requireAuth: true,
    enabled: true
  });

  return {
    dashboardStats: data,
    isLoading: isFetching || isRefetching,
    error,
    refetch
  };
};

export const useDashboardStatistics = () => {
  const { data, isFetching, isRefetching, error, refetch } = useGeneralQuery<DashboardStatistics>({
    queryKey: ["dashboard-charts"],
    url: "/dashboard/charts",
    requireAuth: true,
    enabled: true
  });

  return {
    statistics: data,
    isLoading: isFetching || isRefetching,
    error,
    refetch
  };
};
