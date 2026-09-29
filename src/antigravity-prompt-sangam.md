# BUILD BRIEF: "Sangam", a premium animated web app + landing site for a live "plans on a map" social product

> Paste this whole file into ONE Antigravity task (Planning mode). "Sangam" is a placeholder brand name. Keep it in a single constant (`src/config/brand.ts`) and read it everywhere so it can be renamed in one edit.

---

## 0. How you must work

1. You are a senior creative developer and product designer. Build everything end to end. **Do not ask me questions.** When something is ambiguous, choose whatever produces the most polished result and log the decision in `docs/PROGRESS.md`.
2. **First action:** save this brief verbatim to `docs/SPEC.md`, then create `docs/PROGRESS.md` (sections: Done, Decisions, Known issues). At the start of every phase, re-read those two files instead of re-scanning the repo.
3. **Plan before code.** Produce an Implementation Plan and a Task List, then write `docs/DESIGN.md`: palette, type, ASCII wireframes for the hero, the phone scene and the app shell, and the motion principles. Review that plan against section 5.6 (anti-template guardrails) and revise anything that reads like a generic default before you write code.
4. **Build in the six phases of section 13.** Every phase ends with: dev server running, verified in the browser at 1440x900 and 390x844, screenshots captured, zero console errors, and `git commit -m "phase N: ..."`. The app must never be broken at a phase boundary. If you run out of budget mid-phase, the last commit must still run.
5. **Be economical.** Prefer targeted edits over rewriting files. Reuse components. Do not regenerate what already exists.
6. **Library APIs move.** If an API differs from what you remember, read the package's README or type definitions in `node_modules` and adapt. Never guess.
7. No backend, no API keys, no `.env`. `npm install && npm run dev` is all anyone needs.
8. **Look at your own work in the browser.** Take screenshots, compare them with the design intent, and fix whatever looks cheap: uneven spacing, muddy contrast, janky easing, stray borders. Removing one decoration usually beats adding another.

---

## 1. What we are building

**Reference product: MigoMap, "Nearby Activities"** (Google Play and App Store; marketing site migomap.com). In short:

- A live map of plans that people nearby have posted for today: sports, hikes, coffee runs, workshops, game nights, jam sessions.
- One tap to join a plan, and you are added to that plan's group chat. Anyone can post their own plan and watch people show up.
- No feed, no followers, nothing to scroll. Real names and photos are visible and you see who is going before you join. Plans are always groups, in public places.
- Filter by interest. Go invisible any time. City chats. Plan trips with a crew. Report and safety flows.
- Free to join. Premium subscription (weekly / monthly / yearly). Local venues can pay to show sponsored plans on the map, clearly labelled.
- Marketing site sections: a hero with a live "people out right now" counter and rotating city photos; a three-step "open the map, tap a plan, chat" explainer with phone screenshots; a "two versions of tonight" comparison (on a feed vs on the app) ending in "nobody showed up" vs "four of you showed up"; a partners section (be on the map when people decide where to go, set your own budget, no sales call); a five-question FAQ; a final "go outside" call to action; a footer with safety, guidelines, child safety, content policy, privacy and terms.

**What we copy:** the feature set, information architecture, user flows and section order.
**What we never copy:** the name, logo, wording, screenshots, photography, or exact colours and layout. Write all copy fresh and generate every asset. (You may open migomap.com in the browser to study its structure. Reuse nothing from it.)

**Deliverable:** one Vite + React project containing
1. `/` a cinematic, scroll-driven landing site, and
2. `/app` a fully working web version of the product on fake data. Every button does something. No backend.

**Quality bar:** it must look and feel like a 10-lakh-rupee agency build. Awwwards-level polish, 60 fps, no jank, no broken images, no dead buttons, no lorem ipsum. "Better than the original" means a more considered identity, a scroll story that actually explains the product, real micro-interactions on every action, and the UX upgrades listed in section 8.9.

---

## 2. Scope and priorities

| Priority | What |
|---|---|
| **P0 (must ship)** | Global systems (section 6). Landing L1, L2, L3, L7, L8, L9 (section 7). App: map, bubbles, filters, plan list, plan sheet, join, group chat, create plan (sections 8.1 to 8.6). Fake data and simulation (section 9). Fully responsive. |
| **P1** | Landing L4, L5, L6. App: time scrubber, onboarding, my plans, chats list, trips, city chats, notifications, profile with invisible mode, Premium sheet. |
| **P2** | `/partners` dashboard, command palette (Ctrl/Cmd+K), info pages, referrals, demo-safe fallback when map tiles fail, easter eggs. |

If budget gets tight, cut P2 first, then P1. P0 must be flawless rather than P1 being half done.

---

## 3. Tech stack (use exactly this)

| Concern | Use |
|---|---|
| Build | Vite + React + TypeScript. Type strictness relaxed so type errors never block the dev server. |
| Styling | Tailwind CSS v4 via `@tailwindcss/vite`; tokens in `@theme`; hand-written CSS only for effects Tailwind can't express. |
| Routing | `react-router-dom`. Add a `vercel.json` with an SPA rewrite to `/`. |
| State | `zustand`. Persist joined/hosted plans, visibility, theme, onboarding flag and Premium, wrapped in try/catch. |
| Smooth scroll | `lenis` (import its CSS). **Landing page only.** |
| Timeline / scroll animation | `gsap` (3.13+ ships ScrollTrigger, SplitText and Flip in the public package) plus `@gsap/react` (`useGSAP`). If a plugin import fails, write a tiny custom splitter instead. |
| UI / gesture animation | `motion` (`import { motion, AnimatePresence } from "motion/react"`): sheets, layout animations, presence, springs. |
| Map | `maplibre-gl` + `react-map-gl` (`import Map, { Marker } from "react-map-gl/maplibre"`). No API key. Day style: `https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json`. Night style: `https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json`. Fallback: `https://basemaps.cartocdn.com/gl/positron-gl-style/style.json`. Keep the compact attribution visible. |
| Physics | `matter-js`, for the final-CTA emoji pile only. |
| Extras | `canvas-confetti`, `lucide-react`, `clsx` + `tailwind-merge`, `cmdk` (P2). |
| Fonts | Google Fonts `<link>` with preconnect: Bricolage Grotesque (axes `opsz,wdth,wght`) and Noto Color Emoji (so emoji look identical on Windows, Android and Mac). |

