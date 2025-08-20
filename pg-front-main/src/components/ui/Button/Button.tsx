import React from "react";
import styles from "./Button.module.scss";
import cn from "classnames";
import ButtonSmooth from "../SVGs/ButtonSmooth";
import ButtonBigBG from "../SVGs/ButtonBigBG";

// button has height and width as 100%, so it should
// be used in a container with specific height and width

type HexColor = `#${string}`;

const Button: React.FC<{
  type: "large" | "smooth" | "alternative";
  disabled?: boolean;
  text: string;
  customStyle?: React.CSSProperties;
  fillColor?: HexColor;
  strokeColor?: HexColor;
  primary?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
}> = ({
  type = "small",
  disabled,
  text,
  customStyle,
  fillColor,
  strokeColor,
  children,
  onClick,
  primary = true,
}) => {
  return (
    <div className={styles.componentButtonWrapper}>
      <button
        className={cn(styles.button, {
          [styles.disabled]: disabled,
          [styles.large]: type === "large",
          [styles.alternative]: type === "alternative",
        })}
        disabled={disabled}
        onClick={onClick}
        style={customStyle}
      >
        {type === "large" && (
          <ButtonBigBG fill={fillColor} stroke={strokeColor} />
        )}
        {(type === "smooth" || type === "alternative") && (
          <ButtonSmooth primary={primary} disabled={false} />
        )}
        <span className={styles.text}>{text}</span>
        {children}
      </button>
    </div>
  );
};

export default Button;
