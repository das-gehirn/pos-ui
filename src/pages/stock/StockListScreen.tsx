import Container from "@/components/Container";
import DashboardLayout from "@/components/dashboard/Layout";
import Table from "@/components/table/Table";
import { ActionButton } from "@/components/table/type";
import { useGeneralQuery } from "@/hooks/request/useGeneralQuery";
import { GetManyProps } from "@/hooks/types";
import { useSetQueryParam } from "@/hooks/useSetQueryParam";
import { usePermission } from "@/hooks/usePermission"; // Import usePermission
import { StockProps } from "@/interfaces/stock";
import { stockDataSchema } from "@/tableSchema/stocks";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import InspectStock from "./InspectStock";
import { useRoles } from "@/hooks/useRoles";
import ExportModal from "@/components/table/ExportModal";
import { OptionsProps } from "@/interfaces";

const StockListScreen = () => {
  const { isAdmin } = useRoles();
  const navigate = useNavigate();
  const [selectedStock, setSelectedStock] = useState<Partial<StockProps>>({});
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openExportModal, setOpenExportModal] = useState(false);
  const { queryObject } = useSetQueryParam();
  const { data, isFetching } = useGeneralQuery<GetManyProps<StockProps[]>>({
    queryKey: ["stocks", queryObject],
    url: "/stocks",
    query: queryObject,
    enabled: !!Object.keys(queryObject).length
  });

  const { canCreateStocks, canUpdateStocks, canReadStocks } = usePermission(); // Use usePermission hook

  function handleEditRowActionClick(data: Record<string, any>) {
    navigate(`/stocks/${data.id}`);
  }

  const rowActions: ActionButton[] = [
    {
      label: "Edit",
      action: handleEditRowActionClick,
      show: canUpdateStocks
    },
    {
      label: "View",
      action: (data: Record<string, any>) => {
        navigate(`/stocks/${data.id}/view`);
      },
      show: canReadStocks
    },
    {
      label: "Inspect",
      action: (data: Record<string, any>) => {
        setSelectedStock(data);
        setOpenDrawer(true);
      },
      show: isAdmin
    }
  ];

  const actionButtonProps = canCreateStocks
    ? {
        createButton: {
          name: "Record Stock",
          onClick: () => navigate("/stocks/record"),
          disabled: isFetching
        }
      }
    : undefined;

  // Prepare columns options for export
  const columnsOptions: OptionsProps[] = useMemo(() => {
    const columnLabels: Record<string, string> = {
      deliveryId: "Delivery Code",
      truckNumber: "Truck Number",
      supplierId: "Supplier",
      stockData: "Total Stock Recorded",
      createdBy: "Recorded by",
      status: "Status",
      receivedDate: "Date Received"
    };

    return stockDataSchema
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
    stockDataSchema.forEach((column) => {
      if ("accessorKey" in column && column.accessorKey) {
        const accessorKey = column.accessorKey as string;
        const numberColumns = ["stockData"];
        schema[accessorKey] = {
          dataType: numberColumns.includes(accessorKey) ? "number" : "text"
        };
      }
    });
    return schema;
  }, []);

  return (
    <DashboardLayout pageTitle="Stock Data" actionButton={actionButtonProps}>
      <InspectStock
        handleDrawerOpen={() => setOpenDrawer(!openDrawer)}
        type="listView"
        selectedStock={selectedStock}
        openDrawer={openDrawer}
        queryObject={queryObject}
      />
      <Container className="border border-gray-50">
        <Table
          columns={stockDataSchema}
          data={data?.data || []}
          isLoading={isFetching}
          loadingText="Fetching stock data"
          showExportButton
          paginator={data?.paginator || null}
          allowRowSelect
          handleRowClick={handleEditRowActionClick}
          showSelectColumns
          actionButtons={rowActions}
          onExportClick={() => setOpenExportModal(true)}
        />
        <ExportModal
          columnsOptions={columnsOptions}
          tableSchema={tableSchema}
          service="stocks"
          openExportModal={openExportModal}
          onClose={() => setOpenExportModal(false)}
        />
      </Container>
    </DashboardLayout>
  );
};

export default StockListScreen;
