import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

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

export default function StarModal({
  club,
  onClose,
}: {
  club: Club | null;
  onClose: () => void;
}) {
  // Close on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {club && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 grid place-items-center bg-black/70 backdrop-blur-md"
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
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
            className="
              w-full max-w-lg mx-auto rounded-3xl 
              bg-gradient-to-br from-indigo-400/40 via-indigo-500/30 to-purple-600/20 
              ring-2 ring-indigo-400/60 shadow-[0_0_20px_5px_rgba(99,102,241,0.5)]
              p-8 backdrop-blur-xl overflow-auto max-h-[80vh] relative
              text-[color:theme('colors.solar.text.DEFAULT')]
            "
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Close"
              className="
                absolute right-3 top-3 text-xl p-2 rounded-md
                text-[color:theme('colors.solar.text.DEFAULT')]
                hover:bg-white/10 transition
              "
            >
              ✕
            </button>

            {/* Modal content */}
            <div className="flex gap-4 items-start">
              <div
                className="w-3 h-3 mt-1.5 rounded-full shadow-[0_0_12px_rgba(156,204,255,0.6)]"
                style={{
                  background:
                    "radial-gradient(circle at 30% 30%, #fff, rgba(255,255,255,0.6) 30%, transparent 60%), #9cf",
                }}
                aria-hidden
              />
              <div className="flex-1">
                <h2
                  id="modal-title"
                  className="text-xl font-semibold text-[color:theme('colors.solar.text.DEFAULT')]"
                >
                  {club.name}
                </h2>
                <div className="text-[color:theme('colors.solar.text.secondary')] mt-1">
                  {club.category ?? "No category"}
                </div>

                <div className="flex gap-3 mt-4 flex-wrap">
                  {club.discord ? (
                    <a
                      href={club.discord}
                      target="_blank"
                      rel="noreferrer"
                      className="no-underline"
                    >
                      <button className="px-4 py-2 bg-gradient-to-r from-indigo-400 to-cyan-300 text-slate-900 rounded-md font-semibold">
                        Open Discord
                      </button>
                    </a>
                  ) : (
                    <button className="px-4 py-2 bg-transparent border border-white/10 text-[color:theme('colors.solar.text.secondary')] rounded-md">
                      No Discord
                    </button>
                  )}

                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-transparent border border-white/10 text-[color:theme('colors.solar.text.secondary')] rounded-md"
                  >
                    Close
                  </button>
                </div>

                <div className="mt-4 space-y-2 text-[color:theme('colors.solar.text.secondary')]">
                  {club.president && (
                    <p>
                      <strong>President:</strong> {club.president}
                    </p>
                  )}
                  {typeof club.members === "number" && (
                    <p>
                      <strong>Members:</strong> {club.members}
                    </p>
                  )}
                  {club.meeting_schedule && (
                    <p>
                      <strong>Meeting schedule:</strong> {club.meeting_schedule}
                    </p>
                  )}

                  {club.next_meetings?.length ? (
                    <div>
                      <strong>Upcoming meetings</strong>
                      <ul className="mt-2 list-disc list-inside">
                        {club.next_meetings.map((m, idx) => (
                          <li key={idx}>
                            {m.date}
                            {m.time && ` · ${m.time}`}
                            {m.location && ` · ${m.location}`}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {club.related?.length ? (
                    <div>
                      <strong>Related:</strong>
                      <ul className="mt-2 list-disc list-inside">
                        {club.related.map((r) => (
                          <li key={r}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
