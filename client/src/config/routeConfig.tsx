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
const Profiles = React.lazy(() => import("../modules/profile/Profiles"));
const Transactions = React.lazy(() => import("../modules/transactions/Transactions"));
const Categories = React.lazy(() => import("../modules/categories/Categories"));
const Dashboard = React.lazy(() => import("../modules/dashboard/Dashboard"));
const Summary = React.lazy(() => import("../modules/summary/Summary"));

const routes: RouteConfig[] = [
  {
    path: "/",
    component: App,
    children: [
      {
        path: "profiles",
        component: Profiles,
      },
      {
        path: "transactions",
        component: Transactions,
      },
      {
        path: "categories",
        component: Categories,
      },
      {
        path: "dashboard",
        component: Dashboard,
      },
      {
        path: "overall-summary/:profileId",
        component: Summary,
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
