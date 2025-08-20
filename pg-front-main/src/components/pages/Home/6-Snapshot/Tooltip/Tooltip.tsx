import styles from "./Tooltip.module.scss";

interface TooltipProps {
  date: string | "N/D";
  balance: number | "N/D";
  coeff: number | "N/D";
}

export const Tooltip = ({ date, balance, coeff }: TooltipProps) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.beak} />
      <div className={styles.row}>
        <span className={styles.key}>Date:</span>
        <span className={styles.value}>
          {date === "N/D" ? "N/D" : new Date(date).toLocaleDateString()}
        </span>
      </div>
      <div className={styles.row}>
        <span className={styles.key}>Your balance:</span>
        <span className={styles.value}>
          {balance === "N/D" ? "N/D" : `${balance} $PEGE`}
        </span>
      </div>
      <div className={styles.row}>
        <span className={styles.key}>Your coeff:</span>
        <span className={styles.value}>
          {coeff === "N/D" ? "N/D" : `X ${coeff}`}
        </span>
      </div>
    </div>
  );
};
