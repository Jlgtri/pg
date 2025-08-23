import React from "react";
import { BlockWrapper } from "../../../ui/BlockWrapper/BlockWrapper";
import Subtitle from "../../../ui/Subtitle/Subtitle";
import Title from "../../../ui/Title/Title";
import Accordion from "./Accordion/Accordion";
import styles from "./Pegepedia.module.scss";

const PEGEPEDIA_DATA = [
  {
    title: "1. What do I need to do to earn $PEGE?",
    description:
      "Participation in any $PEGE airdrop or bounty program is strictly prohibited for residents or citizens of the United States, as well as persons located in, or otherwise subject to the jurisdiction of, the United States or any other restricted jurisdictions.",
  },
  {
    title: "2. How often are snapshots taken?",
    description:
      "Daily, at random times, throughout the entire bounty campaign.",
  },
  {
    title: "3. How can I track my progress?",
    description:
      "After each snapshot, you’ll see a live estimate of your $PEGE based on your average $PEPE balance and current multiplier.",
  },
  {
    title: "4. Which tokens are counted?",
    description:
      "Only $PEPE counts toward your $PEGE rewards. 1 $PEPE = 20 $PEGE. Other tokens in your wallet do not affect your results.",
  },
  {
    title: "5. Can I sell or transfer $PEPE during the bounty?",
    description:
      "Yes, $PEPE is not locked. However, reducing your balance will lower your final reward, since your $PEGE is based on your average balance across all snapshots.",
  },
  {
    title: "6. How does the multiplier work?",
    description: `Your multiplier is based on how long you’ve held $PEPE:
    \n Less than 1 week — x1 \n More than 1 week — x1.5 \n More than 2 weeks — x2 \n More than 2 months — x2.5 \n Over 6 months — x3 \n
The earlier you started holding, the higher your multiplier.`,
  },
  {
    title: "7. When can I claim my $PEGE?",
    description:
      "Right after the final calculation is completed. \n There is no lock-up period — you can use or transfer your $PEGE immediately after claiming.",
  },
  {
    title: "8. Who is not eligible to participate?",
    description:
      "U.S. citizens, residents, and anyone subject to U.S. jurisdiction are strictly prohibited from participating.",
  },
  {
    title: "9. How does the Twitter (now X) bounty work?",
    description: `You can earn extra $PEGE by posting tweets or retweets with official campaign hashtags.
    Important:
    Your posts must remain live until the bounty ends.
    Deleted posts will not be rewarded.
    You must link your Twitter account to your wallet through the website to participate.`,
  },
  //   {
  //     title: "10. How does the Twitter bounty work?",
  //     description: `You can earn additional $PEGE rewards by posting tweets or retweets using the project’s official hashtags.
  // Twitter participation is completely optional, but it helps boost your rewards and supports the growth of the project.`,
  //   },
];

export const Pegepedia: React.FC = () => {
  return (
    <BlockWrapper isDark type={3}>
      <div className={styles.wrapper}>
        <div className={styles.titleWrapper}>
          <Title text="Pegepedia" />
          <Subtitle text="All Your Questions" />
        </div>
        <div className={styles.accordionWrapper}>
          <div className={styles.accordionColumn}>
            {PEGEPEDIA_DATA.slice(0, 5).map((item) => (
              <Accordion
                key={item.title.slice(0, 2)}
                title={item.title}
                description={item.description}
              />
            ))}
          </div>
          <div className={styles.accordionColumn}>
            {PEGEPEDIA_DATA.slice(5).map((item) => (
              <Accordion
                key={item.title.slice(0, 2)}
                title={item.title}
                description={item.description}
              />
            ))}
          </div>
        </div>
      </div>
    </BlockWrapper>
  );
};

export default Pegepedia;
