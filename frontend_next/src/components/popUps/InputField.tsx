import { Textarea } from "@nextui-org/react"
import React from "react"

type QueryInputProps = {
  label?: string
  placeholder: string
  rows: number
}

const InputField: React.FC<QueryInputProps> = ({
  placeholder,
  label,
  rows
}) => {
  return (
    <Textarea
      {...(label ? { label } : {})}
      labelPlacement="outside"
      className="p-2 text-black text-lg w-70 max-h-xl"
      placeholder={placeholder}
      minRows={rows}
    />
  )
}

export default InputField
