import { useModal } from "@/providers/ModalProvider.tsx";
import { Modal } from "@/components/ui/Modal";
import { ConnectionModal } from "@/components/ui/modals/ConnectionModal/ConnectionModal";
import { DonationModal } from "@/components/ui/modals/DonationModal/DonationModal";
import { CompleteModal } from "@/components/ui/modals/CompleteModal";
import { CalculateModal } from "../modals/ClaculateModal/CalculateModal";
import { StatusModal } from "../modals/StatusModal/StatusModal";

export const ModalContainer = (props: Record<string, unknown>) => {
  const { activeModal, closeModal } = useModal();

  const modals = {
    custom: <div>{props.element as React.ReactNode}</div>,
    connection: <ConnectionModal />,
    donation: <DonationModal />,
    complete: <CompleteModal />,
    calculation: <CalculateModal />,
    status: <StatusModal status={props.status as "success" | "error"} />,
  };

  if (!activeModal) {
    return null;
  }

  return (
    <Modal
      open={!!activeModal}
      onClose={() => {
        closeModal();
      }}
    >
      {modals[activeModal as keyof typeof modals] || null}
    </Modal>
  );
};
