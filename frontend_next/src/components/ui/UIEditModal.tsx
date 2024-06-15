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
import React from "react";

type UIModalProps = {
  button: ({ onOpen }: { onOpen: () => void }) => ReactNode;
  header?: ReactNode;
  body: ReactNode; // Update type to ReactNode
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
              <ModalHeader data-testid="modal-header">
                {header}
              </ModalHeader>
              <Divider />
            </>
          )}
          <ModalBody className={`${bodyNoPadding && "p-0"}`}>
            {React.isValidElement(body) ? (
              React.cloneElement(body as React.ReactElement, {
                // Ensure props are passed to the body element
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  if (typeof (body as React.ReactElement).props.onChange === 'function') {
                    (body as React.ReactElement).props.onChange(e);
                  }
                },
                value: (body as React.ReactElement).props.value,
              })
            ) : (
              body // Render body as is if it's not a React element
            )}
          </ModalBody>
          {footer && <ModalFooter>{footer({ onClose })}</ModalFooter>}
        </ModalContent>
      </Modal>
    </>
  );
};

export default UIModal;