import React, { useState, useEffect } from "react";
import { Element } from "@/src/libs/types";
import { fetchElements } from "@/src/utils/home/selectExistingProject/fetchProjects";
import ProjectItem from "../home/selectExistingProject/ProjectItem";

type newFavFolderProps = {};

const newFavFolder: React.FC<newFavFolderProps> = ({}) => {
  const [elements, setElements] = useState<Element[]>([]);
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [editingElement, setEditingElement] = useState<Element | null>(null);
  const [deletingElement, setDeletingElement] = useState<Element | null>(null);

  useEffect(() => {
    fetchElements(setElements);
  }, []);

  return (
    <div>
      {elements.map((element) => (
        <ProjectItem
          key={element.projectId}
          element={element}
          selectedElement={selectedElement}
          setSelectedElement={setSelectedElement}
          setElements={setElements}
          elements={elements}
          editingElement={editingElement}
          setEditingElement={setEditingElement}
          deletingElement={deletingElement}
          setDeletingElement={setDeletingElement}
        />
      ))}
    </div>
  );
};

export default newFavFolder;

// export  function newFavfolder() {
//     const router = useRouter();
//     const { projectId, projectName } = useProjectProps();

//     const handleSelect = () => {
//       console.log("Selected Project Name:", projectName);
//       console.log("Selected Project ID:", projectId);

//       router.push("/projectpage");
//     };

//     return (
//       <div className="h-[100vh] flex flex-col">
//         <Header />
//         <div className="flex w-full flex-grow items-center justify-center">
//           <Card
//             className="bg-capgemini-gray bg-opacity-90"
//             data-testid="main-card"
//           >
//             <CardBody className="grid gap-10 items-center justify-center p-10">
//               <UIModal
//                 button={({ onOpen }) => (
//                   <UIButton data-testid="ui-button" onClick={onOpen}>
//                     Select existing project
//                   </UIButton>
//                 )}
//                 header={<p className="text-primary">Select Existing project</p>}
//                 body={<SelectExistingProject></SelectExistingProject>}
//                 footer={({ onClose }) => (
//                   <>
//                     <UIButton color="danger" onClick={onClose}>
//                       Close
//                     </UIButton>
//                     <UIButton color="primary" onClick={handleSelect}>
//                       Select
//                     </UIButton>
//                   </>
//                 )}
//               ></UIModal>

//               <UIModal
//                 button={({ onOpen }) => (
//                   <UIButton onClick={onOpen}>Start new project</UIButton>
//                 )}
//                 header={<p className="text-primary">Select File</p>}
//                 body={<StartNewProject></StartNewProject>}
//               ></UIModal>
//             </CardBody>
//           </Card>
//         </div>
//       </div>
//     );
//   }

// import React, { MouseEvent } from "react";
// import SelectGroup from "@/src/components/favouriteFolder/SelectGroup";
// import { QueryFolderListType } from "@/src/libs/types";

// interface SelectProps {
//   title: string;
//   items: QueryFolderListType[];
//   type: "Default" | "Custom" | "Favorite";
//   canBeShared: boolean;
// }

// const FolderTest: React.FC<SelectProps> = ({ items, type, canBeShared }) => {
//   // Event handler
//   const handleClick = (event: MouseEvent) =>
//     console.log("clicked newitem type");

//   // Button click handler
//   const handleButtonClick = () => {
//     console.log("Select Query button clicked");
//   };

//   // Trash bin click handler
//   const handleTrashClick = (favorite: string) => {
//     console.log(`Trash bin clicked for ${favorite}`);
//   };

//   return (
//     <div>
//       {items.length === 0 ? (
//         <p>No query found</p>
//       ) : (
//         <div>
//           {items.map((item) => (
//             <SelectGroup
//               key={`select_group_${item.folder.folderId}`}
//               item={item}
//               type={type}
//               canBeShared={canBeShared}
//               handlerClick={handleClick}
//               handlerTrashClick={handleTrashClick}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default FolderTest;

// import React from "react";
// import SelectExistingProject from "@/src/components/home/SelectExistingProject";
// import StartNewProject from "@/src/components/home/StartNewProject";
// import { Card, CardBody } from "@nextui-org/card";
// import UIButton from "@/src/components/ui/UIButton";
// import UIModal from "@/src/components/ui/UIModal";
// import Header from "../components/header/Header";
// import { useRouter } from "next/router";
// import { useProjectProps } from "@/src/contexts/ProjectContext";

// export default function Home() {
//   const router = useRouter();
//   const { projectId, projectName } = useProjectProps();

//   const handleSelect = () => {
//     console.log("Selected Project Name:", projectName);
//     console.log("Selected Project ID:", projectId);
//     //Handle Select
//     router.push("/projectpage");
//   };

//   return (
//     <div className="h-[100vh] flex flex-col">
//       <Header />
//       <div className="flex w-full flex-grow items-center justify-center">
//         <Card
//           className="bg-capgemini-gray bg-opacity-90"
//           data-testid="main-card"
//         >
//           <CardBody className="grid gap-10 items-center justify-center p-10">
//             <UIModal
//               button={({ onOpen }) => (
//                 <UIButton data-testid="ui-button" onClick={onOpen}>
//                   Select existing project
//                 </UIButton>
//               )}
//               header={<p className="text-primary">Select Existing project</p>}
//               body={<SelectExistingProject></SelectExistingProject>}
//               footer={({ onClose }) => (
//                 <>
//                   <UIButton color="danger" onClick={onClose}>
//                     Close
//                   </UIButton>
//                   <UIButton color="primary" onClick={handleSelect}>
//                     Select
//                   </UIButton>
//                 </>
//               )}
//             ></UIModal>

//             <UIModal
//               button={({ onOpen }) => (
//                 <UIButton onClick={onOpen}>Start new project</UIButton>
//               )}
//               header={<p className="text-primary">Select File</p>}
//               body={<StartNewProject></StartNewProject>}
//             ></UIModal>
//           </CardBody>
//         </Card>
//       </div>
//     </div>
//   );
// }

// <UIModal
//               button={({ onOpen }) => (
//                 <UIButton data-testid="ui-button" onClick={onOpen}>
//                   Select existing project
//                 </UIButton>
//               )}
//               header={<p className="text-primary">Select Existing project</p>}
//               body={<SelectExistingProject></SelectExistingProject>}
//               footer={({ onClose }) => (
//                 <>
//                   <UIButton color="danger" onClick={onClose}>
//                     Close
//                   </UIButton>
//                   <UIButton color="primary" onClick={handleSelect}>
//                     Select
//                   </UIButton>
//                 </>
//               )}
//             ></UIModal>
