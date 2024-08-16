import { formatCurrency } from "@/helpers";
import { Trash } from "lucide-react";
import { FC } from "react";

interface InvoiceItemProps {
  item: {
    amount: number;
    quantity: number;
    name: string;
  };
  id: string;
  handleInvoiceItemRemove?: (id: string) => void;
  showDelete?: boolean;
}
const InvoiceItem: FC<InvoiceItemProps> = ({ item, handleInvoiceItemRemove, id, showDelete = true }) => {
  const totalPrice = item.quantity * item.amount;
  const handleIteRemove = () => {
    if (handleInvoiceItemRemove) {
      handleInvoiceItemRemove(id);
    }
  };
  return (
    <div className="flex item-center text-[12px] relative border-b pb-1">
      <div className="w-[60%] flex gap-x-4 items-center">
        <div className="item-title">
          <p>{item.name}</p>
        </div>
      </div>
      <div className="w-[40%] flex items-center justify-between">
        <p className="text-start w-[38%]">{item.quantity}</p>
        <p className="text-center w-[30%]">{formatCurrency({ value: item.amount, showCurrencySign: false })}</p>
        <p className=" w-1/3 text-right">{formatCurrency({ value: totalPrice })}</p>
      </div>
      {showDelete && (
        <div className="absolute top-[-0.25rem] right-[-37px]">
          <button className="p-1 hover:bg-primary hover:text-white bg-transparent" onClick={handleIteRemove}>
            <Trash size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default InvoiceItem;
