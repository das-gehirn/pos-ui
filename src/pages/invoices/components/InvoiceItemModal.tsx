import Modal from "@/components/Modal";
import SelectField from "@/components/customFields/Select/SelectField";
import NumberField from "@/components/customFields/input/NumberField";
import { HandlerProps } from "@/components/customFields/type";
import { ModalActionButtonProps, OptionsProps } from "@/interfaces";
import { InvoiceItem } from "@/interfaces/invoice";
import { FC } from "react";

interface InvoiceItemModalProps {
  showModal: boolean;
  handleShowModal: () => void;
  invoiceItem: InvoiceItem;
  handleFormFieldChange: (data: HandlerProps) => void;
  productOptions: OptionsProps[];
  emitInvoiceItem: (data: InvoiceItem) => void;
}
const InvoiceItemModal: FC<InvoiceItemModalProps> = ({
  handleShowModal,
  showModal,
  handleFormFieldChange,
  invoiceItem,
  productOptions,
  emitInvoiceItem
}) => {
  const handleCloseModal = () => {
    handleShowModal();
  };
  const modalData = {
    showModal: showModal,
    modalTitle: "Invoice Item",
    modalDescription: "Fill the inputs to add an invoice item",
    actionButtons: [
      {
        title: "Cancel",
        action: handleCloseModal,
        type: "cancel"
      },
      {
        title: "Add Item",
        action: () => {
          emitInvoiceItem(invoiceItem);
          handleCloseModal();
        },
        type: "action",
        disabled: !(invoiceItem._id && invoiceItem.price && invoiceItem.quantity)
      }
    ] as ModalActionButtonProps[]
  };
  return (
    <Modal
      modalTitle={modalData.modalTitle}
      modalDescription={modalData.modalDescription}
      showModal={modalData.showModal}
      actionButtons={modalData.actionButtons}
    >
      <SelectField
        fieldKey="_id"
        onChange={handleFormFieldChange}
        options={productOptions}
        label="Product"
        selectValue={invoiceItem?._id}
        isSearchable
      />
      <NumberField
        fieldKey="quantity"
        handleInputChange={handleFormFieldChange}
        label="Quantity"
        value={invoiceItem?.quantity}
      />
      <NumberField fieldKey="price" handleInputChange={() => {}} label="Amount" value={invoiceItem?.price} disabled />
    </Modal>
  );
};

export default InvoiceItemModal;
