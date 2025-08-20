import React from "react";
import { BlurredFG } from "../BlurredFG/BlurredFG";
import styles from "./Preloader.module.scss";
import alphaAnimation from "../../../animations/alpha.gif";

interface PreloaderProps {
  isVisible: boolean;
}

export const Preloader: React.FC<PreloaderProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <BlurredFG>
      <div className={styles.preloader}>
        <img
          src={alphaAnimation}
          alt="Loading animation"
          className={styles.animation}
        />
      </div>
    </BlurredFG>
  );
};
