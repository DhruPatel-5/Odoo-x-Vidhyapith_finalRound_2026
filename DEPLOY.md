# Deploy RevoraX (Render API + Vercel frontend)

## Architecture

| Where        | What runs                                      |
|-------------|-------------------------------------------------|
| **Vercel**  | React app (`client/`) only                      |
| **Render**  | Node API (`server/`) — **mail is sent here**    |

Invite emails and all API logic use **Render’s environment variables**, not Vercel’s.

---

## 1. Render (backend)

1. Create a **Web Service** from this repo; root directory **`server`** (or set **Root Directory** = `server`).
2. **Build command:** `npm install`
3. **Start command:** `npm start`
4. **Environment variables** (minimum):

| Variable | Example | Notes |
|----------|---------|--------|
| `MONGODB_URI` | `mongodb+srv://...` | Atlas connection string |
| `JWT_SECRET` | long random string | Same as you use locally |
| `CLIENT_URL` | `https://your-app.vercel.app` | **Required** — invite links in emails (no trailing slash) |
| `GMAIL_USER` | `you@gmail.com` | Same as local `.env` |
| `GMAIL_APP_PASSWORD` | app password | Same as local — **spaces in the password are OK** |
| `PORT` | `5000` or leave default | Render often sets `PORT` automatically |

5. **Node version:** use **Node 18+** (see `server/package.json` `engines`).

### If invite email still fails on Render

Gmail from cloud servers often **times out** even with a correct app password. Do this:

1. Sign up at [Resend](https://resend.com) → create an API key.
2. Add **`RESEND_API_KEY`** in Render (keep **`GMAIL_*`** too).
3. The server tries **Gmail first**, then **automatically uses Resend** if Gmail fails.
4. For testing, you can set `RESEND_FROM_EMAIL=onboarding@resend.dev` (verify sender rules in Resend).

You do **not** need separate “SMTP host” env vars for Gmail — only `GMAIL_USER` + `GMAIL_APP_PASSWORD`.

---

## 2. Vercel (frontend)

1. Import the repo; set **Root Directory** to **`client`** (or monorepo equivalent).
2. **Environment variable:**

| Variable | Value |
|----------|--------|
| `VITE_API_URL` | `https://your-service.onrender.com/api` |

Use your real Render service URL + `/api` (no trailing slash before `/api`).

3. Redeploy after changing env vars.

---

## 3. CORS

Ensure `server` allows your Vercel origin. If you have a `CLIENT_URL` or CORS list, add `https://your-app.vercel.app`.

---

## 4. Checklist

- [ ] Render: `CLIENT_URL` = Vercel URL (invite links)
- [ ] Vercel: `VITE_API_URL` = Render API base with `/api`
- [ ] Render: `GMAIL_USER` + `GMAIL_APP_PASSWORD` (and optional `RESEND_API_KEY` if Gmail fails)
