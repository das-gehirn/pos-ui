import Drawer from "@/components/Drawer";
import { StockProps, StockStatus } from "@/interfaces/stock";
import { format } from "date-fns";
import { FC } from "react";
import StockCard from "./StockCard";
import PrimaryButton from "@/components/PrimaryButton";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useGeneralMutation } from "@/hooks/request/useGeneralMutation";
import { useOptimisticUpdates } from "@/hooks/request/useOptimisticUpdates";

interface InspectStockProps {
  selectedStock: Partial<StockProps>;
  openDrawer?: boolean;
  handleDrawerOpen: () => void;
  type: "view" | "listView";
  queryObject?: Record<string, string>;
}
const InspectStock: FC<InspectStockProps> = ({ selectedStock, handleDrawerOpen, openDrawer, type, queryObject }) => {
  const getStockData = (productId: string) => {
    return selectedStock.stockData?.find((stock) => stock.productId === productId);
  };
  const navigate = useNavigate();
  const { addToOrUpdateList, updateSingleItem } = useOptimisticUpdates();
  const { isPending, mutate } = useGeneralMutation({
    httpMethod: "put",
    mutationKey: ["updateStock", selectedStock._id as string],
    url: `/stocks/${selectedStock._id}/change-status`
  });

  const handleStockStatusChange = (status: StockStatus) => {
    mutate(
      { payload: { status } },
      {
        onSuccess(data) {
          const stock = data.data.response as StockProps;
          if (type == "view") {
            updateSingleItem<StockProps>(["stock", selectedStock._id], stock);
          } else {
            addToOrUpdateList<StockProps>(["stocks", queryObject], stock);
          }
          handleDrawerOpen();
        }
      }
    );
  };

  const handlePayStock = () => {
    navigate(`/pay-stock-creditor?creditId=${selectedStock?.creditorData?._id}`);
  };
  return (
    <Drawer
      description=""
      title={selectedStock?.deliveryId || ""}
      handleDrawerClose={handleDrawerOpen}
      open={openDrawer}
    >
      <div className="flex justify-between items-center mb-3">
        <div>
          <h1 className="font-medium">Supplier</h1>
          <p>{selectedStock?.supplier?.name}</p>
        </div>
        <div>
          <h1 className="font-medium">Received Data</h1>
          <p>{selectedStock.receivedDate ? format(selectedStock?.receivedDate, "dd-MM-y") : "N/A"}</p>
        </div>
        <div>
          <h1 className="font-medium">Truck #</h1>
          <p>{selectedStock?.truckNumber}</p>
        </div>
      </div>
      <div className="h-full flex flex-col mt-5">
        <div className="flex-1">
          {selectedStock?.products &&
            selectedStock.products.length > 0 &&
            selectedStock.products.map((product, index) => {
              const stock = getStockData(product.id || "");
              return (
                <StockCard
                  product={{ name: product.name }}
                  stock={{
                    quantityExpected: stock?.quantityExpected,
                    quantityReceived: stock?.quantityReceived,
                    status: stock?.status,
                    batchId: stock?.batchId,
                    remark: stock?.remarks
                  }}
                  key={index}
                />
              );
            })}
        </div>
        {selectedStock && selectedStock?.status === "pending" && (
          <div className="button-container flex justify-between items-center gap-4">
            <PrimaryButton
              text="Approve"
              onClick={() => handleStockStatusChange("approved")}
              loading={isPending}
              disabled={isPending}
            />
            <PrimaryButton
              text="Reject"
              variant={"outline"}
              className="w-full border-primary"
              onClick={() => handleStockStatusChange("rejected")}
              loading={isPending}
              disabled={isPending}
            />
          </div>
        )}
        <div className="my-5 text-center">
          <Button
            className="bg-transparent text-primary space-x-2 hover:bg-transparent"
            onClick={() => {
              selectedStock.status === "pending"
                ? navigate(`/stocks/${selectedStock._id}`)
                : navigate(`/stocks/${selectedStock._id}/view`);
            }}
          >
            {selectedStock.status === "pending" && "Edit Stock"}
            {selectedStock.status !== "pending" && type !== "view" && "View Stock"}
          </Button>
        </div>
        {selectedStock.status === "approved" && <Button onClick={handlePayStock}>Pay stock</Button>}
      </div>
    </Drawer>
  );
};

export default InspectStock;
