import DashboardLayout from "@/components/dashboard/Layout";
import PageContainer from "@/components/dashboard/PageContainer";
import { useGeneralQuery } from "@/hooks/request/useGeneralQuery";
import { GetManyProps } from "@/hooks/types";
import { useNavigate, useParams } from "react-router-dom";
import { useSetQueryParam } from "@/hooks/useSetQueryParam";
import Table from "@/components/table/Table";
import { stockCreditorsSchema, stockCreditorsTableFilters } from "@/tableSchema/stockCreditors";
import { StockCreditorProps } from "@/interfaces/stockCreditors";
import { OptionsProps } from "@/interfaces";

const StockCreditorsList = () => {
  const { queryObject } = useSetQueryParam();
  const params = useParams<{ supplierId: string }>();
  const supplierId = params?.supplierId || "";

  const navigate = useNavigate();
  const query = { ...queryObject, supplierId };
  const { data, isFetching } = useGeneralQuery<GetManyProps<StockCreditorProps[]>>({
    queryKey: ["stockCreditors", query],
    url: "/stock-creditors",
    query,
    enabled: !!supplierId
  });
  const handleRowClick = (data: Record<string, string>) => {
    navigate(`/stock-creditors/${data.supplierId}/list`);
  };
  const rowActions = [
    {
      label: "Pay",
      action: (data: Record<string, any>) => {
        navigate(`/pay-stock-creditor?creditId=${data?._id}`);
      },
      show: true
    },
    {
      label: "View Payments",
      action: () => {
        alert("View payments is being worked on");
      },
      show: true
    }
  ];

  const searchSelectionOptions: OptionsProps[] = [
    {
      label: "Delivery Id",
      value: "deliveryId"
    },
    {
      label: "Supplier",
      value: "supplierId"
    }
  ];
  return (
    <DashboardLayout
      pageTitle="Stock Creditors"
      isLoading={isFetching}
      actionButton={{
        createButton: {
          name: "Make Payment",
          onClick: () => {
            navigate("/pay-stock-creditor");
          }
        }
      }}
    >
      <PageContainer>
        <Table
          columns={stockCreditorsSchema}
          data={data?.data || []}
          paginator={data?.paginator || null}
          isLoading={isFetching}
          handleRowClick={handleRowClick}
          actionButtons={rowActions}
          showSearchSelection
          searchSelectionOptions={searchSelectionOptions}
          filters={stockCreditorsTableFilters}
        />
      </PageContainer>
    </DashboardLayout>
  );
};

export default StockCreditorsList;
