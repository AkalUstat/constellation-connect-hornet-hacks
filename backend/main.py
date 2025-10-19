import os, json
from pathlib import Path
from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
from openai import BadRequestError, APIStatusError

app = Flask(__name__)
CORS(app)

# OpenAI
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
MODEL = os.getenv("OPENAI_MODEL", "gpt-4o")  # pick a sane default that exists

# Models that DO NOT support temperature / top_p
REASONING_PREFIXES = ("o3", "o4-mini-high")  # extend if needed

def is_reasoning_model(model: str) -> bool:
    return any(model.startswith(p) for p in REASONING_PREFIXES)

# Data
DATA_PATH = Path(__file__).parent / "data" / "clubs.json"
if DATA_PATH.exists():
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        RAW_CLUBS = json.load(f)
else:
    RAW_CLUBS = []

def normalize_club(c: dict) -> dict:
    return {
        "name": c.get("name") or "Unnamed Club",
        "category": c.get("category") or "",
        "related": c.get("related") or [],
        "tags": c.get("tags") or [],               # ensure present
        "discord": c.get("discord"),
        "president": c.get("president"),
        "members": c.get("members"),
        "meeting_schedule": c.get("meeting_schedule"),
        "next_meetings": c.get("next_meetings") or [],
    }

CLUBS = [normalize_club(c) for c in RAW_CLUBS]

def clubs_as_context() -> str:
    """Compact directory text using only the fields you have."""
    rows = []
    for c in CLUBS:
        rows.append(
            "Name: {name}; Category: {cat}; Related: {rel}; Members: {memb}; "
            "Meetings: {meet}; Discord: {disc}; President: {pres}".format(
                name=c["name"],
                cat=(c["category"] or "n/a"),
                rel=(", ".join(c["related"]) if c["related"] else "—"),
                memb=(c["members"] if c["members"] is not None else "unknown"),
                meet=(c["meeting_schedule"] or "n/a"),
                disc=(c["discord"] or "n/a"),
                pres=(c["president"] or "n/a"),
            )
        )
    return "\n".join(rows[:200])  # keep prompt compact

@app.get("/api/health")
def health():
    return {"ok": True, "clubs_loaded": len(CLUBS), "model": MODEL}

@app.get("/")
def home():
    return {"status": "Mission Control online 🛰️"}

def score(club: dict, text: str) -> int:
    """Very simple v1 relevance score via word overlap."""
    user_words = set(w.lower() for w in text.split())
    parts = set(
        [club["name"].lower()]
        + ([club["category"].lower()] if club["category"] else [])
        + [r.lower() for r in (club.get("related") or [])]
        + [t.lower() for t in (club.get("tags") or [])]
    )
    return sum(any(u in p for u in user_words) for p in parts)

@app.post("/api/chat")
def chat():
    data = request.get_json(force=True) or {}
    user_message = (data.get("message") or "").strip()
    if not user_message:
        return jsonify({"error": "Missing 'message' in request."}), 400

    system_prompt = (
        "You are Mission Control, a friendly assistant helping students find campus clubs. "
        "Use ONLY the provided club directory for factual answers. "
        "If you're unsure, say so. If the user shares interests, recommend up to 3 clubs."
    )

    context = f"CLUB DIRECTORY:\n{clubs_as_context()}"

    # Build params depending on model capabilities
    params = {
        "model": MODEL,
        "input": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"{context}\n\nUser: {user_message}"},
        ],
        "max_output_tokens": 1024,  # preferred for Responses API
    }
    if not is_reasoning_model(MODEL):
        # only non-reasoning models accept temperature/top_p
        params.update({
            "top_p": 1.0,
        })

    try:
        resp = client.responses.create(**params)
        reply_text = resp.output_text
    except BadRequestError as e:
        # expose as 400 so the frontend sees the real error
        return jsonify({"error": str(e), "model": MODEL}), 400
    except APIStatusError as e:
        # upstream/server errors from OpenAI
        return jsonify({"error": f"Upstream error {e.status_code}: {e}", "model": MODEL}), 502
    except Exception as e:
        app.logger.exception("chat handler failed")
        return jsonify({"error": "Server error"}), 500

    # Top-3 naive recommendations
    ranked = sorted(CLUBS, key=lambda c: score(c, user_message), reverse=True)[:3]

    return jsonify({
        "reply": reply_text,
        "recommendations": ranked
    })

if __name__ == "__main__":
    # keep :5001 if your Vite proxy forwards /api/* → http://localhost:5001
    app.run(host="0.0.0.0", port=5001, debug=True)