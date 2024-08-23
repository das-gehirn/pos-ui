import ViewElement from "@/components/ViewElement";
import SelectField from "@/components/customFields/Select/SelectField";
import InputField from "@/components/customFields/input/InputField";
import NumberField from "@/components/customFields/input/NumberField";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrderSummary from "./OrderSummary";
import usePosStore from "@/store/pos";
import { HandlerProps } from "@/components/customFields/type";
import { BANK_NAME_OPTIONS, TELECOM_NAME_OPTIONS, formatCurrency } from "@/helpers";
import { FC } from "react";
import { OptionsProps } from "@/interfaces";
import { MOP } from "@/interfaces/sales";
import { calculateDiscountAmount } from "@/utils";

interface PayNowProps {
  customers: OptionsProps[];
}
const PayNowModal: FC<PayNowProps> = ({ customers }) => {
  const { getItemTotalAmount, getTotalItems, setState, getState } = usePosStore();
  const state = getState();
  const handleFieldChange = (data: HandlerProps) => {
    setState({ [data.key]: data.value });
  };

  const calculateDiscount = calculateDiscountAmount(getItemTotalAmount(), getState().discount);
  const changeAmount = state.amountPaid - getItemTotalAmount() || 0;
  const discrepancy = Number(changeAmount.toFixed(2)) + Number(calculateDiscount.toFixed(2));
  const hasArrears = discrepancy < 0;

  const handleTabChange = (mop: string) => {
    const modeOfPayment = mop as MOP;
    switch (modeOfPayment) {
      case "cash":
        setState({
          mobileMoneyPayment: null,
          bankPayment: null,
          chequePayment: null
        });
        break;
      case "mobile money":
        setState({
          bankPayment: null,
          chequePayment: null
        });
        break;
      case "bank":
        setState({
          mobileMoneyPayment: null,
          chequePayment: null
        });
        break;
      case "cheque":
        setState({
          mobileMoneyPayment: null,
          bankPayment: null
        });
        break;

      default:
        break;
    }
    setState({ modeOfPayment });
  };
  return (
    <div className="relative">
      <ViewElement title="Customer Details" />
      <SelectField
        fieldKey="customerId"
        onChange={handleFieldChange}
        options={customers}
        label="Customer"
        selectValue={state.customerId}
      />
      <div className="my-5">
        <ViewElement title="Mode of Payment" />
        <Tabs defaultValue="cash" className="mb-5" onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="cash">Cash</TabsTrigger>
            <TabsTrigger value="mobile money">Mobile Money</TabsTrigger>
            <TabsTrigger value="bank">Bank</TabsTrigger>
            <TabsTrigger value="cheque">Cheque</TabsTrigger>
          </TabsList>
          <NumberField
            handleInputChange={handleFieldChange}
            fieldKey="amountPaid"
            label="Amount paid"
            value={state.amountPaid}
          />
          <TabsContent value="cash"></TabsContent>

          <TabsContent value="mobile money">
            <SelectField
              fieldKey="mobileMoneyPayment.networkType"
              options={TELECOM_NAME_OPTIONS}
              label="Network type"
              selectValue={state?.mobileMoneyPayment?.networkType}
              onChange={handleFieldChange}
              isSearchable
            />
            <InputField
              fieldKey="mobileMoneyPayment.mobileMoneyNumber"
              handleInputChange={handleFieldChange}
              label="Mobile money number"
              value={state?.mobileMoneyPayment?.mobileMoneyNumber}
              maxLength={10}
            />
            <InputField
              fieldKey="mobileMoneyPayment.transactionId"
              handleInputChange={handleFieldChange}
              label="Transaction Id"
              value={state?.mobileMoneyPayment?.transactionId}
            />
          </TabsContent>

          <TabsContent value="bank">
            <SelectField
              fieldKey="bankPayment.bankName"
              options={BANK_NAME_OPTIONS}
              label="Bank name"
              selectValue={state?.bankPayment?.bankName}
              onChange={handleFieldChange}
              isSearchable
            />
            <InputField
              fieldKey="bankPayment.branchBranch"
              handleInputChange={handleFieldChange}
              label="Bank branch"
              value={state?.bankPayment?.bankBranch}
            />
            <InputField
              fieldKey="bankPayment.bankAccountNumber"
              handleInputChange={handleFieldChange}
              label="Bank account number"
              value={state?.bankPayment?.bankAccountNumber}
            />
            <InputField
              fieldKey="bankPayment.transactionNumber"
              handleInputChange={handleFieldChange}
              label="Bank transaction number"
              value={state?.bankPayment?.transactionNumber}
            />
          </TabsContent>
          <TabsContent value="cheque">
            <InputField
              fieldKey="chequePayment.chequeNumber"
              handleInputChange={handleFieldChange}
              label="Cheque Number"
              maxLength={10}
              value={state?.chequePayment?.chequeNumber}
            />
            <SelectField
              fieldKey="chequePayment.bankName"
              options={BANK_NAME_OPTIONS}
              label="Bank name"
              selectValue={state?.chequePayment?.bankName}
              onChange={handleFieldChange}
              isSearchable
            />
            <InputField
              fieldKey="bankPayment.branchBranch"
              handleInputChange={handleFieldChange}
              label="Bank branch"
              value={state?.bankPayment?.bankBranch}
            />
          </TabsContent>
        </Tabs>
        <OrderSummary
          totalItemAmount={getItemTotalAmount()}
          totalItems={getTotalItems()}
          title=""
          discount={getState().discount}
        />
        <div className="flex items-center justify-between gap-x-3">
          <h1 className="font-bold text-sm flex-1">Amount paid:</h1>
          <p className="text-right flex-1">{formatCurrency({ value: state.amountPaid || 0 })}</p>
        </div>
        {!hasArrears && (
          <div className="flex items-center justify-between gap-x-3">
            <h1 className="font-bold text-sm flex-1">Change to give:</h1>
            <p className="text-right flex-1">{formatCurrency({ value: discrepancy })}</p>
          </div>
        )}
        {hasArrears && (
          <div className="flex items-center justify-between gap-x-3">
            <h1 className="font-bold text-sm flex-1 text-red-500">Arrears</h1>
            <p className="text-right flex-1">{formatCurrency({ value: discrepancy })}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PayNowModal;
