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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        transform: "translate(-50%, -50%)",
        width: `${Math.max(size, 4)}px`,
        height: `${Math.max(size, 4)}px`,
        borderRadius: "50%",
        backgroundColor: color,
        boxShadow: `0 0 4px ${color}`,
        cursor: "pointer",
        pointerEvents: "auto",
      }}
    >
      {/* Invisible hitbox */}
      <div
        style={{
          position: "absolute",
          top: "-8px",
          left: "-8px",
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "auto",
        }}
      />
    </div>
  );
}
export default Star;