import { DollarSign, TrendingUp } from "lucide-react";
import { FC } from "react";

interface DashboardCardProps {
  title: string;
  amount: number;
  percentageDifference: number;
  isAmount?: boolean;
}
const DashboardCard: FC<DashboardCardProps> = ({ amount, percentageDifference, title, isAmount }) => {
  return (
    <div
      className="space-y-2 relative p-6 bg-white  rounded-sm border-gray-100 border"
      style={{ boxShadow: "rgba(33, 35, 38, 0.3) 0px 10px 10px -10px" }}
    >
      <div className="heading flex gap-3 items-center">
        <div className="icon-container w-8 h-8 bg-red-50 flex items-center justify-center">
          <DollarSign size={18} className="text-red-500" />
        </div>
        <p className="text-sm flex-1">{title}</p>
      </div>
      <h1 className="text-xl font-medium">{isAmount ? <span>&#8373;{amount.toFixed(2)}</span> : amount}</h1>
      <div className="flex items-center font-light text-[12px] gap-2">
        <p className="flex items-center text-green-600 gap-1">
          <TrendingUp size={16} />
          <span>{percentageDifference}%</span>
        </p>
        <span className="text-[12px]">From last month</span>{" "}
      </div>
    </div>
  );
};

export default DashboardCard;
