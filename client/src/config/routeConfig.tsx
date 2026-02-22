import React from "react";

type LazyComponent = React.LazyExoticComponent<React.ComponentType<any>>;

interface RouteConfig {
  path: string;
  component: LazyComponent;
  children?: RouteConfig[];
}

const App = React.lazy(() => import("../App"));
const Login = React.lazy(() => import("../modules/auth/Login"));
const SignUp = React.lazy(() => import("../modules/auth/SignUp"));
const ProfileList = React.lazy(() => import("../modules/profile/ProfileList"));

const routes: RouteConfig[] = [
  {
    path: "/",
    component: App,
    children: [
      {
        path: "profiles",
        component: ProfileList,
      },
    ],
  },
  {
    path: "login",
    component: Login,
  },
  {
    path: "signup",
    component: SignUp,
  },
];

export default routes;
