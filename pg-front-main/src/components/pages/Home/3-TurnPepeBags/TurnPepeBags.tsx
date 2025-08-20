import React from "react";
import styles from "./TurnPepeBags.module.scss";
import BlockWrapper from "../../../ui/BlockWrapper/BlockWrapper";
import Subtitle from "../../../ui/Subtitle/Subtitle";
import Title from "../../../ui/Title/Title";
import { StepsCard } from "./StepsCard/StepsCard";
import step1 from "../../../../images/step_1.png";
import step2 from "../../../../images/step_2.png";
import step3 from "../../../../images/step_3.png";
import step4 from "../../../../images/step_4.png";
import step5 from "../../../../images/step_5.png";
import animation1 from "@/animations/i1.json";
import animation2 from "@/animations/i2.json";
import animation3 from "@/animations/i3.json";
import animation4 from "@/animations/i4.json";
import animation5 from "@/animations/i5.json";
import { ConnectClaimButton } from "@/components/web3/ConnectClaimButton/ConnectClaimButton";

const STEPS = [
  {
    step: "01",
    title: "Connect wallet",
    description: `Link your wallet Link your crypto 
    wallet via WalletConnect to enter the $PEGE hunt. 
    WalletConnect to join the $PEGE hunt.`,
    image: step1,
    animation: animation3,
  },
  {
    step: "02",
    title: "Hold $PEPE",
    description: `Keep $PEPE in your wallet — the 
    earlier and longer you hold, the fatter your 
    $PEGE bag gets. the more you earn. 1 $PEPE = 20 $PEGE`,
    image: step2,
    animation: animation4,
  },
  {
    step: "03",
    title: "Daily Snapshots",
    description: `We track your balance every day. 
    Your average $PEPE balance across all snapshots 
    defines your final payout.`,
    image: step3,
    animation: animation1,
  },
  {
    step: "04",
    title: "Wait for snapshot ",
    description: `Once the season ends, we calculate 
    your full holder score with your multiplier applied.`,
    image: step4,
    animation: animation2,
  },
  {
    step: "05",
    title: "Claim Your $PEGE",
    description: `Once the season ends, we calculate 
    your full holder score with your multiplier applied.`,
    image: step5,
    animation: animation5,
  },
];

export const TurnPepeBags: React.FC = () => {
  return (
    <BlockWrapper isDark={true}>
      <div className={styles.wrapper}>
        <Title text="Turn PEPE Bags Into $PEGE Rewards — Here’s How" />
        <Subtitle text="No magic. Just snapshots, patience, and your bags" />
        <div className={styles.cardsWrapper}>
          {STEPS.map((step) => (
            <StepsCard key={step.step} {...step} />
          ))}
        </div>
        <div className={styles.buttonWrapper}>
          <ConnectClaimButton type="primary" />
        </div>
      </div>
    </BlockWrapper>
  );
};

export default TurnPepeBags;
