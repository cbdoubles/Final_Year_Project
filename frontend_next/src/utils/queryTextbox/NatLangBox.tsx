import { Card, Input } from "@nextui-org/react";
import React, { useEffect, useMemo } from "react";

// Define interface for component props
interface NatLangBoxProps {
  dataArray: string;
  inputValues: Record<string, string>;
  onInputChange: (placeholder: string, value: string) => void;
  onCheckValueChange: (checkValue: number) => void;
  readOnly?: boolean;
}

/**
 * NatLangBox Component
 *
 * @description
 * This component displays a natural language box that contains text with placeholders. Users can input values
 * into the placeholders, and the component handles updates and validations. The component can be read-only.
 *
 * @props
 * @param {string} dataArray - The natural language data string with placeholders.
 * @param {Record<string, string>} inputValues - A record of input values keyed by placeholders.
 * @param {(placeholder: string, value: string) => void} onInputChange - Callback for when an input value changes.
 * @param {(checkValue: number) => void} onCheckValueChange - Callback for when the number of check values changes.
 * @param {boolean} [readOnly] - Determines if the inputs are read-only.
 *
 * @state
 * @typedef {Object} data - An object containing the parts of the dataArray and indices of placeholders.
 * @typedef {number} data.check - The number of placeholders found in the dataArray.
 * @typedef {string[]} data.parts - The split parts of the dataArray.
 * @typedef {number[]} data.indices - The indices of the parts that are placeholders.
 */
const NatLangBox: React.FC<NatLangBoxProps> = ({
  dataArray,
  inputValues,
  readOnly,
  onInputChange,
  onCheckValueChange,
}) => {
  /**
   * Parse and split the dataArray into parts and find indices of placeholders
   *
   * @description
   * Uses a regular expression to identify and split the dataArray into parts. It also counts the number of placeholders
   * and finds their indices for later rendering.
   *
   * @memoized
   * The data parsing and splitting is memoized to optimize performance and prevent unnecessary re-renders.
   */
  const data = useMemo(() => {
    // Regular expression to match " $" followed by anything until "}"
    const regex = /(\$\w+\{[^}]*\})/g;
    let parts = dataArray.split(regex);
    let indices: number[] = [];
    let check = 0;
    // Iterate over the parts and find the indices of the matched patterns
    parts.forEach((part, index) => {
      if (regex.test(part)) {
        indices.push(index);
        check++;
      }
    });
    return {
      check: check,
      parts: parts,
      indices: indices,
    };
  }, [dataArray]);

  /**
   * Effect to update the check value when data.check changes
   *
   * @description
   * Calls the onCheckValueChange callback with the updated number of placeholders.
   */
  useEffect(() => {
    onCheckValueChange(data.check); // Call the function with the check value
  }, [data.check, onCheckValueChange]);

  /**
   * Render the component
   *
   * @description
   * Renders the natural language box with placeholders replaced by input fields. If read-only, inputs are disabled.
   */
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
                  className="w-full m-2"
                  placeholder={placeholder}
                  readOnly={readOnly}
                  title={placeholder}
                  value={inputValues[placeholder] || ""}
                  onChange={(e) => onInputChange(placeholder, e.target.value)}
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
