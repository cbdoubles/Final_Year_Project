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
          <Image src={CapGemini} alt="Capgemini Logo" width={150} height={70} />
        </div>
      </div>

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
            height: "60vh",
            width: "50vh",
            backgroundColor: "rgba(173, 216, 230, 0.85)",
            color: "white",
            margin: "auto",
            borderRadius: "20px",
          }}
        >
          <button
            style={{
              marginBottom: "50px",
              backgroundColor: "#0077C8",
              color: "white",
              width: "300px",
              height: "100px",
              border: "none",
              borderRadius: "20px",
              fontSize: "30px",
            }}
          >
            <strong>Existing Project </strong>
          </button>
          
          <button
            style={{
              backgroundColor: "#0077C8",
              color: "white",
              width: "300px",
              height: "100px",
              border: "none",
              borderRadius: "20px",
              fontSize: "30px",
            }}
          >
            <strong> New Project </strong>
          </button>
        </div>
      </div>
    </div>
  );
}
