import { apiClient } from "./client";
import type { ProfileModel } from "../types/api";

export const profileApi = {
  create: async (data: Partial<ProfileModel>) => {
    return apiClient.post<ProfileModel>(`/profile`, data);
  },

  getByUser: async (userId: string, fetchActive?: boolean) => {
    const url = fetchActive !== undefined 
      ? `/profile/user/${userId}/${fetchActive}` 
      : `/profile/user/${userId}`;
    const response = await apiClient.get<{ message: string; profiles: ProfileModel[] }>(url);
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
