import pege from "@/animations/pege6.json";
import pegeMobile from "@/animations/pege_tab+mob.json";
import { StatusTable } from "@/components/ui/SVGs/StatusTable";
import { TIME_BETWEEN_SNAPSHOTS_SEC, TOTAL_SNAPSHOTS } from "@/constants";
import { useAppState } from "@/context/AppStateContext";
import heroImageMobile from "@/images/hero-image-mobile.webp";
import heroImage from "@/images/hero-image.webp";
import { getLastProjectStartDate, getSnapshotDateString, snapshotEndTime } from "@/utils/format";
import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { formatTimeDigits, getCountdownDate } from "../../../../utils/format";
import { Lottie } from "../../../ui/Lottie/Lottie";
import styles from "./Hero.module.scss";

export const Hero: React.FC = () => {
  const tablet = useMediaQuery({ query: "(max-width: 1250px)" });
  const { state } = useAppState();
  const [countdownDateDiff, setCountdownDateDiff] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdownDateDiff(getCountdownDate(snapshotEndTime(state.currentSnapshot)));
    }, 1000);

    return () => clearInterval(interval);
  }, [state.currentSnapshot]);

  const snapshotDate = getSnapshotDateString(
    snapshotEndTime(state.currentSnapshot),
    true
  );


  const nowSec = Date.now() / 1000;
  const progressRaw =
    ((nowSec - getLastProjectStartDate()) / (TOTAL_SNAPSHOTS * TIME_BETWEEN_SNAPSHOTS_SEC)) *
    100;
  const progress = Math.min(Math.max(progressRaw, 0), 100);

  return (
    <div className={styles.wrapper}>
      <div className={styles.animationWrapper}>
        <img
          className={styles.heroImage}
          src={tablet ? heroImageMobile : heroImage}
          alt="hero"
        />
        {tablet ? (
          <Lottie
            animationData={pegeMobile}
            loop={true}
            autoplay={true}
            rendererSettings={{
              preserveAspectRatio: "xMidYMid slice",
            }}
          />
        ) : (
          <Lottie
            animationData={pege}
            loop={true}
            autoplay={true}
            rendererSettings={{
              preserveAspectRatio: "xMidYMid slice",
            }}
          />
        )}
      </div>

      <div className={styles.statusWrapper}>
        <StatusTable
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            transform: "scaleY(1.7)",
          }}
        />
        <div className={styles.countdown}>
          <span className={styles.countdownTitle}>BAG BOMB:</span>
          <span className={styles.countdownValue}>{`T-${formatTimeDigits(
            countdownDateDiff.days > 0
              ? countdownDateDiff.days
              : countdownDateDiff.hours,
            true
          )}:${formatTimeDigits(
            countdownDateDiff.days > 0
              ? countdownDateDiff.hours
              : countdownDateDiff.minutes
          )}:`}</span>
          <span className={styles.countdownValue_seconds}>{`${formatTimeDigits(
            countdownDateDiff.seconds
          )}`}</span>
        </div>
        <div className={styles.progressWrapper}>
          <div
            className={styles.progressBar}
            style={{ width: `${progress.toFixed(0)}%` }}
          ></div>
          <div
            className={styles.progressText}
          >{`CURRENT PROGRESS: ${progress.toFixed(0)}%`}</div>
        </div>
      </div>
      <div className={styles.snapshotWrapper}>
        <span className={styles.snapshotDate}>{snapshotDate}</span>
        <span
          className={styles.snapshotNumber}
        >{`SNAPSHOT#${state.currentSnapshot}`}</span>
      </div>
    </div>
  );
};
