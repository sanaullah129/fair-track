import { useQuery } from "@tanstack/react-query";
import { summaryApi } from "../api/summary";
import type { SummaryModel } from "../types/api";

/**
 * Hook to fetch summary stats for a profile.
 * Utilizes react-query for caching and background refetch.
 */
export const useSummaryByProfile = (profileId?: string) => {
  return useQuery<SummaryModel>({
    queryKey: ["summary", profileId],
    queryFn: () => {
      if (!profileId) throw new Error("profileId is required");
      return summaryApi.getByProfile(profileId);
    },
    enabled: !!profileId,
    gcTime: 0,
  });
};
