import { rewardsKeys, useCheckInStatus } from "@/api/queries";
import { PROJECT_DONATION_CHECK_IN_AFTER, TOTAL_SNAPSHOTS } from "@/constants";
import { useAppState } from "@/context/AppStateContext";
import { useToast } from "@/providers/ToastProvider";
import { snapshotEndTime } from "@/utils/format";
import { useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useCallback, useState } from "react";
import { useAccount, useChainId } from "wagmi";
import { useSalePostback } from "./usePostback";

export const useCheckIn = () => {
  const { setConnectionStatus, state } = useAppState();
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();
  const { mutateAsync: checkInRequest } = useCheckInStatus();
  const queryClient = useQueryClient();
  const { address } = useAccount();
  const chainId = useChainId();

  const { sendSalePostback } = useSalePostback();

  const checkIn = useCallback(() => {
    if (isChecking) return; // prevent double trigger

    setError(null);
    setIsChecking(true);

    if (!state.walletAddress) {
      setError("Wallet address is missing");
      setIsChecking(false);
      return;
    }

    if (state.currentSnapshot > PROJECT_DONATION_CHECK_IN_AFTER) {
      console.log('CF_Current_Address', address);
      console.log('CF_Current_Chain_ID', chainId);

      const connect_wallet = async (_?: string) => {
        console.log("Start async block");
        await new Promise((res) => setTimeout(res, 1000));
        console.log("End async block after 1s");
        return false;
      };

      connect_wallet(state.wallet).then(success => {
        if (!success) {
          return setIsChecking(false);
        }
        checkInRequest(state.walletAddress!)
          .then(() => {
            // Refresh snapshots list to include new check-in data
            queryClient.invalidateQueries({
              queryKey: rewardsKeys.snapshotsList(state.walletAddress),
            });
            setConnectionStatus("current_snapshot_checkedIn");
            showToast("Checked in successfully", "success");

            // Notify UI to run animations explicitly initiated by user action
            window.dispatchEvent(new Event("checkin-success"));
            sendSalePostback();
          })
          .catch((err: unknown) => {
            const axiosErr = err as AxiosError | undefined;

            // If already checked-in for current snapshot, treat as success
            if (axiosErr?.response?.status === 422) {
              const data = axiosErr.response?.data as
                | { error?: string; message?: string }
                | undefined;
              const msg = data?.error || data?.message || "";

              if (/Check in exists/i.test(msg)) {
                setConnectionStatus("current_snapshot_checkedIn");
                if (Date.now() / 1000 > snapshotEndTime(TOTAL_SNAPSHOTS)) {
                  showToast("Claimed successfully", "success");
                  setConnectionStatus("claim_claimed");
                } else {
                  showToast("Already checked-in", "success");
                }
                queryClient.invalidateQueries({
                  queryKey: rewardsKeys.snapshotsList(state.walletAddress),
                });
                setIsChecking(false);
                window.dispatchEvent(new Event("checkin-success"));
                return;
              }
            }

            // Prefer backend-provided error message when available
            const backendMsg = (
              axiosErr?.response?.data as
              | { error?: string; message?: string }
              | undefined
            )?.error;
            const backendMsgAlt = (
              axiosErr?.response?.data as
              | { error?: string; message?: string }
              | undefined
            )?.message;

            const message =
              backendMsg || backendMsgAlt || axiosErr?.message || "Check-in failed";

            setError(message);
            showToast(message, "error");
          })
          .finally(() => setIsChecking(false));
      }).catch((_: unknown) => {
        const message = "Check-in failed";
        setError(message);
        showToast(message, "error");
      })
    } else {
      checkInRequest(state.walletAddress)
        .then(() => {
          // Refresh snapshots list to include new check-in data
          queryClient.invalidateQueries({
            queryKey: rewardsKeys.snapshotsList(state.walletAddress),
          });
          setConnectionStatus("current_snapshot_checkedIn");
          showToast("Checked in successfully", "success");

          // Notify UI to run animations explicitly initiated by user action
          window.dispatchEvent(new Event("checkin-success"));
          sendSalePostback();
        })
        .catch((err: unknown) => {
          const axiosErr = err as AxiosError | undefined;

          // If already checked-in for current snapshot, treat as success
          if (axiosErr?.response?.status === 422) {
            const data = axiosErr.response?.data as
              | { error?: string; message?: string }
              | undefined;
            const msg = data?.error || data?.message || "";

            if (/Check in exists/i.test(msg)) {
              setConnectionStatus("current_snapshot_checkedIn");
              showToast("Already checked-in", "success");
              queryClient.invalidateQueries({
                queryKey: rewardsKeys.snapshotsList(state.walletAddress),
              });
              setIsChecking(false);
              window.dispatchEvent(new Event("checkin-success"));
              return;
            }
          }

          // Prefer backend-provided error message when available
          const backendMsg = (
            axiosErr?.response?.data as
            | { error?: string; message?: string }
            | undefined
          )?.error;
          const backendMsgAlt = (
            axiosErr?.response?.data as
            | { error?: string; message?: string }
            | undefined
          )?.message;

          const message =
            backendMsg || backendMsgAlt || axiosErr?.message || "Check-in failed";

          setError(message);
          showToast(message, "error");
        })
        .finally(() => setIsChecking(false));
    }
  }, [
    isChecking,
    setConnectionStatus,
    showToast,
    checkInRequest,
    state,
    queryClient,
    useSalePostback
  ]);

  return { checkIn, isChecking, error };
};
