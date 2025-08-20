import React from "react";
import styles from "./BlockWrapper.module.scss";
import cn from "classnames";
import BgBorder1 from "../SVGs/BgBorder1";
import BgBorder2 from "../SVGs/BgBorder2";

interface IBlockWrapperProps {
  isDark?: boolean;
  children: React.ReactNode;
  className?: string;
  type?: 1 | 2 | 3;
}

export const BlockWrapper: React.FC<IBlockWrapperProps> = ({
  children,
  isDark = false,
  className,
  type = 1,
}) => {
  return (
    <div className={cn(styles.blockWrapper)}>
      {isDark && (
        <div
          className={cn(styles.imageWrapper, styles.imageWrapper_top, {
            [styles.imageWrapper_top_type1]: type === 1,
            [styles.imageWrapper_top_type2]: type === 2,
            [styles.imageWrapper_top_type3]: type === 3,
          })}
        >
          <BgBorder1 />
        </div>
      )}
      <div
        className={cn(styles.children, className, {
          [styles.blockWrapper_dark]: isDark,
        })}
      >
        {children}
      </div>
      {isDark && (
        <div
          className={cn(styles.imageWrapper, styles.imageWrapper_bottom, {
            [styles.imageWrapper_bottom_type1]: type === 1,
            [styles.imageWrapper_bottom_type2]: type === 2,
            [styles.imageWrapper_bottom_type3]: type === 3,
          })}
        >
          {type === 2 ? <BgBorder2 /> : <BgBorder1 />}
        </div>
      )}
    </div>
  );
};

export default BlockWrapper;
