import { useQuery, useMutation } from "@tanstack/react-query";
import { apiClient } from "../client";
import type {
  SnapshotListItem,
  SnapshotListApiResponse,
  CheckInStatusApiResponse,
  ApiResponse,
  FinalResultApiResponse,
  FinalResultItem,
} from "../types";
import { axiosAuthConfig, endpoints } from "../endpoints";

export const rewardsKeys = {
  all: ["rewards"] as const,
  snapshots: () => [...rewardsKeys.all, "snapshots"] as const,
  snapshotsList: (wallet?: string) =>
    [...rewardsKeys.snapshots(), "list", wallet ?? "unknown"] as const,
  checkInStatus: (wallet?: string) =>
    [...rewardsKeys.all, "check-in", wallet ?? "unknown"] as const,
  canCheckIn: (wallet?: string) =>
    [...rewardsKeys.all, "can-check-in", wallet ?? "unknown"] as const,
  finalResult: (wallet?: string) =>
    [...rewardsKeys.all, "final-result", wallet ?? "unknown"] as const,
} as const;

const fetchSnapshotsList = async (
  wallet: string
): Promise<SnapshotListItem[]> => {
  if (!wallet) {
    throw new Error("Wallet address is required to fetch snapshots list");
  }

  const response = await apiClient.get<
    SnapshotListApiResponse | SnapshotListItem[]
  >(endpoints.rewards.snapshots.list, {
    params: { wallet },
    ...axiosAuthConfig,
  });

  // Back-end sometimes returns plain array, sometimes wrapped in { success, data }
  const raw = response.data as SnapshotListApiResponse | SnapshotListItem[];

  if (Array.isArray(raw)) {
    // plain array response – treat as success
    return raw;
  }

  if (!raw.success) {
    throw new Error(raw.error || "Failed to fetch snapshots list");
  }

  return raw.data;
};

export const useSnapshotsList = (wallet?: string, enabled = !!wallet) => {
  return useQuery({
    queryKey: rewardsKeys.snapshotsList(wallet),
    queryFn: () => fetchSnapshotsList(wallet as string),
    enabled: enabled && !!wallet,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

const checkInStatusRequest = async (wallet: string): Promise<void> => {
  const response = await apiClient.post<CheckInStatusApiResponse>(
    endpoints.rewards.checkIn,
    {
      wallet: wallet,
    }
  );

  if (response.status === 201) {
    return;
  }

  if (!response.data.success) {
    throw new Error(response.data.error || "Failed to fetch check-in status");
  }
};

export const useCheckInStatus = () => {
  return useMutation({
    mutationFn: checkInStatusRequest,
  });
};

type CanCheckInApiResponse = ApiResponse<null>;

const canCheckInRequest = async (wallet: string): Promise<void> => {
  if (!wallet) throw new Error("Wallet address required");

  const response = await apiClient.get<CanCheckInApiResponse>(
    endpoints.rewards.canCheckIn,
    { params: { wallet }, ...axiosAuthConfig }
  );

  if (!response.data.success) {
    throw new Error(response.data.error || "Cannot check-in");
  }
};

export const useCanCheckIn = () => {
  return useMutation({ mutationFn: canCheckInRequest });
};

const finalResultRequest = async (wallet: string): Promise<number> => {
  if (!wallet) throw new Error("Wallet address required");

  const response = await apiClient.get<
    FinalResultApiResponse | FinalResultItem[]
  >(endpoints.rewards.finalResult, { params: { wallet }, ...axiosAuthConfig });

  const raw = response.data as FinalResultApiResponse | FinalResultItem[];

  const list: FinalResultItem[] = Array.isArray(raw)
    ? raw
    : raw.success
    ? raw.data
    : (() => {
        throw new Error(raw.error || "Failed to fetch final result");
      })();

  return list[0]?.pegeAmount ?? 0;
};

export const useFinalResult = () => {
  return useMutation<number, Error, string>({
    mutationFn: finalResultRequest,
  });
};

interface HasTweetApiResponse {
  hasTweet: boolean;
  xUserName: string;
  error?: string;
}

type HasTweetResult = { xUserName: string; hasTweet: boolean };

const hasTweetRequest = async (wallet: string): Promise<HasTweetResult> => {
  if (!wallet) throw new Error("Wallet address required");

  const response = await apiClient.get<HasTweetApiResponse>(
    endpoints.common.hasTweet,
    {
      params: { wallet },
      ...axiosAuthConfig,
    }
  );

  // Handle 404 – user not found
  if (response.status === 404) {
    const err = (response.data as { error?: string } | undefined)?.error;
    throw new Error(err || "User not found");
  }

  const { hasTweet, xUserName } = response.data;

  if (!hasTweet && !xUserName) {
    throw new Error("Tweet not found and username missing");
  }

  return { xUserName, hasTweet };
};

export const useHasTweet = () => {
  return useMutation<HasTweetResult, Error, string>({
    mutationFn: hasTweetRequest,
  });
};
