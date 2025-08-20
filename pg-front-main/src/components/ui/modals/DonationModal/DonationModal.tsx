import styles from "./DonationModal.module.scss";
import cn from "classnames";
import { useModal } from "@/providers/ModalProvider";
import DonateBg from "@/images/donate.png";
import { CopyIcon } from "../../SVGs/CopyIcon";
import ethIcon from "@/images/eth-icon.webp";
import { AlertIcon } from "../../SVGs/AlertIcon";
import { useToast } from "@/providers/ToastProvider";
import Bg from "@/components/ui/SVGs/Bg";
import { DONATION_ADDRESS } from "@/constants";

export const DonationModal = () => {
  const { closeModal } = useModal();
  const { showToast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(DONATION_ADDRESS);
    showToast("address copied", "success");
  };

  return (
    <div className={styles.wrapper}>
      <img src={DonateBg} alt="bg" className={styles.bg} />

      <div className={styles.content}>
        <div className={styles.title}>
          <h1>donate</h1>
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
          Every donation fuels the art, memes & madness. Become part of the
          story — literally
        </h2>

        <div className={styles.walletAddress}>
          <div className={cn(styles.walletTitle)}>
            <span>WALLET ADRESS:</span>
          </div>

          <div className={styles.addressField}>
            <div className={styles.bgWrapper}>
              <Bg fill="#101A5C" />
            </div>
            <img src={ethIcon} alt="eth" className={styles.ethIcon} />
            <div className={styles.walletTitle}>
              <span>{DONATION_ADDRESS}</span>
            </div>
            <div className={styles.copyIcon} onClick={handleCopy}>
              <div className={styles.copyIconWrapper}>
                <CopyIcon />
              </div>
            </div>
          </div>

          <div className={styles.alertWrapper}>
            <div className={styles.alertBgWrapper}>
              <Bg fill="#5D3D9A" />
            </div>
            <AlertIcon />
            <div className={styles.alertContent}>
              <span>Donations are optional & non-refundable.</span>
              <span>All funds go toward art, illustration, and meme-fuel.</span>
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
