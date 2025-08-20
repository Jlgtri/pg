import React from "react";
import styles from "./TheOlderThePepe.module.scss";
import { BlockWrapper } from "../../../ui/BlockWrapper/BlockWrapper";
import Title from "../../../ui/Title/Title";
import Subtitle from "../../../ui/Subtitle/Subtitle";
import Paragraph from "../../../ui/Paragraph/Paragraph";
import image from "../../../../images/coeff_pepe.webp";

export const TheOlderThePepe: React.FC = () => {
  return (
    <BlockWrapper>
      <div className={styles.wrapper}>
        <div className={styles.textWrapper}>
          <div className={styles.textBlock}>
            <Title text="THE OLDER THE PEPE — THE FATTER THE BAG" />
            <Subtitle text=" In this game, time = multiplier." />
          </div>
          <div className={styles.textBlock}>
            <Paragraph title="Daily snapshots. No second chances." />
            <Paragraph text="The program runs for XX days from launch." />
          </div>
          <div className={styles.textBlock}>
            <Paragraph
              title="Each day, we take a snapshot of your $PEPE balance."
              keywords={["$PEPE"]}
            />
            <Paragraph text="We also track the date $PEPE first appeared in your wallet." />
          </div>
          <div className={styles.textBlock}>
            <Paragraph
              title="How your $PEGE is calculated:"
              keywords={["$PEGE"]}
            />
            <Paragraph
              text="$PEGE = Average $PEPE balance × Multiplier"
              keywords={["$PEGE"]}
            />
            <Paragraph text="We calculate your average $PEPE balance across all snapshots. " />
            <Paragraph text="Then we apply your personal time-based multiplier." />
          </div>
        </div>
        <div className={styles.imageWrapper}>
          <img src={image} alt="TheOlderThePepe" />
        </div>
      </div>
    </BlockWrapper>
  );
};

export default TheOlderThePepe;
