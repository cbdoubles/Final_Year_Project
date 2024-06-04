// pages/index.tsx
import React from "react"

const Header = () => (
  <div className="relative">
    <div
      className="absolute inset-0 z-0 bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.3)), url(/images/background.jpg)`
      }}
    ></div>
    <div className="flex items-center justify-between z-10 relative">
      <img
        src={"/images/blackminiNG.png"}
        alt="Capgemini Logo"
        className="w-40 h-full"
      />
      <div className="flex flex-col items-start bg-gray-200 p-5 rounded-lg w-80 h-20 mr-[-2px]">
        <p className="m-0 text-base text-black ml-[-10px] mt-[-10px]">
          Project:
        </p>
        <p className="m-0 text-base text-black ml-[-10px] mt-[10px] ">
          Graph File:
        </p>
      </div>
    </div>
  </div>
)

export default function Home() {
  return (
    <div>
      <Header />
      <style jsx global>{`
        body {
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center;
          background-attachment: fixed;
          color: white;
      `}</style>
    </div>
  )
}
