import React, { useRef, useState, useEffect } from "react";
import styles from "./Snapshot.module.scss";
import { BlockWrapper } from "../../../ui/BlockWrapper/BlockWrapper";
import Title from "../../../ui/Title/Title";
import Subtitle from "../../../ui/Subtitle/Subtitle";
import Paragraph from "../../../ui/Paragraph/Paragraph";
import { WelcomeBg } from "../../../ui/SVGs/WelcomeBg";
import { formatTimeDigits, snapshotEndTime } from "../../../../utils/format";
import cn from "classnames";
import parachute from "@/animations/pege_par2.json";
import Bg from "@/components/ui/SVGs/Bg";
import { ConnectClaimButton } from "@/components/web3/ConnectClaimButton/ConnectClaimButton";
import { useAccount } from "wagmi";
import balanceIcon from "@/images/coin-icon.png";
import coinIcon from "@/images/coin-fliyng.png";
import Lottie from "lottie-react";
import stand from "@/images/stand.webp";
import head from "@/images/hanginghead.webp";
import frontLight from "@/images/frontlight.webp";
import backLight from "@/images/backlight.webp";
import { useAppState } from "@/context/AppStateContext";
import SnapshotsList from "./SnapshotsList";
import { useSnapshotCountdown } from "@/hooks/useSnapshotCountdown";
import { useAnimatedBalance } from "@/hooks/useAnimatedBalance";

export const Snapshot: React.FC = () => {
  const { isConnected } = useAccount();
  const { state } = useAppState();
  const [buttonPressed, setButtonPressed] = useState(false);
  const originalBalanceRef = useRef(0);
  const [balanceLoaded, setBalanceLoaded] = useState(false);

  const { countdownDateDiff, countDownState } = useSnapshotCountdown(
    snapshotEndTime(state.currentSnapshot)
  );

  useEffect(() => {
    if (!balanceLoaded && state.balance !== 0) {
      originalBalanceRef.current = state.balance ?? 0;
      setBalanceLoaded(true);
    }
  }, [state.balance, balanceLoaded]);

  const { animatedBalance, isBalanceAnimating, showCoinFly } =
    useAnimatedBalance(setButtonPressed, buttonPressed);

  return (
    <BlockWrapper>
      <div className={styles.wrapper}>
        <div className={styles.imageTextWrapper}>
          <div className={styles.imageWrapper}>
            <div className={styles.standWrapper}>
              <img src={stand} alt="Stand" className={styles.stand} />
            </div>
            <div className={styles.headWrapper}>
              <img src={head} alt="Head" className={styles.head} />
            </div>
            <div className={styles.lightWrapper}>
              <img src={frontLight} alt="Light" className={styles.frontLight} />
              <img src={backLight} alt="Light" className={styles.backLight} />
            </div>
            <SnapshotsList />
          </div>
          <div className={styles.textWrapper}>
            <div className={cn(styles.textBlock)}>
              <Title text="Welcome to the $PEGE Drop ZonE" />
              <Subtitle text="Holding $PEPE? Hold it tighter" />
            </div>
            <div className={styles.textBlock}>
              <Paragraph title="OGs don't rush — they rack up rewards" />
              <Paragraph text="Every snapshot is +1 to your bag. Only true holders reach the final snap!" />
            </div>
            <div className={styles.textBlock}>
              <Paragraph
                title="Tick-tock — the bags are growing."
                keywords={["$PEPE"]}
              />
              <Paragraph
                text="Connect your wallet and check how fat your $PEGE has become."
                keywords={["$PEGE"]}
              />
            </div>
            <div className={styles.textBlock}>
              <Paragraph title="Miss a day? Miss a bag. Snapshots don't wait." />
              <Paragraph title="Final snapshot is coming — claim season is near." />
            </div>
          </div>
        </div>

        <div className={styles.countdownWrapper}>
          <div className={styles.countdownBgWrapper}>
            <WelcomeBg />
          </div>

          {showCoinFly && (
            <div className={styles.coinFlyWrapper}>
              {Array.from({ length: 15 }).map((_, i) => (
                <img
                  key={i}
                  src={coinIcon}
                  alt="flying coin"
                  className={styles.coinFly}
                  style={{ animationDelay: `${i * 0.3}s` }}
                />
              ))}
            </div>
          )}

          <div id="countdownText" className={styles.countdownText}>
            <div className={styles.parachuteWrapper}>
              <div className={cn(styles.parachute, styles.pegeFloating)}>
                <Lottie
                  animationData={parachute}
                  loop={true}
                  autoplay={true}
                  rendererSettings={{
                    preserveAspectRatio: "xMidYMid slice",
                  }}
                />
              </div>
            </div>
            {isConnected && (
              <>
                <img src={coinIcon} alt="coin" className={styles.coinIcon} />
                <img
                  src={coinIcon}
                  alt="coin"
                  className={cn(styles.coinIcon, styles.coinIconRight)}
                />
              </>
            )}

            <span className={styles.countdownTitle}>Until Next Snapshot </span>

            <div className={styles.timerWrapper}>
              <div
                className={cn(styles.countdown, {
                  [styles.countdownLater]: countDownState === "later",
                  [styles.countdownNow]: countDownState === "now",
                  [styles.countdownSoon]: countDownState === "soon",
                })}
              >
                <div className={cn(styles.countdownTimeWrpapper)}>
                  <span className={styles.countdownValue}>{`${formatTimeDigits(
                    countdownDateDiff.days > 0
                      ? countdownDateDiff.days
                      : countdownDateDiff.hours
                  )}`}</span>
                  <span className={styles.countdownSubText}>
                    {countdownDateDiff.days > 0 ? "days" : "Hours"}
                  </span>
                </div>
                <span className={cn(styles.countdownSeparator)}>:</span>{" "}
                <div className={styles.countdownTimeWrpapper}>
                  <span className={styles.countdownValue}>{`${formatTimeDigits(
                    countdownDateDiff.days > 0
                      ? countdownDateDiff.hours
                      : countdownDateDiff.minutes
                  )}`}</span>
                  <span className={styles.countdownSubText}>
                    {countdownDateDiff.days > 0 ? "hours" : "Minutes"}
                  </span>
                </div>
                <span className={cn(styles.countdownSeparator)}>:</span>{" "}
                <div className={styles.countdownTimeWrpapper}>
                  <span className={styles.countdownValue}>{`${formatTimeDigits(
                    countdownDateDiff.seconds
                  )}`}</span>
                  <span className={styles.countdownSubText}>seconds</span>
                </div>
              </div>
            </div>
            <div className={styles.messageWrapper}>
              <div className={styles.buttonBigBGWrapper}>
                <Bg fill={isConnected ? "#181B6D" : "#101A5C"} />
              </div>

              {isConnected ? (
                <div className={styles.balanceWrapper}>
                  <img src={balanceIcon} alt="balance" />
                  <span
                    className={cn(styles.balanceText, {
                      [styles.balanceTextAnimating]: isBalanceAnimating,
                    })}
                  >
                    {`${(isBalanceAnimating
                      ? animatedBalance
                      : state.balance ?? 0
                    ).toFixed(2)} $PEGE`}
                  </span>
                </div>
              ) : (
                <>
                  <span className={styles.message}>
                    Connect your wallet to check your{" "}
                  </span>
                  <span className={styles.message_blue}>
                    $PEGE balance and check in{" "}
                  </span>
                </>
              )}
            </div>
            <div className={styles.buttonWrapper}>
              <ConnectClaimButton
                type="secondary"
                onButtonPressed={() => {
                  setButtonPressed(true);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </BlockWrapper>
  );
};

export default Snapshot;
