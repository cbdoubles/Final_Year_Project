// import React, { useState } from "react";
// import { handleEditSubmit } from "@/src/utils/home/selectExistingProject/handleEditSubmit";
// import { Element } from "@/src/libs/types";
// import { useProjectProps } from "@/src/contexts/ProjectContext";

// type EditFormProps = {
//   element: Element;
//   setEditingElement: React.Dispatch<React.SetStateAction<Element | null>>;
//   setElements: React.Dispatch<React.SetStateAction<Element[]>>;
//   elements: Element[];
// };

// const EditForm: React.FC<EditFormProps> = ({
//   element,
//   setEditingElement,
//   setElements,
//   elements,
// }) => {
//   const [prevElementState] = useState<Element>(element);
//   const { setProjectName } = useProjectProps();

//   const handleEditChange = (
//     event: React.ChangeEvent<HTMLInputElement>,
//     element: Element
//   ) => {
//     const updatedElements = elements.map((el) =>
//       el.projectId === element.projectId
//         ? { ...el, projectName: event.target.value }
//         : el
//     );
//     setElements(updatedElements);
//   };

//   return (
//     <form
//       onSubmit={(event) =>
//         handleEditSubmit(
//           event,
//           element,
//           setEditingElement,
//           setElements,
//           elements,
//           prevElementState,
//           setProjectName
//         )
//       }
//     >
//       <input
//         type="text"
//         value={element.projectName}
//         onChange={(event) => handleEditChange(event, element)}
//         autoFocus
//         className="focus:outline-none"
//       />
//     </form>
//   );
// };

// export default EditForm;

import React, { useState } from "react";

type EditFormProps<T> = {
  element: T;
  setEditingElement: React.Dispatch<React.SetStateAction<T | null>>;
  setElements: React.Dispatch<React.SetStateAction<T[]>>;
  elements: T[];
  onEditSubmit: (
    event: React.FormEvent,
    element: T,
    setEditingElement: React.Dispatch<React.SetStateAction<T | null>>,
    setElements: React.Dispatch<React.SetStateAction<T[]>>,
    elements: T[],
    prevStateElement: T,
    setProjectName: React.Dispatch<string>
  ) => void;
  propertyKey: keyof T;
  propertyName: keyof T;
  getPropertyValue: (element: T) => number;
  renderElementName: (element: T) => string;
};

function EditForm<T>({
  element,
  setEditingElement,
  setElements,
  elements,
  onEditSubmit,
  propertyKey,
  propertyName,
  getPropertyValue,
  renderElementName,
}: EditFormProps<T>) {
  // const [inputValue, setInputValue] = useState(renderElementName(element));

  const [prevElementState] = useState<T>(element);

  const handleEditChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    element: T
  ) => {
    // setInputValue(event.target.value);

    const updatedElements = elements.map((el) =>
      el[propertyKey] === element[propertyKey]
        ? { ...el, [propertyName]: event.target.value }
        : el
    );
    setElements(updatedElements);
  };

  return (
    <form
      onSubmit={(event) =>
        onEditSubmit(
          event,
          element,
          setEditingElement,
          setElements,
          elements,
          prevElementState,
          () => {}
        )
      }
    >
      <input
        type="text"
        value={renderElementName(element)}
        onChange={(event) => handleEditChange(event, element)}
        autoFocus
        className="focus:outline-none"
      />
    </form>
  );
}

export default EditForm;
