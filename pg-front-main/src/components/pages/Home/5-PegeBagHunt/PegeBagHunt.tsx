import React from "react";
import styles from "./PegeBagHunt.module.scss";
import { BlockWrapper } from "../../../ui/BlockWrapper/BlockWrapper";
import Title from "../../../ui/Title/Title";
import Subtitle from "../../../ui/Subtitle/Subtitle";
import Paragraph from "../../../ui/Paragraph/Paragraph";
import image from "../../../../images/pepe_pege_crown.webp";
import { CheckMark } from "../../../ui/SVGs/CheckMark";
import { CrossMark } from "../../../ui/SVGs/CrossMark";
import { useMediaQuery } from "react-responsive";
import { ConnectClaimButton } from "@/components/web3/ConnectClaimButton/ConnectClaimButton";

const RULES = [
  {
    text: "Deleting tweets = instant bag loss",
    isCorrect: false,
  },
  {
    text: "Multi-accounts = zero reward",
    isCorrect: false,
  },
  {
    text: "Your map is ready.",
    isCorrect: true,
  },
  {
    text: "Your wallet knows.",
    isCorrect: true,
  },
  {
    text: "The bags are hidden.",
    isCorrect: true,
  },
];

function Rule({ text, isCorrect }: { text: string; isCorrect: boolean }) {
  return (
    <div className={styles.rule}>
      {isCorrect ? <CheckMark /> : <CrossMark />}
      <span className={styles.ruleText}>{text}</span>
    </div>
  );
}

export const PegeBagHunt: React.FC = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 720px)" });

  return (
    <BlockWrapper isDark type={2}>
      <div className={styles.wrapper}>
        <div className={styles.imageWrapper}>
          <img src={image} alt="pege-bag-hunt" />
        </div>
        <div className={styles.textWrapper}>
          <div className={styles.textBlock}>
            <Title text="The $PEGE Bag Hunt is ONЕ" />
            <Subtitle text="3 Bags. 3 Tasks. 1 Shot at Glory" />
          </div>
          <div className={styles.textBlock}>
            <Paragraph title="The path to your $PEGE reward is marked with clues: " />
            <Paragraph
              text={`Check your daily snapshots — Don’t miss a day, or your bag gets lighter.
                    HODL $PEPE like a real OG — Sell now? Say goodbye to the multiplier.
                    Boost your rewards via Twitter — Tweet it. Retweet it. Make memes.`}
              keywords={["$PEPE"]}
            />
          </div>
          <div className={styles.textBlock}>
            <Paragraph title="Twitter CTA: " />
            <Paragraph text="Want bonus $PEGE ?" keywords={["$PEGE"]} />
            <Paragraph
              text="Post your meme with #PEGE and tag @pegevip"
              keywords={["#PEGE", "@pegevip"]}
            />
            <Paragraph text="The community watches. The bags don’t wait." />
          </div>
          <div className={styles.textBlock}>
            <div className={styles.numberedBlockWrapper}>
              <div className={styles.numberedBlock}>
                <div className={styles.number}>01</div>
                <Paragraph text="Connect your cryptocurrency wallet (Required to receive your reward)" />
              </div>
              <div className={styles.numberedBlock}>
                <div className={styles.number}>02</div>
                <Paragraph text="Link your X account (Via Twitter's secure authorization)" />
              </div>
            </div>
            <Paragraph text="(All actions are moderated before being credited)" />
          </div>
          <div className={styles.buttonWrapper}>
            <ConnectClaimButton type="primary" />
          </div>
          <Paragraph title="But be warned:" />
          {isMobile ? (
            <div className={styles.rulesWrapper}>
              <div className={styles.rulesPairWrapper}>
                {RULES.slice(2, 5).map((rule) => (
                  <Rule key={rule.text} {...rule} />
                ))}
              </div>
              <div className={styles.rulesPairWrapper}>
                {RULES.slice(0, 2).map((rule) => (
                  <Rule key={rule.text} {...rule} />
                ))}
              </div>
            </div>
          ) : (
            <div className={styles.rulesWrapper}>
              <div className={styles.rulesPairWrapper}>
                {RULES.slice(0, 2).map((rule) => (
                  <Rule key={rule.text} {...rule} />
                ))}
              </div>
              <div className={styles.rulesPairWrapper}>
                {RULES.slice(2, 4).map((rule) => (
                  <Rule key={rule.text} {...rule} />
                ))}
              </div>
              <div className={styles.rulesPairWrapper}>
                {RULES.slice(4, 5).map((rule) => (
                  <Rule key={rule.text} {...rule} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </BlockWrapper>
  );
};

export default PegeBagHunt;
