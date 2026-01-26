import Container from "@/components/Container";
import Modal from "@/components/Modal";
import DashboardLayout from "@/components/dashboard/Layout";
import Table from "@/components/table/Table";
import { useGeneralMutation } from "@/hooks/request/useGeneralMutation";
import { useGeneralQuery } from "@/hooks/request/useGeneralQuery";
import { useOptimisticUpdates } from "@/hooks/request/useOptimisticUpdates";
import { GetManyProps } from "@/hooks/types";
import { useSetQueryParam } from "@/hooks/useSetQueryParam";
import { usePermission } from "@/hooks/usePermission"; // Import usePermission
import { ModalActionButtonProps, OptionsProps } from "@/interfaces";
import { SupplierProps } from "@/interfaces/supplier";
import { suppliersTableSchema } from "@/tableSchema/suppliers";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ExportModal from "@/components/table/ExportModal";

const ListSuppliersScreen = () => {
  const { removeItemFromList } = useOptimisticUpdates();
  const [selectedSupplier, setSelectedSupplier] = useState<Record<string, any>>({});
  const { queryObject } = useSetQueryParam();
  const { mutate, isPending } = useGeneralMutation<SupplierProps>({
    httpMethod: "delete",
    mutationKey: ["deleteSupplier", selectedSupplier.id],
    url: `/suppliers/${selectedSupplier.id}`
  });

  const { data, isFetching } = useGeneralQuery<GetManyProps<SupplierProps[]>>({
    queryKey: ["suppliers", queryObject],
    url: "/suppliers",
    query: queryObject,
    enabled: !!Object.keys(queryObject).length
  });
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  const { canCreateSuppliers, canUpdateSuppliers, canDeleteSuppliers } = usePermission();
  const [openExportModal, setOpenExportModal] = useState(false);

  const rowActions = [
    {
      label: "Edit",
      action: handleEditRowActionClick,
      show: canUpdateSuppliers
    },
    {
      label: "Delete",
      action: (data: Record<string, any>) => {
        setOpenModal(true);
        setSelectedSupplier(data);
      },
      show: canDeleteSuppliers
    }
  ];

  const modalData = {
    showModal: openModal,
    modalTitle: (name: string) => `Are you sure you want to delete ${name}`,
    modalDescription: `Deleting the supplier will permanently remove it from the system. Continue?`,
    actionButtons: [
      {
        title: "Cancel",
        action: () => setOpenModal(false),
        type: "cancel"
      },
      {
        title: "Continue",
        action: async () => {
          mutate(selectedSupplier.id, {
            onSuccess: () => {
              setOpenModal(false);
              toast.success("Success", {
                description: "Supplier deleted"
              });
            },
            onSettled() {
              return removeItemFromList(["suppliers", queryObject], selectedSupplier.id);
            }
          });
        },
        type: "action",
        loading: isPending
      }
    ] as ModalActionButtonProps[]
  };

  function handleEditRowActionClick(data: Record<string, any>) {
    navigate(`/suppliers/${data.id}`);
  }

  const actionButtonProps = canCreateSuppliers
    ? {
        createButton: {
          name: "Create Supplier",
          onClick: () => navigate("/suppliers/create"),
          disabled: isFetching
        }
      }
    : undefined;

  // Prepare columns options for export
  const columnsOptions: OptionsProps[] = useMemo(() => {
    const columnLabels: Record<string, string> = {
      name: "Supplier Name",
      email: "Supplier Email",
      phone: "Supplier Phone",
      status: "Status",
      createdAt: "Created At"
    };

    return suppliersTableSchema
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
    suppliersTableSchema.forEach((column) => {
      if ("accessorKey" in column && column.accessorKey) {
        const accessorKey = column.accessorKey as string;
        schema[accessorKey] = {
          dataType: "text"
        };
      }
    });
    return schema;
  }, []);

  return (
    <DashboardLayout pageTitle="Suppliers" actionButton={actionButtonProps}>
      <Modal
        showModal={modalData.showModal}
        modalTitle={modalData.modalTitle(selectedSupplier.name)}
        modalDescription={modalData.modalDescription}
        actionButtons={modalData.actionButtons}
      />
      <Container className="border border-gray-50">
        <Table
          columns={suppliersTableSchema}
          data={data?.data || []}
          isLoading={isFetching}
          loadingText="Fetching supplier data"
          showExportButton
          paginator={data?.paginator || null}
          filters={[]}
          actionButtons={rowActions}
          allowRowSelect
          handleRowClick={handleEditRowActionClick}
          showSelectColumns
          onExportClick={() => setOpenExportModal(true)}
        />
        <ExportModal
          columnsOptions={columnsOptions}
          tableSchema={tableSchema}
          service="suppliers"
          openExportModal={openExportModal}
          onClose={() => setOpenExportModal(false)}
        />
      </Container>
    </DashboardLayout>
  );
};

export default ListSuppliersScreen;
