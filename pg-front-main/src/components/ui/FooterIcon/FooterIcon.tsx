import React from "react";
import { X } from "../SVGs/X";
import { TG } from "../SVGs/TG";
import { IconRectangle } from "../SVGs/IconRectangle";
import { Splash } from "../SVGs/Splash";
import styles from "./FooterIcon.module.scss";
import cn from "classnames";
import { TG_LINK, X_LINK } from "@/constants";

export const FooterIcon: React.FC<{ type: "x" | "tg" }> = ({ type = "x" }) => {
  return (
    <a
      href={type === "x" ? X_LINK : TG_LINK}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className={styles.wrapper}>
        <div
          className={cn(styles.splash, { [styles.rotate180]: type === "x" })}
        >
          <Splash />
        </div>
        <div className={styles.rectangle}>
          <IconRectangle />
        </div>
        <div className={styles.icon}>
          {type === "x" && <X />}
          {type === "tg" && <TG />}
        </div>
      </div>
    </a>
  );
};
