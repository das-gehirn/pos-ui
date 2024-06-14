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
import { ProductCodeProps } from "@/interfaces/productCode";
import { productCodeSchema } from "@/tableSchema/productCodes";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ListProductCodeScreen = () => {
  const { removeItemFromList } = useOptimisticUpdates();
  const [selectedCode, setSelectedCode] = useState<Record<string, any>>({});
  const { queryObject } = useSetQueryParam();
  const { mutate, isPending } = useGeneralMutation<ProductCodeProps>({
    httpMethod: "delete",
    mutationKey: ["deleteProductCode", selectedCode.id],
    url: `/product-codes/${selectedCode.id}`
  });

  const { data, isFetching } = useGeneralQuery<GetManyProps<ProductCodeProps>>({
    queryKey: ["productCodes", queryObject],
    url: "/product-codes",
    query: queryObject,
    enabled: !!Object.keys(queryObject).length
  });
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const rowActions = [
    {
      label: "Edit",
      action: handleEditRowActionClick
    },
    {
      label: "Delete",
      action: (data: Record<string, any>) => {
        setOpenModal(true);
        setSelectedCode(data);
      }
    }
  ];

  const modalData = {
    showModal: openModal,
    modalTitle: (code: string) => {
      return `Are you sure you want to delete  ${code}`;
    },
    modalDescription: `Deleting the product code will permanently remove it from the system. Continue?`,
    actionButtons: [
      {
        title: "Cancel",
        action: () => setOpenModal(false),
        type: "cancel"
      },
      {
        title: "Continue",
        action: async () => {
          mutate(selectedCode.id, {
            onSuccess: () => {
              setOpenModal(false);
              toast.success("Success", {
                description: "Product code deleted"
              });
            },
            onSettled() {
              return removeItemFromList(["productCodes", queryObject], selectedCode.id);
            }
          });
        },
        type: "action",
        loading: isPending
      }
    ] as ModalActionButtonProps[]
  };

  function handleEditRowActionClick(data: Record<string, any>) {
    navigate(`/product-codes/${data.id}`);
  }

  return (
    <DashboardLayout
      pageTitle="Product Codes"
      actionButton={{
        createButton: { name: "Create Product Code", onClick: () => navigate("/product-codes/create") }
      }}
      isLoading={isFetching}
    >
      <Modal
        showModal={modalData.showModal}
        modalTitle={modalData.modalTitle(selectedCode.code)}
        modalDescription={modalData.modalDescription}
        actionButtons={modalData.actionButtons}
      />
      <Container className="border border-gray-50">
        <Table
          columns={productCodeSchema}
          data={data?.data || []}
          isLoading={isFetching}
          loadingText="Fetching product code data"
          showExportButton
          paginator={data?.paginator}
          filters={[]}
          actionButtons={rowActions}
          allowRowSelect
          handleRowClick={handleEditRowActionClick}
          showSelectColumns
        />
      </Container>
    </DashboardLayout>
  );
};

export default ListProductCodeScreen;
