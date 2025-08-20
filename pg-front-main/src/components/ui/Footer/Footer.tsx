import React from "react";
import styles from "./Footer.module.scss";
import { FooterIcon } from "../FooterIcon/FooterIcon";
import { FooterLine } from "../SVGs/FooterLine";
import pegeLogo from "../../../images/pege_logo.png";
import { useMediaQuery } from "react-responsive";

export const Footer: React.FC = () => {
  const isTablet = useMediaQuery({ query: "(max-width: 1250px)" });

  return (
    <div className={styles.wrapper}>
      <div className={styles.logoWrapper}>
        <div className={styles.logo}>
          <img src={pegeLogo} alt="pege-logo" />
        </div>
        {isTablet && (
          <div className={styles.icons}>
            <FooterIcon type="tg" />
            <FooterIcon type="x" />
          </div>
        )}
      </div>
      <div className={styles.centralBlockWrapper}>
        <div className={styles.centralBlock}>
          <div className={styles.text}>
            <p>
              $PEGE is a meme-based digital asset with no intrinsic value,
              utility, or expectation of profit. There is no official team,
              development roadmap, or guarantees of future performance. $PEGE
              exists solely for entertainment purposes. Participation in any
              $PEGE airdrop or bounty program is strictly prohibited for
              residents or citizens of the United States, as well as persons
              located in, or otherwise subject to the jurisdiction of, the
              United States or any other restricted jurisdictions. Participation
              may be subject to additional legal and regulatory restrictions in
              other jurisdictions. Participants are solely responsible for
              ensuring compliance with all applicable laws and regulations in
              their country of residence.
            </p>
          </div>
          <FooterLine />
          <span className={styles.reserved}>
            © Copyright 2025, All Rights Reserved
          </span>
        </div>
      </div>

      {!isTablet && (
        <div className={styles.icons}>
          <FooterIcon type="tg" />
          <FooterIcon type="x" />
        </div>
      )}
    </div>
  );
};
