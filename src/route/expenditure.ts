import { RoutesProps } from "@/interfaces/route";
import CreateExpenditureScreen from "@/pages/expenditure/CreateExpenditureScreen";
import ExpenditureListViewScreen from "@/pages/expenditure/ExpenditureListViewScreen";
import UpdateExpenditureScreen from "@/pages/expenditure/UpdateExpenditureScreen";
export const EXPENDITURE_ROUTES: RoutesProps[] = [
  {
    component: CreateExpenditureScreen,
    url: "/expenditure/create",
    requireAuth: true,
    permission: ["expenditures", "create"]
  },
  {
    component: ExpenditureListViewScreen,
    url: "/expenditure",
    requireAuth: true,
    permission: ["expenditures", "read"]
  },
  {
    component: UpdateExpenditureScreen,
    url: "/expenditure/:id/update",
    requireAuth: true,
    permission: ["expenditures", "update"]
  }
];
