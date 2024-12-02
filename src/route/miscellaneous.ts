import { RoutesProps } from "@/interfaces/route";
import ImportsScreen from "@/pages/imports/ImportScreen";
import Home from "@/pages/shared/Home";

export const MISCELLANEOUS_ROUTES: RoutesProps[] = [
  {
    component: Home,
    url: "/",
    requireAuth: false
  },
  {
    component: ImportsScreen,
    url: "/imports",
    requireAuth: true,
    allowedRoles: ["admin"]
  }
];
