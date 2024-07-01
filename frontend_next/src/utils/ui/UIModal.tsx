import { ReactNode, FC } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Divider,
} from "@nextui-org/react";

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
      <Modal isOpen={isOpen} onClose={onClose} size="5xl">
        <ModalContent>
          {header && (
            <>
              <ModalHeader data-testid="modal-header" className="flex flex-col">
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
