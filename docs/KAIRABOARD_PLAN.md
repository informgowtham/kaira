# KairaBoard — Final Phased Implementation Plan (Updated)

## Summary
KairaBoard is a premium collaborative celebration platform where creators build digital group cards, collect messages/media from contributors, and deliver an emotional, cinematic reveal to recipients. The build is phased, and after each phase we stop and ask whether to proceed or revise.

Payments: UI-only gating (no payment gateway/Stripe integration yet).

## Product Vision
Core positioning: "Turn group messages into lasting memories."

Must combine:
- Emotional UX
- Premium visual design
- Secure creator ownership
- Frictionless collaboration
- Cinematic reveal experiences

## Core User Model

### Visitor (No Login)
Visitors can:
- Browse homepage
- Explore categories
- View templates/themes
- View pricing
- Experience demo reveals

Visitors cannot:
- Create boards
- Access private boards
- Manage boards

### Creator (Authenticated User)
Creators must login/signup to:
- Create boards
- Manage boards
- Schedule delivery
- Invite contributors
- Customize themes
- Download memories
- Upgrade subscription (UI-only for now)

Security:
- Creators can ONLY access boards they created
- No public board discovery
- All protected APIs must enforce ownership checks

Preferred auth:
- Google Sign-In
- Email/password fallback

### Contributors (No Login Required)
Contributors can:
- Open shared contribution links
- Add messages
- Add GIFs/images/emojis
- View the board before delivery

No accounts required.

### Recipient (No Login)
Recipients can:
- Open delivered reveal experience
- Replay celebration
- Download memory (if enabled by plan gates)

## Product Categories (Homepage)
- Birthday
- Farewell
- Anniversary (no romantic/wedding iconography; supports work anniversaries/milestones/tenure/team celebrations)
- Other

## Visual Design Direction
Use:
- Soft gradients
- Glassmorphism
- Rounded corners
- Floating cards
- Smooth transitions
- Layered depth
- Subtle motion

Avoid:
- Loud/cluttered visuals
- Cheap party aesthetics
- Overly cartoonish design

Primary colors:
- Purple gradients
- Blue gradients
- Soft pastel backgrounds

## Mobile-First Requirement
All flows must be designed mobile-first:
- Responsive layouts
- WhatsApp-friendly contribution flow
- Smooth mobile animations
- Fast performance on mobile browsers

## Phase 1 — UI-Only Experience (Mock/Local State Only)
Goal: build the complete premium frontend experience with mock/local data only. No backend or persistence.

Tech:
- Vite React
- Tailwind CSS
- Framer Motion
- React Three Fiber
- Three.js
- Lucide Icons

Build (UI shells + local state interactions):
- Landing page
- Login/signup UI
- Protected creator dashboard shell
- Board creation flow
- Theme/template selection flow
- Creator board page
- Contributor page
- Pricing page
- Recipient reveal page

Theme selection:
- Creator chooses occasion + theme/template
- Theme categories: Birthday, Farewell, Anniversary, Celebration/Other
- Theme dimensions: background, header, card style, mood variations
- Example moods: Elegant, Playful, Corporate, Minimal, Neon celebration, Premium gold

Board layout:
- Masonry/Pinterest-style celebration wall
- Cards: text, GIFs, images, emojis, stickers
- Cards have layered depth, varying heights/sizes, subtle motion

UI-only interactions:
- Create card routes to mock board
- Add/update messages in local state
- Invite modal
- WhatsApp share affordance
- Schedule delivery modal (UI-only)
- Pricing upgrade modals (UI-only)
- Theme selection
- Countdown preview (UI-only)

Invite helper text:
"Anyone can add messages — no login needed."

Pricing model (UI-only enforcement in Phase 1):
- Free: 5 boards/year, 20 messages/board, watermark, no scheduled delivery, no memory download, standard reveal
- Pro: $19/month, $182/year (Save 20%), unlimited boards/messages, scheduled delivery, memory download, no watermark, premium reveal, premium themes
- Only 2 plans: Free + Pro, with monthly/yearly toggle and "Most Popular" on Pro
- No lifetime plan

