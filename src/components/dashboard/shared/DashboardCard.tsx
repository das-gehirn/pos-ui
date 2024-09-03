import { formatCurrency } from "@/helpers";
import { DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import { FC } from "react";

interface DashboardCardProps {
  title: string;
  amount: number;
  percentageDifference: number;
  isAmount?: boolean;
}
const DashboardCard: FC<DashboardCardProps> = ({ amount, percentageDifference, title, isAmount = true }) => {
  let color = "";
  if (percentageDifference > 0) {
    color = "text-green-600";
  }
  if (percentageDifference < 0) {
    color = "text-red-600";
  }
  return (
    <div
      className="space-y-2 relative p-6 bg-white  rounded-sm border-gray-100 border"
      style={{ boxShadow: "#2123260a 0px 8px 16px" }}
    >
      <div className="heading flex gap-3 items-center">
        <div className="icon-container w-8 h-8 bg-red-50 flex items-center justify-center">
          <DollarSign size={18} className="text-red-500" />
        </div>
        <p className="text-sm flex-1">{title}</p>
      </div>
      <h1 className="text-xl font-medium">{isAmount ? <span>{formatCurrency({ value: amount })}</span> : amount}</h1>
      <div className="flex items-center font-light text-[12px] gap-2">
        <p className={`flex items-center ${color} gap-1`}>
          {percentageDifference > 0 && <TrendingUp size={16} />}
          {percentageDifference < 0 && <TrendingDown size={16} />}
          <span>{percentageDifference}%</span>
        </p>
        <span className="text-[12px]">From last month</span>{" "}
      </div>
    </div>
  );
};

export default DashboardCard;
