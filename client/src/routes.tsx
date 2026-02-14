import { createBrowserRouter } from "react-router";
import Login from "./modules/auth/Login";
import SignUp from "./modules/auth/SignUp";
import App from "./App";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "signup",
    element: <SignUp />,
  },
]);

export default routes;
