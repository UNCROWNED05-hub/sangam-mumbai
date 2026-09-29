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
- [Phase 3] App Core (P0):
  - Shell: Desktop navigation rail (Map, Plans, Chats, Trips, You, [+Post]) + Mobile bottom navigation bar + top filter & search bar + live counter badge + notifications popover.
  - MapView: MapLibre GL with Carto Voyager (Day) / Dark Matter (Night), User radar dot with hollow ghost mode for invisible state, React Portals for custom interactive markers, popularity-based sizing, zoom-out area chips (<11.8) with animated fly-in, camera padding easing (desktop right 440px, mobile bottom 55%), glass controls (recenter, 2D/3D, day/night, zoom +/-).
  - PlanList: Left floating panel on desktop, urgency chips ("Starts in Xm", "1 spot left", "Full: waitlist"), two-way rock-solid hover sync with map markers.
  - PlanSheet: Right drawer (420px) / mobile bottom sheet with host card, verified shields, where/when with walking ETA, capacity progress meter, avatar stack with members modal, vibe tags, secondary actions (share, +1 friend, calendar, report modal).
  - Hero Join Interaction: 450ms simulated latency with inline spinner, morph into lagoon check with ripple, 60-particle canvas-confetti burst, navigator.vibrate(12) haptics, undo toast with 5s countdown and open chat action.
  - ChatRoom: Group chat per plan, header with pinned location/time strip, message bubbles, emoji reactions picker with counter pills, interactive poll voting with animated percentage bars, typing indicator with bouncing dots, scripted auto-replies (900-2200ms), auto-scroll with new messages pill.
  - Composer: 5-step create plan flow (What's the plan, When, Where with map place mode crosshair, Who can join with capacity stepper, Review & Post). On post: camera flies, pin drops, toast confirms, plan marked as hosted.
  - Keyboard shortcuts: '/' search, 'Esc' close, 'J'/'K' next/prev plan.
- [Phase 4] App P1 Features:
  - TimeScrubber: Bottom-center pill with chips Now / Tonight / Tomorrow / Weekend, 36-hour scrubber, formatted time labels, and realtime spring reset.
  - OnboardingModal: First-visit onboarding sequence with fake radar permission pulse, interactive interest tags, and initials avatar customized palette.
  - PremiumSheet: Sangam Club sheet with segmented Weekly / Monthly / Yearly selector with sliding thumb (`layoutId`), animated odometer pricing (₹99 / ₹249 / ₹1,499), perk list, and celebratory simulated purchase flow with confetti.
  - PlansTab: Upcoming / Hosting / Past segmented tabs with animated underline (`layoutId`), count badges, and leave plan actions.
  - ChatsTab: Joined Circles vs City Lounges (Mumbai Everyone, Bandra Locals, Weekend Hikers, Street Food), unread preview, and deep link into ChatRoom.
  - TripsTab: Crew trips showcase (Goa Workation, Lonavala Ridge Trail, Kanheri Caves), interactive day-by-day itinerary timeline, and interactive packing checklist with strikethrough animation.
  - YouTab: Profile presence, stats, Invisible Ghost Mode toggle, Club membership card, referral code with progress tracker, appearance theme selector (Auto/Day/Night), notification preferences, and demo reset.
  - Clean production build tested (`npm run build`).

## Decisions
- Brand placeholder: "Sangam" centralized in `src/config/brand.ts`.
- City placeholder: "mumbai" centralized in `src/config/city.ts`.
- Tech stack alignment: `lenis`, `maplibre-gl`, `react-map-gl`, `matter-js`, `@types/matter-js`, `react-router-dom`, `motion`, `cmdk`, `@gsap/react`.
- Typography: Bricolage Grotesque (axes `opsz,wdth,wght`) and Noto Color Emoji via Google Fonts.
- MapLibre imported as namespace (`import * as maplibregl from 'maplibre-gl'`) to ensure full ESM compatibility.

## Known issues
- None. Production build is clean and green.
