import SelectField from "@/components/customFields/Select/SelectField";
import DatePicker from "@/components/customFields/date/DatePicker";
import DashboardLayout from "@/components/dashboard/Layout";
import PageContainer from "@/components/dashboard/PageContainer";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { FC, useState } from "react";
import InvoiceItemModal from "./InvoiceItemModal";
import InvoiceItemHeader from "./InvoiceItemHeader";
import InvoiceItem from "./InvoiceItem";
import TextAreaField from "@/components/customFields/input/TextAreaField";
import CheckBoxField from "@/components/customFields/combo/CheckBoxField";
import NumberField from "@/components/customFields/input/NumberField";
import { HandlerProps } from "@/components/customFields/type";
import { useFormFieldUpdate } from "@/hooks/useFormFieldUpdate";
import { useGeneralQuery } from "@/hooks/request/useGeneralQuery";
import { CustomerProps } from "@/interfaces/customer";
import { GetManyProps } from "@/hooks/types";
import { OptionsProps } from "@/interfaces";
import {
  INVOICE_DISCOUNT_TYPE_OPTIONS,
  INVOICE_FREQUENCY_OPTIONS,
  InvoiceItem as InvoiceItemProps,
  InvoiceProps
} from "@/interfaces/invoice";
import { ProductProps } from "@/interfaces/products";
import PrimaryButton from "@/components/PrimaryButton";

import BillingAddress from "./BillingAddress";
import InvoiceSummary from "./InvoiceSummary";
import { computeInvoiceAmounts } from "@/utils";