---

## 4. Project structure

```
sangam/
├─ docs/            SPEC.md · PROGRESS.md · DESIGN.md
├─ src/
│  ├─ config/       brand.ts · city.ts
│  ├─ data/         people · plans · chats · trips · cities · notifications · stories · faq
│  ├─ store/        useAppStore.ts · useSimulation.ts
│  ├─ lib/          rng.ts · api.ts · sky.ts · geo.ts · format.ts · cn.ts
│  ├─ systems/      SmoothScroll · Cursor · useMagnetic · Preloader · Sky · Orb · Grain · RouteTransition
│  ├─ ui/           PlanBubble · Avatar · AvatarStack · Button · Chip · Sheet · Toast · Odometer · StaticMap · PhoneFrame ...
│  ├─ landing/      Landing.tsx · sections/L1Hero ... L9Footer
│  ├─ app/          AppShell · MapView · PlanList · PlanSheet · ChatRoom · Composer · tabs/...
│  └─ pages/        Partners.tsx · InfoPage.tsx
├─ index.html       font links, meta tags, SVG pin favicon
├─ vercel.json
└─ README.md
```

---

## 5. Design direction

### 5.1 Concept: "The day is a scroll"
The landing page is one continuous day. Scrolling advances the clock: dawn, noon, golden hour, dusk, night, and back to dawn for the final "Go outside." The sky gradient, a sun-to-moon orb, the map tint, the timestamps in the copy and a small clock on the scroll rail are all driven by ONE scroll-progress value, so the page feels like a single living object instead of stacked sections. In the app the same idea returns as a time scrubber on the map and a theme that follows local time. Everything you design should make sense inside this idea.

### 5.2 Colour
Named tokens (Tailwind v4 `@theme` variables):

| Token | Hex | Role |
|---|---|---|
| `ink` | #14163A | Text on light skies; night surface |
| `marigold` | #FFC21A | Primary buttons; "happening now" bubbles |
| `bougainvillea` | #FF3D7F | Live / now dots, notifications, your own plans |
| `lagoon` | #10B5A5 | Joined, confirmed, success, focus ring |
| `paper` | #FFFFFF | Light app surfaces |
| `night` | #1D2050 | Dark app surfaces |

Sky keyframes for the landing page (top to bottom gradient), each with a clock label used by the scroll rail:

| Stage | Clock | Sky | Ink |
|---|---|---|---|
| Dawn | 6:10 am | #CFE0FF to #FFD6E0 | `ink` |
| Noon | 12:30 pm | #EAF4FF to #FFF3C4 | `ink` |
| Golden hour | 6:48 pm | #FFD08A to #FF8FA3 | `ink` |
| Dusk | 9:00 pm | #4B3FA6 to #E8607A | #FFF7F2 |
| Night | 11:50 pm | #0B0E2A to #1A1F5A | #F3F1FF |
| Pre-dawn | 5:30 am | #2B2F73 to #8E9BE0 | #F3F1FF |

Landing timeline: L1 = Dawn. L2 = Noon. L3 runs Golden hour, then Dusk, then Night (its own clock goes 6:48 pm to 11:50 pm). L4 and L5 = Night. L6 and L7 drift to Pre-dawn. L8 and L9 return to Dawn, closing the loop.

**Legibility rule:** interpolate the sky gradient, but do not interpolate text colour. Compute the sky's relative luminance each frame; when it crosses about 0.4, flip `--ink` between dark and light with a 200 ms transition. This avoids unreadable mid-grey text at the crossover. Verify at every keyframe and every mid-transition: body text must be at least 4.5:1.

**Colour is information.** Plan bubbles encode state, not category: white = a normal plan, marigold + pulse = happening now, ink with a marigold outline = sponsored, bougainvillea = yours, lagoon check = you've joined.

### 5.3 Typography
One family: **Bricolage Grotesque**, using its width and optical-size axes for hierarchy.
- Display: weight 800, width about 78 to 85 (condensed), tracking -0.03em, line-height 0.9, fluid `clamp()` up to about 12 to 14 vw on desktop. The hero headline is the largest thing on the page.
- Body: weight 400 to 450, width 100, 17 to 18 px / 1.5, max line length 68 characters.
- UI: 14 to 15 px, weight 500 to 600. Numbers use `font-variant-numeric: tabular-nums`.
- Hierarchy comes from size, weight and width, never from ALL CAPS, letter-spaced eyebrows or coloured words.
- Headlines use `text-wrap: balance`.

### 5.4 Shape and depth
- Vary the radii on purpose: pills (999) for chips and bubbles, 28 px for sheets and large cards, 16 px for in-app inputs and buttons, 44 px for the phone frame. Never one radius on everything.
- Shadows are layered and tinted with the current sky colour (for example a 1 px edge, a 10 px / 24 px soft one and a 40 px / 80 px ambient one), never a flat grey `rgba(0,0,0,.1)`.
- Glass (backdrop blur up to 16 px) only on the nav and the floating map controls.
- A static grain overlay (SVG `feTurbulence`, 4 to 6 percent opacity, `pointer-events: none`) sits over the whole landing page.
- Draw the sky on a fixed full-screen layer, not with `background-attachment: fixed` (broken on mobile Safari).

### 5.5 Imagery and assets (no external images, ever)
- No stock photos, no hot-linked images, no files you can't regenerate. Zero broken images.
- Build the visuals: procedural SVG maps (`StaticMap`), CSS/SVG pins, avatars generated from gradients + initials, sky and grain, physics emoji.
- `StaticMap`: a seeded-RNG SVG city (coast shape, road grid with diagonals, park patches, water). Used inside the phone, the partner builder and tiles, so you never spin up a second WebGL map.
- If your environment can generate images, you may create up to six illustrations for city cards. Otherwise stay procedural.
- Do not use official Google Play or App Store badge artwork. Build neutral store buttons.

