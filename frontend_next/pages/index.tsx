// pages/index.tsx
import React from "react";
import Button from "../src/utils/Button";
import Image from "next/image";
import CapGemini from "../public/images/capgemini.jpg";

export default function home() {
  return (
    // <div className="centered-column">
    <div>
      <div style={{ backgroundColor: "white", height: "70px" }}>
        <div style={{ marginLeft: "25px" }}>
          <Image src={CapGemini} alt="Capgemini Logo" width={130} height={70} />
        </div>
      </div>

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

      <div
        style={{
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
            height: "40vh",
            width: "40vh",
            backgroundColor: "#ADD8E6",
            color: "white",
            margin: "auto",
            borderRadius: "20px",
          }}
        >
          <button
            style={{
              marginBottom: "20px",
              backgroundColor: "#0077C8",
              color: "white",
              width: "300px",
              height: "60px",
              border: "none",
              borderRadius: "20px",
            }}
          >
            <strong>Existing Project </strong>
          </button>
          <button
            style={{
              backgroundColor: "#0077C8",
              color: "white",
              width: "300px",
              height: "60px",
              border: "none",
              borderRadius: "20px",
            }}
          >
            <strong> New Project </strong>
          </button>
        </div>
      </div>
    </div>
  );
}
