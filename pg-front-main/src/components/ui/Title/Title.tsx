import React from "react";
import styles from "./Title.module.scss";

const Title: React.FC<{ text: string }> = ({ text }) => {
  return (
    <h1 className={styles.titleWrapper}>
      <span>{text}</span>
    </h1>
  );
};

export default Title;