### 5.6 Anti-template guardrails (do NOT do these)
- A warm-cream background with a serif display and a terracotta accent. A near-black page with one neon accent used everywhere.
- Headlines where a single word is set in italic, bold or a different colour.
- Tracked, ALL-CAPS eyebrow labels above headings; middle-dot strings ("A · B · C"); an arrow appended to every link; a monospace face for small labels.
- Numbered markers (01 / 02 / 03) anywhere except the genuine three-step sequence in L2.
- Grids of identical rounded cards with the same soft shadow; gradient washes used as decoration.
- Fade-and-slide-up on every section; hover-lift on every card; more than three signature motion moments.
- Lorem ipsum, "Coming soon", placeholder grey boxes.

**Spend boldness in three places:** (1) the hero, (2) the pinned phone scene, (3) the two-versions-of-tonight scene plus the final emoji pile. Everything else stays quiet, consistent and precise. That restraint is what makes it read as expensive rather than noisy.

### 5.7 Motion language
- Easing: entrances `expo.out` / `cubic-bezier(.16,1,.3,1)`; in-out `power3.inOut` / `cubic-bezier(.65,0,.35,1)`. Never `linear`, except marquees and the scroll rail.
- Durations: 120 / 220 / 380 / 640 / 1100 ms. Line reveals stagger 70 to 90 ms; bubble pops stagger 30 ms.
- Springs (motion): sheets `{ type: "spring", stiffness: 380, damping: 36 }`; bubble pop `{ stiffness: 520, damping: 24 }`; button press `{ stiffness: 600, damping: 30 }`.
- Scroll scrub smoothing: `scrub: 0.6` to `1`.
- Every piece of motion is either (a) driven by the user's scroll, pointer or tap, or (b) one of three deliberate ambient loops: bubble float, live-counter tick, map drift. Nothing else moves on its own.
- Only animate `transform`, `opacity`, `clip-path` and (small-area) `filter`. Never animate `width`, `height`, `top` or `left`.

---

## 6. Global systems (build once, reuse everywhere)

### 6.1 Smooth scroll (landing only)
- Lenis: `{ lerp: 0.085, wheelMultiplier: 0.9, smoothWheel: true, syncTouch: false }`. Native touch scrolling on phones.
- Sync with GSAP: `lenis.on("scroll", ScrollTrigger.update)`; `gsap.ticker.add((t) => lenis.raf(t * 1000))`; `gsap.ticker.lagSmoothing(0)`.
- Anchor links use `lenis.scrollTo(target, { offset: -80, duration: 1.4 })`.
- Pause Lenis while a modal or sheet is open. Put `data-lenis-prevent` on every inner scroller (menus, sheets, chat lists).
- Not mounted on `/app`. Off under `prefers-reduced-motion`.

### 6.2 Custom cursor (fine pointers only: `(hover: hover) and (pointer: fine)`)
The cursor must feel liquid, like it has weight.
- Two elements in a fixed, `pointer-events: none` layer above everything (z-index 9999), positioned with `translate3d` only: a 6 px **dot** and a 34 px **ring**.
- The dot follows with `gsap.quickTo(..., { duration: 0.08 })`; the ring with `{ duration: 0.45, ease: "power3.out" }`, so the ring trails the dot smoothly.
- **Velocity stretch:** the ring stretches up to `scaleX(1.35)` along its direction of travel (rotate it to the movement angle) and relaxes to a circle when still. Off under reduced motion.
- **States via `data-cursor` on any element** (use event delegation on `pointerover`):

| `data-cursor` | Ring | Label inside |
|---|---|---|
| default | 34 px outline | none |
| `link` (all buttons and links) | 56 px, marigold at 25 percent fill, dot hides | none |
| `drag` (map, sheets, physics emoji) | 84 px solid marigold | drag |
| `join` (plan bubbles, Join buttons) | 96 px solid marigold | join |
| `open` (cards that open something) | 84 px solid ink (light sky) or white (dark sky) | open |
| `pause` (marquee) | 72 px outline | pause |
| pressed | scale 0.85 | unchanged |

- Labels: sentence case, 12 px, weight 600, centered in the ring.
- Inputs, textareas, selects and `[contenteditable]` restore the native cursor and hide the custom one.
- Click feedback: 8 tiny particles in brand colours burst from the pointer and fade in 500 ms. Only on interactive elements.
- Theme-aware: ring and dot are ink on light skies, white on dark skies; 200 ms transition when the theme flips.
- Hidden until the first `pointermove` and when the pointer leaves the window. It never intercepts events. Apply `html.has-cursor * { cursor: none }` only while it is active.

### 6.3 Magnetic elements
`useMagnetic(ref, { strength: 0.35, radius: 90 })`: within the radius the element translates toward the pointer (max 12 px) via `gsap.quickTo`; on leave it returns with `elastic.out(1, 0.4)`. Apply to primary CTAs, the nav CTA, map control buttons and the wordmark. Off on touch.

### 6.4 Preloader (landing, once per session)
1.4 to 1.8 s total. Ink screen. A pin drops from the top with squash and stretch, lands and sends out a shockwave ring; the ring expands as a clip-path circle that reveals the hero while the headline starts its reveal. Skip it on repeat visits and with `?nopreload`. Never block input for more than 2 s. `/app` gets no preloader, only a 400 ms map fade-in.

### 6.5 Sky system (`useSky`)
One GSAP timeline scrubbed across the whole landing scroll tweens CSS variables on `:root`: `--sky-top`, `--sky-bottom`, `--ink`, `--ink-soft`, `--surface`, `--line`, `--shadow-tint`, and sets `data-theme="light|dark"` using the luminance rule in section 5.2. The same progress value drives the orb, the stars, the map tint, the scroll-rail clock label and the L3 clock.

### 6.6 Sun/moon orb and stars
A fixed layer behind the content. A soft radial-gradient disc travels along an arc across the page (low left, high middle, low right) over the whole scroll. It is a sun with a warm glow until inside L3, where it crossfades to a moon (pale lilac, faint crater texture); it becomes a sun again for the pre-dawn / dawn ending. About 120 stars (tiny radial gradients) whose opacity follows how "night" the sky is; slow twinkle, static under reduced motion.

### 6.7 Navigation
Floating glass pill, top 16 px, centered: wordmark with a small animated pin, links (How it works, Why, Places, FAQ), primary CTA "Open the map" (magnetic). Hides on scroll down (`translateY(-140%)`) and returns on scroll up. The active-link marker slides between links (`layoutId`). Mobile: wordmark + menu button; the menu is a full-screen sheet with staggered links.

