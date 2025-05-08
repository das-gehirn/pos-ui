import SidebarMenu from "./SidebarMenu";
import { MouseEventHandler, memo } from "react";
import { generalSidebarRoutes, menuSidebarRoutes } from "@/route/sidebar";
import { ArrowRightLeft, ChevronsLeft } from "lucide-react";
import { Button } from "../ui/button";
import useAuthStore from "@/store/auth";
import { UserRole } from "@/interfaces/user";
const DashboardSidebar = ({
  displaySidebar,
  handleDisplaySidebar
}: {
  displaySidebar: boolean;
  handleDisplaySidebar: MouseEventHandler;
}) => {
  const { authUser } = useAuthStore();

  const menuSidebarRoutesLinks = menuSidebarRoutes((authUser?.role || "") as UserRole, authUser?.userPermission || {});
  const generalSidebarRoutesLinks = generalSidebarRoutes(authUser?.role);

  return (
    <div
      className={`flex-shrink-0 overflow-x-hidden dark ${
        displaySidebar ? "left-[-100%] w-0" : "left-0"
      } md:w-[260px] lg:block md:block bg-primary z-[900] shadow-md fixed bottom-0 top-0`}
    >
      <div className="h-full w-full p-5 pr-0">
        <div className="flex h-full min-h-0 flex-col">
          <div className="relative h-full w-full flex-1 border-white/20 flex flex-col">
            <div className="sidebar-main__content flex-grow w-full">
              <div className="logo mb-10 flex items-center justify-between text-white pr-3">
                {/* <img src=Logo} alt="Logo" className="w-[120px]" /> */}
                <span>Logo</span>
                <ChevronsLeft onClick={handleDisplaySidebar} className="cursor-pointer" size={19} />
              </div>
              <div className="menu-items">
                <SidebarMenu title={menuSidebarRoutesLinks.title} routesData={menuSidebarRoutesLinks.routeLinks} />
                <SidebarMenu
                  title={generalSidebarRoutesLinks.title}
                  routesData={generalSidebarRoutesLinks.routeLinks}
                />
              </div>
            </div>
            {false && (
              <div className="ml-[-30px] flex items-center justify-center w-full text-white">
                <Button variant={"outline"} size={"icon"} className="bg-[#38585e24 hover:bg-transparent">
                  <ArrowRightLeft />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(DashboardSidebar);