interface InvoiceEditFieldsProps {
  buttonTitle: string;
  formFields?: InvoiceProps;
  onsubmitHandler: () => void;
  handleFormFieldChange: (data: HandlerProps) => void;
  isLoading?: boolean;
  pageTitle: string;
  disabledButton?: boolean;
  pageDescription: string;
  disableFields?: boolean;
}
const InvoiceEditFields: FC<InvoiceEditFieldsProps> = ({
  buttonTitle,
  formFields,
  handleFormFieldChange,
  onsubmitHandler,
  pageDescription,
  pageTitle,
  disabledButton,
  isLoading,
  disableFields
}) => {
  const invoiceItemDefault = {
    _id: "",
    quantity: 0,
    price: 0,
    name: ""
  };
  const {
    formValues: invoiceItemValues,
    updateFormFieldValue: updateInvoiceItemFormValue,
    setFormValues: resetInvoiceItemValues
  } = useFormFieldUpdate(invoiceItemDefault);
  const [showModal, setShowModal] = useState(false);
  const handleShowAddItemModal = () => {
    setShowModal(!showModal);
  };

  const handleInvoiceItemFormFieldChange = (data: HandlerProps) => {
    const { key, value } = data;
    const product = products?.data.find((prod) => prod._id === value);
    if (key === "_id") {
      updateInvoiceItemFormValue("price", product?.productSellingPrice);
    }
    updateInvoiceItemFormValue(key, value);
  };

  const { data: customers, isFetching } = useGeneralQuery<GetManyProps<CustomerProps[]>>({
    queryKey: ["customers"],
    url: "/customers",
    query: { deleted: false },
    enabled: true,
    requireAuth: true
  });
  const { data: products, isFetching: isFetchingProducts } = useGeneralQuery<GetManyProps<ProductProps[]>>({
    queryKey: ["products"],
    url: "/products",
    query: { deleted: false },
    enabled: true,
    requireAuth: true
  });

  const customerOptions: OptionsProps[] =
    customers?.data.map((customer) => {
      return {
        label: `${customer.firstName} ${customer.lastName}`,
        value: customer._id || ""
      };
    }) || [];
  const productsOptions: OptionsProps[] =
    products?.data.map((product) => {
      return {
        label: `${product.name}`,
        value: product._id || ""
      };
    }) || [];

  const handleInvoiceItemAdded = (item: InvoiceItemProps) => {
    const getItem = productsOptions.find((prod) => prod.value === item._id);
    const finalItem = {
      ...item,
      name: getItem?.label
    };
    const items = formFields?.items || [];
    items.push(finalItem);
    handleFormFieldChange({ key: "items", value: items });
    resetInvoiceItemValues(invoiceItemDefault);
  };
  const handleInvoiceItemRemove = (id: string) => {
    const items = formFields?.items.filter((item) => item._id !== id);
    if (items?.length === 0) {
      handleFormFieldChange({ key: "discount", value: undefined });
      handleFormFieldChange({ key: "hasDiscount", value: false });
    }
    handleFormFieldChange({ key: "items", value: items });
  };

  const { invoiceDiscountTotal, invoiceSubTotal } = computeInvoiceAmounts({
    discount: formFields?.discount,
    items: formFields?.items || []
  });

  const enableInvoiceButton = Boolean(formFields?.items.length && formFields?.customerId && formFields?.invoiceDate);
  const selectedCustomer = customers?.data?.find((cus) => cus?._id === formFields?.customerId);

  const invoiceIsPaidOrExpired = !["expired", "paid"].includes(formFields?.status || "");
  return (
    <DashboardLayout
      pageTitle={pageTitle}
      pageDescription={pageDescription}
      isLoading={isFetching || isFetchingProducts || isLoading}
    >
      <PageContainer>
        <div className="flex items-center justify-end">
          <div className="w-1/3">
            <SelectField
              options={customerOptions}
              fieldKey="customerId"
              label="Customer"
              onChange={handleFormFieldChange}
              selectValue={formFields?.customerId}
              isDisabled={!invoiceIsPaidOrExpired || isFetching || isLoading || disableFields}
            />
          </div>
        </div>
        <div className="md:flex items-center justify-between relative">
          <BillingAddress
            address={{ poBox: "P.O BOX 34", state: "Ekwamkurom", city: "Agona Swdru" }}
            email="admin@oseikrom.com"
            name="Oseikrom Hardware Enterprise"
            phone={{ number: "543814868", country: "GH", prefix: "233" }}
            type="from"
            showEditAddress={false}
          />
          <div className="absolute md:border-r h-full bg-red-50 left-1/2"></div>
          <BillingAddress
            address={selectedCustomer?.address || {}}
            email={selectedCustomer?.email || ""}
            name={`${selectedCustomer?.firstName || "N/A"} ${selectedCustomer?.lastName || "N/A"}`}
            phone={selectedCustomer?.phone}
            type="to"
            showEditAddress={!!selectedCustomer?._id}
            editAddressURL={`/customers/${selectedCustomer?._id}/edit`}
          />
        </div>

        <div className="md:flex items-center justify-end">
          <div className="lg:w-[40%] flex justify-between gap-x-4">
            <div className="flex-1">
              <DatePicker
                fieldKey="invoiceDate"
                label="Invoice Date"
                onChange={handleFormFieldChange}
                value={formFields?.invoiceDate}
                disabled={!invoiceIsPaidOrExpired || isFetching || isLoading || disableFields}
              />
            </div>
            <div className="flex-1">
              <DatePicker
                fieldKey="dueDate"
                label="Invoice Due Date"
                onChange={handleFormFieldChange}
                value={formFields?.dueDate}
                disabled={!invoiceIsPaidOrExpired || isFetching || isLoading || disableFields}
              />
            </div>
          </div>
        </div>

        {false && (
          <div className="recurring_container md:flex items-center justify-between gap-x-5">
            <div className="flex-1">
              <CheckBoxField
                fieldKey="isRecurring"
                label="Is invoice recurring?"
                handleFieldChange={handleFormFieldChange}
                value={formFields?.isRecurring}
                disabled={!invoiceIsPaidOrExpired || isFetching || isLoading || disableFields}
              />
            </div>
            {formFields?.isRecurring && (
              <>
                <div className="flex-1">
                  <SelectField
                    options={INVOICE_FREQUENCY_OPTIONS}
                    label="Frequency"
                    fieldKey="recurrence.frequency"
                    onChange={handleFormFieldChange}
                    selectValue={formFields?.recurrence?.frequency}
                    isDisabled={!invoiceIsPaidOrExpired || isFetching || isLoading || disableFields}
                  />
                </div>
                <div className="flex-1">
                  <NumberField
                    fieldKey="recurrence.interval"
                    label="Interval"
                    handleInputChange={handleFormFieldChange}
                    value={formFields?.recurrence?.interval}
                    disabled={!invoiceIsPaidOrExpired || isFetching || isLoading || disableFields}
                  />
                </div>
                <div className="flex-1">
                  <NumberField
                    fieldKey="recurrence.cycle"
                    label="Cycle"
                    handleInputChange={handleFormFieldChange}
                    value={formFields?.recurrence?.cycle}
                    disabled={!invoiceIsPaidOrExpired || isFetching || isLoading || disableFields}
                  />
                </div>
              </>
            )}
          </div>
        )}
        <div className="items-container my-10 border py-5 px-10 space-y-5">
          <h1 className="font-medium">Invoice Details</h1>
          <InvoiceItemHeader />
          {formFields?.items &&
            formFields?.items.length > 0 &&
            formFields.items.map((item) => {
              return (
                <InvoiceItem
                  item={{ amount: item.price, name: item.name || "", quantity: item.quantity }}
                  key={item._id}
                  handleInvoiceItemRemove={handleInvoiceItemRemove}
                  id={item._id || ""}
                  showDelete={invoiceIsPaidOrExpired}
                />
              );
            })}
        </div>
        {invoiceIsPaidOrExpired && (
          <div className="add_item_container flex justify-end">
            <Button
              variant={"link"}
              className="font-bold"
              onClick={handleShowAddItemModal}
              disabled={!invoiceIsPaidOrExpired || isFetching || isLoading || disableFields}
            >
              <span>
                <Plus size={16} />
              </span>
              <span>Add item</span>
            </Button>
          </div>
        )}

        {formFields?.items && formFields?.items.length > 0 && (
          <div className="discount_container md:flex items-center justify-between gap-x-5">
            <div className="flex-1">
              <CheckBoxField
                fieldKey="hasDiscount"
                label="Invoice has discount?"
                handleFieldChange={handleFormFieldChange}
                value={formFields?.hasDiscount}
                disabled={invoiceSubTotal === 0 || !invoiceIsPaidOrExpired || isFetching || isLoading || disableFields}
              />
            </div>
            {formFields?.hasDiscount && (
              <>
                <div className="flex-1">
                  <SelectField
                    options={INVOICE_DISCOUNT_TYPE_OPTIONS}
                    label="Discount Type"
                    fieldKey="discount.type"
                    onChange={handleFormFieldChange}
                    selectValue={formFields?.discount?.type}
                    isDisabled={!invoiceIsPaidOrExpired || isFetching || isLoading || disableFields}
                  />
                </div>
                <div className="flex-1">
                  <NumberField
                    fieldKey="discount.value"
                    handleInputChange={handleFormFieldChange}
                    label="Discount Value"
                    value={formFields?.discount?.value}
                    min={0}
                    max={100}
                    disabled={!invoiceIsPaidOrExpired || isFetching || isLoading || disableFields}
                  />
                </div>
              </>
            )}
          </div>
        )}
        <div className="my-5 md:flex items-center justify-between gap-x-5">
          <div className="flex-1 w-full">
            <TextAreaField
              fieldKey="termsAndCondition"
              handleInputChange={handleFormFieldChange}
              label={"Terms and conditions"}
              value={formFields?.termsAndCondition}
              disabled={!invoiceIsPaidOrExpired || isFetching || isLoading || disableFields}
            />
          </div>
          <div className="flex-1 w-full">
            <TextAreaField
              fieldKey="note"
              handleInputChange={handleFormFieldChange}
              label={"Notes"}
              value={formFields?.note}
              disabled={!invoiceIsPaidOrExpired || isFetching || isLoading || disableFields}
            />
          </div>
        </div>
        <div className="md:flex item-center justify-end">
          <div className="md:w-1/2 flex items-end justify-end flex-col">
            <InvoiceSummary
              discount={formFields?.discount}
              invoiceDiscountTotal={invoiceDiscountTotal}
              invoiceSubTotal={invoiceSubTotal}
            />
            {invoiceIsPaidOrExpired && (
              <div className="Submit-button lg:w-1/3 flex justify-end flex-1">
                <PrimaryButton
                  text={buttonTitle}
                  onClick={onsubmitHandler}
                  disabled={!enableInvoiceButton || isLoading || isFetching || isFetchingProducts || disabledButton}
                  loading={isFetching || isFetchingProducts || isLoading || disableFields}
                />
              </div>
            )}
          </div>
        </div>
        {showModal && (
          <InvoiceItemModal
            handleShowModal={handleShowAddItemModal}
            showModal={showModal}
            invoiceItem={invoiceItemValues}
            handleFormFieldChange={handleInvoiceItemFormFieldChange}
            productOptions={productsOptions}
            emitInvoiceItem={handleInvoiceItemAdded}
          />
        )}
      </PageContainer>
    </DashboardLayout>
  );
};

export default InvoiceEditFields;
