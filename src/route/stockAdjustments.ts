import { RoutesProps } from "@/interfaces/route";
import CreateStockAdjustmentScreen from "@/pages/stockAdjustment/CreateStockAdjustmentScreen";
import StockAdjustmentListScreen from "@/pages/stockAdjustment/StockAdjustmentListScreen";

export const STOCK_ADJUSTMENT_ROUTES: RoutesProps[] = [
  {
    component: StockAdjustmentListScreen,
    url: "/stock-adjustments",
    requireAuth: true,
    permission: ["stockAdjustments", "read"]
  },
  {
    component: CreateStockAdjustmentScreen,
    url: "/stock-adjustments/create",
    requireAuth: true,
    permission: ["stockAdjustments", "create"]
  }
];
