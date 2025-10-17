import { useEffect, useRef, useState } from "react";
import clubsData from "../data/clubs.json"; // adjust the path if needed

export default function ModalStarFab() {
  const [open, setOpen] = useState(false);
  const [clubName] = useState("Order of the Engineer"); // example variable
  const overlayRef = useRef<HTMLDivElement | null>(null);

  const club = clubsData.find((c) => c.name === clubName);
  const category = club ? club.category : "Unknown Category";
  const discord = club ? club.discord : "Unknown Discord";
  const president = club ? club.president : "Unknown President";

  // Close on ESC
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
        className={[
          "fixed bottom-6 right-6 z-50 rounded-full p-4",
          "bg-indigo-500/20 ring-1 ring-indigo-300/40 backdrop-blur-md",
          "shadow-[0_0_40px_8px_rgba(99,102,241,0.35)]",
          "hover:bg-indigo-500/30 hover:shadow-[0_0_60px_18px_rgba(99,102,241,0.45)]",
          "active:scale-95 transition-all duration-200",
        ].join(" ")}
      >
        {/* Star icon */}
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
          <path d="M12 2.5l2.79 6.35 6.96.54-5.29 4.5 1.68 6.81L12 16.9l-6.14 3.8 1.68-6.81-5.29-4.5 6.96-.54L12 2.5z" />
        </svg>
      </button>

      {/* Modal */}
      {open && (
        <div
          ref={overlayRef}
          role="presentation"
          className="fixed inset-0 z-40 grid place-items-center bg-black/60 backdrop-blur-sm"
          tabIndex={0}
          onClick={() => setOpen(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="w-full max-w-md mx-auto rounded-2xl bg-neutral-900 ring-1 ring-white/10 shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <h2 id="modal-title" className="text-xl font-medium tracking-tight">
                {clubName}
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="ml-4 inline-flex items-center rounded-xl px-3 py-1.5 text-sm bg-white/10 hover:bg-white/15 ring-1 ring-white/10"
              >
                Close
              </button>
            </div>
            <p className="mt-3 text-neutral-400 text-sm">
                <p><strong>Category:</strong> {category}</p>
                <p><strong>Discord:</strong> {discord}</p>
                <p><strong>President:</strong> {president}</p>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
