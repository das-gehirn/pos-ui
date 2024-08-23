import { RoutesProps } from "@/interfaces/route";
import RecordStockScreen from "@/pages/stock/RecordStockScreen";
import StockListScreen from "@/pages/stock/StockListScreen";
import UpdateStockScreen from "@/pages/stock/UpdateStockScreen";
import ViewStockScreen from "@/pages/stock/ViewStockScreen";
import PayStockScreen from "@/pages/stockPayments/PayStockScreen";
import StockCreditorsList from "@/pages/stockCredit/StockCreditorsList";
import StockCreditorsScreen from "@/pages/stockCredit/StockCreditorsScreen";
import StockCreditPaymentsScreen from "@/pages/stockPayments/StockCreditPaymentsScreen";

export const STOCK_ROUTES: RoutesProps[] = [
  {
    component: RecordStockScreen,
    url: "/stocks/record",
    requireAuth: true,
    permission: ["stocks", "create"]
  },
  {
    component: StockListScreen,
    url: "/stocks",
    requireAuth: true,
    permission: ["stocks", "read"]
  },
  {
    component: UpdateStockScreen,
    url: "/stocks/:id",
    requireAuth: true,
    permission: ["stocks", "update"]
  },
  {
    component: ViewStockScreen,
    url: "/stocks/:id/view",
    requireAuth: true,
    permission: ["stocks", "read"]
  },
  {
    component: StockCreditorsScreen,
    url: "/stocks/creditors",
    requireAuth: true,
    permission: ["stockCreditors", "read"]
  },
  {
    component: StockCreditorsList,
    url: "/stock-creditors/:supplierId/list",
    requireAuth: true,
    permission: ["stockCreditors", "read"]
  },
  {
    component: PayStockScreen,
    url: "/pay-stock-creditor",
    requireAuth: true,
    allowedRoles: ["admin", "super-admin"]
  },
  {
    component: StockCreditPaymentsScreen,
    url: "/stock-payments",
    requireAuth: true,
    allowedRoles: ["admin", "super-admin"]
  }
];
