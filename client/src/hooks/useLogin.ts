import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/auth";
import type { LoginRequest, AuthResponse } from "../types/api";
import useAuthStore from "../stores/useAuthStore";

export const useLogin = () => {
  const queryClient = useQueryClient();
  const { setUser, setToken } = useAuthStore();

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (data: AuthResponse) => {
      // Store user and token in auth store
      setUser({
        id: data.user.id,
        username: data.user.username,
        email: data.user.email,
      });
      setToken(data.token);

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
    onError: (error: any) => {
      console.error("Login error:", error);
    },
  });
};
