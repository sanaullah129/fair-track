import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/auth";
import type { SignUpRequest, AuthResponse } from "../types/api";
import useAuthStore from "../stores/useAuthStore";

export const useSignUp = () => {
  const queryClient = useQueryClient();
  const { setUser, setToken } = useAuthStore();

  return useMutation({
    mutationFn: (data: SignUpRequest) => authApi.signUp(data),
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
      console.error("Sign up error:", error);
    },
  });
};
