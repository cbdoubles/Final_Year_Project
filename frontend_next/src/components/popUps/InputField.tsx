import { Textarea } from "@nextui-org/react";
import React, { ChangeEventHandler } from "react";

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
  // const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
  //   if (onChange) {
  //     onChange(e);
  //   }
  // };

  return (
    <Textarea
      {...(label ? { label } : {})}
      labelPlacement="outside"
      className="p-2 text-black text-lg w-70 max-h-xl"
      placeholder={placeholder}
      minRows={rows}
      isDisabled={readOnly}
      value={value}
      onChange={onChange}
    />
  );
};

export default InputField;