### 6.8 Scroll rail
Fixed at the right (desktop only): a 140 px vertical line with a dot that travels as you scroll and a small label showing the current clock time from the sky timeline ("6:10 am"). Linear easing is allowed here.

### 6.9 Route transition: "the map opens"
Clicking "Open the map" or a hero bubble grows a marigold circle from the click point (`clip-path: circle()`, 650 ms, `power3.inOut`). The route changes at the midpoint; the circle then shrinks onto the user's location dot to reveal the app, and the bubbles pop in with a radial stagger from that dot. Returning to the landing page reverses it in 450 ms.

### 6.10 Fallbacks
- Touch devices: no custom cursor, no magnetic, no hover-only effects (use tap states).
- `prefers-reduced-motion`: no Lenis, no pinning or scrubbing (sections stack normally), no velocity stretch, marquees paused, sky changes to per-section static values, reveals become instant. Everything still works and looks intentional.

---

## 7. Landing page (`/`) storyboard

Desktop first, then a considered mobile version (section 11). Section order follows the reference (hero, explainer, comparison, partners, FAQ, final CTA, footer) plus two additions (why, stories).

### L1. Hero (P0)
**Idea:** the hero is the product itself: a live map with believable plans on it.

```
+--------------------------------------------------------------+
|  (o) sangam     How it works  Why  Places  FAQ   [Open map] |  glass pill
|                                                  o 12,804    |  live chip
|        (live pitched map, bubbles floating)      out now     |
|      (B)           (B)              (B)                      |
|              (B)          (B)              (B)               |
|                                                              |
|  Someone near you                                            |
|  already has a plan.                                         |
|  Open the map, tap a plan, show up. No feed. No followers.   |
|  [ Open the map ]  [ Get the app ]        Mumbai . Delhi ... |
|                                                     6:10 am  |  scroll rail
+--------------------------------------------------------------+
```

- **Background:** MapLibre (Voyager), `interactive: false`, over the Mumbai seafront, pitch 58, zoom 13.4, bearing -18, compact attribution. Slow idle drift: bearing +/-3 degrees over about 30 s (ambient loop 1).
- **Headline** (two lines, left-aligned, bottom-left, huge): "Someone near you / already has a plan." Reveal per line with SplitText (`yPercent 110 -> 0`, stagger 0.09, 1.2 s, `expo.out`) right after the preloader. Then the sub-copy (fade + 16 px), then the CTAs (scale-in with slight overshoot), then the bubbles.
- **Sub-copy:** "Open the map, tap a plan, show up. No feed. No followers. No small talk."
- **Live chip** beside the headline block: pulsing bougainvillea dot + an odometer: "12,804 people are out right now". Digits roll vertically (700 ms). The value changes by 1 to 7 every 2.5 to 4 s (ambient loop 2).
- **CTAs:** primary "Open the map" (marigold, magnetic, triggers section 6.9); secondary "Get the app", which opens a small modal with two neutral store buttons that show a "Demo build" toast.
- **City ticker** under the CTAs: names roll vertically every 2.2 s: Mumbai, Delhi, Bengaluru, Pune, Goa. No flag emoji.
- **12 plan bubbles** (`PlanBubble`) pop in (scale 0 to 1, `back.out(2)`, stagger 30 ms) radiating from the primary CTA's screen position. Idle float +/-4 px on a sine, 4 to 6 s, random phases. Pointer repel: within 140 px they slide away up to 18 px (`quickTo`). Hover: the bubble springs open into a mini card (title, time, three avatars) and the cursor becomes `join`. Click goes to `/app?plan=<id>` with the section 6.9 transition.
- **Scroll (hero pinned for about 160 vh, scrub 0.8):** headline lines drift up and fade at different rates; sub-copy and CTAs fade; the camera flies along three waypoints (Marine Drive, Bandstand, Carter Road) with pitch 58 to 68 and bearing -18 to 28; bubbles re-key to their new positions with a stagger; the sky moves Dawn to Noon and the orb climbs.
- **Signature transition into L2:** the full-screen map shrinks into the phone screen of L2 (scrub `clip-path: inset()` + border-radius from full-bleed to the phone screen rect). If this fights the layout or drops frames, fall back to a crossfade. Do not spend more than one attempt on it.

### L2. Three taps (P0, pinned phone scene, about 300 vh)
Heading: "Map, tap, go." Sub: "No invite. No approval. You see who's going before you tap."
- Layout: copy on the left, `PhoneFrame` on the right (Android style: punch-hole camera, thin bezel, gesture bar; built in CSS). A vertical progress line beside the three steps fills as you scroll.
- Steps (the only place numbered markers are allowed):
  1. **Open the map.** "Bubbles are plans happening near you today."
  2. **Pick one.** "Check who's in, then hit join."
  3. **Say hi first.** "The chat is live before you leave home."
- Phone content is real React screens built from shared primitives on a `StaticMap`, not screenshots:
  - Screen A: map with 8 bubbles popping in.
  - Screen B: the plan card slides up (title, host, avatar stack, "Join - 5 going"). At about 55 percent of the step a ghost fingertip presses Join: the button morphs to a lagoon check, your avatar joins the stack, a small confetti burst.
  - Screen C: group chat. Messages appear one by one with typing dots; the last one is "see you at 7".
- Scroll only drives the **step index** (0, 1, 2) and the phone's rotation. Each step change plays a spring animation (motion `layoutId`: the tapped bubble expands into the plan card; the Join button collapses into the chat header pill). Do not scrub pixels inside the phone.
- The phone also tilts with the pointer (+/-6 degrees) with a moving specular highlight, and floats +/-6 px.
- Mobile and reduced motion: no pin; each step is its own block and its screen animates once on enter.

