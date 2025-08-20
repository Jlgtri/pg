import { useEffect, useState } from "react";
import { getCountdownDate } from "@/utils/format";

export type CountdownState = "later" | "now" | "soon";

interface CountdownDiff {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const useSnapshotCountdown = (targetTimestamp?: number | null) => {
  const [countdownDateDiff, setCountdownDateDiff] = useState<CountdownDiff>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [countDownState, setCountDownState] = useState<CountdownState>("later");

  useEffect(() => {
    if (!targetTimestamp) return;

    const interval = setInterval(() => {
      setCountdownDateDiff(getCountdownDate(targetTimestamp));

      const timeLeftInSeconds = targetTimestamp - Date.now() / 1000;

      if (timeLeftInSeconds <= 0) {
        setCountDownState("now");
      } else if (timeLeftInSeconds < 24 * 60 * 60) {
        setCountDownState("soon");
      } else {
        setCountDownState("later");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetTimestamp]);

  return {
    countdownDateDiff,
    countDownState,
  } as const;
};
