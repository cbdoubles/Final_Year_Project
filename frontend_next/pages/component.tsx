// pages/index.tsx
import React from "react"
import Button from "../src/utils/Button"
import Image from "next/image"
import CapGemini from "../public/images/capgemini.jpg"
import Background from "../public/images/background.jpg"

const Header = () => (
  <div
    style={{
      backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.3)), url(/images/background.jpg)`,
      height: "70px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 25px"
    }}
  >
    <img
      src={"/images/capgemini.jpg"}
      alt="Capgemini Logo"
      width={200}
      height={300}
    />
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        backgroundColor: "grey",
        padding: "20px",
        borderRadius: "10px",
        width: "200px",
        height: "30px",
        marginRight: "-27px"
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: "15px",
          color: "black",
          marginLeft: "-10px"
        }}
      >
        Project:
      </p>
      <p
        style={{
          margin: 0,
          fontSize: "15px",
          color: "black",
          marginTop: "15px",
          marginLeft: "-10px"
        }}
      >
        Graph File:
      </p>
    </div>

    {}
  </div>
)

export default function home() {
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

          margin: 0; 
          padding: 0;
          height: 100vh; 
      `}</style>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh"
        }}
      ></div>
    </div>
  )
}
