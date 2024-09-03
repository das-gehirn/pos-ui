import { DefaultPluginProps } from ".";
import { StockProps } from "./stock";
import { SupplierProps } from "./supplier";

export interface StockCreditorProps extends DefaultPluginProps {
  _id?: string;
  amount: number;
  stockId: string;
  supplierId: string;
  accountId: string;
  warehouseId: string;

  stockData?: StockProps;
  supplierData?: SupplierProps;
}