### L3. Two versions of tonight (P0, pinned clock scene, about 260 vh)
The emotional centre of the page.
- A centered SVG clock dial (about 320 px) whose hands sweep from 6:48 pm to 11:50 pm as you scroll. Left column "On a feed", right column "On {brand}". Five timestamped rows each, revealed in pairs as the clock passes them.
- The sky runs Golden hour, Dusk, Night inside this section; the orb becomes a moon.
- Left rows desaturate and fade as the night goes on, ending on 4 ghost outlines and "Nobody showed up." Right rows light up, and a `StaticMap` between the columns drops pins and draws a dotted route of people converging on one court. It ends on 4 avatars popping in (spring, 90 ms stagger) and "Four of you showed up."
- Finale line, centered, giant: "Only one of these was an evening you were in." Word-by-word opacity scrub (0.15 to 1).
- Starting copy (rewrite in the same spirit; keep it short and human):
  - On a feed: 6:48 "Free evening. You open the feed." / 7:30 "Forty minutes in. Somebody else's dinner." / 8:40 "Saved three things. Going to none." / 10:05 "Screen dims. Same couch." / 11:50 "Nobody showed up."
  - On {brand}: 6:48 "Free evening. You open the map." / 7:30 "Four plans within a ten-minute walk. You join badminton." / 8:40 "The court. Four strangers, one shuttle." / 10:05 "Chai after. Numbers swapped." / 11:50 "Four of you showed up."

### L4. Why it feels different (P1)
A bento of six tiles in varied sizes (not identical cards). Each has a tiny live micro-demo that plays on enter or hover:
1. **No feed, no followers:** a blurred feed scrolls, then the map wipes across it.
2. **Real names, real faces:** an avatar flips to show name + verified tick.
3. **Always public places:** a pin snaps onto a lit landmark with a "public" halo.
4. **Chat opens on your first tap:** typing bubbles.
5. **Go invisible any time:** a toggle turns a dot into a ghost.
6. **Free to join:** a ticket gets a Rs 0 stamp.

Tiles have a cursor-spotlight border (radial gradient at the pointer via CSS variables) and +/-5 degree 3D tilt. One staggered entrance for the whole grid, not per-element scroll fades.

### L5. For places (P1)
Heading: "Be on the map when people pick where to go." Three points: people nearby see you; you set the budget; no sales call. Then an interactive **ad builder**: venue chips (Cafe, Turf, Studio, Bookshop), a daily budget slider (Rs 200 to Rs 5,000) and a radius slider. A `StaticMap` shows a "Sponsored" bubble whose halo grows with the radius; a GSAP count-up shows "about 1,840 people nearby will see this". CTA "Create your first ad" opens `/partners`.

### L6. Stories (P1)
Two counter-scrolling marquee rows of about 14 short fake quotes each (avatar, first name, city, a line like "Found my Sunday cycling gang in one evening."). Speed multiplies with scroll velocity (x1 to x4). Pointer over a row: `pause` cursor and the row eases to a stop.

### L7. FAQ (P0)
Five questions in an accordion, one open at a time, height animated with motion, plus icon rotating 45 degrees. Topics: I don't know anyone, is that okay? / Is it safe to meet strangers? / Can I bring a friend? / What if nobody shows up? / What does it cost, and what does "sponsored" mean? Write original two-to-three-sentence answers. Buttons: "Read the safety policy" (`/safety`) and "Still stuck? Email us".

### L8. Go outside (P0)
The sky returns to dawn. Headline "Go outside." at about 16 vw. Below it, **an emoji pile**: 60 DOM emoji elements (activity emoji) driven by matter-js (gravity 1, restitution 0.5, walls at the section bounds). They drop when the section is about 40 percent in view, can be dragged (`drag` cursor) and get nudged by the pointer. Render emoji as DOM elements positioned from the physics bodies, not as canvas text. Rebuild on resize. If matter-js is still fighting you after one attempt, fall back to a CSS-only falling and stacking emoji animation. CTAs: primary "Open the map", secondary neutral store buttons.

### L9. Footer (P0)
Four columns: Product (How it works, Why, Places), Get it (Android, iPhone, Download), Trust (Safety, Guidelines, Child safety, Content policy), Legal (Privacy, Terms, Contact). A giant wordmark clipped by the bottom edge. Line: "Made for free evenings." Every link works: info links open a styled page with a readable fake policy.

---

## 8. The working app (`/app`)

Everything here is functional against in-memory fake data (section 9). Every action has a satisfying animation, a toast, and a sensible empty / loading / error state.

### 8.1 Shell and navigation

Desktop (1024 px and up):
```
+--------+--------------------------------------------+----------+
| rail   | search [____]   chips: All . Sports . Food | plan     |
| Map    |                                            | drawer   |
| Plans  |          MAP (pitched, bubbles)            | (opens   |
| Chats  |                                            | on pick, |
| Trips  |  [plan list, floating, left]               | 420 px)  |
| You    |                                            |          |
| [+Post]|  (scrubber) Now . Tonight . Tomorrow . Wknd|          |
+--------+--------------------------------------------+----------+
```

Mobile (below 1024 px):
```
+----------------+
| search      bell|
| chips >>>       |
|                 |
|      MAP        |
|     bubbles     |
|                 |
| (scrubber)      |
| ==== sheet ==== |  peek / half / full
| Map Plans [+] Chats You |
+----------------+
```

- Tabs: **Map** (default), **Plans** (mine), **Chats**, **Trips**, **You**. Tab changes slide content with a shared underline or pill (`layoutId`). The centre "Post" button is a marigold pill that morphs into the composer (section 8.6).
- Deep links: `/app?plan=<id>`, `/app/chats/<planId>`, `/app/trips/<id>`.
- Theme: auto by real local time (day 6:00 to 18:30, otherwise night), with a manual Auto / Day / Night control in **You**. The theme switches the map style and the UI tokens with a 400 ms crossfade.

### 8.2 Map
- MapLibre via react-map-gl. Day: Voyager. Night: Dark Matter. The camera starts on the user's fake location (Bandra West, `[72.83, 19.059]` as `[lng, lat]`), zoom 12.6, pitch 50, bearing -12. If the style has a `building` source layer, add a subtle `fill-extrusion` from zoom 14; skip silently if it doesn't.
- "You are here": ink dot, white ring, lagoon radar pulse.
- **Bubbles** (`PlanBubble`, state colours in section 5.2): emoji disc + going count. Size scales 0.9 to 1.2 with popularity. Hover: lift 6 px with a soft ground shadow that shrinks. Selected: halo ring, others dim to 60 percent. Sponsored ones show a small "Sponsored" tag on hover.
- **Zoom-out grouping:** below zoom 11.8, replace bubbles with area chips ("Bandra - 14 plans") grouped by nearest anchor; clicking one flies in.
- **Camera padding:** when a plan opens, `easeTo` with padding (right 440 px on desktop, bottom 62 percent on mobile) so the selected bubble is never hidden behind the sheet.
- Controls (glass, magnetic): recenter, 2D/3D, day/night, zoom +/-. Keyboard: `/` focuses search, `Esc` closes the sheet, `J` / `K` next / previous plan.
- **List and map hover sync:** hovering a list card highlights its bubble, and hovering a bubble highlights its card. Keep this rock solid.
- **Filters:** a horizontally scrolling chip rail with emoji + label: All, Sports, Food and coffee, Outdoors, Creative, Games, Music, Study, Wellness, Trips. Selecting a chip filters with a staggered bubble exit / enter (spring). Chips show counts. A "Starting soon" toggle.
- **Search:** filters by title, place and host; results in a dropdown with keyboard navigation.
- **Empty state:** "Nothing here yet. Post the first plan." with a button that opens the composer.

