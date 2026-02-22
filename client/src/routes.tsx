import { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import routes from "./config/routeConfig";
import AuthContext from "./components/wrappers/AuthContext";

function renderRoutes(routesList: any[]) {
  return routesList.map((r) => {
    const Component = r.component;
    if (r.children && r.children.length > 0) {
      return (
        <Route key={r.path} path={r.path} element={<Component />}>
          {renderRoutes(r.children)}
        </Route>
      );
    }
    return <Route key={r.path} path={r.path} element={<Component />} />;
  });
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <AuthContext>
          <Routes>
            {renderRoutes(routes)}
          </Routes>
        </AuthContext>
      </Suspense>
    </BrowserRouter>
  );
}
