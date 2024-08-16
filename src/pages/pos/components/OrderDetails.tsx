import SelectField from "@/components/customFields/Select/SelectField";
import OrderItems from "./OrderItems";
import OrderSummary from "./OrderSummary";
import { Button } from "@/components/ui/button";
import usePosStore from "@/store/pos";
import { Plus } from "lucide-react";
import Modal from "@/components/Modal";
import { ModalActionButtonProps, OptionsProps } from "@/interfaces";
import { useState, useCallback } from "react";
import InputField from "@/components/customFields/input/InputField";
import PhoneInputField from "@/components/customFields/input/Phone";
import { useGeneralMutation } from "@/hooks/request/useGeneralMutation";
import { useGeneralQuery } from "@/hooks/request/useGeneralQuery";
import { CustomerProps } from "@/interfaces/customer";
import { GetManyProps } from "@/hooks/types";
import { defaultCustomer } from "@/defaults";
import { useFormFieldUpdate } from "@/hooks/useFormFieldUpdate";
import { HandlerProps } from "@/components/customFields/type";
import { formatCurrency, objectDifference } from "@/helpers";
import { GENDER_OPTIONS, calculateDiscountAmount, printPDF } from "@/utils";
import PayNowModal from "./PayNowModal";
import { pick, set } from "lodash";
import { toast } from "sonner";
import HoldItem from "./HoldItem";
import CheckBoxField from "@/components/customFields/combo/CheckBoxField";
import NumberField from "@/components/customFields/input/NumberField";
import { INVOICE_DISCOUNT_TYPE_OPTIONS } from "@/interfaces/invoice";
import { addMonths } from "date-fns";

type ModalType = "payment" | "customer" | "invoicing";
type ModalObjectMapperProps = {
  [key in ModalType]: {
    description: string;
    title: string;
    buttonTitle: string;
    url: string;
    mutationKey: string[];
    keys: string[];
    successMessage: string;
    disabled?: boolean;
  };
};

const modalObjectMapper: ModalObjectMapperProps = {
  payment: {
    description: "Fill the form to complete the sale",
    title: "Make Payment",
    buttonTitle: "Make Payment",
    url: "/sales",
    mutationKey: ["createSales"],
    keys: [
      "amountPaid",
      "bankPayment",
      "chequePayment",
      "customerId",
      "discount",
      "items",
      "modeOfPayment",
      "mobileMoneyPayment",
      "tax"
    ],
    successMessage: "Sales recorded",
    disabled: false
  },
  customer: {
    description: "Fill the form to create a new customer.",
    title: "Create Customer",
    buttonTitle: "Create Customer",
    url: "/customers",
    mutationKey: ["createCustomer"],
    keys: ["firstName", "lastName", "email", "gender", "phone"],
    successMessage: "Customer created"
  },
  invoicing: {
    description: "Fill the form to hold/invoice the products.",
    title: "Create Invoice",
    buttonTitle: "Hold Product",
    url: "/invoices",
    mutationKey: ["createInvoice"],
    keys: ["customerId", "discount", "items", "tax", "description"],
    successMessage: "Invoice created",
    disabled: false
  }
};

