# 🕴️ Elegante — The Digital Atelier

> *"Dress like yourself."*

An AI-powered personal styling service — not a generic outfit generator, but a private consultation that understands your body, your lifestyle, and the moment you're dressing for. Built end-to-end: authenticated API, structured AI reasoning, and a fully custom frontend.

---

## 🎯 What it does

Elegante works like a real styling consultation, split across a few connected capabilities:

### 🎩 Outfit Consultation
Describe the occasion and your mood — Elegante builds a complete outfit (top, bottom, shoes, accessory), reasoning about *why* each piece works for your body type, lifestyle, budget, and preferred style. No generic advice, no filler.

### 📸 Second Opinion (Photo Feedback)
Upload a photo of what you're wearing. Elegante gives an honest, structured critique — fit, color coordination, and whether the look actually works for the occasion you picked it for.

### 🧥 Wardrobe Cataloging
Snap a photo of what you're wearing, and Elegante automatically identifies and logs every piece — type, color, material, fit — into your personal digital wardrobe. No manual entry.

### 📖 Lookbook (History)
Every consultation is saved, so past recommendations are never lost — a running record of what Elegante has suggested and when.

---

## 🧠 Why this isn't "just another ChatGPT wrapper"

- **Structured outputs, not walls of text.** Every AI response is enforced through Claude's tool-use API against strict Pydantic schemas — the model *cannot* return malformed data. This is a real API contract between AI and application, not a chatbot glued onto a form.
- **Vision-grounded, not guesswork.** Photo feedback and wardrobe cataloging run directly on the uploaded image via Claude's vision capabilities — including automatic HEIC-to-JPEG conversion, since most uploads come straight from an iPhone.
- **Prompt-engineered for precision.** Early iterations returned 800 tokens of scripted enthusiasm. Current prompts return clean, decision-ready output — same intelligence, a fraction of the tokens, zero fluff.
- **Authenticated by design.** JWT-based auth (Argon2 password hashing) ties every profile, recommendation, and wardrobe item to its owner — no endpoint trusts a client-supplied ID.
- **Domain-driven architecture.** The backend isn't one bloated `main.py` — it's split into isolated modules (`auth`, `profiles`, `outfits`, `wardrobe`), each owning its own routes, schemas, models, and AI logic.

---

## 🏗️ Architecture

```
elegante/
├── api/
│   ├── main.py              # FastAPI app assembly, router registration
│   ├── database.py          # DB session management
│   ├── auth/                # JWT auth: register, login, get_current_user
│   │   ├── router.py
│   │   ├── schemas.py
│   │   ├── models.py
│   │   └── service.py       # hashing + token logic
│   ├── profiles/            # User styling profile (body, style, units)
│   │   ├── router.py
│   │   ├── schemas.py
│   │   └── models.py
│   ├── outfits/             # Outfit recommendations, photo feedback, history
│   │   ├── router.py
│   │   ├── schemas.py
│   │   ├── models.py
│   │   └── ai_service.py    # Claude tool-use + vision calls
│   └── wardrobe/            # Wardrobe photo analysis & cataloging
│       ├── router.py
│       ├── schemas.py
│       ├── models.py
│       └── ai_service.py
│
├── frontend/                 # React (Vite) — "The Digital Atelier"
│   └── src/
│       ├── pages/            # Consultation, Second Opinion, Wardrobe, Lookbook
│       ├── components/
│       └── context/          # Auth state
│
├── docker-compose.yml         # Postgres + API, one command to run
```

**Backend stack:**
- **FastAPI** — async-ready REST API, domain-based routing
- **PostgreSQL + SQLAlchemy** — profiles, outfit history, wardrobe items, users
- **Claude (Anthropic API)** — structured outfit generation via tool use, vision-based photo analysis
- **JWT + Argon2** (`pyjwt`, `pwdlib`) — authentication and password security
- **Pydantic** — strict schema validation end-to-end, including AI outputs
- **Docker Compose** — zero-friction local setup

**Frontend stack:**
- **React + Vite** — fast, modern SPA
- **React Router** — client-side navigation with auth-gated routes
- Custom design system — ink-dark palette, editorial serif/sans type pairing, orchestrated motion for the "consultation" loading state

---

## 🚀 Running it locally

**Backend:**
```bash
git clone https://github.com/jeeamir/elegante.git
cd elegante
```

Create a `.env` file in `api/`:
```
ANTHROPIC_API_KEY=your_key_here
SECRET_KEY=your_generated_secret   # openssl rand -hex 32
```

```bash
docker-compose up --build
```

API docs live at `http://localhost:8000/docs`.

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Runs at `http://localhost:5173`.

---

## 📡 API Overview

| Endpoint | What it does |
|---|---|
| `POST /auth/register` | Create an account, returns a JWT |
| `POST /auth/login` | OAuth2-compatible login, returns a JWT |
| `POST /profile/` | Create the authenticated user's styling profile |
| `POST /outfits/` | Get a structured outfit recommendation for an occasion |
| `GET /outfits/history` | Retrieve past recommendations |
| `POST /outfits/photo-feedback` | Upload a photo, get honest styling feedback |
| `POST /wardrobe/analyze-photo` | Auto-catalog clothing items from a photo |

All endpoints except `/auth/*` require `Authorization: Bearer <token>`. Every request is scoped to the authenticated user — no `profile_id` is ever taken from the client.

---

## 🗺️ Roadmap

- [ ] Real product search — Claude searches actual shops and returns real, purchasable items with links, not just a store name
- [ ] Wardrobe-aware recommendations — "build me an outfit from what I already own," only suggesting purchases for what's missing
- [ ] Outfit ratings feedback loop ("wore it" / "not me") to sharpen future suggestions
- [ ] Weather-aware consultations
- [ ] Trip packing — a capsule wardrobe for a full trip in one request

---

## 👨‍💻 About this project

Built by **Amir Jiyembayev** — a hands-on exploration of applied AI engineering: structured LLM outputs, vision integration, authentication, and full-stack API design