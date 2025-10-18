//Individual clickable star component
import React from "react";

interface StarProps {
  // Props for the Star component
  size?: number; // Size of the star in px
  color?: string; // Color of the star
  onClick?: () => void; // Click handler
  // Position as percentage of parent container (0 - 100)
  x?: number;
  y?: number;
}

const Star: React.FC<StarProps> = ({
  size = 5,
  color = "yellow",
  onClick,
  x = 0,
  y = 0,
}) => {
  // The star is absolutely positioned inside a relative container
  return (
    <div
      onClick={onClick}
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        transform: "translate(-50%, -50%)",
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius: "50%",
        boxShadow: `0 0 ${Math.max(1, size / 2)}px ${color}`,
        cursor: onClick ? "pointer" : "default",
        transition: "transform 120ms ease, box-shadow 120ms ease, opacity 200ms",
        opacity: 0.95,
      }}
    />
  );
};

export default Star; // Exporting the Star component