import { useSendSignature } from "@/api/queries";
import { useAppState } from "@/context/AppStateContext";
import { useWalletSignature } from "@/hooks/useWalletSignature";
import modalBg from "@/images/modalBgBlue.png";
import { useModal } from "@/providers/ModalProvider";
import { useToast } from "@/providers/ToastProvider";
import cn from "classnames";
import { useState } from "react";
import { useAccount } from "wagmi";
import { CheckPostButton } from "../../CheckPostButton/CheckPostButton";
import styles from "./ConnectionModal.module.scss";
// import { useCheckInStatus } from "@/api/queries";
import type { AxiosError } from "axios";

export const ConnectionModal = () => {
  const { closeModal } = useModal();
  const { state, setUserInfo, setConnectionStatus } = useAppState();
  const [twitterAccountId, setTwitterAccountId] = useState(
    state.twitterAccountId
  );
  const { requestSignature } = useWalletSignature();
  const { mutateAsync: sendSignature } = useSendSignature();
  const { address } = useAccount();
  const { showToast } = useToast();
  // const { mutateAsync: checkRegistered } = useCheckInStatus();

  // ------------------------------------------------------------------
  // Handlers
  // ------------------------------------------------------------------
  const handleSend = async () => {
    const cleanHandle = (twitterAccountId ?? "").replace(/^@/, "");
    try {
      const dataObj = {
        timestamp: Math.floor(Date.now() / 1000),
        wallet: address ?? "",
      } as const;

      const sig = await requestSignature(dataObj);

      await sendSignature({
        signature: sig,
        xUserName: cleanHandle ?? "",
        data: dataObj,
      });

      setUserInfo({ twitterAccountId: cleanHandle });

      if (state.connectionStatus === "wallet_connected") {
        setConnectionStatus("twitter_connected");
      }

      showToast("connected successfully", "success");
    } catch (err) {
      const axiosErr = err as AxiosError | undefined;

      if (axiosErr?.response?.status === 422) {
        const data = axiosErr.response?.data as
          | { error?: string; message?: string }
          | undefined;
        const msg = data?.error || data?.message || "";

        if (/User exists/i.test(msg)) {
          setConnectionStatus("twitter_connected");
          setUserInfo({ twitterAccountId: cleanHandle });

          showToast("connected successfully", "success");
          return;
        }
      }

      console.error("Failed to sign or send signature", err);
      showToast("error, try again", "error");
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.bg}>
        <img src={modalBg} alt="modal bg" />
      </div>

      <div className={styles.content}>
        <div className={styles.title}>
          <h1>AUTH twitter</h1>
          <div
            onClick={() => {
              closeModal();
            }}
            className={styles.closeButton}
          >
            <div
              className={cn(styles.closeButtonStick, styles.closeButtonStick_1)}
            />
            <div
              className={cn(styles.closeButtonStick, styles.closeButtonStick_2)}
            />
          </div>
        </div>
        <div className={styles.cta_wrapper}>
          <div className={styles.group_wrapper}>
            <div className={styles.instruction}>
              <div className={styles.number}>1--</div>
              <div className={styles.text}>
                {state.twitterAccountId
                  ? `@${state.twitterAccountId}`
                  : "input your X handle"}
              </div>
            </div>
            <div className={styles.input_wrapper}>
              <input
                type="text"
                disabled={
                  state.connectionStatus === "twitter_connected" ||
                  state.connectionStatus === "post_checked" ||
                  Boolean(state.twitterAccountId)
                }
                value={twitterAccountId ? `@${twitterAccountId}` : ""}
                placeholder={
                  state.twitterAccountId
                    ? `@${state.twitterAccountId}`
                    : "@username"
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    (async () => {
                      await handleSend();
                    })();
                  }
                }}
                maxLength={16}
                className={styles.input}
                onChange={(e) => {
                  // Remove leading @ if present, then allow only valid chars
                  const raw = e.target.value.startsWith("@")
                    ? e.target.value.slice(1)
                    : e.target.value;
                  const sanitized = raw.replace(/[^A-Za-z0-9_]/g, "");
                  setTwitterAccountId(sanitized);
                }}
              />
              {!(
                state.connectionStatus === "twitter_connected" ||
                state.connectionStatus === "post_checked" ||
                Boolean(state.twitterAccountId)
              ) && (
                  <button
                    disabled={
                      !twitterAccountId || !address || twitterAccountId.length < 1
                    }
                    onClick={handleSend}
                    className={styles.sendButton}
                  >
                    Send
                  </button>
                )}
            </div>
          </div>
          <div className={styles.arrows_wrapper}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M13.1704 16.9426L28.2275 31.9997L13.1704 47.0571L15.056 48.9427L31.0561 32.9427L31.9987 31.9997L31.0561 31.0571L15.056 15.057L13.1704 16.9426ZM34.5038 16.9426L49.5609 31.9997L34.5038 47.0571L36.3894 48.9427L52.3894 32.9427L53.3321 31.9997L52.3894 31.0571L36.3894 15.057L34.5038 16.9426Z"
                fill="#717CD2"
                fillOpacity="0.2"
              />
            </svg>
          </div>
          <div className={styles.group_wrapper}>
            <div className={styles.instruction}>
              <div className={styles.number}>2--</div>
              <div className={styles.text}>Follow @pegevip</div>
            </div>
            <CheckPostButton />
          </div>{" "}
        </div>
      </div>
    </div>
  );
};
