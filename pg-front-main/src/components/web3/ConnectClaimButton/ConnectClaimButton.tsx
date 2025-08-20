import { useCanCheckIn } from "@/api/queries";
import { ButtonBig } from "@/components/ui/ButtonBig/ButtonBig";
import { useAppState } from "@/context/AppStateContext";
import { useCheckIn } from "@/hooks/useCheckIn";
import { useWalletOnboarding } from "@/hooks/useWalletOnboarding";
import { useModal } from "@/providers/ModalProvider";
import { useToast } from "@/providers/ToastProvider";
import { computeCurrentSnapshot, getLastProjectStartDate } from "@/utils/format";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import React, { useEffect } from "react";
import { useAccount } from "wagmi";
import styles from "./ConnectClaimButton.module.scss";
const scrollToCountdown = () => {
  const el = document.getElementById("countdownText");
  if (!el) return;

  const rect = el.getBoundingClientRect();
  const isInView = rect.top >= 0 && rect.top < window.innerHeight;

  if (!isInView) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

export const ConnectClaimButton: React.FC<{
  type: "primary" | "secondary";
  onButtonPressed?: () => void;
}> = ({ type, onButtonPressed }) => {
  const { state, setSnapshotInfo } = useAppState();
  const { isConnected, address } = useAccount();
  const { openModal } = useModal();
  const { checkIn, isChecking } = useCheckIn();
  const { showToast } = useToast();

  localStorage.removeItem("twitterAccountId");
  // mutation to check if wallet already registered (needed for onboarding hook)
  const { mutateAsync: checkRegistered } = useCanCheckIn();

  // move side-effects to dedicated hook
  useWalletOnboarding({
    isConnected,
    address,
    openModal,
    checkRegistered,
  });

  // useEffect(() => {
  //   async function fetchData() {
  //     var f = await connect[0].isAuthorized();
  //     console.log(f);
  //   }

  //   fetchData(); // Call the async function
  // }, [isConnected]); // Empty dependency array means this runs once on mount


  useEffect(() => {
    if (state.connectionStatus === "not_connected") return;

    const id = setInterval(() => {
      const currentSnapshotNumber = computeCurrentSnapshot();
      if (
        state.currentSnapshot !== currentSnapshotNumber
      ) {
        setSnapshotInfo(currentSnapshotNumber);
      }
    }, 10_000);

    return () => clearInterval(id);
  }, [
    state.currentSnapshot,
    setSnapshotInfo,
    state.connectionStatus,
  ]); // stay in sync with dynamic dates

  // useEffect(() => {
  //   console.log("App data:", state);
  // }, [state.currentSnapshot, state.twitterAccountId, state.balance]);

  return (
    <>
      <ConnectButton.Custom>
        {({ openConnectModal, mounted }) => {
          const ready = mounted;

          return (
            <div
              {...(!ready && {
                "aria-hidden": true,
                style: {
                  opacity: 0,
                  pointerEvents: "none",
                  userSelect: "none",
                },
              })}
              className={styles.button}
            >
              {(() => {
                var connectionStatus = state.connectionStatus;
                // if (state.currentSnapshot > PROJECT_DONATION_CHECK_IN_AFTER) {
                //   if (connectionStatus == 'wallet_connected' || connectionStatus == 'twitter_connected') {
                //     connectionStatus = 'post_checked';
                //   }
                // }
                switch (connectionStatus) {
                  case "not_connected":
                    return (
                      <button onClick={openConnectModal} type="button">
                        <ButtonBig text="Connect wallet" type={type} />
                      </button>
                    );

                  case "wallet_connected":
                    //   return (
                    //     <button
                    //       onClick={() => {
                    //         openModal("connection");
                    //         scrollToCountdown();
                    //       }}
                    //       type="button"
                    //     >
                    //       <ButtonBig text="connect twitter" type={type} />
                    //     </button>
                    //   );

                    // case "twitter_connected":
                    //   return (
                    //     <button
                    //       onClick={() => {
                    //         openModal("connection");
                    //         scrollToCountdown();
                    //       }}
                    //       type="button"
                    //     >
                    //       <ButtonBig text="CHECK FOLLOW" type={type} />
                    //     </button>
                    //   );

                    // case "post_checked":
                    return (
                      <button
                        onClick={async () => {
                          checkIn();
                          scrollToCountdown();
                          onButtonPressed?.();
                        }}
                        type="button"
                        disabled={
                          isChecking ||
                          Boolean(
                            new Date().getTime() / 1000 < getLastProjectStartDate()
                          )
                        }
                        className={styles.checkInButton}
                      >
                        <div className={styles.buttonContent}>
                          <ButtonBig
                            text={
                              new Date().getTime() / 1000 < getLastProjectStartDate()
                                ? "waiting for project start"
                                : isChecking
                                  ? "CHECKING…"
                                  : `Check In #${state.currentSnapshot} Snapshot`
                            }
                            type={type}
                            isDisabled={Boolean(
                              new Date().getTime() / 1000 < getLastProjectStartDate()
                            )}
                          >
                            {isChecking && <span className={styles.spinner} />}
                          </ButtonBig>
                        </div>
                      </button>
                    );

                  case "current_snapshot_checkedIn":
                    return (
                      <button disabled type="button">
                        <ButtonBig
                          text={`You're succesfully checked in #${state.currentSnapshot} Snapshot`}
                          type={type}
                          isDisabled={true}
                          isLocked={false}
                        ></ButtonBig>
                      </button>
                    );

                  case "claim_not_available_yet":
                    return (
                      <button disabled type="button">
                        <ButtonBig
                          text="CLAIM"
                          type={type}
                          isDisabled={true}
                          isLocked={true}
                        />
                      </button>
                    );

                  case "claim_available":
                    return (
                      <button
                        disabled={state.balance === 0 ? true : false}
                        onClick={() => {
                          scrollToCountdown();
                          showToast("Claim is not available yet", "error");
                        }}
                        type="button"
                      >
                        <ButtonBig
                          isDisabled={state.balance === 0 ? true : false}
                          text={
                            state.balance && state.balance > 0
                              ? "CLAIM"
                              : "Nothing to claim"
                          }
                          type={type}
                        />
                      </button>
                    );

                  case "claim_claimed":
                    return (
                      <button disabled type="button">
                        <ButtonBig text="CLAIMED" type={type} />
                      </button>
                    );

                  default:
                    return null;
                }
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>
    </>
  );
};
