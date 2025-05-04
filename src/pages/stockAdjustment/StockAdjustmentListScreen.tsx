import Container from "@/components/Container";
import DashboardLayout from "@/components/dashboard/Layout";
import Table from "@/components/table/Table";
import { useGeneralQuery } from "@/hooks/request/useGeneralQuery";
import { GetManyProps } from "@/hooks/types";
import { useSetQueryParam } from "@/hooks/useSetQueryParam";
import { usePermission } from "@/hooks/usePermission";
import { useNavigate } from "react-router-dom";
import { invoiceTableFilters } from "@/tableSchema/invoice";
import { stockAdjustmentTableSchema } from "@/tableSchema/stockAdjustment";
import { StockAdjustmentProps } from "@/interfaces/stockAdjustment";

const StockAdjustmentListScreen = () => {
  const { queryObject } = useSetQueryParam();

  const { data, isFetching } = useGeneralQuery<GetManyProps<StockAdjustmentProps[]>>({
    queryKey: ["stockAdjustments", queryObject],
    url: "/stock-adjustments",
    query: queryObject
  });

  const { canCreateStockAdjustments } = usePermission();

  const navigate = useNavigate();

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
      <Container className="border border-gray-50">
        <Table
          columns={stockAdjustmentTableSchema}
          data={data?.data || []}
          isLoading={isFetching}
          loadingText="Fetching stock adjustment data"
          paginator={data?.paginator || null}
          filters={invoiceTableFilters}
          allowRowSelect={false}
        />
      </Container>
    </DashboardLayout>
  );
};

export default StockAdjustmentListScreen;
