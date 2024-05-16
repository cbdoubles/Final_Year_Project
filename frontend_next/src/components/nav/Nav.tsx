import React from "react"

const Nav = ({ title }: { title: string }) => {
  return (
    <div className="bg-white h-16 px-10 flex items-center justify-start">
      <div className="mr-10">
        <img
          src={"/images/capgemini.jpg"}
          alt="Capgemini Logo"
          className="h-12"
        />
      </div>
      <h1 className="text-10 text-black">{title}</h1>
    </div>
  )
}

export default Nav
