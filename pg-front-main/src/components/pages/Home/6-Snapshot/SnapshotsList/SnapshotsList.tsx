import React, { createRef, useRef, useState } from "react";
import Lottie, { type LottieRefCurrentProps } from "lottie-react";
import cn from "classnames";
import styles from "../Snapshot.module.scss";
import animationTransition from "@/animations/perehod_new.json";
import { Tooltip } from "../Tooltip/Tooltip";
import { formatBalance, getSnapshotDateString } from "@/utils/format";
import { useAppState } from "@/context/AppStateContext";
import { BONUS_ON_EACH_CHECK_IN } from "@/constants";

const getBonusForSnapshot = (snapshotNumber: number): number | undefined =>
  BONUS_ON_EACH_CHECK_IN[snapshotNumber] ?? undefined;

const SnapshotsList: React.FC = () => {
  const { state } = useAppState();
  const { snapshotsData } = state.allSnapshotsData;

  const lottieRefs = useRef<
    Array<React.RefObject<LottieRefCurrentProps | null>>
  >([]);
  const [activeSnapshot, setActiveSnapshot] = useState<number[]>([
    0, 0, 0, 0, 0,
  ]);

  if (lottieRefs.current.length !== snapshotsData.length) {
    lottieRefs.current = snapshotsData.map(() =>
      createRef<LottieRefCurrentProps>()
    );
  }

  return (
    <div className={styles.snapshotsWrapper}>
      {snapshotsData.map((snapshot, index) => (
        <div
          className={styles.singleSnapshotWrapper}
          key={`snapshot#${index + 1}`}
          onClick={() => {
            const currentRef = lottieRefs.current[index].current;
            if (currentRef) {
              currentRef.stop();
              currentRef.goToAndPlay(0, true);
            }

            setActiveSnapshot((prev) => {
              const newActiveSnapshot = [...prev];
              newActiveSnapshot[index] = prev[index] === 0 ? 1 : 0;
              return newActiveSnapshot;
            });
          }}
        >
          <div
            className={cn(styles.snapshotTransition, {
              [styles.snapshot_1_transition]: index === 0,
              [styles.snapshot_2_transition]: index === 1,
              [styles.snapshot_3_transition]: index === 2,
              [styles.snapshot_4_transition]: index === 3,
              [styles.snapshot_5_transition]: index === 4,
            })}
          >
            <Lottie
              lottieRef={lottieRefs.current[index]}
              animationData={animationTransition}
              loop={false}
              autoplay={false}
            />
          </div>
          <div
            className={cn(styles.snapshot, {
              [styles.snapshot_1]: index === 0,
              [styles.snapshot_2]: index === 1,
              [styles.snapshot_3]: index === 2,
              [styles.snapshot_4]: index === 3,
              [styles.snapshot_5]: index === 4,
            })}
          >
            {activeSnapshot[index] === 1 ? (
              <div key={`${index}-details`} className={styles.snapshotDetails}>
                <span className={styles.snapshotDetailRow}>
                  <span className={styles.snapshotDetailKey}>Date:</span>
                  <span className={styles.snapshotDetailValue}>
                    {snapshot.isCheckedIn
                      ? snapshot.snapshotDate
                        ? new Date(snapshot.snapshotDate).toLocaleDateString()
                        : "N/D"
                      : "N/D"}
                  </span>
                </span>
                <span className={styles.snapshotDetailRow}>
                  <span className={styles.snapshotDetailKey}>Balance:</span>
                  <span className={styles.snapshotDetailValue}>{`${
                    snapshot.isCheckedIn
                      ? formatBalance(snapshot.snapshotAmount.toString())
                      : "N/D"
                  } ${snapshot.isCheckedIn ? "$PEGE" : ""}`}</span>
                </span>
                {snapshot.isCheckedIn && snapshot.snapshotBonus > 0 && (
                  <span className={styles.snapshotDetailRow}>
                    <span className={styles.snapshotDetailKey}>
                      + {getBonusForSnapshot(snapshot.snapshotNumber)} bonus
                    </span>
                  </span>
                )}
                <span className={styles.snapshotDetailRow}>
                  <span className={styles.snapshotDetailKey}>Your coeff:</span>
                  <span className={styles.snapshotDetailValue}>
                    {snapshot.isCheckedIn ? `X ${snapshot.coeff}` : "N/D"}
                  </span>
                </span>
              </div>
            ) : (
              <div key={`${index}-simple`} className={styles.snapshotSimple}>
                <span className={styles.snapshotTitle}>
                  {snapshot.snapshotNumber === 5
                    ? "final snap"
                    : `snapshot#${snapshot.snapshotNumber}`}
                </span>
                <span className={styles.snapshotDate}>
                  {snapshot.snapshotDate
                    ? getSnapshotDateString(
                        Math.floor(Date.parse(snapshot.snapshotDate) / 1000),
                        false
                      )
                    : getSnapshotDateString(snapshot.date, false)}
                </span>
              </div>
            )}
          </div>
          <div className={styles.tooltip}>
            <Tooltip
              date={snapshot.isCheckedIn ? snapshot.snapshotDate ?? "" : "N/D"}
              balance={
                snapshot.isCheckedIn
                  ? Number(snapshot.snapshotAmount.toFixed(2))
                  : "N/D"
              }
              coeff={snapshot.isCheckedIn ? snapshot.coeff : "N/D"}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SnapshotsList;
