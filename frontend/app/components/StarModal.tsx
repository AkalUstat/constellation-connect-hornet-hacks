import React from "react";

type Club = {
  name: string;
  category?: string | null;
  related?: string[];
  discord?: string | null;
  president?: string | null;
};

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
};

const modalStyle: React.CSSProperties = {
  background: "#0b1220",
  color: "#fff",
  borderRadius: 8,
  padding: 20,
  maxWidth: 520,
  width: "90%",
  boxShadow: "0 8px 30px rgba(0,0,0,0.6)",
};

export default function StarModal({
  club,
  onClose,
}: {
  club: Club;
  onClose: () => void;
}) {
  if (!club) return null;

  return (
    <div style={overlayStyle} role="dialog" aria-modal="true">
      <div style={modalStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0 }}>{club.name}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: "transparent",
              color: "#fff",
              border: "none",
              fontSize: 20,
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>

        <p style={{ opacity: 0.9 }}>{club.category ?? "No category"}</p>

        {club.president && (
          <p style={{ marginTop: 8 }}>
            <strong>President:</strong> {club.president}
          </p>
        )}

        {club.discord && (
          <p style={{ marginTop: 8 }}>
            <strong>Discord:</strong>{" "}
            <a href={club.discord} target="_blank" rel="noreferrer" style={{ color: "#9cf" }}>
              {club.discord}
            </a>
          </p>
        )}

        {club.related && club.related.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <strong>Related:</strong>
            <ul style={{ marginTop: 6 }}>
              {club.related.map((r) => (
                <li key={r} style={{ color: "#ddd" }}>
                  {r}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
          <button
            onClick={onClose}
            style={{
              padding: "8px 12px",
              background: "#1e293b",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
