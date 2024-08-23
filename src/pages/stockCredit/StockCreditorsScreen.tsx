import DashboardLayout from "@/components/dashboard/Layout";
import PageContainer from "@/components/dashboard/PageContainer";
import Table from "@/components/table/Table";
import { useGeneralQuery } from "@/hooks/request/useGeneralQuery";
import { GetManyProps } from "@/hooks/types";
import { stockCreditorsTotalsSchema } from "@/tableSchema/stockCreditorsTotals";
import { useNavigate } from "react-router-dom";

const StockCreditorsScreen = () => {
  const navigate = useNavigate();

  const { data, isFetching } = useGeneralQuery<GetManyProps<StockCreditorsTotalsProps[]>>({
    queryKey: ["stockCreditorsTotals"],
    url: "/stock-creditors-totals",
    enabled: true
  });
  const handleRowClick = (data: Record<string, string>) => {
    navigate(`/stock-creditors/${data.supplierId}/list`);
  };
  return (
    <DashboardLayout pageTitle="Stock Creditors Totals">
      <PageContainer>
        <Table
          columns={stockCreditorsTotalsSchema}
          data={data?.data || []}
          paginator={data?.paginator || null}
          showSearch={false}
          isLoading={isFetching}
          handleRowClick={handleRowClick}
        />
      </PageContainer>
    </DashboardLayout>
  );
};

export default StockCreditorsScreen;