Cinematic reveal experience (core differentiator):
- Anticipation screen: soft animated gradients, floating particles, ambient motion
  - "A surprise is waiting for you"
  - "18 people came together to celebrate you"
  - CTA: "Open Your Card"
- 3D card opening: floating card with tilt/parallax, lighting, glow/shadows; open triggers smooth animation, camera move, confetti burst, background transform
- Message reveal journey: progressive animated message pacing; avoid dumping all at once
- Emotional ending: "Made with love by 18 people"
  - Actions: Download as Memory, Replay Celebration, Share Reaction (UI-only gates)

3D constraints:
- Smooth, elegant, lightweight, mobile-friendly
- Avoid heavy particle systems, laggy rendering, game-like visuals

Phase 1 gate:
When complete, STOP and ask:
"Can we proceed to Phase 2, or would you like changes to Phase 1 first?"

## Phase 2 — Backend + Security Foundation
Add:
- Express API
- Postgres
- Authentication (Google Sign-In + email/password fallback)
- Protected creator dashboard (real)
- Ownership validation on protected APIs
- DATABASE_URL config + migration scripts

Core DB tables:
- users: id, email, auth provider, subscription status (entitlement flag only), createdAt
- boards: id, ownerId, recipientName, occasion, theme, title, status, contributorToken, revealToken, planTier, timestamps
- messages: boardId, displayName, text, emoji metadata, GIF URL, image URL, timestamps
- deliveries: boardId, scheduledAt, destinationType, recipientContact, deliveryState

Board states:
- draft
- collecting_messages
- scheduled
- delivered
- archived

Security rules:
- Creator can only access their own boards/dashboard
- Protected APIs must validate ownership: board.ownerId === authenticatedUser.id
- Contributor routes remain tokenized/public (no login)

Analytics/event tracking:
- board_created
- invite_clicked
- message_added
- reveal_opened
- upgrade_clicked

Additional UI requirement (Phase 2+):
- Visitors can browse templates under each category without logging in.
- Require login only after a visitor selects a template (before board creation).
- Minimum: 4 templates per category (Birthday/Farewell/Anniversary/Other), ultra-creative and modern.

Phase 2 gate:
STOP after completion and ask before Phase 3.

## Phase 3 — Collaboration + Media
Add:
- Public contributor APIs (token-based)
- Real uploads (local file uploads + static serving)
- GIF support (URL-based)
- Theme engine + board customization
- Read-only behavior after delivery

Maintain:
- No-login contribution

Phase 3 gate:
STOP after completion and ask before Phase 4.

## Phase 4 — Delivery + Monetization (UI-Only)
Add:
- Real scheduled delivery logic (server-side activation based on scheduledAt)
- Countdown system sourced from real delivery state
- Subscription enforcement as UI-only entitlements (no Stripe/payment gateway yet)
- Feature gating for:
  - Scheduled delivery
  - Memory download
  - Premium reveal
  - Premium themes
  - Unlimited boards/messages

Phase 4 gate:
STOP after completion and ask before Phase 5.

## Phase 5 — QA + Production Readiness
Test/verify:
- Mobile responsiveness
- Full creator flow
- Contribution flow
- Delivery + countdown flow
- Reveal + replay flow
- Entitlement gates (Free vs Pro)

Verify:
- 3D reveal is smooth
- No layout overlap
- Good mobile performance
- Security validation
- Read-only delivered boards

Add:
- API tests
- UI flow tests
- Reveal replay tests

Phase 5 gate:
STOP after completion and ask for final refinements.

## Assumptions
- Payments remain UI-only until you explicitly approve adding a payment gateway (Stripe) in a later phase.
- Postgres is the system of record starting Phase 2.
- Contributors and recipients remain login-free via unguessable tokens.

