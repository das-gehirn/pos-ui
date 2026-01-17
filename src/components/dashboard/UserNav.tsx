import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useBaseRequestService } from "@/hooks/request/useAxiosPrivate";
import { toast } from "sonner";
import { getErrorMessageFromApi } from "@/utils";
import { useRoles } from "@/hooks/useRoles";
import useAuthStore from "@/store/auth";
// import Preloader from '../Preloader';

const UserNav = memo(() => {
  const { isAdmin } = useRoles();
  const navLinks = [
    {
      name: "Profile",
      route: "/me",
      allowedRoles: [],
      shortcut: "⇧⌘P"
    }
  ];

  if (isAdmin) {
    navLinks.push({
      name: "Settings",
      route: "/settings",
      allowedRoles: [],
      shortcut: "⌘S"
    });
  }

  const { axiosInstance } = useBaseRequestService({ useToken: true, tokenType: "accessToken" });
  const { authUser: userDetails, clearAuthUser } = useAuthStore();

  const userNameExists = userDetails && (userDetails.firstName || userDetails?.lastName);
  const fullName = userNameExists ? `${userDetails.firstName} ${userDetails.lastName}` : "";
  const userAbbreviation = userNameExists ? `${userDetails?.firstName?.[0]}${userDetails?.lastName?.[0]}` : "";
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axiosInstance.get("/auth/logout");
      clearAuthUser();
      navigate("/auth/login", { replace: true });
    } catch (error) {
      toast.error("Error", {
        description: getErrorMessageFromApi(error)
      });
    }
  };
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-8 w-8 rounded-full outline-none focus-within:outline-none focus-visible:outline-none focus:outline-none border-none"
          >
            <Avatar className="h-8 w-8 outline-none">
              <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
              <AvatarFallback>{userAbbreviation}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{fullName}</p>
              <p className="text-xs leading-none text-muted-foreground">{userDetails && userDetails.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {navLinks &&
              navLinks &&
              navLinks.map((link) => {
                return (
                  !!link.route && (
                    <Link to={link.route} role="button" className="block" key={link.route}>
                      <DropdownMenuItem className="!cursor-pointer">
                        {link.name}
                        {link.shortcut && <DropdownMenuShortcut>{link.shortcut}</DropdownMenuShortcut>}
                      </DropdownMenuItem>
                    </Link>
                  )
                );
              })}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="!cursor-pointer" onClick={handleLogout}>
            Log out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
});
export default UserNav;
