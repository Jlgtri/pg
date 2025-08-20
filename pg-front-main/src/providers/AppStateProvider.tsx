import type { AppState } from "@/api/types";
import {
  AppStateContext,
  appStateReducer,
  initialState,
  type AppStateContextType,
} from "@/context/AppStateContext";
import React, { useCallback, useReducer } from "react";

export const AppStateProvider: React.FC<{
  children: React.ReactNode;
  initial?: Partial<AppState>;
}> = ({ children, initial }) => {
  const [state, dispatch] = useReducer(appStateReducer, {
    ...initialState,
    ...initial,
  });

  // -----------------------------------------------------------------------
  // Connection status handling (no strict ordering — backend drives the flow)
  // -----------------------------------------------------------------------

  const setConnectionStatus = useCallback(
    (status: AppState["connectionStatus"]) => {
      dispatch({ type: "SET_CONNECTION_STATUS", payload: status });
    },
    []
  );

  const setAllSnapshotsData = useCallback(
    (data: AppState["allSnapshotsData"]) => {
      dispatch({ type: "SET_ALL_SNAPSHOTS_DATA", payload: data });
    },
    []
  );

  const resetAppState = useCallback(() => {
    dispatch({ type: "RESET_STATE" });
  }, []);

  const setUserInfo = useCallback(
    (
      info: Partial<
        Pick<AppState, "twitterAccountId" | "walletAddress" | "balance">
      >
    ) => {
      dispatch({ type: "SET_USER_INFO", payload: info });
    },
    []
  );

  const setSnapshotInfo = useCallback(
    (
      currentSnapshot: number,
    ) => {
      dispatch({
        type: "SET_SNAPSHOT_INFO",
        payload: {
          currentSnapshot,
        },
      });
    },
    []
  );

  const value: AppStateContextType = {
    state,
    setConnectionStatus,
    setAllSnapshotsData,
    setUserInfo,
    setSnapshotInfo,
    resetAppState,
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
};
