import { DefaultPluginProps } from ".";
import { CustomerProps } from "./customer";
import { NetworkType } from "./expenditure";
import { InvoiceProps } from "./invoice";
import { UserProps } from "./user";

export interface Item {
  productId: string;
  quantity: number;
  price: number;
  _id?: string;
  id?: string;
}

export interface Discount {
  type: "fixed" | "percentage";
  amount: number;
}
export type MOP = "cash" | "mobile money" | "cheque" | "bank";
export interface SalesProps extends DefaultPluginProps {
  _id?: string;
  customerId: string;
  amountPaid: number;
  changeGiven: number;
  arrears: number;
  accountId?: string;
  warehouseId?: string;
  modeOfPayment: MOP;
  invoiceId: string;
  receiptNumber?: string;

  // virtuals
  invoiceData?: InvoiceProps;
  customerData?: CustomerProps;
  createdByData?: UserProps;
}

export type MobileMoneyPaymentProps = {
  networkType: NetworkType;
  mobileMoneyNumber: string;
  transactionId: string;
};
export type BankPaymentProps = {
  bankName: string;
  bankAccountNumber: number;
  bankBranch: string;
  transactionNumber: string;
};
export type ChequePaymentProps = {
  bankName: string;
  chequeNumber: number;
  bankBranch: string;
};
