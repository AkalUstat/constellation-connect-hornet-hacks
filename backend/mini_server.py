# mini_server.py
from flask import Flask, request, jsonify
app = Flask(__name__)

@app.post("/api/chat")
def chat():
    data = request.get_json(silent=True) or {}
    msg = data.get("message", "")
    return jsonify({"reply": f"You said: {msg}", "recommendations": []})

if __name__ == "__main__":
    # 0.0.0.0 lets it accept connections from the host/browser too
    app.run(host="0.0.0.0", port=5001, debug=True)