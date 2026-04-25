import { apiClient } from "./client";
import type { SummaryModel } from "../types/api";

export const summaryApi = {
  /**
   * Fetch summary stats for a given profile.
   * Returns the SummaryModel defined on the server.
   */
  getByProfile: async (profileId: string): Promise<SummaryModel> => {
    const response = await apiClient.get<{ message: string; summary: SummaryModel }>(
      `/summary/${profileId}`
    );
    return response.summary;
  },
};
