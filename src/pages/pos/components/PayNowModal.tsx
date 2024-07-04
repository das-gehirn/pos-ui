import ViewElement from "@/components/ViewElement";
import SelectField from "@/components/customFields/Select/SelectField";
import InputField from "@/components/customFields/input/InputField";
import NumberField from "@/components/customFields/input/NumberField";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrderSummary from "./OrderSummary";
import usePosStore from "@/store/usePosStore";
import { HandlerProps } from "@/components/customFields/type";
import { BANK_NAME_OPTIONS, TELECOM_NAME_OPTIONS, formatCurrency } from "@/helpers";
import { FC } from "react";
import { OptionsProps } from "@/interfaces";
import { MOP } from "@/interfaces/sales";

interface PayNowProps {
  customers: OptionsProps[];
}
const PayNowModal: FC<PayNowProps> = ({ customers }) => {
  const { getItemTotalAmount, getTotalItems, setState, getState } = usePosStore();
  const state = getState();
  const handleFieldChange = (data: HandlerProps) => {
    console.log(data);

    setState({ [data.key]: data.value });
  };

  const changeAmount = state.amountPaid - getItemTotalAmount() || 0;
  const hasArrears = changeAmount < 0;

  const handleTabChange = (mop: string) => {
    const modeOfPayment = mop as MOP;
    switch (modeOfPayment) {
      case "cash":
        setState({
          mobileMoneyPayment: undefined,
          bankPayment: undefined,
          chequePayment: undefined
        });
        break;
      case "mobile money":
        setState({
          bankPayment: undefined,
          chequePayment: undefined
        });
        break;
      case "bank":
        setState({
          mobileMoneyPayment: undefined,
          chequePayment: undefined
        });
        break;
      case "cheque":
        setState({
          mobileMoneyPayment: undefined,
          bankPayment: undefined
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
          <TabsContent value="cash">
            <NumberField
              handleInputChange={handleFieldChange}
              fieldKey="amountPaid"
              label="Amount paid"
              value={state.amountPaid}
            />
          </TabsContent>

          <TabsContent value="mobile money">
            <NumberField
              handleInputChange={handleFieldChange}
              fieldKey="amountPaid"
              label="Amount paid"
              value={state.amountPaid}
            />
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
            <NumberField
              handleInputChange={handleFieldChange}
              fieldKey="amountPaid"
              label="Amount paid"
              value={state.amountPaid}
            />
            <SelectField
              fieldKey="bankPayment.bankName"
              options={BANK_NAME_OPTIONS}
              label="Bank name"
              selectValue={state?.bankPayment?.bankName}
              onChange={handleFieldChange}
              isSearchable
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
            <NumberField
              handleInputChange={handleFieldChange}
              fieldKey="amountPaid"
              label="Amount paid"
              value={state.amountPaid}
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
              fieldKey="chequePayment.chequeNumber"
              handleInputChange={handleFieldChange}
              label="Cheque Number"
              maxLength={10}
              value={state?.chequePayment?.chequeNumber}
            />
          </TabsContent>
        </Tabs>
        <OrderSummary totalItemAmount={getItemTotalAmount()} totalItems={getTotalItems()} />
        <div className="flex items-center justify-between gap-x-3">
          <h1 className="font-bold text-sm flex-1">Amount paid:</h1>
          <p className="text-right flex-1">{formatCurrency(state.amountPaid || 0)}</p>
        </div>
        {!hasArrears && (
          <div className="flex items-center justify-between gap-x-3">
            <h1 className="font-bold text-sm flex-1">Change to give:</h1>
            <p className="text-right flex-1">{formatCurrency(changeAmount)}</p>
          </div>
        )}
        {hasArrears && (
          <div className="flex items-center justify-between gap-x-3">
            <h1 className="font-bold text-sm flex-1 text-red-500">Arrears</h1>
            <p className="text-right flex-1">{formatCurrency(changeAmount)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PayNowModal;
