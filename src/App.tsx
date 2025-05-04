import { Route } from "react-router-dom";
import CustomSwitch from "./components/CustomSwitch";
import { ROUTES } from "./route";
import { RoutesProps } from "./interfaces/route";
import NotFoundScreen from "./components/NotFound";
import Unauthorized from "./components/Unauthorized";
import CheckAuth from "./persistLogin/CheckAuth";

function App() {
  return (
    <CustomSwitch>
      {ROUTES.map((route: RoutesProps, index: number) => {
        return route.requireAuth ? (
          <Route
            key={index}
            element={<CheckAuth permission={route.permission!} meta={route.meta} allowedRoles={route.allowedRoles} />}
          >
            <Route path={route.url} element={<route.component />} />
          </Route>
        ) : (
          <Route path={route.url} element={<route.component />} key={index} />
        );
      })}

      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFoundScreen />} />
    </CustomSwitch>
  );
}

export default App;
