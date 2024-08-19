import { DefaultPluginProps } from ".";
import { MOP, NetworkType } from "./expenditure";

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
  chequeNumber?: number;
  transactionId?: string;
  networkType?: NetworkType;
  supplier?: string;
  remarks?: string;
}
