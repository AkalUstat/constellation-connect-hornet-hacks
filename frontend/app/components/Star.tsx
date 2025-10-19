//Individual clickable star component
import React, { useState } from "react";

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
  const [hovered, setHovered] = useState(false);

  const glowBlur = hovered ? Math.max(4, size) : Math.max(1, size / 2);
  const scale = hovered ? 1.15 : 1;

  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        transform: `translate(-50%, -50%) scale(${scale})`,
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius: "50%",
        boxShadow: `0 0 ${glowBlur}px ${color}`,
        cursor: onClick ? "pointer" : "default",
        transition: "transform 140ms ease, box-shadow 140ms ease, opacity 200ms",
        opacity: 0.95,
      }}
    />
  );
};

export default Star; // Exporting the Star component