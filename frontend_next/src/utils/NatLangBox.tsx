import React from "react";
import { Card, Input } from "@nextui-org/react";

interface NatLangBoxProps {
  dataArray: string[];
  inputValues: Record<string, string>;
  onInputChange: (placeholder: string, value: string) => void;
}

const NatLangBox: React.FC<NatLangBoxProps> = ({
  dataArray,
  inputValues,
  onInputChange,
}) => {
  return (
    <Card className="justify-center p-4 rounded-lg w-full mb-2">
      <div className="w-full break-all">
        {dataArray.map((item, index) => {
          if (item.startsWith("$") && item.endsWith("$")) {
            const placeholder = item; //.slice(1, -1) // remove the $ characters
            return (
              <span
                key={index}
                style={{
                  width: 30 + placeholder.length * 8 + "px",
                }}
                className="inline-flex"
              >
                <Input
                  placeholder={placeholder}
                  value={inputValues[placeholder] || ""}
                  onChange={(e) => onInputChange(placeholder, e.target.value)}
                  className="w-full m-2"
                  title={placeholder}
                />
              </span>
            );
          } else {
            return <span key={index}>{item}</span>;
          }
        })}
      </div>
    </Card>
  );
};

export default NatLangBox;
