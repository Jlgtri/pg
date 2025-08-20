import React, { useEffect, useState } from "react";
import styles from "./Header.module.scss";
import { useMediaQuery } from "react-responsive";
import ButtonBigBG from "../SVGs/ButtonBigBG";
import cn from "classnames";
import { useScrollLock } from "../../../hooks/useScrollLock";
import { FooterIcon } from "../FooterIcon/FooterIcon";
import {
  HOME_LINK,
  WHO_IS_PEGE_LINK,
  WHY_PEGE_LINK,
  ROADMAP_LINK,
  TOKENOMICS_LINK,
} from "@/constants";

const navItems = [
  {
    label: "HOME",
    href: HOME_LINK,
  },
  {
    label: "WHO IS  PEGE",
    href: WHO_IS_PEGE_LINK,
  },
  {
    label: "WHY PEGE?",
    href: WHY_PEGE_LINK,
  },
  {
    label: "ROAD MAP",
    href: ROADMAP_LINK,
  },
  {
    label: "TOKENOMICS",
    href: TOKENOMICS_LINK,
  },
];

function SandwichMenu({ isOpen }: { isOpen: boolean }) {
  return (
    <div
      className={cn(styles.sandwichMenu, {
        [styles.sandwichMenuOpen]: isOpen,
      })}
    >
      <div className={styles.sandwichMenuLine}></div>
      <div className={styles.sandwichMenuLine}></div>
      <div className={styles.sandwichMenuLine}></div>
    </div>
  );
}

export const Header: React.FC = () => {
  const isDesktop = useMediaQuery({
    query: "(min-width: 1250px)",
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { blockScroll, allowScroll } = useScrollLock();

  useEffect(() => {
    if (isMenuOpen) {
      blockScroll();
    } else {
      allowScroll();
    }
  }, [isMenuOpen, blockScroll, allowScroll]);

  return (
    <div className={styles.wrapper}>
      {isDesktop ? (
        <nav>
          <ul className={styles.navItems}>
            {navItems.map((item) => (
              <li key={item.label}>
                <a
                  className={styles.navItem}
                  href={item.href}
                  target={item.href.split("")[0] === "/" ? "_self" : "_blank"}
                  rel="noreferrer"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : (
        <>
          <div
            className={cn(styles.menuButtonWrapper, {
              [styles.menuButtonWrapperOpen]: isMenuOpen,
            })}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <ButtonBigBG fill="var(--violet)" stroke="#071949" />
            <span className={styles.menuButtonText}>MENU</span>
            <SandwichMenu isOpen={isMenuOpen} />
          </div>
          <div
            className={cn(styles.mobileMenuWrapper, {
              [styles.mobileMenuWrapperOpen]: isMenuOpen,
            })}
          >
            <nav>
              <ul className={styles.mobileMenuItems}>
                {navItems.map((item) => (
                  <li key={item.label} className={styles.mobileMenuItem}>
                    <a
                      href={item.href}
                      target={
                        item.href.split("")[0] === "/" ? "_self" : "_blank"
                      }
                      rel="noreferrer"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className={styles.icons}>
              <FooterIcon type="tg" />
              <FooterIcon type="x" />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
