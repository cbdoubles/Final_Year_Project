import React from "react"
import { Textarea } from "@nextui-org/react"

type QueryInputProps = {
  defaultValue: string
}

const NaturalLanguage: React.FC<QueryInputProps> = ({ defaultValue }) => {
  return (
    <div>
      <h3 className="mb-2 text-black font-bold">NATURAL LANGUAGE QUERY</h3>
      <Textarea
        className="border-2 border-gray-300 p-2 text-black text-lg h-20 w-1/2"
        defaultValue={defaultValue}
      />
    </div>
  )
}

export default NaturalLanguage

//Good?
