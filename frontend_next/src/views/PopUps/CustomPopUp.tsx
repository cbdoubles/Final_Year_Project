import React from "react";
import InputField from "@/src/components/popUps/InputField";

type CustomPopUpProps = {
  fav?: boolean;
  query: string;
  setQuery: (query: string) => void;
  naturalLanguage: string;
  setNaturalLanguage: (nl: string) => void;
};

const CustomPopUp: React.FC<CustomPopUpProps> = ({
  fav,
  query,
  setQuery,
  naturalLanguage,
  setNaturalLanguage,
}) => {
  return (
    <div>
      <InputField rows={4} label="Query name" placeholder="Type here" />
      <InputField
        readOnly={fav ? true : false}
        rows={4}
        label="Cyphertext representation"
        placeholder="Type here"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <InputField
        readOnly={fav ? true : false}
        rows={4}
        label="Natural language representation"
        placeholder="Type here"
        value={naturalLanguage}
        onChange={(e) => setNaturalLanguage(e.target.value)}
      />
    </div>
  );
};
export default CustomPopUp;
