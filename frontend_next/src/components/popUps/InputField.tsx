
import { Textarea } from "@nextui-org/react"
import React from "react"

type QueryInputProps = {
  label?: string
  placeholder: string
  rows: number
  readOnly?: boolean
}

const InputField: React.FC<QueryInputProps> = ({
  placeholder,
  label,
  rows,
  readOnly,
}) => {
  return (
    <Textarea
      {...(label ? { label } : {})}
      labelPlacement="outside"
      className="p-2 text-black text-lg w-70 max-h-xl"
      placeholder={placeholder}
      minRows={rows}
      isDisabled={readOnly}
    />
  )
}

export default InputField
