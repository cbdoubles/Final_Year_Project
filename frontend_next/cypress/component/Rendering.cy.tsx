import DeleteModal from "@/src/components/home/selectExistingProject/DeleteModal";
import { Element } from "@/src/libs/types";
import { SetStateAction } from "react";

describe("Delete Modal", () => {
  it("renders the delete modal component", () => {
    cy.mount(
      <DeleteModal
        element={{
          projectId: 0,
          projectName: "",
          graphName: "",
        }}
        deletingElement={null}
        setDeletingElement={function (
          value: SetStateAction<Element | null>
        ): void {
          throw new Error("Function not implemented.");
        }}
        setElements={function (value: SetStateAction<Element[]>): void {
          throw new Error("Function not implemented.");
        }}
        elements={[]}
      />
    );
  });
});
