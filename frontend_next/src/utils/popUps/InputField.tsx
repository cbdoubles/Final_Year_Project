import { Textarea } from "@nextui-org/react";
import React from "react";

// Define props for the InputField component
type QueryInputProps = {
  label?: string;
  placeholder?: string;
  rows: number;
  readOnly?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

/**
 * InputField Component
 *
 * @description
 * Renders a Textarea input field with optional label, placeholder, and event handling for value changes.
 *
 * @props
 * @param {string} [label] - Optional label for the input field.
 * @param {string} [placeholder] - Placeholder text when the input field is empty.
 * @param {number} rows - Number of visible rows in the textarea.
 * @param {boolean} [readOnly] - Flag indicating if the input field is read-only.
 * @param {string} [value] - Current value of the input field.
 * @param {(e: React.ChangeEvent<HTMLInputElement>) => void} [onChange] - Function to handle change events.
 */
const InputField: React.FC<QueryInputProps> = ({
  placeholder,
  label,
  rows,
  readOnly,
  value,
  onChange,
}) => {
  return (
    <Textarea
      {...(label ? { label } : {})}
      className="p-2 text-black text-lg w-70 max-h-xl"
      isDisabled={readOnly}
      labelPlacement="outside"
      minRows={rows}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
};

export default InputField;
