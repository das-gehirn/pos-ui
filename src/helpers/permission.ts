import { UserRole } from "@/interfaces/user";
import { isSpecialRole } from ".";

export type PermissionOperation = "create" | "read" | "update" | "delete";
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
export const permissionOperations: PermissionOperation[] = ["create", "read", "update", "delete"];
export const hasPermission = (
  userPermission: string,
  permissions: [PermissionResource, PermissionOperation],
  role?: UserRole
): boolean => {
  if ((role && role === "admin") || (role && isSpecialRole(role)) || userPermission === "*") return true;
  if (!userPermission || !permissions) return false;

  const [permissionService, permissionOperation] = permissions;
  return userPermission.includes(String.fromCharCode(PERMISSIONS[permissionService][permissionOperation]));
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

export const PERMISSIONS = structurePermissionsObject(PERMISSIONS_LIST);

function structurePermissionsObject(permissionsArray: PermissionResource[]): IPermission {
  const permissions: Partial<
    Record<
      PermissionResource,
      {
        create: number;
        read: number;
        update: number;
        delete: number;
        export: number;
      }
    >
  > = {};

  for (let i = 0; i < permissionsArray.length; i++) {
    const resource = permissionsArray[i];
    permissions[resource] = {
      create: 32 + (i * 5 + 1),
      read: 32 + (i * 5 + 2),
      update: 32 + (i * 5 + 3),
      delete: 32 + (i * 5 + 4),
      export: 32 + (i * 5 + 5)
    };
  }

  return permissions as IPermission;
}

export const decipherPermission = (cypheredPermissions: string): Record<PermissionResource, PermissionOperation[]> => {
  const permissionsList = PERMISSIONS;
  const permissions: Record<PermissionResource, PermissionOperation[]> = {} as Record<
    PermissionResource,
    PermissionOperation[]
  >;

  for (const key in permissionsList) {
    const mainKey = key as PermissionResource;
    const permission = permissionsList[mainKey];

    if (typeof permission === "object") {
      for (const innerKey in permission) {
        const permissionOperation = innerKey as PermissionOperation;
        const charCode = String.fromCharCode(permission[permissionOperation]);
        if (cypheredPermissions.length && cypheredPermissions.includes(charCode)) {
          permissions[mainKey] = permissions[mainKey] || [];
          permissions[mainKey].push(permissionOperation);
        }
      }
    }
  }

  return permissions;
};
