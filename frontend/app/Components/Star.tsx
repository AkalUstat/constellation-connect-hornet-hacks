import React from "react";

interface StarProps {
  x: number;
  y: number;
  size: number;
  color: string;
  onClick?: () => void;
}

export default function Star({ x, y, size, color, onClick }: StarProps) {
  return (
    <div
      onClick={onClick}
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
