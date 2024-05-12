// pages/index.tsx
import React from "react";
import Button from "../src/utils/Button";
import Image from "next/image";
import CapGemini from "../public/images/capgemini.jpg";

export default function home() {
  return (
    // <div className="centered-column">
    <div>
      <style jsx global>{`
        body {
          background-image: url(/images/background.jpg);
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center;
          background-attachment: fixed;
          color: white; 
          margin: 0; 
          padding: 0;
          height: 100vh; 
      `}</style>

      <div>
        <Image src={CapGemini} alt="Capgemini Logo" width={150} height={80} />
      </div>
      <div
      style = {{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "20vh",
            width: "20vh",
            backgroundColor: "#ADD8E6",
            color: "white",
            margin: "auto",
          }}
        >
          <button
            style={{
              marginBottom: "10px",
              backgroundColor: "#0077C8",
              color: "white",
              width: "150px",
              height: "30px",
              border: "none",
              borderRadius: "10px",
            }}
          >
            Existing Project
          </button>
          <button
            style={{
              backgroundColor: "#0077C8",
              color: "white",
              width: "150px",
              height: "30px",
              border: "none",
              borderRadius: "10px",
            }}
          >
            New Project
          </button>
        </div>
      </div>
    </div>
  );
}
