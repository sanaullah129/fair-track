import { Outlet, useNavigate } from "react-router";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { useEffect } from "react";
import { Box, useMediaQuery } from "@mui/material";

function App() {

  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    if(location.pathname === "/") {
      navigate("/transactions");
    }
  },[navigate]);

  return (
    <>
      <Navbar />
      <Box
        sx={{
          pb: isMobile ? "70px" : 0,
          minHeight: "100vh",
        }}
      >
        <Outlet />
      </Box>
      <Footer />
    </>
  );
}

export default App;
