//Individual clickable star component
import React, { useState } from "react";

interface StarProps {
  // Props for the Star component
  id?: number;
  size?: number; // Size of the star in px
  color?: string; // Color of the star
  onClick?: () => void; // Click handler
  // Position as percentage of parent container (0 - 100)
  x?: number;
  y?: number;
  // External hover handlers (used by StarMap for highlighting)
  onMouseEnter?: (e: React.MouseEvent) => void;
  onMouseLeave?: (e: React.MouseEvent) => void;
  highlighted?: boolean;
}

const Star: React.FC<StarProps> = ({
  id,
  size = 5,
  color = "yellow",
  onClick,
  x = 0,
  y = 0,
  onMouseEnter,
  onMouseLeave,
  highlighted = false,
}) => {
  // The star is absolutely positioned inside a relative container
  const [hovered, setHovered] = useState(false);

  const glowBlur = hovered || highlighted ? Math.max(6, size) : Math.max(1, size / 2);
  const scale = hovered || highlighted ? 1.18 : 1;

  return (
    <div
      data-star-id={id}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onMouseEnter={(e) => {
        setHovered(true);
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        setHovered(false);
        onMouseLeave?.(e);
      }}
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