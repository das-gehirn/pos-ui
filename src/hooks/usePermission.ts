import {
  PERMISSIONS_LIST,
  PermissionOperation,
  hasPermission,
  permissionOperations,
  PermissionResource
} from "@/helpers/permission";
import useAuthStore from "@/store/auth";
import { useMemo } from "react";
// Define the permission keys dynamically
type PermissionKeys = `${"can"}${Capitalize<PermissionOperation>}${Capitalize<PermissionResource>}`;

// Define a record type for permissions
type Permissions = Record<PermissionKeys, boolean>;
export const usePermission = (): Permissions => {
  const { authUser } = useAuthStore();

  const permissions = useMemo(() => {
    const perms = {} as Permissions;

    PERMISSIONS_LIST.forEach((resource) => {
      permissionOperations.forEach((operation) => {
        const key = `can${operation.charAt(0).toUpperCase() + operation.slice(1)}${
          resource.charAt(0).toUpperCase() + resource.slice(1)
        }` as PermissionKeys;
        perms[key] = hasPermission(authUser?.permission?.access, [resource, operation]);
      });
    });

    return perms;
  }, []);

  return permissions;
};
