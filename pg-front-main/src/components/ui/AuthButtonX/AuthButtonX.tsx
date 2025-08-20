import React from "react";
import styles from "./AuthButtonX.module.scss";
import cn from "classnames";
import AuthButtonBG from "../SVGs/AuthButtonBG";
import { useAppState } from "@/context/AppStateContext";
import { useAuth } from "@/hooks/useAuth";
import { useWalletSignature } from "@/hooks/useWalletSignature";
import { useAccount } from "wagmi";

export const AuthButtonX: React.FC = () => {
  const { state, setConnectionStatus } = useAppState();
  const { isLoggingIn, isAuthenticated } = useAuth();
  const { requestSignature, isLoading } = useWalletSignature();
  const { address } = useAccount();
  // Whenever backend confirms authentication, update global state
  React.useEffect(() => {
    if (isAuthenticated) {
      setConnectionStatus("twitter_connected");
    }
  }, [isAuthenticated, setConnectionStatus]);

  // Determine completed state (either local app state or fresh auth)
  const isCompleted =
    isAuthenticated ||
    state.connectionStatus === "twitter_connected" ||
    state.connectionStatus === "post_checked";

  return (
    <button
      className={cn(styles.authButtonContainer, {
        [styles.completed]: isCompleted,
      })}
      onClick={() => {
        requestSignature({
          timestamp: Math.floor(Date.now() / 1000),
          wallet: address ?? "",
        });
      }}
      disabled={isCompleted || isLoggingIn || isLoading}
    >
      <div className={styles.authButtonBG}>
        <AuthButtonBG />
      </div>
      <div className={styles.authButton}>
        {isCompleted
          ? "✓ COMPLETE"
          : isLoggingIn
          ? "Loading…"
          : isLoading
          ? "Waiting for signature…"
          : "sign"}
      </div>
    </button>
  );
};
