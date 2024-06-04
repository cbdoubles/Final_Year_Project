import React from "react"
import InputField from "@/src/components/popUps/InputField"

type FavouritePopUpProps = {}

const FavouritePopUp: React.FC<FavouritePopUpProps> = ({}) => {
  return (
    <div className="grid grid-col-1 bg-white">
      <InputField
        label={"Name of the query"}
        rows={8}
        placeholder="Type here"
      />
    </div>
  )
}
export default FavouritePopUp
