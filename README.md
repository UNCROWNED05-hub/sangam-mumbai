# Sangam • Live Plans on a Map

> **Someone near you already has a plan.**  
> A live map of spontaneous gatherings that people nearby have posted for today: sports, hikes, coffee runs, game nights, jam sessions. Real people, public places. No feed. No followers. No small talk.

---

## ⚡ Quick Start

### 1. Requirements
- Node.js 18+ (tested on Node 20 & 24)
- npm or pnpm

### 2. Run Locally
```bash
# Clone and enter the repository
cd "ps project"

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

Visit **`http://localhost:5173`** for the cinematic landing page or **`http://localhost:5173/app`** for the live interactive app.

### 3. Production Build & Preview
```bash
# Typecheck & build minified bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🗺️ Routes & Pages

| Route | Description | Highlights |
|---|---|---|
| `/` | **Cinematic Landing Page** | MapLibre background, 3-step pinned phone with real React screens, sweeping clock comparison, 6 bento micro-demos, ad builder, stories marquee, 60-emoji Matter.js pile, footer. |
| `/app` | **Live Web Application** | MapLibre GL map, user radar pulse, interactive plan bubbles, list-map hover sync, right drawer / bottom sheet, optimistic join with confetti, group chat with auto-replies, 5-step composer. |
| `/app?plan=<id>` | **Direct Plan Link** | Deep links directly to any plan bubble and automatically eases the camera with sheet padding. |
| `/partners` | **Partner & Venue Portal** | Footfall driven metrics, reservation stats, and self-serve sponsored pin campaign launcher. |
| `/safety` | **Safety Protocol** | Verification requirements, public places policy, and reporting system. |
| `/guidelines` | **Community Code of Conduct** | Attendance commitment, zero solicitation, and warmth standards. |
| `/terms` | **Terms of Service** | Privacy guidelines, decentralized gatherings, and user expectations. |

---

## 💎 Features & UX Upgrades ("100x Better")

1. **Ambient Sky & Lighting Engine** (`src/systems/Sky.tsx`):
   - Dynamic gradient interpolating smoothly between Dawn, Noon, Golden Hour, Dusk, and Night as you scroll.
   - Ambient Sun and Moon orb traversing an arched orbital path, plus 120 twinkling SVG stars.
   - Automatic luminance calculation flipping typography between ink and white to guarantee contrast.

2. **Liquid Cursor & Velocity Stretch** (`src/systems/Cursor.tsx`):
   - 60fps RAF follower with squish and velocity stretch based on pointer speed.
   - Contextual cursor states: `join`, `drag`, `pause`, `text`, and magnetic button attraction (`useMagnetic`).

3. **Time Scrubber** (`src/app/TimeScrubber.tsx`):
   - Signature 36-hour scrubber pill at the bottom of the map.
   - Quick chips: `Now`, `Tonight`, `Tomorrow`, `Weekend` with spring snapback.
   - Live formatted time labels ("Tonight • 8:30 pm", "Tomorrow • 7:00 am").

4. **Two-Way Map and List Hover Sync**:
   - Hovering a card in the left floating panel lifts and highlights its bubble on the map.
   - Hovering a bubble on the map highlights and smoothly scrolls the corresponding card into view.

5. **Camera Padding Easing**:
   - When a plan drawer opens, the MapLibre camera shifts with 440px right padding on desktop (55% bottom padding on mobile) so selected bubbles are never covered.

6. **Hero Join Interaction** (`src/app/PlanSheet.tsx`):
   - Spring button press with 450ms simulated latency spinner.
   - Morph into lagoon checkmark with ripple effect.
   - Avatar flies into the attendee stack.
   - 60-particle `canvas-confetti` explosion in brand colors (`marigold`, `bougainvillea`, `lagoon`, `ink`).
   - Device haptics (`navigator.vibrate(12)`).
   - Undo toast notification with 5-second countdown and quick "Open chat" action.

7. **Realtime Group Chat** (`src/app/ChatRoom.tsx`):
   - Header with emoji, plan title, attendee count, and pinned location strip.
   - Interactive poll voting with animated percentage bars.
   - Emoji reaction picker with reaction pills and counts.
   - Typing indicator (3 bouncing dots) and scripted contextual auto-replies after 900-2200ms.
   - Auto-scroll with a floating "New messages ↓" pill when scrolled up.

8. **5-Step Plan Composer** (`src/app/Composer.tsx`):
   - 1. *What's the plan?* Title input, 20 emoji picker, category chips.
   - 2. *When?* Quick chips (30m, 1hr, tonight, tomorrow) and duration slider.
   - 3. *Where?* Interactive map "Place Mode" with center crosshair pin and public place verification.
   - 4. *Who can join?* Capacity stepper (2 to 20 spots), verified members toggle, vibe tags.
   - 5. *Review & Post:* Live preview card. On post, camera flies, pin drops with shockwave, and simulated people join over the next minute.

9. **Live Simulation Engine** (`src/store/useSimulation.ts`):
   - Counter drift: Live people out counter drifts every 3.2s.
   - Ambient plan drops: New spontaneous plan drops onto the map every 11s.
   - Plan joins: Simulated users join your hosted plans every 12s with toast & notification.

10. **Keyboard Shortcuts Everywhere**:
    - `/` Focuses global search.
    - `Esc` Closes drawers, sheets, and modals.
    - `J` / `K` Cycles through plans in the current filtered view.
    - `Ctrl+K` / `Cmd+K` Opens the Command Palette.
    - `↑ ↑ ↓ ↓ ← → ← → B A` (Konami Code) triggers activity emoji rain.

---

## 🛠️ Tech Stack & Dependencies

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS + Custom Tokens (`ink`, `marigold`, `bougainvillea`, `lagoon`, `paper`, `night`)
- **Typography**: Bricolage Grotesque (variable `opsz,wdth,wght`) + Noto Color Emoji
- **Map Engine**: MapLibre GL (`maplibre-gl`) with Carto Voyager (Day) and Dark Matter (Night) vector styles
- **Smooth Scrolling**: Lenis (`lenis`) synchronized with GSAP ticker
- **Motion & Pinning**: GSAP `ScrollTrigger` (pinned phone & clock scenes) + Motion (`motion/react`)
- **State Management**: Zustand with safe `localStorage` persistence
- **Physics**: Matter.js (`matter-js`) for the 60-emoji gravity pile
- **Command Palette**: `cmdk`

---

## ⚙️ Customization Guide

### Rename the Brand
Open `src/config/brand.ts`:
```ts
export const BRAND = {
  name: 'Sangam', // Change to your brand name
  tagline: 'Someone near you already has a plan.',
  // ...
};
```
Every mention across navigation, hero, footer, and toasts updates instantly.

### Change the City
Open `src/config/city.ts`:
```ts
export const CITY = {
  id: 'mumbai',
  name: 'Mumbai',
  center: [72.83, 19.059], // [lng, lat]
  zoom: 12.6,
  anchors: [
    { name: 'Marine Drive', lngLat: [72.8236, 18.9433] },
    // Add your city anchors here
  ],
};
```

### Edit Seed Data
- Plans: `src/data/plans.ts` (48 seeded Mumbai activities with categories, capacities, vibe tags)
- People: `src/data/people.ts` (40 deterministic profiles with avatars and verified badges)
- Chats: `src/data/chats.ts` (Scripted threads, polls, reactions, and auto-reply pool)
- Trips: `src/data/trips.ts` (Crew weekend trips, itineraries, packing checklists)

---

## 🚀 Deployment to Vercel

The project includes `vercel.json` configured for Single Page Application routing:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

To deploy:
```bash
# Push to GitHub, then run:
vercel
# or connect the repo directly on vercel.com
```

---

## 📄 License
MIT License. Created for high-performance, real-world community discovery.
