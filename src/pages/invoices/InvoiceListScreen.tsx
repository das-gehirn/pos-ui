import Container from "@/components/Container";
import Modal from "@/components/Modal";
import DashboardLayout from "@/components/dashboard/Layout";
import Table from "@/components/table/Table";
import { useGeneralMutation } from "@/hooks/request/useGeneralMutation";
import { useGeneralQuery } from "@/hooks/request/useGeneralQuery";
import { useOptimisticUpdates } from "@/hooks/request/useOptimisticUpdates";
import { GetManyProps } from "@/hooks/types";
import { useSetQueryParam } from "@/hooks/useSetQueryParam";
import { usePermission } from "@/hooks/usePermission";
import { ModalActionButtonProps } from "@/interfaces";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { InvoiceProps } from "@/interfaces/invoice";
import { invoiceSchema, invoiceTableFilters } from "@/tableSchema/invoice";

const InvoiceListScreen = () => {
  const { removeItemFromList } = useOptimisticUpdates();
  const [selectedInvoice, setSelectedInvoice] = useState<Record<string, any>>({});
  const invoiceId = selectedInvoice._id;
  const { queryObject } = useSetQueryParam();
  const { mutate, isPending } = useGeneralMutation<InvoiceProps>({
    httpMethod: "delete",
    mutationKey: ["deleteInvoice", invoiceId],
    url: `/invoices/${invoiceId}`
  });

  const { data, isFetching } = useGeneralQuery<GetManyProps<InvoiceProps[]>>({
    queryKey: ["invoices", queryObject],
    url: "/invoices",
    query: queryObject
  });

  const { canCreateInvoice, canDeleteInvoice, canUpdateInvoice, canReadInvoice } = usePermission();

  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  const rowActions = [
    {
      label: "Delete",
      action: (data: Record<string, any>) => {
        setOpenModal(true);
        setSelectedInvoice(data);
      },
      show: canDeleteInvoice
    },
    {
      label: "Edit",
      action: (data: Record<string, any>) => {
        navigate(`/invoices/${data._id}/edit`);
      },
      show: canUpdateInvoice
    },
    {
      label: "View",
      action: handleEditRowActionClick,
      show: canReadInvoice
    }
  ];

  const modalData = {
    showModal: openModal,
    modalTitle: (name: string) => `Are you sure you want to delete invoice INV-${name}`,
    modalDescription: `Deleting the invoice will permanently remove it from the system. Continue?`,
    actionButtons: [
      {
        title: "Cancel",
        action: () => setOpenModal(false),
        type: "cancel"
      },
      {
        title: "Continue",
        action: async () => {
          mutate(invoiceId, {
            onSuccess: () => {
              setOpenModal(false);
              toast.success("Success", {
                description: "Invoice deleted"
              });
            },
            onSettled() {
              return removeItemFromList(["invoices", queryObject], invoiceId);
            }
          });
        },
        type: "action",
        loading: isPending
      }
    ] as ModalActionButtonProps[]
  };

  function handleEditRowActionClick(data: Record<string, any>) {
    if (canReadInvoice) {
      navigate(`/invoices/${data._id}`);
    }
  }

  const actionButtonProps = canCreateInvoice
    ? {
        createButton: {
          name: "Create Invoice",
          onClick: () => navigate("/invoices/create"),
          disabled: isFetching
        }
      }
    : undefined;

  return (
    <DashboardLayout pageTitle="Invoices" actionButton={actionButtonProps}>
      <Modal
        showModal={modalData.showModal}
        modalTitle={modalData.modalTitle(selectedInvoice.invoiceNumber)}
        modalDescription={modalData.modalDescription}
        actionButtons={modalData.actionButtons}
      />
      <Container className="border border-gray-50">
        <Table
          columns={invoiceSchema}
          data={data?.data || []}
          isLoading={isFetching || isPending}
          loadingText="Fetching invoice data"
          showExportButton
          paginator={data?.paginator || null}
          filters={invoiceTableFilters}
          actionButtons={rowActions}
          showSearchSelection
          searchSelectionOptions={[{ label: "Customer", value: "customerName" }]}
          allowRowSelect
          handleRowClick={handleEditRowActionClick}
          showSelectColumns
        />
      </Container>
    </DashboardLayout>
  );
};

export default InvoiceListScreen;