const OrderDetails = () => {
  const { formValues, updateFormFieldValue } = useFormFieldUpdate(defaultCustomer());
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState<ModalType>("customer");
  const { items, getItemTotalAmount, getTotalItems, setState, getState, resetState } = usePosStore();
  const totalAmount = getItemTotalAmount();
  const calculateDiscount = calculateDiscountAmount(totalAmount, getState().discount);
  const totalItems = getTotalItems();

  // Dynamically create the hook instance based on modalType
  const { isPending, mutate } = useGeneralMutation({
    httpMethod: "post",
    mutationKey: modalObjectMapper[modalType]?.mutationKey || [],
    url: modalObjectMapper[modalType]?.url || ""
  });

  const handleAction = useCallback(() => {
    const modalConfig = modalObjectMapper[modalType];
    const data = pick(getState(), modalConfig.keys);

    if (modalType === "payment" && !data.modeOfPayment) {
      data.modeOfPayment = "cash";
    }
    if (modalType === "invoicing") {
      set(data, "invoiceDate", new Date());
      set(data, "dueDate", addMonths(new Date(), 1));
    }
    const payload =
      modalType === "customer" ? (objectDifference(defaultCustomer(), formValues) as CustomerProps) : data;

    mutate(
      { payload },
      {
        async onSuccess(data) {
          setOpenModal(false);
          if (modalType === "payment") {
            printPDF(data?.data?.response);
          }

          resetState();
          toast.success("Success", {
            description: modalConfig.successMessage
          });
          if (modalType === "customer") {
            refetch({ throwOnError: true });
          }
        }
      }
    );
  }, [modalType, formValues, getState, mutate, resetState]);

  const modalData = {
    showModal: openModal,
    modalDescription: modalObjectMapper[modalType].description,
    title: modalObjectMapper[modalType].title,
    actionButtons: [
      {
        title: "Cancel",
        action: () => setOpenModal(false),
        type: "cancel",
        disabled: isPending
      },
      {
        title: modalObjectMapper[modalType].buttonTitle,
        action: handleAction,
        type: "action",
        loading: isPending,
        disabled: modalObjectMapper[modalType].disabled
      }
    ] as ModalActionButtonProps[]
  };

  const { refetch, data: customers } = useGeneralQuery<GetManyProps<CustomerProps[]>>({
    queryKey: ["createCustomers"],
    url: "/customers",
    enabled: true,
    query: { deleted: false }
  });

  const customerOptions: OptionsProps[] =
    customers?.data.map((customer) => {
      return {
        label: `${customer.firstName} ${customer.lastName}`,
        value: customer._id || ""
      };
    }) || [];

  const handleFieldChange = (data: HandlerProps) => {
    const { key, value } = data;
    updateFormFieldValue(key, value);
  };

  const handleFormFieldChange = (data: HandlerProps) => {
    const { value, key } = data;
    if (key === "hasDiscount" && !value) {
      setState({ discount: undefined });
    }
    setState({ [key]: value });
  };

  const handleModalChange = (type: ModalType) => {
    return () => {
      setModalType(type);
      setOpenModal(true);
    };
  };

  return (
    <>
      <Modal
        showModal={modalData.showModal}
        modalTitle={modalData.title}
        modalDescription={modalData.modalDescription}
        actionButtons={modalData.actionButtons}
      >
        {modalType === "customer" && (
          <div>
            <InputField
              fieldKey="firstName"
              handleInputChange={handleFieldChange}
              label="First name"
              isRequired
              value={formValues?.firstName}
            />
            <InputField
              fieldKey="lastName"
              handleInputChange={handleFieldChange}
              label="Last name"
              isRequired
              value={formValues?.lastName}
            />
            <InputField
              fieldKey="email"
              handleInputChange={handleFieldChange}
              label="Email"
              value={formValues?.email}
            />
            <SelectField
              fieldKey="gender"
              onChange={handleFieldChange}
              label="Gender"
              selectValue={formValues?.gender}
              options={GENDER_OPTIONS}
            />
            <PhoneInputField
              fieldKey="phone"
              handleInputChange={handleFieldChange}
              label="Phone"
              isRequired
              value={formValues?.phone}
            />
          </div>
        )}
        {modalType === "payment" && <PayNowModal customers={customerOptions} />}
        {modalType === "invoicing" && <HoldItem customers={customerOptions} />}
      </Modal>
      <aside className="order-details__section md:w-[30%] border-l border-l-gray-300  bg-white px-2 flex flex-col overflow-hidden md:fixed right-0 bottom-0 top-0 mt-8">
        <div className="my-2">
          <div className="flex border-t border-t-gray-300">
            <h1 className="text-xl">Order Details</h1>
          </div>
          <div className="flex items-end gap-x-4 justify-between">
            <div className="flex-1">
              <SelectField
                fieldKey="customerId"
                label={"Customer Name"}
                onChange={handleFormFieldChange}
                options={customerOptions}
                selectValue={getState().customerId}
              />
            </div>
            <div className="my-3">
              <Button size={"icon"} onClick={handleModalChange("customer")}>
                <Plus />
              </Button>
            </div>
          </div>
        </div>
        <OrderItems items={items} />
        {items.length > 0 && (
          <div className="discount_container">
            <CheckBoxField
              label="Check if sales has discount"
              fieldKey="hasDiscount"
              value={getState().hasDiscount}
              handleFieldChange={handleFormFieldChange}
            />
            {getState().hasDiscount && (
              <>
                <SelectField
                  onChange={handleFormFieldChange}
                  fieldKey="discount.type"
                  options={INVOICE_DISCOUNT_TYPE_OPTIONS}
                  label="Discount type"
                  selectValue={getState().discount?.type}
                />
                <NumberField
                  handleInputChange={handleFormFieldChange}
                  fieldKey="discount.value"
                  label="Discount value"
                  value={getState().discount?.value}
                />
              </>
            )}
          </div>
        )}
        <div className="flex-1 h-full flex flex-col justify-end">
          <OrderSummary
            totalItems={totalItems}
            totalItemAmount={totalAmount}
            title="Order Summary"
            discount={getState().discount}
          />
          <div className="pay-button mb-3 flex items-center gap-4">
            <Button
              variant={"outline"}
              className="w-full flex gap-2 items-center"
              disabled={totalAmount === 0 || isPending}
              onClick={handleModalChange("invoicing")}
            >
              <span>Hold</span>
            </Button>
            <Button
              className="w-full flex gap-2 items-center"
              disabled={totalAmount === 0 || isPending}
              onClick={handleModalChange("payment")}
            >
              <span>Pay</span>
              <span>{formatCurrency({ value: totalAmount - calculateDiscount })}</span>
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default OrderDetails;
