import { apiClient } from "./client";
import type { CategoryRequest, CategoryResponse } from "../types/api";

export const categoryApi = {
  create: async (data: CategoryRequest): Promise<CategoryResponse> => {
    return apiClient.post<CategoryResponse>("/category", data);
  },

  getById: async (id: string): Promise<CategoryResponse> => {
    return apiClient.get<CategoryResponse>(`/category/${id}`);
  },

  getByUser: async (userId: string): Promise<CategoryResponse[]> => {
    const response = await apiClient.get<{ message: string; categories: CategoryResponse[] }>(`/category/user/${userId}`);
    return response.categories;
  },

  getAll: async (): Promise<CategoryResponse[]> => {
    return apiClient.get<CategoryResponse[]>("/category");
  },

  update: async (id: string, data: Partial<CategoryRequest>): Promise<CategoryResponse> => {
    return apiClient.put<CategoryResponse>(`/category/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete(`/category/${id}`);
  },
};

