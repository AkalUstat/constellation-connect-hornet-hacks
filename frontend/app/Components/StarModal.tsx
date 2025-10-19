import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Club = {
  name: string;
  category?: string | null;
  related?: string[];
  discord?: string | null;
  president?: string | null;
  members?: number;
  meeting_schedule?: string | null;
  next_meetings?: { date: string; time?: string; location?: string }[];
};

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  background: "radial-gradient(ellipse at center, rgba(10,12,20,0.6), rgba(0,0,0,0.85))",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
  backdropFilter: "blur(4px)",
};

const modalStyle: React.CSSProperties = {
  background: "linear-gradient(180deg, rgba(6,10,20,0.95), rgba(10,14,26,0.98))",
  color: "#f8fafc",
  borderRadius: 14,
  padding: 20,
  maxWidth: 560,
  width: "92%",
  boxShadow: "0 20px 60px rgba(2,6,23,0.7), 0 0 30px rgba(137, 156, 255, 0.04)",
  border: "1px solid rgba(255,255,255,0.04)",
  position: "relative",
  overflow: "hidden",
};

const buttonPrimary: React.CSSProperties = { 
  padding: "8px 12px",
  background: "linear-gradient(90deg,#6474ff,#9cf)",
  color: "#041124",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 600,
};

const buttonGhost: React.CSSProperties = {
  padding: "8px 12px",
  background: "transparent",
  color: "#cbd5e1",
  border: "1px solid rgba(255,255,255,0.05)",
  borderRadius: 8,
  cursor: "pointer",
};

export default function StarModal({
  club,
  onClose,
}: {
  club: Club;
  onClose: () => void;
}) {
  if (!club) return null;
  const nodeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      style={overlayStyle}
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        // close when clicking outside modal content
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        ref={nodeRef}
        style={modalStyle}
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.98 }}
        transition={{ duration: 0.26, ease: [0.2, 0.9, 0.25, 1] }}
      >
        {/* top-right close icon */}
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute",
            right: 12,
            top: 12,
            background: "transparent",
            color: "#cbd5e1",
            border: "none",
            fontSize: 20,
            cursor: "pointer",
            padding: 6,
            borderRadius: 8,
            transition: "background 120ms",
          }}
        >
          ✕
        </button>

        <AnimatePresence mode="wait">
          <motion.div
            key={club.name}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.22, ease: [0.2, 0.9, 0.25, 1] }}
          >
            <div style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
              <div style={{ width: 12, height: 12, marginTop: 6 }} aria-hidden>
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 8,
                    background: "radial-gradient(circle at 30% 30%, #fff, rgba(255,255,255,0.6) 30%, transparent 60%), #9cf",
                    boxShadow: "0 0 12px rgba(156,204,255,0.6)",
                  }}
                />
              </div>

              <div style={{ flex: 1 }}>
                <h2 style={{ margin: 0, fontSize: 20 }}>{club.name}</h2>
                <div style={{ color: "#9fb4ff", marginTop: 6 }}>{club.category ?? "No category"}</div>

                <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                  {club.discord ? (
                    <a href={club.discord} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                      <button style={buttonPrimary}>Open Discord</button>
                    </a>
                  ) : (
                    <button style={buttonGhost}>No Discord</button>
                  )}

                  <button onClick={onClose} style={buttonGhost}>
                    Close
                  </button>
                </div>

                <div style={{ marginTop: 14, color: "#dbeafe" }}>
                  {club.president && (
                    <p style={{ margin: 0 }}>
                      <strong>President:</strong> {club.president}
                    </p>
                  )}

                  {typeof club.members === "number" && (
                    <p style={{ margin: "6px 0 0 0" }}>
                      <strong>Members:</strong> {club.members}
                    </p>
                  )}

                  {club.meeting_schedule && (
                    <p style={{ margin: "6px 0 0 0" }}>
                      <strong>Meeting schedule:</strong> {club.meeting_schedule}
                    </p>
                  )}

                  {club.next_meetings && club.next_meetings.length > 0 && (
                    <div style={{ marginTop: 10 }}>
                      <strong>Upcoming meetings</strong>
                      <ul style={{ marginTop: 8 }}>
                        {club.next_meetings.map((m, idx) => (
                          <li key={idx} style={{ color: "#cbd5e1" }}>
                            {m.date} {m.time ? `· ${m.time}` : ""} {m.location ? `· ${m.location}` : ""}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {club.related && club.related.length > 0 && (
                    <div style={{ marginTop: 10 }}>
                      <strong>Related:</strong>
                      <ul style={{ marginTop: 8 }}>
                        {club.related.map((r) => (
                          <li key={r} style={{ color: "#cbd5e1" }}>
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        </motion.div>
    </div>
  );
}
