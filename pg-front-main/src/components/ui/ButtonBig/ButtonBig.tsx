import React from "react";
import styles from "./ButtonBig.module.scss";
import cn from "classnames";
import lockIcon from "@/images/lock.png";

interface ButtonBigProps {
  text: string;
  isDisabled?: boolean;
  isError?: boolean;
  isLocked?: boolean;
  type?: "primary" | "secondary";
  children?: React.ReactNode;
}

export const ButtonBig: React.FC<ButtonBigProps> = ({
  text,
  isError = false,
  isDisabled = false,
  type = "primary",
  isLocked = false,
  children,
}) => {
  return (
    <div
      className={cn(styles.button, {
        [styles.disabled]: isDisabled,
        [styles.primary]: type === "primary",
        [styles.secondary]: type === "secondary",
        [styles.error]: isError === true,
      })}
    >
      {type === "primary" && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 800 226"
          fill="none"
          className={styles.buttonBG}
          style={{
            fill: "var(--fill-color)",
          }}
        >
          <polygon
            points="791.8,177.9 786.1,45.1 781.2,23.6 732.9,5.4 44,10 20.8,21.1 4.6,42.3 7.2,179.2 17.3,202.9 
      52.4,218.6 739.1,217.7 779.1,204.6 "
            style={{
              fill: "var(--fill-color)",
            }}
          />
          <path
            style={{
              fill: "var(--stroke-color)",
            }}
            d="M189.2,0.5c-0.4,0.4-31.1,0.8-68.3,1c-66.3,0.3-67.8,0.4-79.7,4C28.7,9.2,18.4,15.9,9.1,26.2
      C-1,37.4-1,37.8,1.2,130.8c1.3,54.6,1.4,55.2,5.3,62.8c2.2,4.2,5.6,9.7,7.5,12.3c12.5,16.2,53.8,23,115.6,19.1
      c25.3-1.6,59.1-1.7,173.4-0.4c91.9,1,166.3,1.1,211.2,0.1c38.1-0.8,107.1-1.6,153.3-1.7c75.6-0.2,85-0.5,92.2-2.9
      c19.6-6.5,31.6-19.2,35.3-37.4c2.3-10.9,2.6-57.5,0.8-112.3c-0.8-25.6-1.1-27.2-5.6-36.9c-4.8-10.3-11.7-16.7-25.5-23.7
      c-14.6-7.3-11.5-7.2-177.5-8.4C401.2,0,190.2-0.4,189.2,0.5z M633.6,11.4c121.9,1,118.9,0.7,135.4,12.2
      C784.8,34.6,784.9,35.1,787,98c1.7,52.7,0.9,75.5-3.2,89.2c-2.4,8-11,16.9-20.1,20.7c-14.8,6.2-25.7,6.9-88.4,5.9
      c-32.4-0.5-79.9-0.3-105.4,0.5c-25.5,0.8-98.4,1.4-162,1.2c-144.1-0.4-264.6-0.2-306.7,0.5c-34.1,0.6-48.2-0.8-64-6.5
      c-10.9-3.9-15.1-7.4-20.6-17l-4.6-8l-1.4-55.9c-1.9-76.1-1.8-84,1.3-89.7c4.5-8.3,18.8-19.7,29.7-23.6c9.9-3.6,10.9-3.6,84.7-4.2
      c41.1-0.4,75.1-1,75.5-1.4C202.7,8.7,412.6,9.6,633.6,11.4z"
          />
        </svg>
      )}
      {type === "secondary" && (
        <svg
          id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
          width="418"
          height="94"
          fill="none"
          viewBox="0 0 418 94"
          className={styles.buttonBG}
          style={{
            fill: "var(--fill-color)",
          }}
        >
          <polygon
            points="415.2 73 415.6 19 405.9 8.2 385.6 2 25.1 2.9 3 15.1 4 77.1 11.2 86.6 24.1 90.8 389.9 90.8 408 85.2 415.2 73"
            style={{
              fill: "var(--fill-color)",
            }}
          />
          <path
            d="M99.2,.2c-.2,.2-16.3,.3-35.8,.4-34.8,.1-35.6,.2-41.8,1.6C15,3.8,9.7,6.6,4.8,10.9-.5,15.6-.5,15.7,.6,54.4c.7,22.7,.7,23,2.8,26.1,1.1,1.8,2.9,4.1,3.9,5.1,6.6,6.7,28.2,9.6,60.6,7.9,13.3-.7,31-.7,90.9-.2,48.2,.4,87.2,.4,110.7,0,20-.3,56.1-.7,80.4-.7,39.6,0,44.6-.2,48.4-1.2,10.3-2.7,16.6-8,18.5-15.5,1.2-4.5,1.4-23.9,.4-46.7-.4-10.7-.6-11.3-2.9-15.4-2.5-4.3-6.1-6.9-13.4-9.8-7.6-3.1-6-3-93.1-3.5C210.4,0,99.7-.2,99.2,.2Zm233.1,4.5c63.9,.4,62.3,.3,71,5.1,8.3,4.5,8.3,4.8,9.4,30.9,.9,21.9,.5,31.4-1.7,37.1-1.3,3.3-5.8,7-10.5,8.6-7.8,2.6-13.5,2.9-46.4,2.4-17-.2-41.9-.1-55.3,.2-13.4,.3-51.6,.6-85,.5-75.6-.2-138.8,0-160.8,.2-17.9,.3-25.3-.3-33.5-2.7-5.7-1.6-7.9-3.1-10.8-7.1l-2.4-3.3-.7-23.2c-1-31.6-.9-34.9,.7-37.3,2.4-3.5,9.9-8.2,15.6-9.8,5.2-1.5,5.7-1.5,44.4-1.8,21.5-.1,39.4-.4,39.6-.6,.4-.3,110.5,0,226.4,.8Z"
            style={{
              fill: "#181B6D",
              fillRule: "evenodd",
            }}
          />
        </svg>
      )}

      {isDisabled && isLocked && (
        <div className={styles.lockIcon}>
          <img src={lockIcon} alt="lock" />
        </div>
      )}
      <span className={styles.buttonText}>{text}</span>
      {children && <div className={styles.childrenWrapper}>{children}</div>}
    </div>
  );
};
