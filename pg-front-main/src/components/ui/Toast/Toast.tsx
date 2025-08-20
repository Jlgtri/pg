import React, { useEffect } from "react";
import styles from "./Toast.module.scss";
import type { ToastItem } from "@/providers/ToastProvider";

interface ToastProps {
  toast: ToastItem;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000); // auto close
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={
        toast.type === "error"
          ? `${styles.toast} ${styles.error}`
          : styles.toast
      }
    >
      {toast.message}
    </div>
  );
};
