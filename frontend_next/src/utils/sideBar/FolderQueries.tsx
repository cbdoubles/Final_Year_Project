import SelectExistingProject from "@/src/components/home/SelectExistingProject";
import UIButton from "@/src/components/ui/UIButton";
import UIModal from "@/src/components/ui/UIModal";
import { useProjectProps } from "@/src/contexts/ProjectContext";
import { useRouter } from "next/router";
import React from "react";
import QueryIconButton from "./QueryIconButton";
import { Card, CardBody } from "@nextui-org/react";
import { type } from "os";

interface SelectProps {
  collapsed?: boolean;
  type: "Default" | "Custom" | "Favorite";
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const FolderQueries: React.FC<SelectProps> = ({
  collapsed,
  type,
  icon: Icon,
}) => {
  const router = useRouter();
  const { projectId, projectName } = useProjectProps();

  const handleSelect = () => {
    console.log("Selected Project Name:", projectName);
    console.log("Selected Project ID:", projectId);
    //Handle Select
    router.push("/projectpage");
  };

  return (
    <div className="flex w-full flex-grow items-center justify-center">
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
        header={<p className="text-primary">Select Existing project</p>}
        body={<SelectExistingProject></SelectExistingProject>}
        footer={({ onClose }) => (
          <>
            <UIButton color="danger" onClick={onClose}>
              Close
            </UIButton>
            <UIButton color="primary" onClick={handleSelect}>
              Select
            </UIButton>
          </>
        )}
      ></UIModal>
    </div>
  );
};

export default FolderQueries;
