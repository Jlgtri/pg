import { useState, useEffect, useContext } from "react";

import { ModalContainer } from "@/components/ui/ModalContainer";
import { ModalContext } from "@/context/ModalContext";
import { useScrollLock } from "@/hooks/useScrollLock";

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalData, setModalData] = useState<unknown>(null);

  const openModal = (modalId: string, data?: unknown) => {
    setActiveModal(modalId);
    if (data) {
      setModalData(data);
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    setModalData(null);
  };

  const { allowScroll, blockScroll } = useScrollLock();

  useEffect(() => {
    if (activeModal) {
      blockScroll();
    } else {
      allowScroll();
    }
  }, [activeModal, allowScroll, blockScroll]);

  return (
    <ModalContext.Provider
      value={{ activeModal, modalData, openModal, closeModal }}
    >
      {children}
      <ModalContainer {...(modalData as Record<string, unknown>)} />
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used within a ModalProvider");
  return context;
};
