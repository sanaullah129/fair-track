import { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import { protectedRoutes, publicRoutes } from "./config/routeConfig";
import AuthContext from "./components/wrappers/AuthContext";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        {/* Public routes - no AuthContext */}
        <Routes>
          {publicRoutes.map((r) => {
            const Component = r.component;
            return <Route key={r.path} path={r.path} element={<Component />} />;
          })}

          <AuthContext>
            {protectedRoutes.map((r) => {
              const Component = r.component;
              return (
                <Route key={r.path} path={r.path} element={<Component />} />
              );
            })}
          </AuthContext>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
