import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clubsData from "../data/clubs.json";

export default function ModalStarFab() {
  const [open, setOpen] = useState(false);
  const [clubName] = useState("Concrete Canoe Club");
  const overlayRef = useRef<HTMLDivElement | null>(null);

  const club = clubsData.find((c) => c.name === clubName);
  const name = club?.name || "Unknown Club";
  const category = club?.category || "Unknown Category";
  const president = club?.president || "Unknown President";
  const discord = club?.discord || null;
  const members = club?.members ?? "Unknown Number of Members";
  const meetingSchedule = club?.meeting_schedule || null;
  const nextMeetings = club?.next_meetings || [];

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="relative min-h-screen bg-neutral-950 text-white">
      {/* Floating glowing FAB in bottom-right */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open modal"
        className="fixed bottom-6 right-6 z-50 rounded-full p-4 bg-indigo-500/20 ring-1 ring-indigo-300/40 backdrop-blur-md shadow-[0_0_40px_8px_rgba(99,102,241,0.35)] hover:bg-indigo-500/30 hover:shadow-[0_0_60px_18px_rgba(99,102,241,0.45)] active:scale-95 transition-all duration-200"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
          <path d="M12 2.5l2.79 6.35 6.96.54-5.29 4.5 1.68 6.81L12 16.9l-6.14 3.8 1.68-6.81-5.29-4.5 6.96-.54L12 2.5z" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="overlay"
            ref={overlayRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 grid place-items-center bg-black/70 backdrop-blur-md"
            role="presentation"
            onClick={() => setOpen(false)}
          >
            <motion.div
              key="modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
              className="w-full max-w-lg mx-auto rounded-3xl bg-gradient-to-br from-indigo-400/40 via-indigo-500/30 to-purple-600/20 ring-2 ring-indigo-400/60 shadow-[0_0_80px_20px_rgba(99,102,241,0.5)] p-8 backdrop-blur-xl text-white overflow-auto max-h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between">
                <h2 id="modal-title" className="text-2xl font-semibold tracking-tight">
                  {clubName}
                </h2>
                <button
                  onClick={() => setOpen(false)}
                  className="ml-4 inline-flex items-center rounded-xl px-3 py-1.5 text-sm bg-white/10 hover:bg-white/15 ring-1 ring-white/10"
                >
                  Close
                </button>
              </div>

              <div className="mt-5 space-y-3 text-sm text-neutral-100">
                <p><strong>Name:</strong> {name}</p>
                <p><strong>Category:</strong> {category}</p>
                <p><strong>President:</strong> {president}</p>
                {discord && (
                  <p>
                    <strong>Discord:</strong>{" "}
                    <a href={discord} target="_blank" rel="noopener noreferrer" className="text-blue-300 underline">
                      {discord}
                    </a>
                  </p>
                )}
                <p><strong>Members:</strong> {members}</p>
                {meetingSchedule && <p><strong>Meeting Schedule:</strong> {meetingSchedule}</p>}

                {nextMeetings.length > 0 && (
                  <div>
                    <p className="font-semibold">Next Meetings:</p>
                    <ul className="list-disc ml-5 space-y-1">
                      {nextMeetings.map((meeting, index) => (
                        <li key={index}>
                          {meeting.date} — {meeting.time} @ {meeting.location}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}