import { isSpecialRole } from "@/helpers";
import { hasPermission, PermissionOperation, PermissionResource } from "@/helpers/permission";
import { DeepOptional } from "@/interfaces";
import { UserRole, specialRoles } from "@/interfaces/user";
import {
  ArrowRightLeft,
  Box,
  Calculator,
  LayoutDashboard,
  NotebookText,
  ScanSearch,
  SettingsIcon,
  Tags,
  Truck,
  UserPlus,
  UsersIcon,
  MinusCircle,
  Puzzle,
  LucideIcon,
  Coins,
  FileSpreadsheet
} from "lucide-react";

interface RouteLink {
  title: string;
  url: string;
  isVisible?: boolean;
  isDisabled?: boolean;
}

export interface SubLink extends RouteLink {}

export interface MenuSidebarRoute extends RouteLink {
  icon?: LucideIcon;
  subLinks?: SubLink[];
}

export interface MenuSidebarRoutes {
  title: string;
  routeLinks: MenuSidebarRoute[];
}

const userHasValidPermission = (
  userPermission:
    | DeepOptional<{
        [key in PermissionResource]: PermissionOperation[];
      }>
    | "*",
  permissions: [PermissionResource, PermissionOperation],
  role: UserRole
) => {
  if (role && isSpecialRole(role)) return true;
  return hasPermission(userPermission, permissions);
};
export const menuSidebarRoutes = (
  userRole: UserRole,
  userPermission: DeepOptional<{
    [key in PermissionResource]: PermissionOperation[];
  }>
): MenuSidebarRoutes => {
  return {
    title: "Menu",
    routeLinks: [
      {
        title: "Dashboard",
        url: `/dashboard/${userRole}`,
        icon: LayoutDashboard
      },
      {
        title: "Users",
        url: "/",
        icon: UsersIcon,
        isVisible: userHasValidPermission(userPermission, ["users", "read"], userRole),
        subLinks: [
          {
            title: "Create users",
            url: "/users/create",
            isVisible: userHasValidPermission(userPermission, ["users", "create"], userRole)
          },
          {
            title: "List users",
            url: "/users",
            isVisible: userHasValidPermission(userPermission, ["users", "read"], userRole)
          }
        ]
      },
      {
        title: "Products",
        url: "/",
        icon: Tags,
        isDisabled: false,
        isVisible: userHasValidPermission(userPermission, ["products", "read"], userRole),
        subLinks: [
          {
            title: "Products List",
            url: "/products",
            isDisabled: false,
            isVisible: userHasValidPermission(userPermission, ["products", "read"], userRole)
          },
          {
            title: "Add Product",
            url: "/products/create",
            isDisabled: false,
            isVisible: userHasValidPermission(userPermission, ["products", "create"], userRole)
          },
          {
            title: "Change Product Quantity",
            url: "/products/create",
            isVisible: userHasValidPermission(userPermission, ["products", "create"], userRole)
          },
          {
            title: "Import Products",
            url: "/import-products",
            isDisabled: true
          },
          {
            title: "Product Codes",
            url: "/product-codes",
            isVisible: userHasValidPermission(userPermission, ["productCode", "read"], userRole)
          },
          {
            title: "Product Categories",
            url: "/product-categories",
            isVisible: userHasValidPermission(userPermission, ["productCategory", "read"], userRole)
          },
          {
            title: "Product Brands",
            url: "/product-brands",
            isVisible: userHasValidPermission(userPermission, ["productCode", "read"], userRole)
          },
          {
            title: "Product Units",
            url: "/product-units",
            isVisible: userHasValidPermission(userPermission, ["productUnit", "read"], userRole)
          },
          {
            title: "Product Variations",
            url: "/users",
            isDisabled: true
          },
          {
            title: "Product Warrants",
            url: "/users",
            isDisabled: true,
            isVisible: userHasValidPermission(userPermission, ["productWarranty", "read"], userRole)
          },
          {
            title: "Print Barcode/QrCode",
            url: "/users",
            isDisabled: true
          },
          {
            title: "Product Alert",
            url: "/users",
            isDisabled: true
          }
        ]
      },
      {
        title: "Inventory",
        url: "/",
        icon: Box,
        isDisabled: false,
        isVisible: userHasValidPermission(userPermission, ["inventory", "read"], userRole),
        subLinks: [
          {
            title: "Record Stock",
            url: "/stocks/record",
            isVisible: userHasValidPermission(userPermission, ["stocks", "create"], userRole)
          },
          {
            title: "Stock History",
            url: "/stocks",
            isVisible: userHasValidPermission(userPermission, ["stocks", "read"], userRole)
          },
          {
            title: "Stock Adjustment",
            url: "/stock-adjustments",
            isDisabled: false,
            isVisible: userHasValidPermission(userPermission, ["stockAdjustments", "read"], userRole)
          }
        ]
      },
      {
        title: "Stock Transfer",
        url: "/",
        icon: ArrowRightLeft,
        isVisible: false,
        isDisabled: true,
        subLinks: [
          {
            title: "List stock transfers",
            url: "/users/create"
          },
          {
            title: "Add stock transfers",
            url: "/users/create"
          },
          {
            title: "Received transfers",
            url: "/users/create"
          }
        ]
      },

      {
        title: "Sales",
        url: "/sales",
        icon: Coins,
        isVisible: userHasValidPermission(userPermission, ["sales", "read"], userRole)
      },
      {
        title: "Invoicing",
        url: "/invoices",
        icon: FileSpreadsheet,
        isVisible: userHasValidPermission(userPermission, ["invoice", "read"], userRole),
        subLinks: [
          {
            title: "List invoices",
            url: "/invoices",
            isVisible: userHasValidPermission(userPermission, ["invoice", "read"], userRole)
          },
          {
            title: "Add new invoice",
            url: "/invoices/create",
            isVisible: userHasValidPermission(userPermission, ["invoice", "create"], userRole),
            isDisabled: false
          }
        ]
      },
      {
        title: "Customers",
        url: "/customers",
        icon: UserPlus,
        isDisabled: false,
        isVisible: userHasValidPermission(userPermission, ["customers", "read"], userRole)
      },
      {
        title: "Supplier",
        url: "/suppliers",
        icon: Truck,
        isDisabled: false,
        isVisible: userHasValidPermission(userPermission, ["suppliers", "read"], userRole)
      },
      ...(userRole === "admin"
        ? [
            {
              title: "Accounting",
              url: "/",
              icon: Calculator,
              isDisabled: false,
              isVisible: true,
              subLinks: [
                {
                  title: "Sales Analysis",
                  url: "/sales/analysis",
                  isDisabled: false
                },
                {
                  title: "Stock Creditors",
                  url: "/stocks/creditors",
                  isDisabled: false,
                  isVisible: userHasValidPermission(userPermission, ["stockCreditors", "read"], userRole)
                },
                {
                  title: "Profit/Loss",
                  url: "/users/create",
                  isDisabled: true
                },
                {
                  title: "Sales Target",
                  url: "/users/create",
                  isDisabled: true
                },
                {
                  title: "Income/Expense",
                  url: "/users",
                  isDisabled: true
                }
              ]
            }
          ]
        : []),
      {
        title: "Installments",
        url: "/",
        icon: Puzzle,
        isDisabled: true,
        isVisible: false,
        subLinks: [
          {
            title: "Profit/Loss",
            url: "/users/create"
          },
          {
            title: "Income/Expense",
            url: "/users"
          }
        ]
      },
      {
        title: "Expenditure",
        url: "/",
        icon: MinusCircle,
        isDisabled: false,
        isVisible: userHasValidPermission(userPermission, ["expenditures", "read"], userRole),
        subLinks: [
          {
            title: "Add Expense",
            url: "/expenditure/create",
            isVisible: userHasValidPermission(userPermission, ["expenditures", "create"], userRole)
          },
          {
            title: "Expense List",
            url: "/expenditure",
            isVisible: userHasValidPermission(userPermission, ["expenditures", "read"], userRole)
          },
          {
            title: "Summary",
            url: "/expenditure/summary",
            isDisabled: true
          }
        ]
      },
      {
        title: "Analytics",
        url: "/",
        icon: ScanSearch,
        isDisabled: false,
        isVisible: ["admin", "super-admin"].includes(userRole),
        subLinks: [
          {
            title: "Stock Payments",
            url: "/stock-payments",
            isVisible: ["admin"].includes(userRole)
          }
        ]
      },
      {
        title: "Reports",
        url: "/",
        icon: NotebookText,
        isDisabled: true,
        subLinks: [
          {
            title: "Create users",
            url: "/users/create"
          },
          {
            title: "List users",
            url: "/users"
          }
        ]
      }
    ]
  };
};

export const generalSidebarRoutes = (userRole?: UserRole) => {
  if (userRole && [...specialRoles, "admin"].includes(userRole)) {
    return {
      title: "General",
      routeLinks: [
        {
          isDisabled: true,
          isVisible: false,
          title: "Settings",
          url: "/settings",
          icon: SettingsIcon
        }
      ]
    };
  }
  return {};
};
