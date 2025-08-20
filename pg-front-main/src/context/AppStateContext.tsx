import { snapshotDateByNumber, snapshotEndTime } from "@/utils/format";
import { createContext, useContext } from "react";
import type { AppState } from "../api/types";

// Define action types based on the real AppState from types.ts
type AppAction =
  | { type: "SET_CONNECTION_STATUS"; payload: AppState["connectionStatus"] }
  | { type: "SET_ALL_SNAPSHOTS_DATA"; payload: AppState["allSnapshotsData"] }
  | {
    type: "SET_USER_INFO";
    payload: Partial<
      Pick<AppState, "twitterAccountId" | "walletAddress" | "balance">
    >;
  }
  | { type: "RESET_STATE" }
  | {
    type: "SET_SNAPSHOT_INFO";
    payload: {
      currentSnapshot: number;
    };
  };

// Initial state matching your real AppState
export const initialState: AppState = {
  connectionStatus: "not_connected",
  allSnapshotsData: {
    snapshotsData: Array.from({ length: 5 }, (_, idx) => {
      const snapNum = (idx + 1) as 1 | 2 | 3 | 4 | 5;
      return {
        date: snapshotDateByNumber(snapNum).toString(),
        endDate: snapshotEndTime(snapNum).toString(),
        snapshotNumber: snapNum,
        isCheckedIn: false,
        snapshotBonus: 0,
        pepeAmount: 0,
        pegeAmount: 0,
        holdingDays: 0,
        coeff: 0,
        snapshotAmount: 0,
        snapshotDate: undefined,
      };
    }),
  },
  twitterAccountId: undefined,
  walletAddress: undefined,
  balance: 0,
  currentSnapshot: 1,
};

// Reducer
export const appStateReducer = (
  state: AppState,
  action: AppAction
): AppState => {
  switch (action.type) {
    case "SET_CONNECTION_STATUS":
      return { ...state, connectionStatus: action.payload };
    case "SET_ALL_SNAPSHOTS_DATA":
      return { ...state, allSnapshotsData: action.payload };
    case "SET_USER_INFO":
      return { ...state, ...action.payload };
    case "SET_SNAPSHOT_INFO":
      return {
        ...state,
        currentSnapshot: action.payload.currentSnapshot,
      };
    case "RESET_STATE":
      return initialState;
    default:
      return state;
  }
};

// Context type
export interface AppStateContextType {
  state: AppState;
  setConnectionStatus: (status: AppState["connectionStatus"]) => void;
  setAllSnapshotsData: (data: AppState["allSnapshotsData"]) => void;
  setUserInfo: (
    info: Partial<
      Pick<AppState, "twitterAccountId" | "walletAddress" | "balance" | "wallet">
    >
  ) => void;
  setSnapshotInfo: (
    currentSnapshot: number
  ) => void;
  resetAppState: () => void;
}

export const AppStateContext = createContext<AppStateContextType | undefined>(
  undefined
);

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
};
