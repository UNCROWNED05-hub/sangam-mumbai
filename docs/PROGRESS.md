# Sangam Build Progress

## Done
- Saved build brief verbatim to `docs/SPEC.md`.
- Initialized dedicated git repository in `c:/Users/pacha/OneDrive/Desktop/ps project`.
- [Phase 1] Foundation and Systems:
  - Color tokens, Bricolage Grotesque typography, SVG noise grain, and responsive CSS tokens.
  - Deterministic data layer: 40 people, 48 Mumbai plans (inland checked), simulated chats, trips, notifications.
  - Simulation engine: live odometer drift, periodic plan drops and joins.
  - Core systems: Lenis smooth scroll + GSAP ticker sync, liquid cursor + follower, ambient Sky controller with sun/moon and 120 stars, Preloader with shockwave pin drop, expanding marigold circle RouteTransition.
  - UI Primitives: PlanBubble, Avatar, AvatarStack, Odometer, PhoneFrame, StaticMap, Toast system.
- [Phase 2] Landing P0 Sections:
  - L1 Hero: MapLibre canvas with gentle bearing drift, 12 interactive bubbles, live count odometer, city ticker, SplitText line reveals.
  - L2 Phone Scene: 3-step pinned phone showcase with real React screens, gyroscope/mouse tilt, interactive join with confetti.
  - L3 Clock Dial Scene: Pinned dial sweeping 6:48pm to 11:50pm, comparing feed scrolling vs Sangam real-world plans with animated path map.
  - L7 FAQ: 5 interactive questions with animated expand/collapse and safety links.
  - L8 Emoji Pile: Matter.js physics engine with 60 activity DOM emojis, gravity, floor & wall boundaries, drag/nudge interactions.
  - L9 Footer: 4 functional column links and giant clipped brand wordmark.
  - `/safety`, `/guidelines`, `/terms` policy pages with rich markdown-style cards.
  - Clean production build tested (`npm run build`).

## Decisions
- Brand placeholder: "Sangam" centralized in `src/config/brand.ts`.
- City placeholder: "mumbai" centralized in `src/config/city.ts`.
- Tech stack alignment: `lenis`, `maplibre-gl`, `react-map-gl`, `matter-js`, `@types/matter-js`, `react-router-dom`, `motion`, `cmdk`, `@gsap/react`.
- Typography: Bricolage Grotesque (axes `opsz,wdth,wght`) and Noto Color Emoji via Google Fonts.
- MapLibre imported as namespace (`import * as maplibregl from 'maplibre-gl'`) to ensure full ESM compatibility.

## Known issues
- None. Production build is clean and green.
