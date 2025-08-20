import styles from "./StatusModal.module.scss";
import cn from "classnames";
import { useModal } from "@/providers/ModalProvider";
import DonateBg from "@/images/donate.png";

export const StatusModal = ({
  status = "success",
}: {
  status: "success" | "error";
}) => {
  const { closeModal } = useModal();

  return (
    <div className={styles.wrapper}>
      <img src={DonateBg} alt="bg" className={styles.bg} />

      <div className={styles.content}>
        <div className={styles.title}>
          <h1>{status === "success" ? "success" : "SOMETHING WENT WRONG"}</h1>
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

        <div className={styles.iconWrapper}>
          <div className={styles.icon}>
            {status === "success" ? (
              <svg
                width="101"
                height="100"
                viewBox="0 0 101 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M50.4951 100C78.1093 100 100.495 77.6142 100.495 50C100.495 22.3858 78.1093 0 50.4951 0C22.8809 0 0.495117 22.3858 0.495117 50C0.495117 77.6142 22.8809 100 50.4951 100Z"
                  fill="#34C759"
                />
                <path
                  d="M45.5379 69.0735C44.4131 69.0753 43.3182 68.7114 42.4183 68.0365L42.3645 67.9945L30.6139 59.0058C29.5261 58.1592 28.8172 56.9169 28.6417 55.5498C28.4661 54.1826 28.8383 52.8015 29.6769 51.7076C30.5156 50.6136 31.7527 49.8957 33.1185 49.7102C34.4844 49.5247 35.8682 49.8868 36.9682 50.7174L44.5794 56.5543L62.5649 33.0901C62.9817 32.5458 63.5016 32.0889 64.095 31.7456C64.6884 31.4023 65.3437 31.1793 66.0233 31.0894C66.703 30.9995 67.3937 31.0444 68.0559 31.2216C68.7182 31.3987 69.3391 31.7047 69.883 32.122L69.7717 32.2769L69.8863 32.122C70.9842 32.965 71.7028 34.2093 71.8843 35.5816C72.0658 36.9539 71.6954 38.3422 70.8544 39.4417L49.6993 67.0286C49.2099 67.6641 48.5806 68.1784 47.8603 68.5316C47.1401 68.8847 46.3481 69.0672 45.5459 69.0649L45.5379 69.0735Z"
                  fill="white"
                />
              </svg>
            ) : (
              <svg
                width="101"
                height="100"
                viewBox="0 0 101 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M50.4951 100C78.1093 100 100.495 77.6142 100.495 50C100.495 22.3858 78.1093 0 50.4951 0C22.8809 0 0.495117 22.3858 0.495117 50C0.495117 77.6142 22.8809 100 50.4951 100Z"
                  fill="#FFCC00"
                />
                <path
                  d="M49.966 70.4L49.2517 70.4332C45.7392 70.7815 43 73.6793 43 77.2C43 80.7207 45.7392 83.6185 49.2517 83.9668L49.966 84H50.034C53.8812 84 57 80.9555 57 77.2C57 73.4445 53.8812 70.4 50.034 70.4H49.966ZM57 50V22.8C57 19.0445 53.8812 16 50.034 16C46.1868 16 43.068 19.0445 43.068 22.8V50C43.068 53.7555 46.1868 56.8 50.034 56.8C53.8812 56.8 57 53.7555 57 50Z"
                  fill="white"
                />
              </svg>
            )}
          </div>
        </div>

        <h2 className={styles.subtitle}>
          {status === "success"
            ? `CONGRATULATIONS, $PEGE COINS \nTRANSFERED TO YOUR WALLET, LFG!`
            : "OOPS, SOMETHING WENT WRONG, PLEASE REFRESH THE PAGE"}
        </h2>
      </div>
    </div>
  );
};
