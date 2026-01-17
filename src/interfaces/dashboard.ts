import { DefaultPluginProps } from ".";

export interface DashboardStats extends DefaultPluginProps {
  monthlySales: number;
  monthlyProfit: number;
  monthlyExpenditure: number;
  totalStockTaken: number;
}

export interface SalesTargetPerMonth {
  month: string;
  expected: number;
  actual: number;
}

export interface DebtorsCreditors {
  count: number;
  amount: number;
}

export interface TotalDebtorsCreditors {
  debtors: DebtorsCreditors;
  creditors: DebtorsCreditors;
  total: number;
}

export interface SalesPerMonth {
  month: string;
  total: number;
}

export interface YearlyPortfolioValue {
  total: number;
  profit: number;
  loss: number;
}

export interface ProfitPerMonth {
  month: string;
  profit: number;
}

export interface DashboardStatistics extends DefaultPluginProps {
  salesTargetPerMonth: SalesTargetPerMonth[];
  totalDebtorsCreditors: TotalDebtorsCreditors;
  salesPerMonth: SalesPerMonth[];
  yearlyPortfolioValue: YearlyPortfolioValue;
  profitPerMonth: ProfitPerMonth[];
}
