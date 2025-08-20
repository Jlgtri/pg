import Lottie from "lottie-react";
import styles from "./StepsCard.module.scss";

interface StepsCardProps {
  step: string;
  title: string;
  description: string;
  image?: string;
  animation: Record<string, unknown>; // Lottie animation data
}

export const StepsCard = ({
  step,
  title,
  description,
  animation,
}: StepsCardProps) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.numberImageWrapper}>
        <div className={styles.image}>
          <div className={styles.animation}>
            <Lottie
              animationData={animation}
              loop={true}
              autoplay={true}
              rendererSettings={{
                preserveAspectRatio: "xMidYMid slice",
              }}
            />
          </div>
          {/* <img src={image} alt={title} /> */}
        </div>
        <div className={styles.number}>{step}</div>
      </div>
      <div className={styles.title}>{title}</div>
      <div className={styles.description}>{description}</div>
    </div>
  );
};
