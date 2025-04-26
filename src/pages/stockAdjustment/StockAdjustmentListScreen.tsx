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
import { invoiceTableFilters } from "@/tableSchema/invoice";

const StockAdjustmentListScreen = () => {
  const { removeItemFromList } = useOptimisticUpdates();
  const [selectedInvoice, setSelectedInvoice] = useState<Record<string, string | number>>({});
  const invoiceId = selectedInvoice._id as string;
  const { queryObject } = useSetQueryParam();
  const { mutate, isPending } = useGeneralMutation<Partial<InvoiceProps>>({
    httpMethod: "delete",
    mutationKey: ["deleteStockAdjustment", invoiceId as string],
    url: `/stock-adjustments/${invoiceId}`
  });

  const { data, isFetching } = useGeneralQuery<GetManyProps<InvoiceProps[]>>({
    queryKey: ["stockAdjustments", queryObject],
    url: "/stock-adjustments",
    query: queryObject
  });

  const { canCreateStockAdjustments, canDeleteStockAdjustments } = usePermission();

  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  const rowActions = [
    {
      label: "Delete",
      action: (data: Record<string, any>) => {
        setOpenModal(true);
        setSelectedInvoice(data);
      },
      show: canDeleteStockAdjustments
    }
  ];

  const modalData = {
    showModal: openModal,
    modalDescription: `Are you sure you want to delete the stock adjustment? Deleting the stock adjustment will reduce the product quantity. Continue?`,
    actionButtons: [
      {
        title: "Cancel",
        action: () => setOpenModal(false),
        type: "cancel"
      },
      {
        title: "Continue",
        action: async () => {
          mutate(
            { payload: {} },
            {
              onSuccess: () => {
                setOpenModal(false);
                toast.success("Success", {
                  description: "Invoice deleted"
                });
              },
              onSettled() {
                return removeItemFromList(["stockAdjustments", queryObject], invoiceId);
              }
            }
          );
        },
        type: "action",
        loading: isPending
      }
    ] as ModalActionButtonProps[]
  };

  const actionButtonProps = canCreateStockAdjustments
    ? {
        createButton: {
          name: "Create Stock Adjustment",
          onClick: () => navigate("/stock-adjustments/create"),
          disabled: isFetching
        }
      }
    : undefined;

  return (
    <DashboardLayout pageTitle="Stock Adjustments" actionButton={actionButtonProps}>
      <Modal
        showModal={modalData.showModal}
        modalTitle={"Delete Stock Adjustment"}
        modalDescription={modalData.modalDescription}
        actionButtons={modalData.actionButtons}
      />
      <Container className="border border-gray-50">
        <Table
          columns={[]}
          data={[]}
          isLoading={isFetching || isPending}
          loadingText="Fetching stock adjustment data"
          paginator={data?.paginator || null}
          filters={invoiceTableFilters}
          actionButtons={rowActions}
          allowRowSelect={false}
        />
      </Container>
    </DashboardLayout>
  );
};

export default StockAdjustmentListScreen;
