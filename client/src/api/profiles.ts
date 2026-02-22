import { apiClient } from "./client";
import type { ProfileModel } from "../types/api";

export const profileApi = {
  create: async (data: Partial<ProfileModel>) => {
    return apiClient.post<ProfileModel>(`/profile`, data);
  },

  getByUser: async (userId: string) => {
    const response = await apiClient.get<{ message: string; profiles: ProfileModel[] }>(`/profile/user/${userId}`);
    return response.profiles;
  },

  getById: async (id: string) => {
    return apiClient.get<ProfileModel>(`/profile/${id}`);
  },
};
