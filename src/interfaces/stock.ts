import { DefaultPluginProps } from ".";
import { ProductProps } from "./products";
import { StockCreditorProps } from "./stockCreditors";
import { SupplierProps } from "./supplier";
import { UserProps } from "./user";

export type StockDataStatus = "received" | "partially received";

export interface StockDataProps {
  section?: string;
  remarks?: string;
  productId: string;
  quantityExpected: number;
  quantityReceived: number;
  status?: StockDataStatus;
  batchId?: string;
}

export type StockStatus = "pending" | "approved" | "rejected";

export interface StockProps extends DefaultPluginProps {
  deliveryId: string;
  stockData: StockDataProps[];
  receivedDate?: Date;
  supplierId: string;
  truckNumber: string;
  accountId: string;
  warehouseId: string;
  status?: StockStatus;

  // virtual
  supplier?: SupplierProps;
  products?: ProductProps[];
  createdByData?: UserProps;
  creditorData?: StockCreditorProps;
}
