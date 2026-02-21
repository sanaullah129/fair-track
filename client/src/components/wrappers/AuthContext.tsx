import React, { useEffect } from "react";
import useAuthStore from "../../stores/useAuthStore";
import { useNavigate } from "react-router";

const AuthContext: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuthStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  return <>{children}</>;
};

export default AuthContext;
