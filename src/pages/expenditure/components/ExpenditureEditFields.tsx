import PrimaryButton from "@/components/PrimaryButton";
import SelectField from "@/components/customFields/Select/SelectField";
import CheckBoxField from "@/components/customFields/combo/CheckBoxField";
import InputField from "@/components/customFields/input/InputField";
import NumberField from "@/components/customFields/input/NumberField";
import TextAreaField from "@/components/customFields/input/TextAreaField";
import { HandlerProps } from "@/components/customFields/type";
import DashboardLayout from "@/components/dashboard/Layout";
import PageContainer from "@/components/dashboard/PageContainer";
import { ExpenditureProps } from "@/interfaces/expenditure";
import { FC } from "react";

import { formatCurrency } from "@/helpers";
import { INVOICE_DISCOUNT_TYPE_OPTIONS } from "@/interfaces/invoice";
import { OptionsProps } from "@/interfaces";
import { calculateDiscountAmount } from "@/utils";
import ModeOfPaymentForm from "./ModeOfPaymentForm";

interface ExpenditureEditFieldsProps {
  buttonTitle: string;
  formValues?: ExpenditureProps;
  onsubmitHandler: () => void;
  formFieldChangeHandler: (data: HandlerProps) => void;
  isLoading?: boolean;
  pageTitle: string;
  disabledButton?: boolean;
  pageDescription: string;
  isSubmitting?: boolean;
  expenseOptions: OptionsProps[];
  subExpenseOptions: OptionsProps[];
}
const ExpenditureEditFields: FC<ExpenditureEditFieldsProps> = ({
  buttonTitle,
  formValues,
  formFieldChangeHandler,
  onsubmitHandler,
  pageDescription,
  pageTitle,
  disabledButton,
  isLoading,
  isSubmitting,
  expenseOptions,
  subExpenseOptions
}) => {
  const discountValue = formValues?.discount?.value || 0;
  const discountType = formValues?.discount?.type;
  const discountText = discountType === "percentage" ? `${discountValue}%` : discountValue;
  const totalAmount = (formValues?.quantity || 0) * (formValues?.pricePerQuantity || 0) || 0;
  const calculateDiscounted = calculateDiscountAmount(totalAmount, formValues?.discount);

  return (
    <DashboardLayout pageTitle={pageTitle} pageDescription={pageDescription} isLoading={isLoading}>
      <PageContainer>
        <h1 className="text-xl">Expenditure information</h1>
        <TextAreaField
          handleInputChange={formFieldChangeHandler}
          fieldKey="item"
          label="Item"
          value={formValues?.item}
        />
        <div className="grid md:grid-cols-2 gap-5">
          <NumberField
            fieldKey="quantity"
            handleInputChange={formFieldChangeHandler}
            label="Quantity"
            value={formValues?.quantity}
            min={1}
          />
          <NumberField
            fieldKey="pricePerQuantity"
            handleInputChange={formFieldChangeHandler}
            label="Amount per Quantity"
            value={formValues?.pricePerQuantity}
            min={0}
          />
        </div>
        <ModeOfPaymentForm formFieldChangeHandler={formFieldChangeHandler} formValues={formValues} spaceSize="sm" />

        <div className="flex gap-x-5 flex-wrap">
          <CheckBoxField
            label={"Check if expenditure has discount"}
            handleFieldChange={formFieldChangeHandler}
            fieldKey="hasDiscount"
            name="hasDiscount"
            value={formValues?.hasDiscount}
            checked={formValues?.hasDiscount}
          />
          <CheckBoxField
            label={"Check if expenditure has receipt"}
            value={formValues?.hasReceipt}
            checked={formValues?.hasReceipt}
            handleFieldChange={formFieldChangeHandler}
            fieldKey="hasReceipt"
          />
        </div>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-5">
          {formValues?.hasDiscount && (
            <>
              <SelectField
                fieldKey="discount.type"
                options={INVOICE_DISCOUNT_TYPE_OPTIONS}
                onChange={formFieldChangeHandler}
                label="Discount type"
                selectValue={formValues?.discount?.type}
              />
              <NumberField
                fieldKey="discount.value"
                handleInputChange={formFieldChangeHandler}
                label="Discount value"
                value={formValues?.discount?.value}
                min={0}
                max={100}
              />
            </>
          )}
          {formValues?.hasReceipt && (
            <InputField
              fieldKey="receiptNumber"
              handleInputChange={formFieldChangeHandler}
              label="Receipt Number"
              value={formValues?.receiptNumber}
            />
          )}
          <SelectField
            fieldKey="type"
            options={[
              { label: "Goods", value: "goods" },
              { label: "Services", value: "services" }
            ]}
            onChange={formFieldChangeHandler}
            label="Expenses type"
            selectValue={formValues?.type}
          />
          <SelectField
            fieldKey="expenseHead"
            options={expenseOptions}
            onChange={formFieldChangeHandler}
            label="Expense head"
            selectValue={formValues?.expenseHead}
          />
          <SelectField
            fieldKey="subExpense"
            options={subExpenseOptions}
            onChange={formFieldChangeHandler}
            label="Sub Expense"
            selectValue={formValues?.subExpense}
          />
        </div>
        {/* {formValues?.hasReceipt && (
      <div className="space-y-2">
        <Label>Receipt Image</Label>
        <FileDropzone onChange={() => {}} />
      </div>
    )} */}
        <div>
          <TextAreaField
            handleInputChange={formFieldChangeHandler}
            fieldKey="description"
            label="Description"
            value={formValues?.description}
          />
        </div>
        <h1 className="mt-4">
          Total Amount:
          <span className="font-medium">{formatCurrency({ value: totalAmount })}</span>
        </h1>
        <h1 className="!mt-0.5">
          Discount({discountText})<span className="font-medium">{formatCurrency({ value: calculateDiscounted })}</span>
        </h1>
        <h1 className="!mt-0.5">
          Sub Total<span className="font-medium">{formatCurrency({ value: totalAmount - calculateDiscounted })}</span>
        </h1>
        <div className="flex items-end justify-end">
          <PrimaryButton
            text={buttonTitle}
            className="w-1/3"
            onClick={onsubmitHandler}
            disabled={isLoading || disabledButton}
            loading={isSubmitting}
          />
        </div>
      </PageContainer>
    </DashboardLayout>
  );
};

export default ExpenditureEditFields;
