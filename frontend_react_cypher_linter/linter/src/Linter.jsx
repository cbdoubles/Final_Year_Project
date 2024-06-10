import { CypherEditor } from "@neo4j-cypher/react-codemirror";
import React, { useState, useEffect, useRef } from "react";

const Linter = () => {
  const cypherEditorRef = useRef();
  const [editorValue, setEditorValue] = useState("");
  const editorProps = {
    lint: true,
    autocompleteOpen: true,
    value: editorValue,
  };

  useEffect(() => {
    if (cypherEditorRef.current) {
      const editor = cypherEditorRef.current;
      console.log(editor.editorRef);
      console.log(editor);
    }
  }, [cypherEditorRef]);

  const handleEditorChange = (newValue) => {
    console.log("New value:", newValue);
    setEditorValue(newValue);
  };

  return (
      <CypherEditor
       style={{
         width: "99%",
         height: "50vh", 
         fontSize: "0.75rem", 
         border: "2px solid #D1D5DB", 
         borderRadius: "0.375rem", 
         backgroundColor: "white",
         position: "relative",
         overflow: "auto",
       }}
        ref={cypherEditorRef}
        onValueChanged={handleEditorChange}
        {...editorProps}
      />
  );
};

export default Linter;

