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
const Logout = React.lazy(() => import("../modules/auth/Logout"));
const ProfileList = React.lazy(() => import("../modules/profile/ProfileList"));
const Transactions = React.lazy(() => import("../modules/transactions/Transactions"));
const Categories = React.lazy(() => import("../modules/categories/Categories"));

const routes: RouteConfig[] = [
  {
    path: "/",
    component: App,
    children: [
      {
        path: "profiles",
        component: ProfileList,
      },
      {
        path: "transactions",
        component: Transactions,
      },
      {
        path: "categories",
        component: Categories,
      }
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
  {
    path: "logout",
    component: Logout,
  },
];

export default routes;
