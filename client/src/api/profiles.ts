import { apiClient } from "./client";
import type { ProfileModel } from "../types/api";

export const profileApi = {
  create: async (data: Partial<ProfileModel>) => {
    return apiClient.post<ProfileModel>(`/profile`, data);
  },

  getByUser: async (userId: string) => {
    const response = await apiClient.get<{ message: string; profiles: ProfileModel[] }>(`/profile/user/${userId}`);
    console.log("Fetched profiles:", response);
    return response.profiles;
  },

  getById: async (id: string) => {
    return apiClient.get<ProfileModel>(`/profile/${id}`);
  },

  update: async (id: string, data: Partial<ProfileModel>) => {
    return apiClient.put<ProfileModel>(`/profile/${id}`, data);
  },

  delete: async (id: string) => {
    return apiClient.delete<{ message: string }>(`/profile/${id}`);
  },
};
