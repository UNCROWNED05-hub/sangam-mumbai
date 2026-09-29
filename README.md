# Sangam • Live Plans on a Map

> A live map of plans that people nearby have posted for today: sports, hikes, coffee runs, workshops, game nights, jam sessions. Real people, public places. No feed. No followers.

---

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS + Custom Design Tokens (`ink`, `marigold`, `bougainvillea`, `lagoon`, `paper`, `night`)
- **Typography**: Bricolage Grotesque (variable `opsz,wdth,wght`) + Noto Color Emoji
- **Map**: MapLibre GL + React Map GL (Carto Voyager / Dark Matter styles)
- **Smooth Scroll**: Lenis
- **Animation**: GSAP (ScrollTrigger) + Motion (`motion/react`)
- **State**: Zustand (with local storage persistence)
- **Physics**: Matter.js (interactive emoji pile)

---

## Customization

- **Brand Name**: Edit `src/config/brand.ts` (default: "Sangam").
- **City & Anchors**: Edit `src/config/city.ts` (default: "mumbai").
- **Fake Data**: Edit `src/data/*` (people, plans, chats, trips, cities, stories, faq).
