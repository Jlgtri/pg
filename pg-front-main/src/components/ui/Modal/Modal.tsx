import ReactDOM from "react-dom";
import cn from "classnames";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@/hooks/useOutsideClick";

import styles from "./Modal.module.scss";

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  onOutsideClick?: () => void;
};

export const Modal = ({
  open,
  onClose,
  children,
  className,
  onOutsideClick,
}: ModalProps) => {
  const ref = useOutsideClick(onOutsideClick || onClose);

  const content = (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={styles.backdrop}
            onClick={onOutsideClick || onClose}
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={styles.overlay}
          >
            <div className={styles.overlay_center}>
              <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  duration: 0.3,
                }}
                className={cn(styles.modal, className)}
                ref={ref}
              >
                {children}
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return ReactDOM.createPortal(content, document.body);
};
