import { RoutesProps } from "@/interfaces/route";
import StockAdjustmentListScreen from "@/pages/stockAdjustment/StockAdjustmentListScreen";

export const STOCK_ADJUSTMENT_ROUTES: RoutesProps[] = [
  {
    component: StockAdjustmentListScreen,
    url: "/stock-adjustments",
    requireAuth: true,
    permission: ["stockAdjustments", "read"]
  }
];
