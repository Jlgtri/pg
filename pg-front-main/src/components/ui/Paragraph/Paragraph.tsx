import React from "react";
import styles from "./Paragraph.module.scss";
import cn from "classnames";

function highlightKeywords(text: string, keywords: string[]) {
  const textArray = text.split(" ");
  let highlightedNumber = 0;

  return textArray.map((word, index) => {
    if (word === keywords[highlightedNumber]) {
      highlightedNumber++;
      return (
        <span className={cn(styles.highlight, styles.word)} key={word + index}>
          {`${word} `}
        </span>
      );
    } else {
      return (
        <span className={styles.word} key={word + index}>
          {`${word} `}
        </span>
      );
    }
  });
}

const Paragraph: React.FC<{
  title?: string;
  text?: string;
  keywords?: string[];
}> = ({ title, text, keywords }) => {
  return (
    <div className={styles.wrapper}>
      {title && (
        <div className={styles.titleWrapper}>
          {highlightKeywords(title, keywords || [])}
        </div>
      )}
      {text && (
        <div className={styles.textWrapper}>
          {highlightKeywords(text, keywords || [])}
        </div>
      )}
    </div>
  );
};

export default Paragraph;
