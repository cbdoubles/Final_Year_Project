import React from "react";
import SelectExistingProject from "@/src/components/home/SelectExistingProject";
import StartNewProject from "@/src/components/home/StartNewProject";
import { Card, CardBody } from "@nextui-org/card";
import UIButton from "@/src/components/ui/UIButton";
import UIModal from "@/src/components/ui/UIModal";
import Header from "../components/header/Header";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  const handleSelect = () => {
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
                <UIButton data-testid="ui-button" onClick={onOpen}>
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
