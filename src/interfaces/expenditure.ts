import { DefaultPluginProps } from ".";
import { ExpenseTypeProps } from "./expenseType";
import { Discount } from "./invoice";
import { SubExpenseTypeProps } from "./subExpenseType";
import { UserProps } from "./user";

export type MOP = "cash" | "mobile money" | "bank" | "cheque";
export type NetworkType = "MTN" | "VODAFONE" | "Airtel Tigo";
export interface ExpenditureProps extends DefaultPluginProps {
  item: string;
  quantity: number;
  discount?: Discount;
  hasDiscount?: boolean;
  hasReceipt?: boolean;
  type?: "goods" | "services";
  pricePerQuantity: number;
  description?: string;
  modeOfPayment?: MOP;
  expenseHead?: string;
  subExpense?: string;
  warehouseId: string;
  accountId: string;
  receiptNumber?: string;
  transactionNumber?: string;
  bankAccountNumber?: string;
  bankName?: string;
  bankBranch?: string;
  mobileMoneyNumber?: string;
  chequeNumber?: number;
  transactionId?: string;
  networkType?: NetworkType;

  //
  createdByData?: UserProps;
  expenseHeadData?: ExpenseTypeProps;
  subExpenseHeadData?: SubExpenseTypeProps;
  totalAmount?: number;
}
