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
    <div>
      <h1>Cypher Editor</h1>
      <CypherEditor
        ref={cypherEditorRef}
        onValueChanged={handleEditorChange}
        {...editorProps}
      />
    </div>
  );
};

export default Linter;