### 8.3 Plan sheet
Desktop: right drawer (420 px). Mobile: bottom sheet with drag snap points (peek 96 px / half 52 percent / full 92 percent), built with motion `drag="y"` and velocity-aware snapping; its inner content scrolls only at the full snap point.
Contents:
- Emoji + title.
- Host: real name, generated photo, verified tick, "hosted 12 plans".
- When: "Today, 7:00 pm", plus a live countdown when under an hour.
- Where: place name, "Public place" chip, distance and a fake walking ETA.
- Who's going: avatar stack (tap to see names), capacity meter with a "2 spots left" urgency chip.
- Vibe tags and a one-to-two-sentence description.
- **Join** button.
- Secondary actions: Share (copies a link, toast), Bring a friend (+1 stepper), Report (reason sheet, then a thank-you state), Add to calendar (fake).
- Sponsored plans show a "Sponsored by <venue>" strip.

### 8.4 Join (the hero interaction: make it delightful)
- Default: marigold "Join - 5 going". Pressed: spring scale 0.96. Simulated latency 300 to 700 ms with an inline spinner inside the button.
- Success: the button morphs into a lagoon check and a ripple runs out; **your avatar flies from the button into the avatar stack** (motion layout animation) while the count ticks up (odometer); `canvas-confetti` (60 particles, brand colours, scalar 0.8) fires from the button; `navigator.vibrate(12)` where supported; a toast appears: "You're in. Chat is open." with actions **Open chat** and **Undo** (5 s).
- Other states: Full ("Join waitlist"), Joined ("Going", with a Leave option), Hosting ("Your plan", with Edit / Cancel).

### 8.5 Group chat
- Per plan: header (emoji, title, member count, pinned Where / When strip), message list, composer.
- Bubbles with avatars, timestamps grouped by day, **reactions** (long-press or hover), a **poll** message type ("Cafe or chai stall?") with animated bars, and system messages ("Riya joined").
- Typing indicator (three bouncing dots). Scripted auto-replies: 900 to 2200 ms after the user sends, one member replies from a contextual pool.
- New messages auto-scroll unless the user has scrolled up; then show a "New messages" pill.
- Enter sends; Shift+Enter adds a line. Mobile: full screen with a keyboard-safe composer (`100dvh`, safe-area insets).

### 8.6 Create plan (composer)
A full-screen sheet with five steps and a progress indicator drawn as a pin path that fills:
1. **What's the plan?** Title, emoji picker, category chips.
2. **When?** Quick chips (In 1 hr / Tonight / Tomorrow morning / Pick a time) and a duration.
3. **Where?** The map enters "place mode": a fixed crosshair pin at the centre; drag the map to position; after a short fake delay the label resolves to the nearest anchor ("Near Bandstand"). A "Public place" chip must be ticked, otherwise show "Pick a public place".
4. **Who can join?** Group size stepper (2 to 20), open to all or verified only.
5. **Review.** A live preview bubble + card. Button: "Post to map".

On post: the sheet collapses into the map, the camera flies to the location, **a pin drops from above with a bounce and a shockwave ring**, a toast appears, and the plan sits at the top of the list as yours (bougainvillea). The simulation then sends fake people to join it over the next minute.

### 8.7 Time scrubber (signature UX feature, P1)
A bottom-centre pill: chips Now / Tonight / Tomorrow / Weekend and a draggable scrubber across the next 36 hours. Scrubbing fades and scales bubbles by proximity to the chosen time (with a stagger), updates the label ("Sat, 6:30 pm"), and grades the map toward that time of day (a CSS filter on the map canvas, or an overlay beneath the markers; your call, keep it subtle). "Now" snaps back with a spring. Fully keyboard operable (arrow keys).

### 8.8 Other tabs and sheets (P1)
- **Plans:** Upcoming / Hosting / Past with an animated tab underline; swipe-to-leave on mobile.
- **Chats:** joined plans and city chats with unread badges, last-message preview and typing state.
- **Trips:** "Plan trips with your crew." Three fake trip cards (a long weekend in Goa, a monsoon day trip to Lonavala, a Kanheri trek). Detail: dates, members, a day-by-day itinerary timeline, a packing checklist (ticking strikes through with animation), a small shared-budget tracker, and the trip chat.
- **City chats:** open rooms (Mumbai everyone, Bandra locals, Weekend hikers, Foodies) with member counts; join and chat with scripted messages.
- **You:** avatar, stats (plans joined / hosted), badges, an **Invisible mode** toggle (your dot becomes a hollow ghost on the map, a banner says you're hidden, ghost animation), a Premium card, a referral code with a copy button and progress ("Invite 3 friends, get a week of Premium"), and Settings (theme, notification toggles, reset demo data).
- **Notifications:** bell with badge opens a popover list ("Aarav joined your plan", "Badminton starts in 30 min") with mark-all-read.
- **Premium sheet:** segmented Weekly / Monthly / Yearly control with a sliding thumb (`layoutId`), odometer price change (Rs 99 / Rs 249 / Rs 1,499), a perk list (boost your plan to 3x reach, unlimited joins per day, advanced filters, priority chat). "Continue" runs a fake processing state, then a celebratory success state and a crown badge on the profile. The purchase is simulated; say so in small print.
- **Onboarding (first visit only):** 1) location "Allow" with a radar animation (fake), 2) choose interests (chips), 3) name and avatar picker. Skip is always available. Then the map opens with the radial bubble pop-in.

