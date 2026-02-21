import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoryApi } from "../api/categories";
import type { CategoryRequest, CategoryResponse } from "../types/api";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryApi.getAll(),
    enabled: true,
  });
};

export const useCategory = (id: string) => {
  return useQuery({
    queryKey: ["category", id],
    queryFn: () => categoryApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CategoryRequest) => categoryApi.create(data),
    onSuccess: () => {
      // Invalidate categories list query
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error: any) => {
      console.error("Create category error:", error);
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CategoryRequest> }) =>
      categoryApi.update(id, data),
    onSuccess: (data: CategoryResponse) => {
      // Invalidate both the specific category and categories list
      queryClient.invalidateQueries({ queryKey: ["category", data.id] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error: any) => {
      console.error("Update category error:", error);
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoryApi.delete(id),
    onSuccess: () => {
      // Invalidate categories list query
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error: any) => {
      console.error("Delete category error:", error);
    },
  });
};
