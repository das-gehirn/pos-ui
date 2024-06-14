import { DefaultPluginProps } from ".";
import { ProductProps } from "./products";
import { SupplierProps } from "./supplier";
import { UserProps } from "./users";

export type StockDataStatus = "received" | "partially received";

export interface StockDataProps {
  section?: string;
  remarks?: string;
  productId: string;
  quantityExpected: number;
  quantityReceived: number;
  status?: StockDataStatus;
}

export type StockStatus = "pending" | "approved" | "rejected";

export interface StockProps extends DefaultPluginProps {
  _id?: string;
  id?: string;
  batchId: string;
  stockData: StockDataProps[];
  receivedDate?: Date;
  supplierId: string;
  truckNumber: string;
  accountId: string;
  warehouseId: string;
  status?: StockStatus;

  // virtuals
  supplier?: SupplierProps;
  products?: ProductProps[];
  createdByData?: UserProps;
}