### 8.9 UX upgrades over the original ("100x better" means these)
1. Time scrubber: see the city at any hour.
2. Two-way list and map hover sync, and camera padding so the selected plan is never covered.
3. Optimistic join with undo, avatar-flies-into-stack, confetti.
4. Urgency chips: "Starts in 12 min", "1 spot left", "Full: join waitlist".
5. Smart empty states that say what to do next.
6. Skeleton shimmer during the simulated 300 to 800 ms latency instead of blank panels.
7. Keyboard everywhere: `/`, `Esc`, `J` / `K`, arrow keys, Ctrl/Cmd+K (P2).
8. Auto day / night by local time, applied to the map too.
9. Haptics (`navigator.vibrate`) on join and post.
10. Every state change is animated (nothing pops in without motion) and every animation is interruptible.

---

## 9. Fake data and simulation

Put everything in `src/data/*` and expose it through a tiny async `api` module (`src/lib/api.ts`) that resolves after 250 to 800 ms so loading states are real. All data is seeded (`mulberry32`) so the demo is deterministic.

- **People (40):** id, full name (a natural mix of Indian and international first names + a surname initial; no real public figures), generated avatar (gradient + initials), `verified` (about 60 percent), interests, plans hosted. The current user is "Aarav M." (change freely).
- **Plans (48):** id, title, emoji, category, hostId, `startsInMin` (-40 to +2,100; about 10 are live now), durationMin, place `{ name, area, lngLat, isPublic: true }`, capacity, goingIds, vibe tags, description (1 to 2 sentences), `sponsored?`, `sponsorName?`. Four sponsored plans (cafe, turf, studio, bookshop). Keep everything PG. Use landmarks and generic venue names ("a rooftop cafe", "the chai stall by the station"). **No real brands and no real people.**
- **Anchors (Mumbai, `[lng, lat]`):** approximate. Jitter each plan by up to 0.002 so bubbles don't stack, then **open the map and check that no pin sits in water; nudge inland if one does.**
  Marine Drive [72.8236, 18.9433] · Girgaum Chowpatty [72.8135, 18.9545] · Gateway of India [72.8340, 18.9226] · Colaba Causeway [72.8258, 18.9150] · Kala Ghoda [72.8318, 18.9289] · Churchgate [72.8264, 18.9322] · Hanging Gardens [72.8043, 18.9569] · Lower Parel [72.8256, 18.9944] · Worli Sea Face [72.8165, 19.0100] · Shivaji Park [72.8380, 19.0270] · Bandra Bandstand [72.8190, 19.0425] · Carter Road [72.8228, 19.0692] · BKC [72.8690, 19.0670] · Juhu Beach [72.8266, 19.0985] · Versova [72.8135, 19.1315] · Lokhandwala [72.8296, 19.1364] · Powai lakeside [72.9075, 19.1195] · Aarey [72.8800, 19.1500] · Kanheri trail [72.9051, 19.2054] · Chembur [72.9005, 19.0522].
  Keep the city in `src/config/city.ts` (`CITY = "mumbai"`, centre, anchors) so it can be swapped in one edit.
- **Example plans (tone reference; write about 48 in total):** Sunrise walk on Marine Drive · Badminton doubles, need two more · Board games and chai · Sketching the seafront · Sunday cycle to Aarey · Kanheri trail, easy pace · Bandstand acoustic jam, bring anything · Five-a-side football · Silent book club at a cafe · Photowalk in Kala Ghoda · Sunset yoga at Juhu · Salsa beginners' social · Founders' coffee (no pitching).
- **Chats:** about 14 scripted threads (3 to 12 messages each) in a natural voice ("which gate?", "bringing an extra racket", "running 5 mins late"), one with a poll, one with reactions. A pool of 25 contextual auto-replies.
- **Also:** 3 trips, 8 notifications, 14 stories, 8 cities (Mumbai, Delhi, Bengaluru, Pune, Goa, Hyderabad, Kolkata, Chennai) with fake "plans today" counts, 5 FAQ entries.
- **Simulation engine (`useSimulation`)** makes the demo feel alive:
  - A new plan drops onto the map every 8 to 14 s (with the drop animation; a toast at most once per 30 s).
  - A member joins one of *your* plans about every 12 s (avatar stack grows, a notification arrives).
  - A message arrives in a joined chat every 3 to 6 s.
  - The live counter drifts; "starting soon" chips update; finished plans fade out.
  - Pause everything when the tab is hidden.

---

## 10. Copy and voice

- Voice: warm, quick, slightly cheeky. Sentence case everywhere. Short sentences, plain verbs, no marketing filler. Say what the thing does: "Join", "Post to map", "Open the map", never "Submit" or "Get started".
- One action keeps one name through the whole flow: the button says "Post to map", the toast says "Posted to the map."
- Errors and empty states say what happened and what to do next. They don't apologise or joke.
- Every mention of the product name reads from `BRAND.name`.
- Write all copy fresh. Do not reuse MigoMap's wording. The lines in this brief are starting points; polish them.
- No lorem ipsum, no "Coming soon", no "Feature X".

---

## 11. Responsive, accessibility, performance

**Responsive.** Design at 360, 390, 768, 1024, 1280, 1536 and 1920 px. Mobile specifics:
- Landing: no pinned scenes. L1 keeps the live map behind the hero (cap pixel ratio at 1.5, antialias off) with 8 bubbles. L2's phone sits in the flow with each step as a block. L3 becomes a vertical timeline with the clock as a sticky header. The emoji pile uses 30 emoji. Marquees stay.
- App: full-screen map, bottom sheets with drag snapping, bottom nav with the centre Post button. Filters scroll horizontally. All hit targets 44 px or larger.
- Use `100dvh`, respect `env(safe-area-inset-*)`, no horizontal scroll at any width.

**Accessibility.**
- Semantic landmarks and heading order. Visible focus ring (2 px lagoon with offset) on everything focusable. Sheets and modals trap focus and close on `Esc`.
- Bubbles have real labels: "Badminton doubles, 6 going, starts in 40 minutes". Toasts and chat use `aria-live`.
- Body text 4.5:1 or better at every scroll position (section 5.2). Colour never carries meaning alone.
- `prefers-reduced-motion` behaviour as in section 6.10.

