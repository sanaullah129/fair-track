import { useQuery } from "@tanstack/react-query";
import { profileApi } from "../api/profiles";
import type { ProfileModel } from "../types/api";
import useAuthStore from "../stores/useAuthStore";

export const useProfilesByUser = () => {
  const { user } = useAuthStore();
  console.log("Fetching profiles for user:", user);

  return useQuery<ProfileModel[]>({
    queryKey: ["profiles", user?.id],
    queryFn: () => profileApi.getByUser(user!.id),
    enabled: !!user?.id,
    gcTime: 0,
  });
};
