import { apiClient } from "./client";
import type { ProfileModel } from "../types/api";

export const profileApi = {
  create: async (data: Partial<ProfileModel>) => {
    return apiClient.post<ProfileModel>(`/profile`, data);
  },

  getByUser: async (userId: string) => {
    return apiClient.get<ProfileModel[]>(`/profile/user/${userId}`);
  },

  getById: async (id: string) => {
    return apiClient.get<ProfileModel>(`/profile/${id}`);
  },
};
