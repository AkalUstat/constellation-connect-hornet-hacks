import React from "react";
import spaceTheme from "../Assets/GalexSpaceImage.jpg";

const StarMap = () => {
  // A simple star map component with a space-themed background
  return (
    <div
      style={{
        backgroundImage: `url(${spaceTheme})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      {/* Star map content goes here */}
    </div>
  );
};

export default StarMap; // Exporting the StarMap component
