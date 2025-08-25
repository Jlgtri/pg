import { PROJECT_START_DATE, TIME_BETWEEN_SNAPSHOTS_SEC, TOTAL_SNAPSHOTS } from "@/constants";

export const getLastProjectStartDate = () => {
  const diffSeconds = Date.now() / 1000 - PROJECT_START_DATE;
  const rounds = Math.floor(diffSeconds / ((TOTAL_SNAPSHOTS + 1) * TIME_BETWEEN_SNAPSHOTS_SEC));
  return PROJECT_START_DATE + ((TOTAL_SNAPSHOTS + 1) * TIME_BETWEEN_SNAPSHOTS_SEC) * rounds;
};

export const getLastProjectEndDate = () => {
  return getLastProjectStartDate() + (TOTAL_SNAPSHOTS + 1) * TIME_BETWEEN_SNAPSHOTS_SEC;
};

export const snapshotDateByNumber = (idx: number): number => {
  return getLastProjectStartDate() + (idx - 1) * TIME_BETWEEN_SNAPSHOTS_SEC;
};

export const snapshotEndTime = (idx: number): number => {
  return getLastProjectStartDate() + idx * TIME_BETWEEN_SNAPSHOTS_SEC;
};


export const getCountdownDate = (timeStamp: number) => {
  const now = new Date().getTime() / 1000;
  const countdownDateDiff = timeStamp - now > 0 ? timeStamp - now : 0;

  const days =
    Math.floor(countdownDateDiff / 86400) > 0
      ? Math.floor(countdownDateDiff / 86400)
      : 0;
  const hours = Math.floor((countdownDateDiff % 86400) / 3600);
  const minutes = Math.floor((countdownDateDiff % 3600) / 60);
  const seconds = Math.floor(countdownDateDiff % 60);

  return { days, hours, minutes, seconds };
};

export const formatAmount = (amount: string, decimals?: number) => {
  if (!amount) {
    return "";
  }

  return parseFloat(amount).toLocaleString("en-US", {
    maximumFractionDigits: decimals ?? 3,
    roundingMode: "floor",
  } as Intl.NumberFormatOptions);
};

export const formatTimeDigits = (time: number, isHours: boolean = false) => {
  return isHours
    ? time > 99
      ? time
      : time > 9
        ? ` ${time}`
        : ` 0${time}`
    : time > 9
      ? time
      : `0${time}`;
};

export const trimFractionalNum = (num: number, decimals: number) => {
  const numStr = num.toString();
  return numStr.includes(".") &&
    numStr.length - numStr.indexOf(".") > decimals + 1
    ? parseFloat(numStr.slice(0, numStr.indexOf(".") + decimals + 1))
    : num;
};

export const formatBalance = (amount: string) => {
  if (+amount >= 1000000) {
    const wholeFractionOfMill = +Number(amount).toFixed() / 1000000;
    return `${trimFractionalNum(wholeFractionOfMill, 1)}M`;
  } else if (+amount >= 1000) {
    const wholeFractionOfMill = +Number(amount).toFixed() / 1000;
    return `${trimFractionalNum(wholeFractionOfMill, 1)}K`;
  } else {
    return trimFractionalNum(Number(amount), 1);
  }
};

export const setClientCookie = (name: string, value: string) => {
  document.cookie = `${name}=${value}; path=/`;
};

export const getClientCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts?.pop()?.split(";").shift();
};

export const formatBalanceDecimals = (amount: string): string => {
  return parseFloat(parseFloat(amount).toFixed(5)).toString();
};

export function getSnapshotDateString(
  timeStamp: string | number,
  hasSlash = true
) {
  const date =
    typeof timeStamp === "string"
      ? new Date(Number(timeStamp) * 1000)
      : new Date(timeStamp * 1000);
  const month = date.toLocaleString("en", { month: "short" });
  const day = String(date.getDate()).padStart(2, "0");
  const formattedDate = hasSlash ? `${month}/${day}` : `${month}${day}`;
  return formattedDate;
}

export const computeCurrentSnapshot = (): number => {
  const diffSeconds = Date.now() / 1000 - PROJECT_START_DATE;
  const stage = Math.floor(diffSeconds / TIME_BETWEEN_SNAPSHOTS_SEC);
  return Math.min((stage % (TOTAL_SNAPSHOTS + 1)) + 1, TOTAL_SNAPSHOTS);
};
