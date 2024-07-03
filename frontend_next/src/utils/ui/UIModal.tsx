import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Divider,
} from "@nextui-org/react";
import React, { ReactNode, FC } from "react";

type UIModalProps = {
  button: ({ onOpen }: { onOpen: () => void }) => ReactNode;
  header?: ReactNode;
  body: ReactNode;
  footer?: ({ onClose }: { onClose: () => void }) => ReactNode;
  bodyNoPadding?: boolean;
};

const UIModal: FC<UIModalProps> = ({
  button,
  header,
  body,
  footer,
  bodyNoPadding = false,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {button({ onOpen })}
      <Modal isOpen={isOpen} size="5xl" onClose={onClose}>
        <ModalContent>
          {header && (
            <>
              <ModalHeader className="flex flex-col" data-testid="modal-header">
                {header}
              </ModalHeader>
              <Divider></Divider>
            </>
          )}
          <ModalBody className={`${bodyNoPadding && "p-0"}`}>{body}</ModalBody>
          {footer && <ModalFooter>{footer({ onClose })}</ModalFooter>}
        </ModalContent>
      </Modal>
    </>
  );
};

export default UIModal;
