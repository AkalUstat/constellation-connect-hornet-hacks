import React, { useState } from "react";

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
  const [recs, setRecs] = useState<Club[]>([]);

  async function send() {
    if (!input.trim()) return;
    const userText = input.trim();
    setInput("");
    try {
      const res = await fetch("api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });
      const data = await res.json();

      if (Array.isArray(data.recommendations)) {
        setRecs(data.recommendations as Club[]);
      }
    } catch {
      console.error("Error fetching club data");
    }
  }

  return (
    <div className="max-w-xl mx-auto p-4 rounded-2xl bg-black/60 text-slate-100 border border-white/10">
      <div className="text-lg font-semibold mb-2">🛰️ Mission Control</div>

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
                  <div className="font-medium text-base">
                    {r.name}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
    </div>
  );
}
