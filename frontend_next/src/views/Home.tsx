import React from "react";
import SelectExistingProject from "@/src/components/home/selectExistingProject/SelectExistingProject";
import StartNewProject from "@/src/components/home/StartNewProject";
import { Card, CardBody } from "@nextui-org/card";
import UIButton from "@/src/utils/ui/UIButton";
import UIModal from "@/src/utils/ui/UIModal";
import Header from "../components/projectPage/header/Header";
import { useRouter } from "next/router";
import { useProjectProps } from "@/src/contexts/ProjectContext";

export default function Home() {
  const router = useRouter();
  const { projectId, projectName, graphName } = useProjectProps();

  const handleSelect = () => {
    console.log("Selected Project Name:", projectName);
    console.log("Selected Project ID:", projectId);
    console.log("Selected graph name", graphName);
    //Handle Select
    router.push("/projectpage");
  };

  return (
    <div className="h-[100vh] flex flex-col">
      <Header />
      <div className="flex w-full flex-grow items-center justify-center">
        <Card
          className="bg-capgemini-gray bg-opacity-90"
          data-testid="main-card"
        >
          <CardBody className="grid gap-10 items-center justify-center p-10">
            <UIModal
              button={({ onOpen }) => (
                <UIButton
                  data-testid="select-exising-project-modal"
                  onClick={onOpen}
                >
                  Select existing project
                </UIButton>
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

            <UIModal
              button={({ onOpen }) => (
                <UIButton onClick={onOpen}>Start new project</UIButton>
              )}
              header={<p className="text-primary">Select File</p>}
              body={<StartNewProject></StartNewProject>}
            ></UIModal>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
