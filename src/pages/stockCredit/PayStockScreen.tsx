import PrimaryButton from "@/components/PrimaryButton";
import SelectField from "@/components/customFields/Select/SelectField";
import InputField from "@/components/customFields/input/InputField";
import NumberField from "@/components/customFields/input/NumberField";
import TextAreaField from "@/components/customFields/input/TextAreaField";
import { HandlerProps } from "@/components/customFields/type";
import DashboardLayout from "@/components/dashboard/Layout";
import PageContainer from "@/components/dashboard/PageContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { defaultStockCreditorPayment } from "@/defaults";
import { BANK_NAME_OPTIONS, TELECOM_NAME_OPTIONS, formatCurrency } from "@/helpers";
import { useGeneralQuery } from "@/hooks/request/useGeneralQuery";
import { GetManyProps } from "@/hooks/types";
import { useFormFieldUpdate } from "@/hooks/useFormFieldUpdate";
import { useSetQueryParam } from "@/hooks/useSetQueryParam";
import { OptionsProps } from "@/interfaces";
import { StockCreditorProps } from "@/interfaces/stockCreditors";
import { Banknote, Landmark, NotepadText, Smartphone } from "lucide-react";
import { useEffect } from "react";

const PayStockScreen = () => {
  const { queryObject } = useSetQueryParam();
  const { formValues, updateFormFieldValue } = useFormFieldUpdate(defaultStockCreditorPayment());
  const creditId = queryObject?.creditId;

  const query = {
    deleted: false
  };
  const { data, isFetching } = useGeneralQuery<GetManyProps<StockCreditorProps[]>>({
    queryKey: ["stockCreditors", query],
    url: "/stock-creditors",
    query,
    enabled: true
  });

  const stockOptions: OptionsProps[] =
    data?.data?.map((st) => {
      return {
        label: st?.stockData?.deliveryId || "",
        value: st?._id || ""
      };
    }) || [];

  const getStock = (stockId: string) => {
    return data?.data?.find((stock) => stock._id === stockId);
  };
  useEffect(() => {
    if (creditId && stockOptions.length) {
      const stock = getStock(creditId);
      updateFormFieldValue("stockId", stock?.stockId);
      updateFormFieldValue("supplier", stock?.supplierData?.name);
    }
  }, [creditId]);

  const formFieldChangeHandler = (data: HandlerProps) => {
    const { key, value } = data;

    if (key === "stockId") {
      const stock = getStock(value);
      updateFormFieldValue("supplier", stock?.supplierData?.name);
    }
    updateFormFieldValue(key, value);
  };
  const handleCheckBoxValueChange = (value: string) => {
    formFieldChangeHandler({ value, key: "modeOfPayment" });
  };
  return (
    <DashboardLayout
      pageTitle="Pay Stock creditor"
      pageDescription="Fill the form to pay this stock"
      isLoading={isFetching}
    >
      <PageContainer>
        <div className="flex items-center justify-center flex-col">
          <div className="lg:w-1/2 w-full">
            <div className="flex justify-end">
              Total Amount: <span className="ml-1 font-medium">{formatCurrency({ value: 0 })}</span>
            </div>
            <SelectField
              fieldKey="stockId"
              options={stockOptions}
              label="Stock ID"
              selectValue={formValues?.stockId}
              onChange={formFieldChangeHandler}
            />
            <InputField
              disabled
              fieldKey=""
              handleInputChange={() => {}}
              label="Supplier"
              value={formValues?.supplier}
            />
            <NumberField
              label="Amount to pay"
              fieldKey="amountPaid"
              handleInputChange={formFieldChangeHandler}
              value={formValues?.amountPaid}
            />
            <Card className="border-none shadow-none">
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Select a new payment method.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <RadioGroup
                  className="grid md:grid-cols-2 lg:grid-cols-4 gap-4"
                  onValueChange={handleCheckBoxValueChange}
                  value={formValues?.modeOfPayment}
                >
                  <div>
                    <RadioGroupItem value="cash" id="cash" className="peer sr-only" aria-label="Cash" />
                    <Label
                      htmlFor="cash"
                      className="flex flex-col items-center gap-y-2 justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary min-h-16"
                    >
                      <Banknote />
                      <span className="text-center">Cash</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem
                      value="mobile money"
                      id="mobile-money"
                      className="peer sr-only"
                      aria-label="Mobile Money"
                    />
                    <Label
                      htmlFor="mobile-money"
                      className="flex flex-col items-center gap-y-2 justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary min-h-16"
                    >
                      <Smartphone />
                      <span className="text-center">Momo</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="bank" id="bank" className="peer sr-only" aria-label="Bank" />
                    <Label
                      htmlFor="bank"
                      className="flex flex-col items-center gap-y-2 justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary min-h-16"
                    >
                      <Landmark />
                      <span className="text-center">Bank</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="cheque" id="cheque" className="peer sr-only" aria-label="Cheque" />
                    <Label
                      htmlFor="cheque"
                      className="flex flex-col items-center gap-y-2 justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary min-h-16"
                    >
                      <NotepadText />
                      <span className="text-center">Cheque</span>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-x-5 gap-y-5 md:gap-y-0">
              {formValues?.modeOfPayment === "mobile money" && (
                <>
                  <SelectField
                    fieldKey="networkType"
                    options={TELECOM_NAME_OPTIONS}
                    onChange={formFieldChangeHandler}
                    label="Network type"
                    selectValue={formValues?.networkType}
                  />
                  <InputField
                    fieldKey="mobileMoneyNumber"
                    handleInputChange={formFieldChangeHandler}
                    label="Mobile money number"
                    value={formValues?.mobileMoneyNumber}
                  />
                  <InputField
                    fieldKey="transactionId"
                    handleInputChange={formFieldChangeHandler}
                    label="Transaction ID"
                    value={formValues?.transactionId}
                  />
                </>
              )}
              {formValues?.modeOfPayment === "bank" && (
                <>
                  <SelectField
                    fieldKey="bankName"
                    options={BANK_NAME_OPTIONS}
                    onChange={formFieldChangeHandler}
                    label="Bank name"
                    selectValue={formValues?.bankName}
                  />
                  <InputField
                    fieldKey="bankBranch"
                    handleInputChange={formFieldChangeHandler}
                    label="Bank branch"
                    value={formValues?.bankBranch}
                  />
                  <InputField
                    fieldKey="bankAccountNumber"
                    handleInputChange={formFieldChangeHandler}
                    label="Bank account number"
                    value={formValues?.bankAccountNumber}
                  />

                  <InputField
                    fieldKey="transactionNumber"
                    handleInputChange={formFieldChangeHandler}
                    label="Bank transaction number"
                    value={formValues?.transactionNumber}
                  />
                </>
              )}

              {formValues?.modeOfPayment === "cheque" && (
                <>
                  <InputField
                    fieldKey="chequeNumber"
                    handleInputChange={formFieldChangeHandler}
                    label="Cheque Number"
                    value={formValues?.chequeNumber}
                  />
                  <SelectField
                    fieldKey="bankName"
                    options={BANK_NAME_OPTIONS}
                    onChange={formFieldChangeHandler}
                    label="Bank name"
                    selectValue={formValues?.bankName}
                  />
                  <InputField
                    fieldKey="bankBranch"
                    handleInputChange={formFieldChangeHandler}
                    label="Bank branch"
                    value={formValues?.bankBranch}
                  />
                </>
              )}
            </div>
            <TextAreaField label="Remarks" fieldKey="remarks" handleInputChange={formFieldChangeHandler} value={formValues?.remarks} />
            <PrimaryButton text="Pay" className="mt-5" />
          </div>
        </div>
      </PageContainer>
    </DashboardLayout>
  );
};

export default PayStockScreen;
