// pages/index.tsx
import React from "react";
import Button from "../src/utils/Button";
import Image from "next/image";

export default function home() {
  return (
    // <div className="centered-column">
    <div>
      <div style={{ backgroundColor: "white", height: "70px" }}>
        <div style={{ marginLeft: "25px" }}>
          <img src={"/images/capgemini.jpg"} alt="Capgemini Logo" width={150} height={70} />
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
