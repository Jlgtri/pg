import styles from "./CalculateModal.module.scss";
import cn from "classnames";
import { useModal } from "@/providers/ModalProvider";
import DonateBg from "@/images/donate.png";
import { AlertIcon } from "../../SVGs/AlertIcon";
import Bg from "@/components/ui/SVGs/Bg";

export const CalculateModal = () => {
  const { closeModal } = useModal();

  return (
    <div className={styles.wrapper}>
      <img src={DonateBg} alt="bg" className={styles.bg} />

      <div className={styles.content}>
        <div className={styles.title}>
          <h1>CALCULATION</h1>
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

        <h2 className={styles.subtitle}>
          CALCULATING YOUR $PEGE COINS, WAIT A LITTLE BIT
        </h2>

        <div className={styles.walletAddress}>
          <div className={styles.spinnerWrapper}>
            <div className={styles.spinner}>
              <svg
                width="101"
                height="100"
                viewBox="0 0 101 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M46.3283 91.6666V74.9999C46.3283 72.6988 48.1938 70.8333 50.4949 70.8333C52.7961 70.8333 54.6616 72.6988 54.6616 74.9999V91.6666C54.6616 93.9678 52.7961 95.8333 50.4949 95.8333C48.1938 95.8333 46.3283 93.9678 46.3283 91.6666ZM29.8813 64.7216C31.5085 63.0944 34.1461 63.0944 35.7733 64.7216C37.4005 66.3488 37.4005 68.9864 35.7733 70.6136L23.9813 82.4055C22.354 84.0314 19.7161 84.0323 18.0894 82.4055C16.4626 80.7788 16.4635 78.1409 18.0894 76.5136L29.8813 64.7216ZM65.2166 64.7216C66.7418 63.1964 69.1546 63.0987 70.7912 64.4327L71.1086 64.7216L82.9005 76.5136L83.1854 76.8269C84.521 78.4635 84.4263 80.8797 82.9005 82.4055C81.3747 83.9314 78.9585 84.026 77.3219 82.6904L77.0086 82.4055L65.2166 70.6136L64.9277 70.2962C63.5937 68.6596 63.6914 66.2468 65.2166 64.7216ZM25.495 45.8333C27.7961 45.8333 29.6616 47.6988 29.6616 50C29.6616 52.3011 27.7961 54.1666 25.495 54.1666H8.82829C6.5271 54.1666 4.66162 52.3011 4.66162 50C4.66162 47.6988 6.5271 45.8333 8.82829 45.8333H25.495ZM92.1616 45.8333C94.4628 45.8333 96.3283 47.6988 96.3283 50C96.3283 52.3011 94.4628 54.1666 92.1616 54.1666H75.4949C73.1938 54.1666 71.3283 52.3011 71.3283 50C71.3283 47.6988 73.1938 45.8333 75.4949 45.8333H92.1616ZM18.0894 17.5944C19.6152 16.0686 22.0314 15.9739 23.668 17.3095L23.9813 17.5944L35.7733 29.3863L36.0622 29.7037C37.3962 31.3403 37.2985 33.7531 35.7733 35.2783C34.2481 36.8035 31.8353 36.9012 30.1987 35.5672L29.8813 35.2783L18.0894 23.4863L17.8045 23.173C16.4689 21.5364 16.5636 19.1202 18.0894 17.5944ZM77.0086 17.5944C78.6359 15.9685 81.2738 15.9676 82.9005 17.5944C84.5273 19.2211 84.5264 21.859 82.9005 23.4863L71.1086 35.2783C69.4814 36.9055 66.8438 36.9055 65.2166 35.2783C63.5894 33.6511 63.5894 31.0135 65.2166 29.3863L77.0086 17.5944ZM46.3283 25V8.33329C46.3283 6.03211 48.1938 4.16663 50.4949 4.16663C52.7961 4.16663 54.6616 6.03211 54.6616 8.33329V25C54.6616 27.3011 52.7961 29.1666 50.4949 29.1666C48.1938 29.1666 46.3283 27.3011 46.3283 25Z"
                  fill="white"
                />
              </svg>
            </div>
          </div>

          <div className={styles.alertWrapper}>
            <div className={styles.alertBgWrapper}>
              <Bg fill="#5D3D9A" />
            </div>
            <AlertIcon />
            <div className={styles.alertContent}>
              <span>PLEASE DON'T CLOSE THIS WINDOW</span>
            </div>
          </div>

          <div className={styles.walletTitle}>
            <div className={styles.walletIcon}></div>
          </div>
        </div>
      </div>
    </div>
  );
};
