# Raksha Bandhan — A Letter Between You Two

A two-way animated Raksha Bandhan gifting experience: a brother sends a
gift-letter to his sister (or a sister sends a rakhi-letter to her
brother), watches it fold into an envelope and get a shareable link, and
the recipient can open it and write back.

## Stack

- **Frontend:** React + Vite + Tailwind CSS + Framer Motion → deploy to Netlify
- **Backend:** Node + Express + Drizzle ORM → deploy to Northflank (or any Node host)
- **Database:** Neon Postgres
- **Images:** Cloudinary

This mirrors the GlobeTrotter deployment shape, so the same Netlify/Northflank/Neon setup should feel familiar.

## What's implemented

- Welcome scene, role selection, and a golden "guide" character with a curved gold/saffron trail that travels between every scene transition
- Full brother flow: names → gift photo *or* amount → optional memory photo → handwritten letter (with a moving pen and progressive text reveal) → envelope fold/seal/flip/address → shareable link
- Full sister flow: names → original SVG rakhi → optional memory photo → handwritten letter → envelope → shareable link
- Receive experience: tap-to-open envelope → the letter replays its handwriting animation → reply CTA that starts the opposite flow with `parentSlug` wired up, so chains of letters are traceable in the DB
- Express API: `POST /api/upload` (Cloudinary), `POST /api/gifts`, `GET /api/gifts/:slug`
- Drizzle schema for Neon with slug + unpredictable token, `parentId` for reply chains
- Procedural sound effects (bell, pen scratch, paper, whoosh) via Web Audio — no bundled audio files needed
- Reduced-motion support, drag-and-drop + tap-to-upload on mobile, friendly error/not-found states

## What's simplified (and how to extend it)

The original brief is extremely large — a few things were kept lean so the project actually ships and runs. All are straightforward to build further:

- **Background music:** the app looks for `frontend/public/music.mp3` and plays it on loop once you drop a royalty-free festive track there. Without a file, the app stays silent and fully functional — nothing breaks.
- **Particle density / parallax:** kept modest for performance; the `WelcomeScene` and `GuideTrail` components are the two places to add more if you want a denser scene.
- **Accessibility:** semantic buttons, focus rings, alt text, and `prefers-reduced-motion` are in place; a full screen-reader pass (e.g. live-region announcements during the writing animation) hasn't been done.
- **Rate limiting / abuse protection** on the API isn't included — add something like `express-rate-limit` before this goes fully public.

## Local setup

### 1. Database (Neon)

Create a Neon project, copy the connection string into `backend/.env` (based on `.env.example`), then run:

```bash
cd backend
npm install
npm run db:generate   # generates SQL from the Drizzle schema
npm run db:migrate    # applies it to your Neon database
```

### 2. Backend

```bash
cd backend
cp .env.example .env   # fill in DATABASE_URL, CLOUDINARY_*, ALLOWED_ORIGINS
npm run dev             # http://localhost:8787
```

Image uploads return a clear error until `CLOUDINARY_*` is set — everything else works without it.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev              # http://localhost:5173, proxies /api to localhost:8787
```

## Deploying

- **Frontend → Netlify:** set `VITE_API_BASE_URL` to your deployed backend's `/api` URL in Netlify's environment variables, then `npm run build` (Netlify does this automatically from `frontend/`).
- **Backend → Northflank:** set `DATABASE_URL`, `CLOUDINARY_*`, `ALLOWED_ORIGINS` (your Netlify domain), and optionally `PUBLIC_APP_URL` (your Netlify domain, used to build the full shareable link) as environment variables. Start command: `npm start`.
- **Database → Neon:** already provisioned in step 1 above.

## Project structure

```
frontend/src/
  components/
    guide/      — the golden guide character + its travel trail
    letter/     — paper, pen, and the handwriting engine
    envelope/   — fold → seal → flip → address animation
    rakhi/      — original SVG rakhi
    gift/       — gift photo/amount picker
    memory/     — memory photo upload
    audio/      — music + procedural sound effects
    ui/         — buttons, inputs, shared step layout
  scenes/       — welcome, role select, and each flow step
  pages/        — route-level composition (Home, Create, Gift)
  state/        — the in-progress letter's shared state
  lib/          — API client, letter copy, sanitization

backend/src/
  db/           — Drizzle schema, Neon client, migrations
  routes/       — /api/upload, /api/gifts
  lib/          — Cloudinary wrapper, slug/token generation
```
