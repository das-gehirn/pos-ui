import Container from "@/components/Container";
import Modal from "@/components/Modal";
import DashboardLayout from "@/components/dashboard/Layout";
import Table from "@/components/table/Table";
import { useSetQueryParam } from "@/components/table/hooks/useSetQueryParam";
import { useGeneralMutation } from "@/hooks/request/useGeneralMutation";
import { useGeneralQuery } from "@/hooks/request/useGeneralQuery";
import { useOptimisticUpdates } from "@/hooks/request/useOptimisticUpdates";
import { GetManyProps } from "@/hooks/types";
import { usePermission } from "@/hooks/usePermission";
import { ModalActionButtonProps, OptionsProps } from "@/interfaces";
import { CustomerProps } from "@/interfaces/customer";
import { customerTableSchema } from "@/tableSchema/customers";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ExportModal from "@/components/table/ExportModal";

const CustomersListScreen = () => {
  const { canDeleteCustomers, canUpdateCustomers } = usePermission();
  const { removeItemFromList } = useOptimisticUpdates();
  const [openModal, setOpenModal] = useState(false);
  const [openExportModal, setOpenExportModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Record<string, any>>({});
  const { queryObject } = useSetQueryParam();
  const navigate = useNavigate();
  const { data, isFetching } = useGeneralQuery<GetManyProps<CustomerProps[]>>({
    queryKey: ["customers", queryObject],
    url: "/customers",
    enabled: !!Object.keys(queryObject).length,
    query: queryObject
  });
  const { isPending, mutate } = useGeneralMutation<CustomerProps>({
    httpMethod: "delete",
    mutationKey: ["deleteCustomer", selectedCustomer._id],
    url: `/customers/${selectedCustomer?._id}`
  });

  const searchSelectionOptions: OptionsProps[] = [
    { label: "All Fields", value: "" },
    { label: "First Name", value: "firstName" },
    { label: "Last Name", value: "lastName" },
    { label: "Email", value: "email" }
  ];
  const rowActions = [
    {
      label: "Edit",
      action: handleEditRowActionClick,
      show: canUpdateCustomers
    },
    {
      label: "Delete",
      action: (data: Record<string, any>) => {
        setOpenModal(true);
        setSelectedCustomer(data);
      },
      show: canDeleteCustomers
    }
  ];
  const modalData = {
    showModal: openModal,
    modalTitle: (name: string) => `Are you sure you want to delete  ${name}'s details`,
    modalDescription: `Deleting the customer will permanently remove them from the system. Continue?`,
    actionButtons: [
      {
        title: "Cancel",
        action: () => setOpenModal(false),
        type: "cancel"
      },
      {
        title: "Continue",
        action: async () => {
          mutate(selectedCustomer.id, {
            onSuccess: () => {
              setOpenModal(false);
              toast.success("Success", {
                description: "Customer deleted"
              });
              return removeItemFromList(["customers", queryObject], selectedCustomer.id);
            }
          });
        },
        type: "action",
        loading: isPending
      }
    ] as ModalActionButtonProps[]
  };
  const handleRowClick = (data: any) => {
    if (canUpdateCustomers) {
      navigate(`/customers/${data.id}/edit`);
    }
  };

  function handleEditRowActionClick(data: any) {
    if (canUpdateCustomers) {
      navigate(`/customers/${data.id}/edit`);
    }
  }

  // Prepare columns options for export
  const columnsOptions: OptionsProps[] = useMemo(() => {
    const columnLabels: Record<string, string> = {
      firstName: "First name",
      lastName: "Last name",
      email: "Email",
      gender: "Gender",
      dateOfBirth: "Date of Birth",
      createdBy: "Created By",
      createdAt: "Created At"
    };

    return customerTableSchema
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
    customerTableSchema.forEach((column) => {
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
    <DashboardLayout
      pageTitle="Customers List"
      actionButton={{ createButton: { name: "Create customer", onClick: () => navigate("/customers/create") } }}
    >
      <Modal
        showModal={modalData.showModal}
        modalTitle={modalData.modalTitle(selectedCustomer.firstName)}
        modalDescription={modalData.modalDescription}
        actionButtons={modalData.actionButtons}
      />
      <Container className="border border-gray-50">
        <Table
          columns={customerTableSchema}
          data={data?.data || []}
          isLoading={isFetching}
          loadingText="Fetching customer data"
          showExportButton
          paginator={data?.paginator || null}
          actionButtons={rowActions}
          allowRowSelect
          handleRowClick={handleRowClick}
          searchSelectionOptions={searchSelectionOptions}
          showSelectColumns
          showSearchSelection
          onExportClick={() => setOpenExportModal(true)}
        />
        <ExportModal
          columnsOptions={columnsOptions}
          tableSchema={tableSchema}
          service="customers"
          openExportModal={openExportModal}
          onClose={() => setOpenExportModal(false)}
        />
      </Container>
    </DashboardLayout>
  );
};

export default CustomersListScreen;
