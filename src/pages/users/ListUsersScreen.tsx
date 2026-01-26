import Modal from "@/components/Modal";
import DashboardLayout from "@/components/dashboard/Layout";
import PageContainer from "@/components/dashboard/PageContainer";
import Table from "@/components/table/Table";
import { useSetQueryParam } from "@/components/table/hooks/useSetQueryParam";
import { useDeleteUserMutation, useFetchUsersQuery } from "@/hooks/request/useUserRequest";
import { ModalActionButtonProps, OptionsProps } from "@/interfaces";
import { userTableFilters, usersTableSchema } from "@/tableSchema/users";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ExportModal from "@/components/table/ExportModal";

const ListUsersScreen = () => {
  const { queryObject } = useSetQueryParam();
  const navigate = useNavigate();
  const { data, isFetching } = useFetchUsersQuery(queryObject);
  const { isPending, mutate } = useDeleteUserMutation(queryObject);
  const [openModal, setOpenModal] = useState(false);
  const [openExportModal, setOpenExportModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Record<string, any>>({});
  const searchSelectionOptions: OptionsProps[] = [
    { label: "All Fields", value: "" },
    { label: "First Name", value: "firstName" },
    { label: "Last Name", value: "lastName" },
    { label: "Email", value: "email" },
    { label: "Role", value: "role" }
  ];
  const rowActions = [
    {
      label: "Edit",
      action: handleEditRowActionClick
    },
    {
      label: "Delete",
      action: (data: Record<string, any>) => {
        setOpenModal(true);
        setSelectedUser(data);
      }
    }
  ];
  const modalData = {
    showModal: openModal,
    modalTitle: (name: string) => `Are you sure you want to delete  ${name}'s account`,
    modalDescription: `Deleting the user will permanently remove their account,
       associated data, and access rights. 
      Please ensure that you have verified the user's identity and that this action aligns with your organization's policies`,
    actionButtons: [
      {
        title: "Cancel",
        action: () => setOpenModal(false),
        type: "cancel"
      },
      {
        title: "Continue",
        action: async () => {
          mutate(selectedUser.id, {
            onSuccess: () => {
              setOpenModal(false);
              toast.success("Success", {
                description: "User deleted"
              });
            }
          });
        },
        type: "action",
        loading: isPending
      }
    ] as ModalActionButtonProps[]
  };
  const handleRowClick = (data: any) => {
    navigate(`/users/${data.id}`);
  };

  function handleEditRowActionClick(data: any) {
    navigate(`/users/${data.id}`);
  }

  // Prepare columns options for export
  const columnsOptions: OptionsProps[] = useMemo(() => {
    const columnLabels: Record<string, string> = {
      firstName: "First name",
      lastName: "Last name",
      email: "Email",
      role: "Role",
      gender: "Gender",
      status: "Status"
    };

    return usersTableSchema
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
    usersTableSchema.forEach((column) => {
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
      pageTitle="Users List"
      actionButton={{
        createButton: { name: "Create user", onClick: () => navigate("/users/create"), disabled: isFetching }
      }}
    >
      <Modal
        showModal={modalData.showModal}
        modalTitle={modalData.modalTitle(selectedUser.firstName)}
        modalDescription={modalData.modalDescription}
        actionButtons={modalData.actionButtons}
      />
      <PageContainer>
        <Table
          columns={usersTableSchema}
          data={data?.data || []}
          isLoading={isFetching}
          loadingText="Fetching user data"
          showExportButton
          filters={userTableFilters}
          paginator={data?.paginator || null}
          actionButtons={rowActions}
          allowRowSelect
          handleRowClick={handleRowClick}
          searchSelectionOptions={searchSelectionOptions}
          showSelectColumns
          showSearchSelection
          tableActions={[{ action: () => {}, label: "Export Users", show: true }]}
          onExportClick={() => setOpenExportModal(true)}
        />
        <ExportModal
          columnsOptions={columnsOptions}
          tableSchema={tableSchema}
          service="users"
          openExportModal={openExportModal}
          onClose={() => setOpenExportModal(false)}
        />
      </PageContainer>
    </DashboardLayout>
  );
};

export default ListUsersScreen;
