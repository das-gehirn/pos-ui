import { FC, memo, useEffect, useState } from "react";
import { Outlet, useLocation, Navigate, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

import Preloader from "@/components/Preloader";
import { PermissionOperation, PermissionString, hasPermission } from "@/helpers/permission";
import { Meta } from "@/interfaces/route";
import { UserRole, specialRoles } from "@/interfaces/user";
import { useBaseRequestService } from "@/hooks/request/useAxiosPrivate";
import useAuthStore from "@/store/auth";

interface CheckAuthProps {
  permission?: [PermissionString, PermissionOperation];
  allowedRoles?: UserRole[];
  meta?: Meta;
}

const CheckAuth: FC<CheckAuthProps> = ({ permission, allowedRoles, meta }) => {
  const [isVerifying, setIsVerifying] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { authUser: auth, clearAuthUser } = useAuthStore();

  const { getAuth, getInitData } = useBaseRequestService({ useToken: true, tokenType: "accessToken" });

  // 1. Verify user if no auth
  useEffect(() => {
    const verifyUser = async () => {
      if (!auth?.accessToken) {
        try {
          await getAuth();
        } catch (e) {
          if (e instanceof AxiosError && e.response?.status === 403) {
            clearAuthUser?.();
            navigate("/auth/login", { replace: true });
          } else {
            console.error("Unexpected error during authentication", e);
          }
        }
      }
      setIsVerifying(false);
    };

    verifyUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2. Fetch init data when accessToken is ready
  useEffect(() => {
    if (auth?.accessToken) {
      getInitData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth?.accessToken]);

  if (isVerifying) {
    return <Preloader />;
  }

  const userRole = auth?.role;
  const permissionVerified =
    permission && permission.length ? hasPermission(String(auth?.permission?.access), permission) : true;

  if (userRole && [...specialRoles, "admin"].includes(userRole)) {
    return <Outlet context={{ meta }} />;
  }

  if (userRole && !permission && (!allowedRoles || allowedRoles.length === 0)) {
    return <Outlet context={{ meta }} />;
  }

  if (userRole && permissionVerified) {
    if (!allowedRoles || allowedRoles.length === 0 || allowedRoles.includes(userRole as UserRole)) {
      return <Outlet context={{ meta }} />;
    } else {
      return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }
  }

  if (userRole && !permissionVerified) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return <Navigate to="/auth/login" state={{ from: location }} replace />;
};

export default memo(CheckAuth);
