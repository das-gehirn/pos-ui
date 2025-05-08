import { DeepOptional } from "@/interfaces";

export type PermissionOperation = "list" | "create" | "read" | "update" | "delete" | "export";
export type PermissionResource =
  | "users"
  | "settings"
  | "calendar"
  | "faqs"
  | "accounts"
  | "products"
  | "productUnit"
  | "productCategory"
  | "productBrand"
  | "productWarranty"
  | "productCode"
  | "suppliers"
  | "warehouses"
  | "customers"
  | "expenditures"
  | "salesTarget"
  | "stocks"
  | "inventory"
  | "stockAdjustments"
  | "invoice"
  | "sales"
  | "stockCreditorsPayment"
  | "stockCreditors";

export type IPermission = Record<PermissionResource, Record<PermissionOperation, number>>;
export const permissionOperations: PermissionOperation[] = ["create", "read", "update", "delete", "list", "export"];
export const hasPermission = (
  userPermission:
    | DeepOptional<{
        [key in PermissionResource]: PermissionOperation[];
      }>
    | "*",
  permissions: [PermissionResource, PermissionOperation]
): boolean => {
  if (!userPermission) return false;
  if (userPermission === "*") return true;
  const [permissionResource, permissionOperation] = permissions;
  return Boolean(
    Object.keys(userPermission).length && userPermission[permissionResource]?.includes(permissionOperation)
  );
};

export const PERMISSIONS_LIST: PermissionResource[] = [
  "users",
  "settings",
  "calendar",
  "faqs",
  "productCategory",
  "productBrand",
  "productCode",
  "productWarranty",
  "productUnit",
  "products",
  "suppliers",
  "warehouses",
  "customers",
  "expenditures",
  "salesTarget",
  "stocks",
  "stockAdjustments",
  "invoice",
  "sales",
  "inventory",
  "stockCreditors",
  "stockCreditorsPayment"
];
