import styles from "./CompleteModal.module.scss";
import cn from "classnames";
import { useModal } from "@/providers/ModalProvider";
import bg from "@/images/bg-complete.webp";

export const CompleteModal = () => {
  const { closeModal } = useModal();

  return (
    <div className={styles.wrapper}>
      <div className={styles.bg}>
        <img src={bg} alt="bg" className={styles.bgImage} />
      </div>
      <div className={styles.content}>
        <div className={styles.title}>
          <h1>Complete</h1>
          <div
            onClick={() => {
              closeModal();
            }}
            className={styles.closeButton}
          >
            <div
              className={cn(styles.closeButtonStick, styles.closeButtonStick_1)}
            />
            <div
              className={cn(styles.closeButtonStick, styles.closeButtonStick_2)}
            />
          </div>
        </div>
        <div className={styles.subtitle}>
          <h2>
            Twit Confirmed, Now let's participate in PEPE Race to Gain more
            PEGE, LFG!
          </h2>
        </div>
      </div>
    </div>
  );
};
