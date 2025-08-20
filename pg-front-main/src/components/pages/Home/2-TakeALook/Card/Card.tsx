import React, { useState, useEffect } from "react";
import Soon from "../../../../ui/SVGs/Soon";
// import Button from "../../../../ui/Button/Button";
import styles from "./Card.module.scss";
import ButtonSmall from "@/components/ui/ButtonSmall/ButtonSmall";
import { useModal } from "@/providers/ModalProvider";

interface CardProps {
  source: string;
  soon: boolean;
  buttonText: string;
  link: string;
}

const Card: React.FC<CardProps> = ({ source, soon, buttonText, link }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);
  const COOLDOWN_DURATION = 10000; // 10 seconds cooldown
  const { openModal } = useModal();

  useEffect(() => {
    // Check if there's an active cooldown for this specific file
    const lastDownload = localStorage.getItem(`download_${link}`);
    if (lastDownload) {
      const timeSinceDownload = Date.now() - parseInt(lastDownload);
      if (timeSinceDownload < COOLDOWN_DURATION) {
        const remaining = COOLDOWN_DURATION - timeSinceDownload;
        setCooldownTime(remaining);

        // Set up countdown timer
        const interval = setInterval(() => {
          setCooldownTime((prev) => {
            if (prev <= 1000) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1000;
          });
        }, 1000);

        return () => clearInterval(interval);
      }
    }
  }, [link]);

  const handleClick = (e: React.MouseEvent) => {
    if (link === "donation") {
      e.preventDefault();
      openModal("donation");
      return;
    } else {
      if (isDownloading || cooldownTime > 0) {
        e.preventDefault();
        return;
      }

      setIsDownloading(true);
      localStorage.setItem(`download_${link}`, Date.now().toString());

      // Reset downloading state after a short delay
      setTimeout(() => {
        setIsDownloading(false);
        setCooldownTime(COOLDOWN_DURATION);

        // Start countdown
        const interval = setInterval(() => {
          setCooldownTime((prev) => {
            if (prev <= 1000) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1000;
          });
        }, 1000);
      }, 1000);
    }
  };

  const getButtonText = () => {
    if (isDownloading) return "Downloading...";
    if (cooldownTime > 0) return `Wait ${Math.ceil(cooldownTime / 1000)}s`;
    return buttonText;
  };

  const isDisabled = isDownloading || cooldownTime > 0;

  return (
    <div className={styles.cardWrapper}>
      <div className={styles.imageWrapper}>
        <img className={styles.cardImage} src={source} alt="card" />
        {soon && (
          <div className={styles.soon}>
            <Soon />
          </div>
        )}
      </div>
      <a
        href={link}
        download
        className={styles.buttonWrapper}
        onClick={handleClick}
      >
        <ButtonSmall text={getButtonText()} isDisabled={isDisabled} />
        {/* <Button disabled={isDisabled} type="small" text={getButtonText()} /> */}
      </a>
    </div>
  );
};

export default Card;
