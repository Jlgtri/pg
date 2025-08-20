import React, { useEffect } from "react";
import styles from "./BlurredFG.module.scss";
import { useScrollLock } from "@/hooks/useScrollLock";

export const BlurredFG = ({ children }: { children: React.ReactNode }) => {
  const { blockScroll, allowScroll } = useScrollLock();

  useEffect(() => {
    blockScroll();

    return () => {
      allowScroll();
    };
  }, [blockScroll, allowScroll]);

  return (
    <div className={styles.blurredFG}>
      <div className={styles.content}>{children}</div>
    </div>
  );
};
