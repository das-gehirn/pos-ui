import Container from "@/components/Container";
import Modal from "@/components/Modal";
import DashboardLayout from "@/components/dashboard/Layout";
import Table from "@/components/table/Table";
import { useGeneralMutation } from "@/hooks/request/useGeneralMutation";
import { useGeneralQuery } from "@/hooks/request/useGeneralQuery";
import { useOptimisticUpdates } from "@/hooks/request/useOptimisticUpdates";
import { GetManyProps } from "@/hooks/types";
import { useSetQueryParam } from "@/hooks/useSetQueryParam";
import { ModalActionButtonProps } from "@/interfaces";
import { ProductProps } from "@/interfaces/products";
import { productTableFilters, productTableSchema } from "@/tableSchema/products";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { usePermission } from "@/hooks/usePermission";

const ProductListsScreen = () => {
  const { removeItemFromList } = useOptimisticUpdates();
  const [selectedProduct, setSelectedProduct] = useState<Record<string, any>>({});
  const { queryObject } = useSetQueryParam();
  const { mutate, isPending } = useGeneralMutation<ProductProps>({
    httpMethod: "delete",
    mutationKey: ["deleteProduct", selectedProduct.id],
    url: `/products/${selectedProduct.id}`
  });

  const { data, isFetching } = useGeneralQuery<GetManyProps<ProductProps[]>>({
    queryKey: ["products", queryObject],
    url: "/products",
    query: queryObject,
    enabled: !!Object.keys(queryObject).length
  });

  const { canCreateProducts, canUpdateProducts, canDeleteProducts } = usePermission(); // Assuming usePermission provides these checks
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  const rowActions = [
    {
      label: "Edit",
      action: handleEditRowActionClick,
      show: canUpdateProducts // Only show if user can update products
    },
    {
      label: "Delete",
      action: (data: Record<string, any>) => {
        setOpenModal(true);
        setSelectedProduct(data);
      },
      show: canDeleteProducts // Only show if user can delete products
    }
  ];

  const modalData = {
    showModal: openModal,
    modalTitle: (name: string) => `Are you sure you want to delete  ${name}`,
    modalDescription: `Deleting the product will permanently remove it from the system. Continue?`,
    actionButtons: [
      {
        title: "Cancel",
        action: () => setOpenModal(false),
        type: "cancel"
      },
      {
        title: "Continue",
        action: async () => {
          mutate(selectedProduct.id, {
            onSuccess: () => {
              setOpenModal(false);
              toast.success("Success", {
                description: "Product deleted"
              });
            },
            onSettled() {
              return removeItemFromList(["products", queryObject], selectedProduct.id);
            }
          });
        },
        type: "action",
        loading: isPending
      }
    ] as ModalActionButtonProps[]
  };

  function handleEditRowActionClick(data: Record<string, any>) {
    navigate(`/products/${data.id}`);
  }

  const actionButton = !canCreateProducts
    ? undefined
    : {
        createButton: {
          name: "Create Product",
          onClick: () => navigate("/products/create"),
          disabled: isFetching || !canCreateProducts
        }
      };
  return (
    <DashboardLayout pageTitle="Products List" actionButton={actionButton}>
      <Modal
        showModal={modalData.showModal}
        modalTitle={modalData.modalTitle(selectedProduct.name)}
        modalDescription={modalData.modalDescription}
        actionButtons={modalData.actionButtons}
      />
      <Container className="border border-gray-50">
        <Table
          columns={productTableSchema}
          data={data?.data || []}
          paginator={data?.paginator || null}
          allowRowSelect
          showSelectColumns
          showExportButton
          isLoading={isFetching || isPending}
          actionButtons={rowActions}
          handleRowClick={handleEditRowActionClick}
          filters={productTableFilters}
          showSearchSelection
          searchSelectionOptions={[
            { label: "Product Name", value: "name" },
            { label: "All Fields", value: "" }
          ]}
        />
      </Container>
    </DashboardLayout>
  );
};

export default ProductListsScreen;
