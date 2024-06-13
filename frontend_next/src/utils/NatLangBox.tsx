import React, { useEffect, useMemo } from "react";
import { Card, Input } from "@nextui-org/react";

interface NatLangBoxProps {
  dataArray: string;
  inputValues: Record<string, string>;
  onInputChange: (placeholder: string, value: string) => void;
  onCheckValueChange: (checkValue: number) => void;
}

const NatLangBox: React.FC<NatLangBoxProps> = ({
  dataArray,
  inputValues,
  onInputChange,
  onCheckValueChange,
}) => {
  const data = useMemo(() => {
    // Regular expression to match " $" followed by anything until "}"
    const regex = /(\$\w+\{[^}]*\})/g;
    let parts = dataArray.split(regex);
    let indices: number[] = [];

    // Iterate over the parts and find the indices of the matched patterns
    parts.forEach((part, index) => {
      if (regex.test(part)) {
        indices.push(index);
      }
    });

    return {
      parts: parts,
      indices: indices,
    };
  }, [dataArray]);

  const countParts = () => data.indices.length;
  const check = countParts();

  return (
    <Card className="justify-center p-4 rounded-lg w-full mb-2">
      <div className="w-full break-all">
        {data.parts.map((item, index) => {
          if (data.indices.includes(index)) {
            const placeholder = item;
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
            return <span>{item}</span>;
          }
        })}
      </div>
    </Card>
  );
};

export default NatLangBox;
