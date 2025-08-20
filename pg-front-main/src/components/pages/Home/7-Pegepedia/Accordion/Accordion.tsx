import React, { useState } from "react";
import styles from "./Accordion.module.scss";
import Arrow from "../../../../ui/SVGs/Arrow";
import cn from "classnames";

export const Accordion: React.FC<{ title: string; description: string }> = ({
  title,
  description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={cn(styles.accordionItem)}
      onClick={() => setIsOpen(!isOpen)}
    >
      {/* <div className={styles.accordionHeader}> */}
      <div className={styles.text}>
        <div className={styles.title}>{title}</div>
        <div
          className={cn(styles.description, {
            [styles.description_open]: isOpen,
          })}
        >
          {description}
        </div>
      </div>
      <div className={cn(styles.arrowWrapper)}>
        <div className={cn(styles.arrow, { [styles.rotate180]: isOpen })}>
          <Arrow />
        </div>
      </div>
      {/* </div> */}
    </div>
  );
};

export default Accordion;
