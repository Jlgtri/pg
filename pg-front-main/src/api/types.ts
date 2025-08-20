export interface UserPost {
  id: string;
  title: string;
  description: string;
  image: string;
  createdAt: string;
}

export interface SingleSnapshotData {
  snapshotNumber: number;
  date: string;
  endDate: string;
  snapshotDate?: string;
  isCheckedIn: boolean;
  snapshotBonus: number;
  pepeAmount: number;
  pegeAmount: number;
  holdingDays: number;
  coeff: number;
  snapshotAmount: number;
}

export interface User {
  twitterPostChecked: boolean;
  totalToClaim?: number;
}

export interface AllSnapshotsData {
  snapshotsData: SingleSnapshotData[];
}

export interface AppState {
  connectionStatus:
  | "not_connected"
  | "wallet_connected"
  | "twitter_connected"
  | "post_checked"
  | "current_snapshot_checkedIn"
  | "claim_not_available_yet"
  | "claim_available"
  | "claim_claimed";
  allSnapshotsData: AllSnapshotsData;
  twitterAccountId?: string;
  wallet?: string;
  walletAddress?: string;
  balance?: number;
  currentSnapshot: number;
}

// New snapshots list item returned from `/api/rewards/snapshots/list`
export interface SnapshotListItem {
  date: string;
  snapshotNumber: number;
  pegeAmount: number;
  holdingDistribution: {
    amount: number;
    holdingDays: number;
    coeff: number;
    pepeAmount: number;
  }[];
}

export interface FinalResultItem {
  pegeAmount: number;
  amount: number;
  holdingDays: number;
  coeff: number;
  pepeAmount: number;
  snapshotNumber: number;
}

export type SnapshotListApiResponse = ApiResponse<SnapshotListItem[]>;

export type CheckInStatusApiResponse = ApiResponse<null>;

export type CheckParticipationApiResponse = ApiResponse<null>;

export type FinalResultApiResponse = ApiResponse<FinalResultItem[]>;

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  error?: string;
}
