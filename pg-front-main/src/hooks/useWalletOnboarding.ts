import { useFinalResult, useSnapshotsList } from "@/api/queries";
import {
  BONUS_ON_EACH_CHECK_IN
} from "@/constants";
import { useAppState } from "@/context/AppStateContext";
import { getLastProjectEndDate, snapshotDateByNumber, snapshotEndTime } from "@/utils/format";
import type { AxiosError } from "axios";
import { useEffect, useRef } from "react";
import { useConnectors } from "wagmi";

interface UseWalletOnboardingParams {
  isConnected: boolean;
  address?: string;
  openModal: (name: string) => void;
  checkRegistered: (wallet: string) => Promise<unknown>;
}

export const useWalletOnboarding = ({
  isConnected,
  address,
  openModal,
  checkRegistered,
}: UseWalletOnboardingParams) => {
  const { state, setConnectionStatus, setAllSnapshotsData, setUserInfo } =
    useAppState();

  const previouslyConnectedRef = useRef(isConnected);
  const hasCheckedStatusRef = useRef(false);
  const modalTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedHandle = state.twitterAccountId;

  const connectors = useConnectors();

  useEffect(() => {
    if (isConnected) {
      if (state.connectionStatus === "not_connected") {
        setConnectionStatus("wallet_connected");
      }

      // Check if wallet is already registered (once per session)
      if (address && !hasCheckedStatusRef.current) {
        hasCheckedStatusRef.current = true;
        checkRegistered(address)
          .then(() => {
            if (state.connectionStatus === "wallet_connected") {
              setConnectionStatus("twitter_connected");
            }
          })
          .catch((err: unknown) => {
            const axiosErr = err as AxiosError | undefined;
            if (axiosErr?.response?.status === 422) {
              const errorData = axiosErr.response?.data as
                | { error?: string; message?: string }
                | undefined;
              const msg = errorData?.error || errorData?.message || "";

              if (
                /No tweet/i.test(msg) &&
                state.connectionStatus === "wallet_connected"
              ) {
                setTimeout(() => setConnectionStatus("twitter_connected"), 0);
              }
            }
          });
      }

      if (savedHandle && state.connectionStatus === "wallet_connected") {
        setConnectionStatus("twitter_connected");
      }

      // On the very first successful connect, show the connection modal
      // after a short delay (1.5 s) so async status checks can complete.
      const excludedStatuses: (typeof state.connectionStatus)[] = [
        "post_checked",
        "current_snapshot_checkedIn",
        "claim_not_available_yet",
        "claim_available",
        "claim_claimed",
      ];

      if (!previouslyConnectedRef.current) {
        modalTimerRef.current = setTimeout(() => {
          if (!excludedStatuses.includes(state.connectionStatus)) {
            openModal("connection");
          }
        }, 1500);
      }

      // Save wallet address in global state if not already stored
      if (address && state.walletAddress !== address) {
        setUserInfo({ walletAddress: address });
        (async () => {
          for (var connector of connectors) {
            if (await connector.isAuthorized()) {
              setUserInfo({ wallet: connector.name, walletAddress: address });
              break;
            }
          }
        })();
      }
    } else {
      // Delayed reset: only mark as not_connected if wallet stays
      // disconnected for >1.5 s to avoid short flickers that cause UI glitches
      if (!modalTimerRef.current) {
        modalTimerRef.current = setTimeout(() => {
          if (!isConnected && state.connectionStatus !== "not_connected") {
            setConnectionStatus("not_connected");
          }
        }, 1500);
      }

      hasCheckedStatusRef.current = false;
    }

    previouslyConnectedRef.current = isConnected;

    // Clear timeout when dependencies change / component unmounts
    return () => {
      if (modalTimerRef.current) clearTimeout(modalTimerRef.current);
    };
  }, [
    isConnected,
    address,
    state.connectionStatus,
    setConnectionStatus,
    openModal,
    checkRegistered,
    savedHandle,
    setUserInfo,
  ]);

  const shouldFetchSnapshots =
    isConnected && !!address && state.connectionStatus !== "not_connected";

  const { data: snapshotsListData, isSuccess } = useSnapshotsList(
    state.walletAddress,
    shouldFetchSnapshots
  );

  const { mutateAsync: fetchFinalResult } = useFinalResult(); // returns Promise<number>

  useEffect(() => {
    if (!isConnected) return;
    const nowSec = Date.now() / 1000;

    if (isSuccess && snapshotsListData) {
      const updated = Array.from({ length: 5 }, (_, i) => {
        const snapNum = i + 1;
        const found = snapshotsListData.find(
          (item) => Number(item.snapshotNumber) === snapNum
        );

        const dist = found?.holdingDistribution?.[0];
        return {
          snapshotNumber: snapNum,
          date: snapshotDateByNumber(
            snapNum as 1 | 2 | 3 | 4 | 5
          ).toString(),
          endDate: snapshotEndTime(snapNum as 1 | 2 | 3 | 4 | 5).toString(),
          isCheckedIn: Boolean(dist),
          snapshotBonus: found
            ? BONUS_ON_EACH_CHECK_IN[snapNum as 1 | 2 | 3 | 4 | 5] || 0
            : 0,
          amount: dist?.amount ?? 0,
          pepeAmount: dist?.pepeAmount ?? 0,
          pegeAmount: found?.pegeAmount ?? 0,
          holdingDays: dist?.holdingDays ?? 0,
          coeff: dist?.coeff ?? 0,
          snapshotAmount: dist?.amount ?? 0,
          snapshotDate: found?.date ?? "",
        };
      });

      setAllSnapshotsData({ snapshotsData: updated });

      (async () => {
        let totalPege: number = updated.reduce(
          (sum, snap) =>
            sum +
            (snap.isCheckedIn
              ? snap.amount * snap.coeff +
              BONUS_ON_EACH_CHECK_IN[snap.snapshotNumber as 1 | 2 | 3 | 4 | 5]
              : 0),
          0
        );

        if (nowSec > getLastProjectEndDate() && address) {
          try {
            totalPege = await fetchFinalResult(address); // await numeric pegeAmount
          } catch {
            /* fallback to local estimate */
          }
        }

        setUserInfo({ balance: totalPege });
      })();

      // If already checked in for current snapshot, set status accordingly
      const currentChecked = updated[state.currentSnapshot - 1]?.isCheckedIn;
      if (
        currentChecked &&
        state.connectionStatus !== "current_snapshot_checkedIn" &&
        state.currentSnapshot !== 5
      ) {
        setConnectionStatus("current_snapshot_checkedIn");
      }

      if (
        state.currentSnapshot === 5 &&
        state.connectionStatus !== "current_snapshot_checkedIn" &&
        nowSec < snapshotEndTime(state.currentSnapshot)
      ) {
        if (state.allSnapshotsData.snapshotsData[4].isCheckedIn === true) {
          setConnectionStatus("claim_not_available_yet");
        } else {
          setConnectionStatus("post_checked");
        }
      }
      if (
        state.currentSnapshot === 5 &&
        nowSec > snapshotEndTime(state.currentSnapshot)
      ) {
        setConnectionStatus("claim_available");
      }
    }
  }, [
    isConnected,
    address,
    isSuccess,
    snapshotsListData,
    setAllSnapshotsData,
    setUserInfo,
    state.currentSnapshot,
    state.connectionStatus,
    setConnectionStatus,
    fetchFinalResult,
  ]);
};
