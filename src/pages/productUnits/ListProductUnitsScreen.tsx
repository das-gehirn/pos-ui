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
import { ProductUnitProps } from "@/interfaces/productUnits";
import { productUnitSchema } from "@/tableSchema/productUnits";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ExportModal from "@/components/table/ExportModal";

const ListProductUnitsScreen = () => {
  const { removeItemFromList } = useOptimisticUpdates();
  const [selectedUnit, setSelectedUnit] = useState<Record<string, any>>({});
  const { queryObject } = useSetQueryParam();
  const { mutate, isPending } = useGeneralMutation<ProductUnitProps>({
    httpMethod: "delete",
    mutationKey: ["deleteProductUnit", selectedUnit.id],
    url: `/product-units/${selectedUnit.id}`
  });

  const { data, isFetching } = useGeneralQuery<GetManyProps<ProductUnitProps[]>>({
    queryKey: ["productUnits", queryObject],
    url: "/product-units",
    query: queryObject,
    enabled: !!Object.keys(queryObject).length
  });

  const { canCreateProductUnit, canUpdateProductUnit, canDeleteProductUnit } = usePermission(); // Use usePermission hook

  const [openModal, setOpenModal] = useState(false);
  const [openExportModal, setOpenExportModal] = useState(false);
  const navigate = useNavigate();

  const rowActions = [
    {
      label: "Edit",
      action: handleEditRowActionClick,
      show: canUpdateProductUnit
    },
    {
      label: "Delete",
      action: (data: Record<string, any>) => {
        setOpenModal(true);
        setSelectedUnit(data);
      },
      show: canDeleteProductUnit
    }
  ];

  const modalData = {
    showModal: openModal,
    modalTitle: (name: string) => `Are you sure you want to delete ${name}`,
    modalDescription: `Deleting the product unit will permanently remove it from the system. Continue?`,
    actionButtons: [
      {
        title: "Cancel",
        action: () => setOpenModal(false),
        type: "cancel"
      },
      {
        title: "Continue",
        action: async () => {
          mutate(selectedUnit.id, {
            onSuccess: () => {
              setOpenModal(false);
              toast.success("Success", {
                description: "Product unit deleted"
              });
            },
            onSettled() {
              return removeItemFromList(["productUnits", queryObject], selectedUnit.id);
            }
          });
        },
        type: "action",
        loading: isPending
      }
    ] as ModalActionButtonProps[]
  };

  function handleEditRowActionClick(data: Record<string, any>) {
    navigate(`/product-units/${data.id}`);
  }

  const actionButtonProps = canCreateProductUnit
    ? {
        createButton: {
          name: "Create Product Unit",
          onClick: () => navigate("/product-units/create"),
          disabled: isFetching
        }
      }
    : undefined;

  // Prepare columns options for export
  const columnsOptions: OptionsProps[] = useMemo(() => {
    const columnLabels: Record<string, string> = {
      title: "Product Unit Title",
      name: "Product Unit Name",
      createdAt: "Created At"
    };

    return productUnitSchema
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
    productUnitSchema.forEach((column) => {
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
    <DashboardLayout pageTitle="Product Units" actionButton={actionButtonProps}>
      <Modal
        showModal={modalData.showModal}
        modalTitle={modalData.modalTitle(selectedUnit.name)}
        modalDescription={modalData.modalDescription}
        actionButtons={modalData.actionButtons}
      />
      <Container className="border border-gray-50">
        <Table
          columns={productUnitSchema}
          data={data?.data || []}
          isLoading={isFetching}
          loadingText="Fetching product unit data"
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
          service="productUnit"
          openExportModal={openExportModal}
          onClose={() => setOpenExportModal(false)}
        />
      </Container>
    </DashboardLayout>
  );
};

export default ListProductUnitsScreen;
