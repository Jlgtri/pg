import { useAppState } from "@/context/AppStateContext";
import { computeCurrentSnapshot, snapshotEndTime } from "@/utils/format";
import { useEffect } from "react";

export const useSnapshotTicker = () => {
  const { state, setSnapshotInfo } = useAppState();

  useEffect(() => {
    const id = setInterval(() => {
      if (state.currentSnapshot === 5) return;

      const now = Date.now() / 1000;

      // current snapshot end-time already in state
      if (now <= snapshotEndTime(state.currentSnapshot)) return;

      // snapshot boundary crossed → advance one step
      const next = computeCurrentSnapshot() as 1 | 2 | 3 | 4 | 5; // 1..5
      setSnapshotInfo(next);
    }, 10_000);

    return () => clearInterval(id);
  }, [setSnapshotInfo, state.currentSnapshot]);
};
