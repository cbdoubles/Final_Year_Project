import { Card, CardBody } from "@nextui-org/card";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { toast } from "react-toastify";

import Header from "../components/projectPage/header/Header";

import SelectExistingProject from "@/src/components/home/selectExistingProject/SelectExistingProject";
import StartNewProject from "@/src/components/home/StartNewProject";
import { ProjectType } from "@/src/libs/types";
import UIButton from "@/src/utils/ui/UIButton";
import UIModal from "@/src/utils/ui/UIModal";

/**
 * Home Component
 *
 * @description
 * This component renders the home page with options to select an existing project or start a new project.
 * It includes modals for selecting projects and starting new projects, and handles navigation to the project page.
 *
 * @returns {JSX.Element} The rendered home page component.
 */
export default function Home() {
  const router = useRouter();
  const [selectedElement, setSelectedElement] = useState<ProjectType | null>(
    null
  );

  /**
   * Handle project selection
   *
   * @description
   * Navigates to the project page if a project is selected, otherwise shows an error toast.
   */
  const handleSelect = () => {
    if (selectedElement) {
      router.push("/projectpage");
    } else {
      toast.error("No project selected");
    }
  };

  /**
   * Render the component
   *
   * @description
   * Renders the home page with a header, and two main options: select an existing project or start a new project.
   * Each option is wrapped in a modal for further actions.
   *
   * @returns {JSX.Element} The rendered home page component.
   */
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
              body={
                <SelectExistingProject
                  selectedElement={selectedElement}
                  setSelectedElement={setSelectedElement}
                />
              }
              button={({ onOpen }) => (
                <UIButton
                  data-testid="select-exising-project-modal"
                  onClick={onOpen}
                >
                  Select existing project
                </UIButton>
              )}
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
              header={<p className="text-primary">Select Existing project</p>}
            ></UIModal>

            <UIModal
              button={({ onOpen }) => (
                <UIButton onClick={onOpen}>Start new project</UIButton>
              )}
              body={<StartNewProject></StartNewProject>}
              header={<p className="text-primary">Select File</p>}
            ></UIModal>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
