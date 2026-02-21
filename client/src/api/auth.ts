import { apiClient } from "./client";
import type { SignUpRequest, LoginRequest, AuthResponse } from "../types/api";

export const authApi = {
  signUp: async (data: SignUpRequest): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>("/user/sign-up", data);
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>("/user/login", data);
  },

  getProfile: async (): Promise<any> => {
    return apiClient.get("/user/profile");
  },

  logout: async (): Promise<void> => {
    return apiClient.post("/user/logout");
  },
};
