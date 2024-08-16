export type PermissionOperation = "create" | "read" | "update" | "delete";
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
  | "sales";
export type IPermission = Record<PermissionString, Record<PermissionOperation, number>>;
export const permissionOperations: PermissionOperation[] = ["create", "read", "update", "delete"];
export const hasPermission = (
  userPermission: string,
  permissions: [PermissionString, PermissionOperation]
): boolean => {
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
  "stocks",
  "stockAdjustments",
  "salesTarget",
  "inventory",
  "invoice",
  "customers",
  "sales",
  "expenditures"
];

export const PERMISSIONS = structurePermissionsObject(PERMISSIONS_LIST);

function structurePermissionsObject(permissionsArray: PermissionString[]): IPermission {
  const permissions: any = {};
  for (let i = 0; i < permissionsArray.length; i++) {
    const resource = permissionsArray[i];
    permissions[resource] = {
      create: 32 + (i * 4 + 1),
      read: 32 + (i * 4 + 2),
      update: 32 + (i * 4 + 3),
      delete: 32 + (i * 4 + 4)
    };
  }
  return permissions;
}

export const decipherPermission = (cypheredPermissions: string): Record<PermissionString, PermissionOperation[]> => {
  const permissionsList = PERMISSIONS;
  let permissions: Record<PermissionString, PermissionOperation[]> = {} as Record<
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
