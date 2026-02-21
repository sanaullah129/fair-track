import React from "react";

type LazyComponent = React.LazyExoticComponent<React.ComponentType<any>>;

interface RouteConfig {
  path: string;
  component: LazyComponent;
}

const App = React.lazy(() => import("../App"));
const Login = React.lazy(() => import("../modules/auth/Login"));
const SignUp = React.lazy(() => import("../modules/auth/SignUp"));
const ProfileList = React.lazy(() => import("../modules/profile/ProfileList"));

const protectedRoutes: RouteConfig[] = [
  {
    path: "/",
    component: App,
  },
  {
    path: "profiles",
    component: ProfileList,
  },
];

const publicRoutes: RouteConfig[] = [
  {
    path: "login",
    component: Login,
  },
  {
    path: "signup",
    component: SignUp,
  },
];

export { protectedRoutes, publicRoutes };
