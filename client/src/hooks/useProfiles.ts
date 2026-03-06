import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "../api/profiles";
import type { ProfileModel } from "../types/api";
import useAuthStore from "../stores/useAuthStore";

export const useProfilesByUser = () => {
  const { user } = useAuthStore();

  return useQuery<ProfileModel[]>({
    queryKey: ["profiles", user?.id],
    queryFn: () => profileApi.getByUser(user!.id),
    enabled: !!user?.id,
    gcTime: 0,
  });
};

export const useProfile = (id: string) => {
  return useQuery({
    queryKey: ["profile", id],
    queryFn: () => profileApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateProfile = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: (data: Partial<ProfileModel>) => profileApi.create(data),
    onSuccess: () => {
      // Invalidate profiles list query
      queryClient.invalidateQueries({ queryKey: ["profiles", user?.id] });
    },
    onError: (error: any) => {
      console.error("Create profile error:", error);
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProfileModel> }) =>
      profileApi.update(id, data),
    onSuccess: (data: ProfileModel) => {
      // Invalidate both the specific profile and profiles list
      queryClient.invalidateQueries({ queryKey: ["profile", data._id] });
      queryClient.invalidateQueries({ queryKey: ["profiles", user?.id] });
    },
    onError: (error: any) => {
      console.error("Update profile error:", error);
    },
  });
};

export const useDeleteProfile = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: (id: string) => profileApi.delete(id),
    onSuccess: () => {
      // Invalidate profiles list query
      queryClient.invalidateQueries({ queryKey: ["profiles", user?.id] });
    },
    onError: (error: any) => {
      console.error("Delete profile error:", error);
    },
  });
};
