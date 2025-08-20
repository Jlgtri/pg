import { useCallback, useEffect, useState } from "react";
import { useAppState } from "@/context/AppStateContext";
import { useToast } from "@/providers/ToastProvider";
import { useModal } from "@/providers/ModalProvider";
import { useCheckParticipation } from "@/api/queries";
import { useAccount } from "wagmi";
import type { AxiosError } from "axios";

export const usePostCheck = () => {
  const { state, setConnectionStatus } = useAppState();
  const { showToast } = useToast();
  const { openModal } = useModal();
  const { address } = useAccount();
  const { mutateAsync: checkParticipationApi, isPending: isCheckingApi } =
    useCheckParticipation();
  const isTwitterConnected = state.connectionStatus === "twitter_connected";
  const isPostChecked = state.connectionStatus === "post_checked";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkPost = useCallback(() => {
    if (!isTwitterConnected || loading || isCheckingApi) return;

    // reset previous error and start loading
    setError(null);
    setLoading(true);

    (async () => {
      try {
        if (!address) {
          throw new Error("Wallet not connected");
        }

        await checkParticipationApi(address ?? "");

        setConnectionStatus("post_checked");
        openModal("complete");
      } catch (err: unknown) {
        const axiosErr = err as AxiosError | undefined;

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

        const msg =
          backendMsg || backendMsgAlt || axiosErr?.message || "Unknown error";

        setError(msg);
        showToast(msg, "error");
      } finally {
        setLoading(false);
      }
    })();
  }, [
    isTwitterConnected,
    loading,
    isCheckingApi,
    setConnectionStatus,
    showToast,
    openModal,
    address,
    checkParticipationApi,
  ]);

  // OPTIONAL: automatically clear error when status changes externally
  useEffect(() => {
    if (state.connectionStatus !== "twitter_connected") {
      setError(null);
    }
  }, [state.connectionStatus]);

  return {
    checkPost,
    loading,
    error,
    isTwitterConnected,
    isPostChecked,
  };
};