**Performance.**
- Animate only `transform`, `opacity`, `clip-path` and small-area `filter`. `will-change` only while animating.
- Code-split the landing and app routes; lazy-load MapLibre with a dynamic import.
- Mount heavy sections near the viewport (IntersectionObserver). Pause loops and tickers when off screen or when the tab is hidden.
- Cap device pixel ratio at 2. Batch DOM reads and writes. No scroll event listeners (use ScrollTrigger / Lenis callbacks).
- Target 60 fps on a mid-range laptop. After `vite build`, the main chunk stays under about 250 KB gzipped, excluding the map chunk.

---

## 12. Known pitfalls (follow these)

1. **MapLibre markers:** the library sets `transform` on the marker root. Never animate that element. Put all animation on an inner wrapper.
2. **Coordinates are `[lng, lat]`** in MapLibre. Import `maplibre-gl/dist/maplibre-gl.css`. Give the map container an explicit height. Call `map.resize()` when its container animates. Re-add custom layers on `style.load` after any style swap.
3. **GSAP in React:** use `useGSAP` with a `scope`, register plugins once, clean up on unmount (StrictMode double-mounts). Call `ScrollTrigger.refresh()` after `document.fonts.ready` and after the map first renders.
4. **Pinning:** never pin an element whose ancestors have `transform`, `filter`, `overflow: hidden` or `contain`. Use `pin: true` with `pinSpacing` and `anticipatePin: 1`.
5. **Lenis and inner scrollers:** add `data-lenis-prevent` to chat lists, sheets and menus. On `/app` the wheel over the map must zoom the map (Lenis isn't mounted there). On the landing page the hero map is non-interactive so it never traps the wheel.
6. **Cursor:** `position: fixed`, `pointer-events: none`, `translate3d`, z-index above sheets and modals, hidden on touch, never blocks focus rings or text selection.
7. **Mobile viewport:** `100dvh`, not `100vh`. The composer must not jump when the keyboard opens.
8. **Emoji in physics:** DOM elements, not canvas text. Use the Noto Color Emoji stack. No flag emoji for city names (they don't render on many Windows setups).
9. **Sky vs legibility:** flip ink at the luminance threshold (section 5.2). Re-check contrast after any colour change.
10. **Persistence:** wrap every storage call in try/catch. The app must work with storage blocked.
11. **Network:** if map tiles fail, show a friendly inline state and keep the rest of the app working.
12. Ship no `console.log`, no unused libraries, no dead routes.

---

## 13. Build phases (each ends runnable, verified in the browser, and committed)

**Phase 1: Foundation and systems.** Scaffold Vite + React + TS + Tailwind v4; fonts; tokens; router + `vercel.json`; `docs/DESIGN.md`; fake-data layer, `api`, store, `useSimulation`; Lenis + GSAP sync; custom cursor + magnetic; preloader; grain; sky system + orb + stars; nav; scroll rail; route transition; README skeleton. *Verify:* a tall dummy page shows smooth scroll, the cursor states and the sky/clock changing.

**Phase 2: Landing, P0 sections.** L1 hero, L2 phone scene, L3 clock scene, L7 FAQ, L8 final CTA + emoji pile, L9 footer, plus the mobile and reduced-motion versions of each. *Verify:* pinned scenes scrub forward and backward; the L1-to-L2 transition (or its fallback); text readable at every scroll position.

**Phase 3: App core (P0).** Shell, map, bubbles, zoom-out grouping, filters, search, plan list with hover sync, plan sheet, join sequence, group chat with auto-replies, create-plan composer, "the map opens" transition, simulation wired in. *Verify:* run the full click-through in the browser: pick a plan, join, chat, post a plan.

**Phase 4: App, P1.** Time scrubber, onboarding, Plans, Chats, Trips, city chats, You (invisible mode, referrals, settings), notifications, Premium sheet. *Verify:* every tab and sheet, day and night themes.

**Phase 5: Landing P1 and P2 extras.** L4 bento, L5 ad builder, L6 stories; then `/partners` dashboard, command palette, info pages, easter eggs (Konami code makes it rain emoji; long-press the wordmark to toggle night), demo-safe map fallback.

**Phase 6: QA and polish.** Walk the whole checklist in section 14 in the browser. Fix jank, contrast, spacing and console warnings. Run `npm run build` and `npm run preview`. Finish the README. Attach screenshots and recordings as artifacts.

---

## 14. Definition of done (verify in the browser and tick each one)

**Landing**
- [ ] The preloader plays once, is skippable and lasts under 2 s. The hero headline reveals; bubbles pop in, float, repel the pointer and expand on hover.
- [ ] Sky, orb, stars, clock rail and map tint move together, and text is readable at every scroll position.
- [ ] The L2 pinned phone scene steps cleanly forward and backward. The L3 clock scene reads well and ends on the finale line.
- [ ] The emoji pile falls, can be dragged and rebuilds on resize.
- [ ] Cursor: smooth trail, velocity stretch, all `data-cursor` states, magnetic buttons, hidden on touch.
- [ ] Reduced-motion mode works and still looks designed.

**App**
- [ ] The map loads in day and night; every pin is on land; list and map hover sync; filters and search work.
- [ ] Join: full animation sequence, undo and chat unlock. Leave works.
- [ ] Chat: send, typing indicator, scripted reply, reaction, poll, new-message pill.
- [ ] Create plan: five steps, place mode, pin drop with shockwave; the plan appears in the list and receives fake joiners.
- [ ] Time scrubber, onboarding, Plans, Chats, Trips, You (invisible mode), Premium and notifications all work.
- [ ] The simulation is running: new plans, joins, messages, counter drift.

**Quality**
- [ ] 60 fps on a mid-range laptop in Chrome; no layout shift after load.
- [ ] Verified at 360, 390, 768, 1024, 1440 and 1920 px wide.
- [ ] Keyboard: everything reachable, focus visible, `Esc` closes overlays.
- [ ] No console errors or warnings. `npm run build` succeeds and `npm run preview` looks identical to dev.
- [ ] README explains: run, build, deploy to Vercel, edit the fake data, rename the brand, change the city.
- [ ] Artifacts attached: screenshots (landing scroll stops, app flows), one browser recording of the landing scroll and one of join + create.

Finish with a short summary: routes, what is fake, known limitations.
