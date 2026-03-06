import { Outlet, useNavigate } from "react-router";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { useEffect } from "react";

function App() {

  const navigate = useNavigate();
  useEffect(() => {
    if(location.pathname === "/") {
      navigate("/transactions");
    }
  },[]);

  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

export default App;
