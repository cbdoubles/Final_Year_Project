import React, { useState } from "react";
import QueryIconButton from "./QueryIconButton";
import UIModal from "@/src/components/ui/UIModal";
import UIButton from "@/src/components/ui/UIButton";
import { useProjectProps } from "@/src/contexts/ProjectContext";
import SelectQueryFolder from "@/components/favouriteFolder/SelectQueryFolder";

interface SelectProps {
  collapsed?: boolean;
  type: "Default" | "Custom" | "Favorite";
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const QueryIcon: React.FC<SelectProps> = ({ collapsed, type, icon: Icon }) => {
  const [secondModalOpen, setSecondModalOpen] = useState(false);
  const { projectId } = useProjectProps();

  const handleFolderSelect = () => {
    setSecondModalOpen(true);
  };

  const handleCloseSecondModal = () => {
    setSecondModalOpen(false);
  };

  // Button click handler
  const handleButtonClick = (onCloseFirstModal: () => void) => {
    console.log("Select folder button clicked");
    handleFolderSelect();
    onCloseFirstModal(); // Close the first modal
  };

  return (
    <>
      <UIModal
        button={({ onOpen }) => (
          <QueryIconButton
            handleClick={() => {
              onOpen();
            }}
            collapsed={collapsed}
            type={type}
            icon={Icon}
          />
        )}
        header={
          <>
            <span className="text-primary">Select a folder</span>
            <span className="text-sm text-gray-400 font-light leading-none">
              {type}
            </span>
          </>
        }
        body={<SelectQueryFolder projectId={projectId} type={type} />}
        footer={({ onClose }) => (
          <UIButton onClick={() => handleButtonClick(onClose)}>
            Select folder
          </UIButton>
        )}
        bodyNoPadding
      />

      {secondModalOpen && (
        <UIModal
          button={() => <></>}
          header={
            <>
              <span className="text-primary">Select a query</span>
            </>
          }
          body={<SelectQueryFolder projectId={projectId} type={"Custom"} />}
          footer={({ onClose }) => (
            <UIButton
              onClick={() => {
                onClose();
                handleCloseSecondModal();
              }}
            >
              Close
            </UIButton>
          )}
          bodyNoPadding
        />
      )}
    </>
  );
};

export default QueryIcon;
