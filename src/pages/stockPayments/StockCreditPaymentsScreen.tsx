import DashboardLayout from "@/components/dashboard/Layout";
import PageContainer from "@/components/dashboard/PageContainer";
import Table from "@/components/table/Table";
import { useGeneralQuery } from "@/hooks/request/useGeneralQuery";
import { GetManyProps } from "@/hooks/types";
import { useSetQueryParam } from "@/hooks/useSetQueryParam";
import { StockCreditorPaymentProps } from "@/interfaces/stockPayments";
import { stockPaymentSchema } from "@/tableSchema/stockPayments";

const StockCreditPaymentsScreen = () => {
  const { queryObject } = useSetQueryParam();
  const { data, isFetching } = useGeneralQuery<GetManyProps<StockCreditorPaymentProps[]>>({
    queryKey: ["stockPayments", queryObject],
    url: "/stock-payments",
    query: queryObject,
    enabled: !!Object.keys(queryObject).length
  });
  return (
    <DashboardLayout pageTitle="Stock Payments" isLoading={isFetching}>
      <PageContainer>
        <Table columns={stockPaymentSchema} data={data?.data || []} paginator={data?.paginator || null} />
      </PageContainer>
    </DashboardLayout>
  );
};

export default StockCreditPaymentsScreen;
