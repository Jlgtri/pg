import React from "react";
import styles from "./Home.module.scss";
import { Hero } from "./1-Hero";
import { TakeALook } from "./2-TakeALook";
import { TurnPepeBags } from "./3-TurnPepeBags";
import { TheOlderThePepe } from "./4-TheOlderThePepe";
import { PegeBagHunt } from "./5-PegeBagHunt";
import { Snapshot } from "./6-Snapshot";
import { Pegepedia } from "./7-Pegepedia";

export const Home: React.FC = () => {
  return (
    <div className={styles.home}>
      <Hero />
      <TakeALook />
      <TurnPepeBags />
      <TheOlderThePepe />
      <PegeBagHunt />
      <Snapshot />
      <Pegepedia />
    </div>
  );
};

export default Home;
