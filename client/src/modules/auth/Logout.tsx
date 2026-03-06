import { useEffect } from "react";
import { useNavigate } from "react-router";
import useAuthStore from "../../stores/useAuthStore";

const Logout = () => {
  const navigate = useNavigate();
  const { logout, token } = useAuthStore();

  useEffect(() => {
    if (!token) {
      logout();
    }
    navigate("/login");
  }, [logout, navigate, token]);

  return <div>Logging out...</div>;
};

export default Logout;