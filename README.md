# KairaBoard

KairaBoard is a premium collaborative celebration platform where creators build digital group cards, collect messages/media from contributors, and deliver an emotional, cinematic reveal to recipients.

## Product Vision
Core positioning: **"Turn group messages into lasting memories."**

Must combine:
- Emotional UX
- Premium visual design
- Secure creator ownership
- Frictionless collaboration
- Cinematic reveal experiences

## Quick Start (Local Dev)

```bash
# 1. Install dependencies
pnpm install

# 2. Start PostgreSQL (Homebrew)
brew services start postgresql@16

# 3. Create database
createdb kairaboard

# 4. Configure environment
cp .env.example .env   # then edit DATABASE_URL, AUTH_SECRET, etc.
#    ADMIN_EMAILS controls access to /admin
#    GOOGLE_CLIENT_ID and VITE_GOOGLE_CLIENT_ID must match for Google Sign-In

# 5. Run migrations
pnpm run migrate

# 6. Start backend API (port 4000)
pnpm run dev:server

# 7. Start frontend (port 5173, in a second terminal)
pnpm run dev:client
```

Local demo accounts are seeded when the backend starts:

- Admin: `admin@kairaboard.dev` / `Admin@12345`
- General user: `user@kairaboard.dev` / `User@12345`

Google Sign-In requires a Google OAuth Web Client ID. Add the same value to `GOOGLE_CLIENT_ID` for the API verifier and `VITE_GOOGLE_CLIENT_ID` for the browser button.

## Features

### 🎨 Immersive Background System
Every board features a **full-screen animated background** that adapts to the theme category. Rendered with high-performance Framer Motion:
- **Balloons**: Drifting physics for Birthday celebrations.
- **Confetti**: High-energy celebration pops.
- **Stars**: Twinkling constellations for Farewell/Anniversary.
- **Floating Shapes**: Calm geometric drift for professional settings.
- **Galaxy**: Parallax depth with rotating nebulae for epic milestones.

### 🎬 Cinematic 3D Reveal Experiences
Recipients experience a context-aware 3D opening sequence:
- **Gift Box**: Festive box pop for high-energy themes.
- **Magical Portal**: An energy vortex for space and modern themes.
- **Elegant Card**: A minimalist opening folio for classic celebrations.

### 📦 Memory Archiving (Download as Memory)
Recipients can preserve their celebration boards forever:
- **HTML Export**: A standalone, high-performance HTML file containing all messages and media.
- **PDF Export**: Print-ready, polished layouts optimized for physical archiving.

### ⏱️ Live Delivery Tracking
Scheduled boards feature a **high-precision countdown timer** on the dashboard, providing second-by-second updates until the board is delivered.

### 🔗 Social Sharing & Invites
Creator tools for rapid collaboration:
- **One-Click Share**: Integration with **WhatsApp**, **Email**, and **Slack**.
- **Public Templates**: A gallery to browse and select from 16+ curated themes.

### 🔍 Integrated GIF Search
Powered by **Klipy API**, allowing contributors to search, discover trending content, and add personality to their messages instantly.

## Execution Status

- [x] **Phase 1-6 — Core Loop & Visuals**
  - All templates, animations, auth, and database foundations are complete.
- [x] **Phase 7 — Production Experience**
  - Implemented HTML/PDF downloads, Slack/Email sharing, and the live delivery countdown.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, TypeScript, Vite, Framer Motion, Three.js (R3F), Zustand |
| **Backend** | Node.js, Express, PostgreSQL |
| **Auth** | JWT, bcryptjs, Google OAuth |
| **Media** | Klipy API (GIFs), Multer (local `/uploads` dir) |
| **Archiving** | HTML5 Blob API + Print Layouts (PDF) |

## Project Structure

```
src/ui/
├── components/
│   ├── backgrounds/          # Immersive animation layers
│   ├── Masonry.tsx           # Responsive message board layout
│   ├── MessageCard.tsx       # Layered glass cards
│   ├── ThemeBackground.tsx   # Dynamic theme engine
│   └── TopBar.tsx, Button.tsx, ...
├── pages/
│   ├── LandingPage.tsx       # Feature-rich entry point
│   ├── DashboardPage.tsx     # Board management with Live Countdown
│   ├── RevealPage.tsx        # Cinematic 3D experience + Memory Download
│   └── TemplatesPage.tsx     # Public theme gallery
├── store/
│   ├── themes.ts             # 16 Curated production themes
│   └── useAppStore.ts        # Centralized state management
└── utils/
    └── seo.ts                # Dynamic metadata management
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH_SECRET` | JWT signing secret |
| `ADMIN_EMAILS` | Comma-separated allowlist for `/admin` access |
| `GOOGLE_CLIENT_ID` | Google OAuth Web Client ID used by the backend verifier |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Web Client ID exposed to the frontend |
| `VITE_KLIPY_API_KEY` | API Key for GIF search (klipy.com) |
| `VITE_API_BASE_URL` | API endpoint for frontend (default: port 4000) |
