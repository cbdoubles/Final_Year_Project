import React from "react"

type TitleProps = {
  title?: string
}

const TitleBar: React.FC<TitleProps> = ({ title }) => {
  return (
    <div className="bg-primary-light 300 p-5 flex justify-center items-center w-full rounded">
      <h2 className="text-2xl font-bold transform scaleX-150 text-black rounded">
        {title ? title : "DOESNT WORK"}
      </h2>
    </div>
  )
}

export default TitleBar

//To chane
