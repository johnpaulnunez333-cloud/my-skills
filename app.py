import os
import re
import smtplib
import sqlite3
import threading
import time
from collections import defaultdict
from email.message import EmailMessage

from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)

origins = [o.strip() for o in os.getenv("ALLOWED_ORIGINS", "*").split(",")]
CORS(app, origins=origins)

DB_PATH = os.getenv("DB_PATH", "messages.db")
ADMIN_TOKEN = os.getenv("ADMIN_TOKEN", "")

SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASS = os.getenv("SMTP_PASS", "")
NOTIFY_TO = os.getenv("NOTIFY_TO", SMTP_USER)

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
RATE_LIMIT = 5
RATE_WINDOW = 3600
_hits = defaultdict(list)
_lock = threading.Lock()


def db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    with db() as conn:
        conn.execute(
            """CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                message TEXT NOT NULL,
                ip TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )"""
        )


def client_ip():
    fwd = request.headers.get("X-Forwarded-For", "")
    return fwd.split(",")[0].strip() if fwd else request.remote_addr


def rate_limited(ip):
    now = time.time()
    with _lock:
        _hits[ip] = [t for t in _hits[ip] if now - t < RATE_WINDOW]
        if len(_hits[ip]) >= RATE_LIMIT:
            return True
        _hits[ip].append(now)
    return False


def send_email(name, email, message):
    if not (SMTP_USER and SMTP_PASS and NOTIFY_TO):
        return
    msg = EmailMessage()
    msg["Subject"] = f"Portfolio message from {name}"
    msg["From"] = SMTP_USER
    msg["To"] = NOTIFY_TO
    msg["Reply-To"] = email
    msg.set_content(f"Name: {name}\nEmail: {email}\n\n{message}")
    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=15) as s:
            s.starttls()
            s.login(SMTP_USER, SMTP_PASS)
            s.send_message(msg)
    except Exception as exc:
        app.logger.error("Email failed: %s", exc)


@app.get("/")
def health():
    return jsonify(status="ok")


@app.post("/api/contact")
def contact():
    data = request.get_json(silent=True) or {}

    if data.get("website"):
        return jsonify(ok=True)

    name = str(data.get("name", "")).strip()
    email = str(data.get("email", "")).strip()
    message = str(data.get("message", "")).strip()

    if not name or not email or not message:
        return jsonify(error="Paki-fill out lahat ng fields."), 400
    if len(name) > 80 or len(email) > 120 or len(message) > 2000:
        return jsonify(error="Masyadong mahaba ang input."), 400
    if not EMAIL_RE.match(email):
        return jsonify(error="Invalid ang email address."), 400

    ip = client_ip()
    if rate_limited(ip):
        return jsonify(error="Too many messages. Subukan ulit mamaya."), 429

    with db() as conn:
        conn.execute(
            "INSERT INTO messages (name, email, message, ip) VALUES (?, ?, ?, ?)",
            (name, email, message, ip),
        )

    threading.Thread(target=send_email, args=(name, email, message), daemon=True).start()
    return jsonify(ok=True), 201


@app.get("/api/messages")
def list_messages():
    if not ADMIN_TOKEN or request.headers.get("X-Admin-Token") != ADMIN_TOKEN:
        return jsonify(error="Unauthorized"), 401
    with db() as conn:
        rows = conn.execute("SELECT * FROM messages ORDER BY id DESC LIMIT 100").fetchall()
    return jsonify([dict(r) for r in rows])


init_db()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", "5000")), debug=True)
