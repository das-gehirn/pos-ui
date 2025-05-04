import { hasPermission } from "@/helpers/permission";
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
export const menuSidebarRoutes = (userRole: UserRole, userPermission: string): MenuSidebarRoutes => {
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
        isVisible: hasPermission(userPermission, ["users", "read"], userRole),
        subLinks: [
          {
            title: "Create users",
            url: "/users/create",
            isVisible: hasPermission(userPermission, ["users", "create"], userRole)
          },
          {
            title: "List users",
            url: "/users",
            isVisible: hasPermission(userPermission, ["users", "read"], userRole)
          }
        ]
      },
      {
        title: "Products",
        url: "/",
        icon: Tags,
        isDisabled: false,
        isVisible: hasPermission(userPermission, ["products", "read"], userRole),
        subLinks: [
          {
            title: "Products List",
            url: "/products",
            isDisabled: false,
            isVisible: hasPermission(userPermission, ["products", "read"], userRole)
          },
          {
            title: "Add Product",
            url: "/products/create",
            isDisabled: false,
            isVisible: hasPermission(userPermission, ["products", "create"], userRole)
          },
          {
            title: "Change Product Quantity",
            url: "/products/create",
            isVisible: hasPermission(userPermission, ["products", "create"], userRole)
          },
          {
            title: "Import Products",
            url: "/import-products",
            isDisabled: true
          },
          {
            title: "Product Codes",
            url: "/product-codes",
            isVisible: hasPermission(userPermission, ["productCode", "read"], userRole)
          },
          {
            title: "Product Categories",
            url: "/product-categories",
            isVisible: hasPermission(userPermission, ["productCategory", "read"], userRole)
          },
          {
            title: "Product Brands",
            url: "/product-brands",
            isVisible: hasPermission(userPermission, ["productCode", "read"], userRole)
          },
          {
            title: "Product Units",
            url: "/product-units",
            isVisible: hasPermission(userPermission, ["productUnit", "read"], userRole)
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
            isVisible: hasPermission(userPermission, ["productWarranty", "read"], userRole)
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
        isVisible: hasPermission(userPermission, ["inventory", "read"], userRole),
        subLinks: [
          {
            title: "Record Stock",
            url: "/stocks/record",
            isVisible: hasPermission(userPermission, ["stocks", "create"], userRole)
          },
          {
            title: "Stock History",
            url: "/stocks",
            isVisible: hasPermission(userPermission, ["stocks", "read"], userRole)
          },
          {
            title: "Stock Adjustment",
            url: "/stock-adjustments",
            isDisabled: false,
            isVisible: hasPermission(userPermission, ["stockAdjustments", "read"], userRole)
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
        isVisible: hasPermission(userPermission, ["sales", "read"], userRole)
      },
      {
        title: "Invoicing",
        url: "/invoices",
        icon: FileSpreadsheet,
        isVisible: hasPermission(userPermission, ["invoice", "read"], userRole),
        subLinks: [
          {
            title: "List invoices",
            url: "/invoices",
            isVisible: hasPermission(userPermission, ["invoice", "read"], userRole)
          },
          {
            title: "Add new invoice",
            url: "/invoices/create",
            isVisible: hasPermission(userPermission, ["invoice", "create"], userRole),
            isDisabled: false
          }
        ]
      },
      {
        title: "Customers",
        url: "/customers",
        icon: UserPlus,
        isDisabled: false,
        isVisible: hasPermission(userPermission, ["customers", "read"], userRole)
      },
      {
        title: "Supplier",
        url: "/suppliers",
        icon: Truck,
        isDisabled: false,
        isVisible: hasPermission(userPermission, ["suppliers", "read"], userRole)
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
                  isVisible: hasPermission(userPermission, ["stockCreditors", "read"], userRole)
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
        isVisible: hasPermission(userPermission, ["expenditures", "read"], userRole),
        subLinks: [
          {
            title: "Add Expense",
            url: "/expenditure/create",
            isVisible: hasPermission(userPermission, ["expenditures", "create"], userRole)
          },
          {
            title: "Expense List",
            url: "/expenditure",
            isVisible: hasPermission(userPermission, ["expenditures", "read"], userRole)
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
