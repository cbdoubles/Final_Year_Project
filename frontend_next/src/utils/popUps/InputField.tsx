import { Textarea } from "@nextui-org/react";
import React from "react";

type QueryInputProps = {
  label?: string;
  placeholder?: string;
  rows: number;
  readOnly?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

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
