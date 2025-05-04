import { UserRole } from "@/interfaces/user";
import { isSpecialRole } from ".";

export type PermissionOperation = "list" | "create" | "read" | "update" | "delete" | "export";
export type PermissionString =
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
  | "payment"
  | "stockCreditors";
export type IPermission = Record<PermissionString, Record<PermissionOperation, number>>;
export const permissionOperations: PermissionOperation[] = ["create", "read", "update", "delete"];
export const hasPermission = (
  userPermission: string,
  permissions: [PermissionString, PermissionOperation],
  role?: UserRole
): boolean => {
  if ((role && role === "admin") || (role && isSpecialRole(role))) return true;
  if (!userPermission || !permissions) return false;

  const [permissionService, permissionOperation] = permissions;
  if (userPermission === "*" && permissionService != "calendar") return true;
  return userPermission.includes(String.fromCharCode(PERMISSIONS[permissionService][permissionOperation]));
};

export const PERMISSIONS_LIST: PermissionString[] = [
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
  "payment"
];

export const PERMISSIONS = structurePermissionsObject(PERMISSIONS_LIST);

function structurePermissionsObject(permissionsArray: PermissionString[]): IPermission {
  const permissions: Partial<
    Record<
      PermissionString,
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

export const decipherPermission = (cypheredPermissions: string): Record<PermissionString, PermissionOperation[]> => {
  const permissionsList = PERMISSIONS;
  const permissions: Record<PermissionString, PermissionOperation[]> = {} as Record<
    PermissionString,
    PermissionOperation[]
  >;

  for (const key in permissionsList) {
    const mainKey = key as PermissionString;
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
