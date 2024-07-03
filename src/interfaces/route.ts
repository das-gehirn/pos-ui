import { PermissionOperation, PermissionString } from "@/helpers/permission";
import { UserRole } from "./user";

export interface Meta {
  breadcrumbs: {
    title: string;
    url?: string;
  }[];
}
export interface RoutesProps {
  url: string;
  permission?: [PermissionString, PermissionOperation];
  requireAuth?: boolean;
  allowedRoles?: UserRole[];
  meta?: Meta;
  component: React.FC;
  routeName?: string;
}
