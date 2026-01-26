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
import { ModalActionButtonProps, OptionsProps } from "@/interfaces";
import { ProductBrandProps } from "@/interfaces/productBrands";
import { productBrandSchema } from "@/tableSchema/productBrands";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ExportModal from "@/components/table/ExportModal";

const ListProductBrandScreen = () => {
  const { removeItemFromList } = useOptimisticUpdates();
  const [selectedBrand, setSelectedBrand] = useState<Record<string, any>>({});
  const brandId = selectedBrand.id;
  const { queryObject } = useSetQueryParam();
  const { mutate, isPending } = useGeneralMutation<ProductBrandProps>({
    httpMethod: "delete",
    mutationKey: ["deleteProductBrand", brandId],
    url: `/product-brands/${brandId}`
  });

  const { data, isFetching } = useGeneralQuery<GetManyProps<ProductBrandProps[]>>({
    queryKey: ["productBrands", queryObject],
    url: "/product-brands",
    query: queryObject,
    enabled: !!Object.keys(queryObject).length
  });

  const { canCreateProductBrand, canUpdateProductBrand, canDeleteProductBrand } = usePermission();

  const [openModal, setOpenModal] = useState(false);
  const [openExportModal, setOpenExportModal] = useState(false);
  const navigate = useNavigate();

  const rowActions = [
    {
      label: "Edit",
      action: handleEditRowActionClick,
      show: canUpdateProductBrand
    },
    {
      label: "Delete",
      action: (data: Record<string, any>) => {
        setOpenModal(true);
        setSelectedBrand(data);
      },
      show: canDeleteProductBrand
    }
  ];

  const modalData = {
    showModal: openModal,
    modalTitle: (name: string) => `Are you sure you want to delete ${name}`,
    modalDescription: `Deleting the product brand will permanently remove it from the system. Continue?`,
    actionButtons: [
      {
        title: "Cancel",
        action: () => setOpenModal(false),
        type: "cancel"
      },
      {
        title: "Continue",
        action: async () => {
          mutate(brandId, {
            onSuccess: () => {
              setOpenModal(false);
              toast.success("Success", {
                description: "Product brand deleted"
              });
            },
            onSettled() {
              return removeItemFromList(["productBrands", queryObject], brandId);
            }
          });
        },
        type: "action",
        loading: isPending
      }
    ] as ModalActionButtonProps[]
  };

  function handleEditRowActionClick(data: Record<string, any>) {
    navigate(`/product-brands/${data.id}`);
  }

  const actionButtonProps = canCreateProductBrand
    ? {
        createButton: {
          name: "Create Product Brand",
          onClick: () => navigate("/product-brands/create"),
          disabled: isFetching
        }
      }
    : undefined;

  // Prepare columns options for export
  const columnsOptions: OptionsProps[] = useMemo(() => {
    const columnLabels: Record<string, string> = {
      name: "Product Brand Name",
      slug: "Product Category Slug",
      createdAt: "Created At"
    };

    return productBrandSchema
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
    productBrandSchema.forEach((column) => {
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
    <DashboardLayout pageTitle="Product Brands" actionButton={actionButtonProps}>
      <Modal
        showModal={modalData.showModal}
        modalTitle={modalData.modalTitle(selectedBrand.name)}
        modalDescription={modalData.modalDescription}
        actionButtons={modalData.actionButtons}
      />
      <Container className="border border-gray-50">
        <Table
          columns={productBrandSchema}
          data={data?.data || []}
          isLoading={isFetching || isPending}
          loadingText="Fetching product brand data"
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
          service="productBrand"
          openExportModal={openExportModal}
          onClose={() => setOpenExportModal(false)}
        />
      </Container>
    </DashboardLayout>
  );
};

export default ListProductBrandScreen;
