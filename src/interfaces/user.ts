import { PermissionOperation, PermissionResource } from "@/helpers/permission";
import { AddressProps, DefaultPluginProps, PhoneProps } from ".";
import { SettingsProps } from "./settings";

export type UserRole = "admin" | "support" | "manager" | "super-admin" | "sales-personnel" | "warehouse-manager";

export const userRoles: UserRole[] = [
  "admin",
  "support",
  "manager",
  "super-admin",
  "sales-personnel",
  "warehouse-manager"
];

export const specialRoles: UserRole[] = userRoles.filter((role: UserRole) => ["support", "super-admin"].includes(role));

export type Gender = "male" | "female";
export const genders: Gender[] = ["female", "male"];
export type UserStatus = "active" | "suspended" | "pending" | "inactive";

export const userStatuses: UserStatus[] = ["active", "suspended", "pending", "inactive"];

export interface UserProps extends DefaultPluginProps {
  id?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  role?: UserRole;
  gender?: Gender;
  address?: AddressProps;
  phone?: PhoneProps;
  status?: UserStatus;
  isLoggedIn?: boolean;

  userPermission?: {
    [key in PermissionResource]?: PermissionOperation[];
  };
  fullName?: string;
  accountId?: string;
  warehouseId?: string[];
  currentWarehouse?: string;
}

export interface AuthUserResponse extends UserProps {
  accessToken: string;
}

export interface InitData {
  settings: SettingsProps;
  hasUnreadNotification: boolean;
}
