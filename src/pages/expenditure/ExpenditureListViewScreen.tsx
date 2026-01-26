import DashboardLayout from "@/components/dashboard/Layout";
import PageContainer from "@/components/dashboard/PageContainer";
import Table from "@/components/table/Table";
import { useGeneralQuery } from "@/hooks/request/useGeneralQuery";
import { GetManyProps } from "@/hooks/types";
import { useSetQueryParam } from "@/hooks/useSetQueryParam";
import { ExpenditureProps } from "@/interfaces/expenditure";
import { expenditureTableFilters, expenditureTableSchema } from "@/tableSchema/expenditure";
import { usePermission } from "@/hooks/usePermission";
import { useOptimisticUpdates } from "@/hooks/request/useOptimisticUpdates";
import { useState, useMemo } from "react";
import { useGeneralMutation } from "@/hooks/request/useGeneralMutation";
import { useNavigate } from "react-router-dom";
import { ModalActionButtonProps, OptionsProps } from "@/interfaces";
import { toast } from "sonner";
import Modal from "@/components/Modal";
import ExportModal from "@/components/table/ExportModal";

const ExpenditureListViewScreen = () => {
  const [selectedExpenditure, setSelectedExpenditure] = useState<Record<string, any>>({});
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [openExportModal, setOpenExportModal] = useState(false);

  const { mutate, isPending } = useGeneralMutation<ExpenditureProps>({
    httpMethod: "delete",
    mutationKey: ["deleteExpenditure", selectedExpenditure.id],
    url: `/expenditures/${selectedExpenditure.id}`
  });
  const { removeItemFromList } = useOptimisticUpdates();
  const { queryObject } = useSetQueryParam();
  const { canCreateExpenditures, canDeleteExpenditures, canUpdateExpenditures } = usePermission();

  const { data, isFetching } = useGeneralQuery<GetManyProps<ExpenditureProps[]>>({
    queryKey: ["expenditure", queryObject],
    url: "/expenditures",
    query: queryObject,
    enabled: !!Object.keys(queryObject).length
  });
  const modalData = {
    showModal: openModal,
    modalTitle: `Are you sure you want to delete the expenditure?`,
    modalDescription: `Deleting the expenditure will permanently remove it from the system. Continue?`,
    actionButtons: [
      {
        title: "Cancel",
        action: () => setOpenModal(false),
        type: "cancel"
      },
      {
        title: "Continue",
        action: async () => {
          mutate(selectedExpenditure.id, {
            onSuccess: () => {
              setOpenModal(false);
              toast.success("Success", {
                description: "Expenditure deleted"
              });
              return removeItemFromList(["expenditure", queryObject], selectedExpenditure.id);
            }
          });
        },
        type: "action",
        loading: isPending
      }
    ] as ModalActionButtonProps[]
  };
  function handleEditRowActionClick(data: Record<string, any>) {
    navigate(`/expenditure/${data.id}/update`);
  }
  const rowActions = [
    {
      label: "Edit",
      action: handleEditRowActionClick,
      show: canUpdateExpenditures
    },
    {
      label: "Delete",
      action: (data: Record<string, any>) => {
        setOpenModal(true);
        setSelectedExpenditure(data);
      },
      show: canDeleteExpenditures
    }
    // {
    //   label: "View",
    //   action: handleEditRowActionClick,
    //   show: canReadExpenditures
    // }
  ];

  const actionButton = !canCreateExpenditures
    ? undefined
    : {
        createButton: {
          name: "Add Expenditure",
          onClick: () => navigate("/expenditure/create"),
          disabled: isFetching || !canCreateExpenditures
        }
      };

  // Prepare columns options for export
  const columnsOptions: OptionsProps[] = useMemo(() => {
    const columnLabels: Record<string, string> = {
      item: "Item",
      quantity: "Quantity",
      pricePerQuantity: "Price per quantity",
      totalAmount: "Total Amount",
      modeOfPayment: "Mode of Payment",
      type: "Type",
      expenseHead: "Expense Head",
      subExpense: "Sub expense",
      createdBy: "Created By",
      createdAt: "Created At"
    };

    return expenditureTableSchema
      .filter((column) => "accessorKey" in column && column.accessorKey)
      .map((column) => {
        const accessorKey = (column as any).accessorKey as string;
        const label = columnLabels[accessorKey] || accessorKey;
        return {
          label,
          value: accessorKey
        };
      });
  }, []);

  // Create table schema for export
  const tableSchema = useMemo(() => {
    const schema: Record<string, { dataType: "text" | "number" }> = {};
    expenditureTableSchema.forEach((column) => {
      if ("accessorKey" in column && column.accessorKey) {
        const accessorKey = column.accessorKey as string;
        const numberColumns = ["quantity", "pricePerQuantity", "totalAmount"];
        schema[accessorKey] = {
          dataType: numberColumns.includes(accessorKey) ? "number" : "text"
        };
      }
    });
    return schema;
  }, []);

  return (
    <DashboardLayout isLoading={isFetching} pageTitle="Expenditure List" actionButton={actionButton}>
      <Modal
        showModal={modalData.showModal}
        modalTitle={modalData.modalTitle}
        modalDescription={modalData.modalDescription}
        actionButtons={modalData.actionButtons}
      />
      <PageContainer>
        <Table
          columns={expenditureTableSchema}
          filters={expenditureTableFilters}
          data={data?.data || []}
          paginator={data?.paginator || null}
          actionButtons={rowActions}
          isLoading={isFetching}
          allowRowSelect
          showExportButton
          loadingText="Fetching Expenditure"
          onExportClick={() => setOpenExportModal(true)}
        />
        <ExportModal
          columnsOptions={columnsOptions}
          tableSchema={tableSchema}
          service="expenditures"
          openExportModal={openExportModal}
          onClose={() => setOpenExportModal(false)}
        />
      </PageContainer>
    </DashboardLayout>
  );
};

export default ExpenditureListViewScreen;
