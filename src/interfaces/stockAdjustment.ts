import { DefaultPluginProps } from ".";
import { ProductProps } from "./products";

type AdjustmentType = "increment" | "decrement";
export const adjustmentTypes: AdjustmentType[] = ["increment", "decrement"];

export type StockAdjustmentType = "addition" | "removal" | "correction";

export const stockAdjustmentTypes: StockAdjustmentType[] = ["addition", "removal", "correction"];

export interface StockAdjustmentProps extends DefaultPluginProps {
  productId: string;
  quantity: number;
  quantityBeforeAdjustment?: number;
  type?: StockAdjustmentType;
  reason?: string;
  reference?: string; // External reference ID (e.g., orderId, returnId)
  accountId: string;
  warehouseId: string;
  product?: ProductProps;
}
