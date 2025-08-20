import React from "react";
import styles from "./Subtitle.module.scss";

const Subtitle: React.FC<{ text: string }> = ({ text }) => {
  return (
    <h2 className={styles.wrapper}>
      <span>{text}</span>
    </h2>
  );
};

export default Subtitle;
