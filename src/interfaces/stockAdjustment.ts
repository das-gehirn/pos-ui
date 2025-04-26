import { DefaultPluginProps } from ".";

type AdjustmentType = "increment" | "decrement";
export const adjustmentTypes: AdjustmentType[] = ["increment", "decrement"];

export interface StockAdjustmentProps extends DefaultPluginProps {
  _id?: string;
  productId: string;
  quantityBeforeAdjustment?: number;
  quantityAdjusted: number;
  adjustmentType: AdjustmentType;
  reason: string;
  accountId: string;
  warehouseId: string;
}
