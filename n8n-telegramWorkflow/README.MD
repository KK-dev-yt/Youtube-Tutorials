# 🚀 Telegram Bot on Local System using n8n + Pinggy

This repository contains the **n8n workflow (.json)** for running a Telegram bot entirely on your **local laptop**, using **Pinggy** to expose a public HTTPS webhook URL.

With this setup, you can test Telegram bots locally without any hosting or servers.

---

## 🔧 Requirements

* Docker
* n8n
* Telegram Bot Token (from @BotFather)
* Pinggy (no installation required)

---

## 🌐 Step 1 — Start Pinggy Tunnel

Pinggy creates a public HTTPS URL and forwards it to your local n8n port (5678).

Run:

```bash
ssh -p 443 -R0:localhost:5678 qr@free.pinggy.io
```

Pinggy will output a URL like:

```
https://qlgep-49-206-100-139.a.free.pinggy.link
```

Keep this terminal window **open**, or the tunnel will close.

---

## 🐳 Step 2 — Run n8n in Docker

Start n8n and set your Pinggy URL as the `WEBHOOK_URL`.

### Temporary container (auto-removes on exit):

```bash
docker run -it --rm --name n8n -p 5678:5678 -e WEBHOOK_URL="https://qlgep-49-206-100-139.a.free.pinggy.link" n8nio/n8n
```

### Persistent container (does NOT auto-remove):

```bash
docker run -it --name n8n -p 5678:5678 -e WEBHOOK_URL="https://qlgep-49-206-100-139.a.free.pinggy.link" n8nio/n8n
```

Open n8n in your browser:

```
http://localhost:5678
```

---

## 🤖 Step 3 — Import the Workflow

1. Go to **n8n UI**
2. Click **Import**
3. Select the `.json` file from this repository
4. Paste your **Telegram Bot Token** into the Telegram nodes
5. Save and activate the workflow

---

## 🔗 Step 4 — Set Telegram Webhook

Copy the token from the **Telegram bot father** and create a new credential and set it:


If successful, Telegram returns:

```
Connection Tested Successfully
```

---

## 🎉 Done!
- Your Telegram bot is now running locally and receiving messages through Pinggy’s HTTPS tunnel.
---

