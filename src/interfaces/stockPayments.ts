import { DefaultPluginProps } from ".";
import { MOP, NetworkType } from "./expenditure";
import { StockProps } from "./stock";
import { SupplierProps } from "./supplier";

export interface StockCreditorPaymentProps extends DefaultPluginProps {
  _id?: string;
  amountPaid: number;
  modeOfPayment?: MOP;
  stockId: string;
  supplierId: string;
  accountId: string;
  warehouseId: string;
  receiptNumber?: string;
  transactionNumber?: string;
  bankAccountNumber?: string;
  bankName?: string;
  bankBranch?: string;
  mobileMoneyNumber?: string;
  chequeNumber?: string;
  transactionId?: string;
  networkType?: NetworkType;
  supplier?: string;
  remarks?: string;
  hasReceipt?: boolean;
  creditorId: string;

  // virtual
  supplierData?: SupplierProps;
  stockData?: StockProps;
}
