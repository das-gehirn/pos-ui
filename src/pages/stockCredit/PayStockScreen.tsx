import PrimaryButton from "@/components/PrimaryButton";
import SelectField from "@/components/customFields/Select/SelectField";
import InputField from "@/components/customFields/input/InputField";
import NumberField from "@/components/customFields/input/NumberField";
import TextAreaField from "@/components/customFields/input/TextAreaField";
import { HandlerProps } from "@/components/customFields/type";
import DashboardLayout from "@/components/dashboard/Layout";
import PageContainer from "@/components/dashboard/PageContainer";
import { defaultStockCreditorPayment } from "@/defaults";
import { formatCurrency, objectDifference } from "@/helpers";
import { useGeneralQuery } from "@/hooks/request/useGeneralQuery";
import { GetManyProps } from "@/hooks/types";
import { useFormFieldUpdate } from "@/hooks/useFormFieldUpdate";
import { useSetQueryParam } from "@/hooks/useSetQueryParam";
import { OptionsProps } from "@/interfaces";
import { StockCreditorProps } from "@/interfaces/stockCreditors";
import { useEffect, useState } from "react";
import ModeOfPaymentForm from "../expenditure/components/ModeOfPaymentForm";
import CheckBoxField from "@/components/customFields/combo/CheckBoxField";
import { useGeneralMutation } from "@/hooks/request/useGeneralMutation";
import { useNavigate } from "react-router-dom";
import { StockCreditorPaymentProps } from "@/interfaces/stockPayments";
import { toast } from "sonner";

const PayStockScreen = () => {
  const defaultObj = defaultStockCreditorPayment();
  const { queryObject } = useSetQueryParam();
  const { formValues, updateFormFieldValue } = useFormFieldUpdate(defaultObj);
  const creditId = queryObject?.creditId;
  const [stockCredit, setStockCredit] = useState<StockCreditorProps>();
  const navigate = useNavigate();

  const { isPending, mutate } = useGeneralMutation<StockCreditorPaymentProps>({
    mutationKey: ["stockPayments"],
    url: "/stock-payments",
    httpMethod: "post"
  });

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
      updateFormFieldValue("creditorId", stock?.id);
      updateFormFieldValue("stockId", stock?.stockId);
      updateFormFieldValue("amountPaid", stock?.amount);
      updateFormFieldValue("supplier", stock?.supplierData?.name);
      updateFormFieldValue("supplierId", stock?.supplierId);
      setStockCredit(stock);
    }
  }, [creditId, stockOptions.length]);

  const formFieldChangeHandler = (data: HandlerProps) => {
    const { key, value } = data;

    if (key === "creditorId") {
      const stock = getStock(value);
      updateFormFieldValue("supplier", stock?.supplierData?.name);
      updateFormFieldValue("amountPaid", stock?.amount);
      updateFormFieldValue("stockId", stock?.stockId);
      updateFormFieldValue("supplierId", stock?.supplierId);
      setStockCredit(stock);
    }
    if (key === "hasReceipt" && !value) {
      updateFormFieldValue("receiptNumber", "");
    }
    updateFormFieldValue(key, value);
  };
  const payload = objectDifference(defaultObj, formValues) as StockCreditorPaymentProps;
  const handleFormSubmit = () => {
    mutate(
      { payload },
      {
        onSuccess() {
          navigate(`/stocks/creditors`);
          toast.success("Success", {
            description: "Payment recorded"
          });
        }
      }
    );
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
              Total Amount:{" "}
              <span className="ml-1 font-medium">{formatCurrency({ value: stockCredit?.amount || 0 })}</span>
            </div>
            <SelectField
              fieldKey="creditorId"
              options={stockOptions}
              label="Stock ID"
              selectValue={formValues?.creditorId}
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
            <ModeOfPaymentForm
              formFieldChangeHandler={formFieldChangeHandler}
              formValues={formValues}
              spaceSize="sm"
              disabled={isPending}
            />
            <CheckBoxField
              label={"Check if payment has receipt"}
              value={formValues?.hasReceipt}
              checked={formValues?.hasReceipt}
              handleFieldChange={formFieldChangeHandler}
              fieldKey="hasReceipt"
              disabled={isPending}
            />
            {formValues?.hasReceipt && (
              <InputField
                fieldKey="receiptNumber"
                handleInputChange={formFieldChangeHandler}
                label="Receipt Number"
                value={formValues?.receiptNumber}
                disabled={isPending}
              />
            )}
            <TextAreaField
              label="Remarks"
              fieldKey="remarks"
              handleInputChange={formFieldChangeHandler}
              value={formValues?.remarks}
              disabled={isPending}
            />
            <PrimaryButton
              text="Pay"
              className="mt-5"
              onClick={handleFormSubmit}
              disabled={isPending}
              loading={isPending}
            />
          </div>
        </div>
      </PageContainer>
    </DashboardLayout>
  );
};

export default PayStockScreen;
