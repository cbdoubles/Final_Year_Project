import React from "react"
import InputField from "@/src/components/popUps/InputField"

type CustomPopUpProps = {
  fav?: boolean
}

const CustomPopUp: React.FC<CustomPopUpProps> = ({
  fav,
}) => {
  return (
  <div>
<InputField rows={4} label="Query name" placeholder="Type here" />
      <InputField readOnly={fav ? true : false}
        rows={4}
        label="Cyphertext representation"
        placeholder="Type here"
      />
      <InputField readOnly={fav ? true : false}
        rows={4}
        label="Natural language representation"
        placeholder="Type here"
      />
    </div>
  )
}
export default CustomPopUp
