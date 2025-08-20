import { useMutation } from "@tanstack/react-query";
import { apiClient } from "../client";
import type { CheckParticipationApiResponse } from "../types";
import { endpoints } from "../endpoints";

// Query Keys for Twitter-related queries
export const twitterKeys = {
  all: ["twitter"] as const,
  participation: () => [...twitterKeys.all, "participation"] as const,
} as const;

// Fetch function for checking participation
const fetchCheckParticipation = async (wallet: string): Promise<void> => {
  await apiClient.get<CheckParticipationApiResponse>(
    endpoints.x.checkParticipation,
    {
      params: { wallet: wallet },
    }
  );
};

export const useCheckParticipation = () => {
  return useMutation({
    mutationFn: fetchCheckParticipation,
  });
};
