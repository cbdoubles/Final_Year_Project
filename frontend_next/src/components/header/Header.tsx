// pages/index.tsx
import React from "react"
import Link from "next/link"
import Image from "next/image"
import CapGemini from "../public/images/capgemini.jpg"
import Background from "../public/images/background.jpg"

const Header = () => (
  <div
    style={{
      backgroundColor: "white",
      height: "70px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 25px",
      borderBottom: "1px solid #ccc" // optional: for visual separation
    }}
  >
    <Link href="/" legacyBehavior>
      <a>
        <img
          src={"/images/blackminiNG.png"}
          alt="Capgemini Logo"
          width={200}
          height={300}
          style={{ cursor: "pointer" }}
        />
      </a>
    </Link>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        backgroundColor: "lightgray",
        padding: "20px",
        borderRadius: "10px",
        width: "200px",
        height: "60px"
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: "15px",
          color: "black"
        }}
      >
        Project:
      </p>
      <p
        style={{
          margin: 0,
          fontSize: "15px",
          color: "black"
        }}
      >
        Graph File:
      </p>
    </div>
  </div>
)

export default function HeaderFunct() {
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
        }
      `}</style>
    </div>
  )
}
