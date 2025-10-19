import React, { useState } from "react";

// Matches the backend /api/chat response shape in main.py
// reply: string
// recommendations: Array of normalized club objects
export type Club = {
  name: string;
  category?: string | null;
  related?: string[] | null;
  discord?: string | null;
  president?: string | null;
  members?: number | string | null;
  meeting_schedule?: string | null;
  next_meetings?: string[] | null;
};

export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "bot"; text: string }[]>([]);
  const [recs, setRecs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!input.trim()) return;
    const userText = input.trim();
    setMessages((m) => [...m, { role: "user", text: userText }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });
      const data = await res.json();

      if (data.error) {
        setMessages((m) => [...m, { role: "bot", text: String(data.error) }]);
      } else {
        if (data.reply) setMessages((m) => [...m, { role: "bot", text: String(data.reply) }]);
        if (Array.isArray(data.recommendations)) setRecs(data.recommendations as Club[]);
      }
    } catch {
      setMessages((m) => [...m, { role: "bot", text: "Sorry—something went wrong." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-4 rounded-2xl bg-black/60 text-slate-100 border border-white/10">
      <div className="text-lg font-semibold mb-2">🛰️ Mission Control</div>

      <div className="space-y-2 max-h-72 overflow-y-auto mb-3">
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
            <div
              className={`inline-block px-3 py-2 rounded-2xl ${
                m.role === "user" ? "bg-indigo-600" : "bg-slate-800"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {loading && <div className="text-slate-400">thinking…</div>}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 rounded-xl px-3 py-2 bg-slate-900 border border-white/10"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about clubs or share your interests…"
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600" onClick={send}>
          Send
        </button>
      </div>

      {!!recs.length && (
        <div className="mt-4">
          <div className="font-semibold mb-1">Top matches</div>
          <ul className="space-y-2">
            {recs.map((r, i) => (
              <li key={i} className="p-3 rounded-xl bg-slate-800">
                <div className="font-medium text-base flex items-center justify-between gap-3">
                  <span>{r.name}</span>
                  {r.category ? (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700/70">{r.category}</span>
                  ) : null}
                </div>

                <div className="mt-1 grid gap-1 text-xs opacity-80">
                  {typeof r.members !== "undefined" && r.members !== null && (
                    <div>
                      <span className="opacity-70">Members:</span> {String(r.members)}
                    </div>
                  )}

                  {r.meeting_schedule && (
                    <div>
                      <span className="opacity-70">Meetings:</span> {r.meeting_schedule}
                    </div>
                  )}

                  {Array.isArray(r.next_meetings) && r.next_meetings.length > 0 && (
                    <div>
                      <span className="opacity-70">Next:</span> {r.next_meetings.join(", ")}
                    </div>
                  )}

                  {Array.isArray(r.related) && r.related.length > 0 && (
                    <div>
                      <span className="opacity-70">Related:</span> {r.related.join(", ")}
                    </div>
                  )}

                  {r.president && (
                    <div>
                      <span className="opacity-70">President:</span> {r.president}
                    </div>
                  )}

                  {r.discord && (
                    <div>
                      <span className="opacity-70">Discord:</span>{" "}
                      <a
                        href={r.discord}
                        target="_blank"
                        rel="noreferrer"
                        className="underline hover:opacity-100"
                      >
                        {r.discord}
                      </a>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
