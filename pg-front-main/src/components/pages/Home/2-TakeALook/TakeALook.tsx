import React from "react";
import styles from "./TakeALook.module.scss";
import BlockWrapper from "../../../ui/BlockWrapper/BlockWrapper";
import Title from "../../../ui/Title/Title";
import Subtitle from "../../../ui/Subtitle/Subtitle";
import Paragraph from "../../../ui/Paragraph/Paragraph";
import avePege from "../../../../images/ave_pege.webp";
import pepesBoy from "../../../../images/pepes_boy.webp";
import theGoatWay from "../../../../images/the_goat_way.webp";
import Card from "./Card/Card";

interface Card {
  source: string;
  soon: boolean;
  buttonText: "DOWNLOAD.pdf" | "DONATE";
  link: string;
}

const cards: Card[] = [
  {
    source: pepesBoy,
    soon: false,
    buttonText: "DOWNLOAD.pdf",
    link: "/comics/Pege_Part_1.pdf",
  },
  {
    source: theGoatWay,
    soon: false,
    buttonText: "DOWNLOAD.pdf",
    link: "/comics/Pege_Part_2.pdf",
  },
  {
    source: avePege,
    soon: true,
    buttonText: "DONATE",
    link: "donation",
  },
];

export const TakeALook: React.FC = () => {

  return (
    <BlockWrapper>
      <div className={styles.wrapper}>
        <div className={styles.textWrapper}>
          <Title text="Take a look at Pege Lore" />
          <div className={styles.mb18}>
            <Subtitle text="In this game, time = multiplier." />
          </div>
          <div className={styles.tablet24space}></div>

          <div className={styles.mb10}>
            <Paragraph
              title="Join the $PEGE hunt and turn your $PEPE bags into serious rewards."
              keywords={["$PEGE", "$PEPE"]}
            />
          </div>
          <div className={styles.mb18}>
            <Paragraph
              text="All you need to do is connect your wallet via WalletConnect and 
            start holding $PEPE — the earlier you join and the longer you hold, 
            the more $PEGE you'll farm."
              keywords={["$PEPE"]}
            />
          </div>
          <div className={styles.mb10}>
            <Paragraph title="We take daily snapshots of your $PEPE balance" />
          </div>
          <div className={styles.mb23}>
            <Paragraph
              text="We take daily snapshots of your $PEPE balance, 
          calculate your average over time, and apply a multiplier based 
            on how strong your holding game is."
            />
          </div>
          <Paragraph title="At the end of the season, a final snapshot locks in your score" />
        </div>
        <div className={styles.cardsWrapper}>
          {cards.map((card) => (
            <Card key={card.source} {...card} />
          ))}
        </div>
      </div>
    </BlockWrapper>
  );
};

export default TakeALook;
