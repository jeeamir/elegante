# 🕴️ Elegante — AI Personal Stylist

> *"Dress like yourself."*

An AI-powered stylist that actually gets you — not another "generic outfit generator," but a system that understands your body, your lifestyle, and the moment you're dressing for.

Built because every calorie tracker and workout app already exists twice over — but nobody's building a real AI stylist that understands *you*, not just your measurements.

---

## 🎯 What it does

Elegante isn't one feature — it's three AI-powered capabilities working on the same profile:

### 👔 Outfit Recommendations
Tell it the occasion and your mood — it builds a complete outfit (top, bottom, shoes, accessory) tailored to your body type, lifestyle, budget, and preferred style. No generic advice — it reasons about *why* each piece works for *you*.

### 📸 Photo Feedback
Upload a photo of your outfit. Elegante analyzes fit, color coordination, and whether it actually works for the occasion you're dressing for — with honest, specific feedback, not empty compliments.

### 🧥 Wardrobe Digitization
Snap a photo of what you're wearing, and Elegante automatically catalogs every item — type, color, material, fit — straight into your digital wardrobe. No manual data entry, ever.

---

## 🧠 Why this isn't "just another ChatGPT wrapper"

- **Structured outputs, not walls of text.** Every AI response is enforced through Claude's tool-use API against strict Pydantic schemas — the model *cannot* return malformed data. This isn't a chatbot bolted onto a form; it's a real API contract between AI and application.
- **Vision-grounded, not guesswork.** Photo feedback and wardrobe analysis use Claude's vision capabilities directly on the image — not a caption pipeline, not OCR hacks.
- **Unit-aware by design.** Height, weight, shoe size, currency — all explicitly typed via enums, because a stylist that doesn't know if you mean cm or inches isn't a stylist.
- **Prompt-engineered for precision.** Early iterations returned 800 tokens of scripted enthusiasm ("Hey there! I'm so glad you reached out today! ✨"). Current prompts return four clean, decision-ready lines — same intelligence, 8x fewer tokens, zero fluff.

---

## 🏗️ Architecture

```
elegante/
├── api/
│   ├── main.py          # FastAPI routes
│   ├── ai_service.py     # Claude API integration (tool use + vision)
│   ├── models.py         # SQLAlchemy ORM models
│   ├── schemas.py        # Pydantic validation & structured output schemas
│   └── database.py       # DB session management
├── docker-compose.yml     # Postgres + API, one command to run
```

**Stack:**
- **FastAPI** — async-ready REST API
- **PostgreSQL + SQLAlchemy** — persistent profiles, outfit history, wardrobe items
- **Claude (Anthropic API)** — structured outfit generation, vision-based photo analysis
- **Docker Compose** — zero-friction local setup
- **Pydantic** — strict schema validation end-to-end, including for AI outputs

---

## 🚀 Running it locally

```bash
git clone https://github.com/jeeamir/elegante.git
cd elegante
```

Create a `.env` file:
```
ANTHROPIC_API_KEY=your_key_here
```

Then:
```bash
docker-compose up --build
```

API docs live at `http://localhost:8000/docs` — every endpoint is testable straight from Swagger.

---

## 📡 Endpoints

| Endpoint | What it does |
|---|---|
| `POST /profile` | Create a user profile with body, style, and budget data |
| `POST /outfits` | Get a structured outfit recommendation for an occasion |
| `GET /profile/{id}/history` | Retrieve past outfit recommendations |
| `POST /outfits/photo-feedback` | Upload a photo, get honest styling feedback |
| `POST /wardrobe/analyze-photo` | Auto-catalog clothing items from a photo |

---

## 🗺️ Roadmap

- [ ] Web search integration — real product recommendations from real stores, not just "Massimo Dutti" on repeat
- [ ] Wardrobe-aware recommendations — "build me an outfit from what I already own"
- [ ] Streamlit/React interface — because Swagger UI is great for developers, not for actually getting dressed
- [ ] Occasion-appropriateness reasoning — no more watch suggestions for gym sessions

---

## 👨‍💻 About this project

Built by **Amir Jiyembayev** as a hands-on exploration of applied AI engineering — structured LLM outputs, vision integration, and API design — while preparing for a Master's in Artificial Intelligence.

Every feature here started as "wait, can Claude actually do that?" and ended as a working endpoint. That's the whole methodology.