import React, { useEffect } from "react";

import { useAppState } from "@/context/AppStateContext";
import { computeCurrentSnapshot, snapshotDateByNumber, snapshotEndTime } from "@/utils/format";

interface ProjectProviderProps {
  children: React.ReactNode;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({
  children,
}) => {
  const { setSnapshotInfo, setAllSnapshotsData } = useAppState();

  useEffect(() => {
    const current = computeCurrentSnapshot();
    setSnapshotInfo(current);

    const refreshed = Array.from({ length: 5 }, (_, idx) => {
      const num = (idx + 1) as 1 | 2 | 3 | 4 | 5;
      return {
        date: snapshotDateByNumber(num).toString(),
        endDate: snapshotEndTime(num).toString(),
        snapshotNumber: num,
        isCheckedIn: false,
        snapshotBonus: 0,
        pepeAmount: 0,
        pegeAmount: 0,
        holdingDays: 0,
        coeff: 0,
        snapshotAmount: 0,
        snapshotDate: undefined,
      };
    });

    setAllSnapshotsData({ snapshotsData: refreshed });
  }, [setSnapshotInfo, setAllSnapshotsData]);
  return <>{children}</>;
};
