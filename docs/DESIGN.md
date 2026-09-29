# Sangam Design System & Technical Specification

## 1. Palette & Theme System

The design is grounded in the concept **"The day is a scroll"**. A single scroll-progress value drives the sky gradient, the sun/moon orb position, the map tint, and the scroll-rail clock label.

### Core Token Definitions
| Token | Hex | Meaning & Application |
|---|---|---|
| `ink` | `#14163A` | Primary text on daylight skies; deep night app surface |
| `marigold` | `#FFC21A` | Primary CTAs, active badges, "happening now" pulse |
| `bougainvillea` | `#FF3D7F` | Live indicators, notifications, user's own plans |
| `lagoon` | `#10B5A5` | Joined confirmation, success state, focus rings |
| `paper` | `#FFFFFF` | Light app cards and sheets |
| `night` | `#1D2050` | Dark app cards and sheet surfaces |

### Sky Keyframes Across the Day
- **Dawn (6:10 am):** `#CFE0FF` to `#FFD6E0` (`ink`: `#14163A`)
- **Noon (12:30 pm):** `#EAF4FF` to `#FFF3C4` (`ink`: `#14163A`)
- **Golden hour (6:48 pm):** `#FFD08A` to `#FF8FA3` (`ink`: `#14163A`)
- **Dusk (9:00 pm):** `#4B3FA6` to `#E8607A` (`ink`: `#FFF7F2`)
- **Night (11:50 pm):** `#0B0E2A` to `#1A1F5A` (`ink`: `#F3F1FF`)
- **Pre-dawn (5:30 am):** `#2B2F73` to `#8E9BE0` (`ink`: `#F3F1FF`)

**Luminance Flipping Rule:**
Sky gradient is smoothly interpolated, while `--ink` flips between `#14163A` and `#F3F1FF` when sky luminance crosses 0.4 with a 200ms transition to guarantee >4.5:1 WCAG contrast at all times.

---

## 2. Typography

Single primary family: **Bricolage Grotesque** with optical size, weight, and width axes (`opsz,wdth,wght`), plus **Noto Color Emoji** for unified cross-platform emoji rendering.

- **Hero Display:** `font-weight: 800`, width: ~80 (condensed), tracking: `-0.03em`, line-height: `0.9`, fluid `clamp(3rem, 11vw, 9.5rem)`.
- **Headlines:** `font-weight: 700-800`, `text-wrap: balance`, no ALL-CAPS or tracking gimmicks.
- **Body:** `font-weight: 400-450`, width: 100, `17-18px`, line-height: `1.55`, max-width `68ch`.
- **UI & Badges:** `14-15px`, weight 500-600, tabular numbers `font-variant-numeric: tabular-nums`.

---

## 3. Shape, Depth & Anti-Template Guardrails

- **Radii:** 999px for pills/chips, 28px for modal sheets and cards, 16px for form inputs, 44px for `PhoneFrame`.
- **Layered Tinted Shadows:** 1px sharp highlight, 10px/24px soft elevation, 40px/80px ambient glow tinted with the current sky hue.
- **Grain:** Fixed SVG `feTurbulence` (opacity ~0.04) across the landing page.
- **Boldness Reserved For 3 Places Only:**
  1. The Hero (fullscreen map + massive headline + reactive bubbles).
  2. The Pinned Phone Scene (L2 - real React screens on StaticMap).
  3. Two Versions of Tonight (L3 - sweeping clock + dual timeline) & the final Emoji Pile (L8 - matter-js physics).

---

## 4. ASCII Wireframes

### 4.1 Hero Wireframe (L1)
```
+------------------------------------------------------------------+
|  (o) sangam        How it works   Why   Places   FAQ    [Open map]   |  <- glass pill nav
|                                                     o 12,804 out |  <- live odometer
|           MAPLIBRE (Voyager, pitch 58, bearing -18)              |
|        (B)               (B)                  (B)                |
|                 (B)               (B)                  (B)       |
|                                                                  |
|  Someone near you                                                |
|  already has a plan.                                             |  <- SplitText reveal
|  Open the map, tap a plan, show up. No feed. No followers.       |
|  [ Open the map ]   [ Get the app ]        Mumbai . Delhi . Pune |
|                                                          6:10 am |  <- scroll rail
+------------------------------------------------------------------+
```

### 4.2 Pinned Phone Scene (L2)
```
+------------------------------------------------------------------+
| Map, tap, go.                       +--------------------------+ |
| No invite. No approval.             |  [o]   12:30        98%  | |
| You see who's going before you tap. |                          | |
|                                     |    StaticMap (Mumbai)    | |
| [1] Open the map.                   |   (B)     (B)     (B)    | |
|     Bubbles are plans today.        |         (B)              | |
|                                     |  +--------------------+  | |
| [2] Pick one.                       |  | Badminton doubles  |  | |
|     Check who's in, hit join. ====> |  | 5 going  [ Join ]  |  | |
|                                     |  +--------------------+  | |
| [3] Say hi first.                   |  [                      ] | |
|     Chat is live before you leave.  +--------------------------+ |
+------------------------------------------------------------------+
```

### 4.3 App Shell Wireframe (/app)
```
Desktop (1024px+):
+--------+--------------------------------------------------+------------+
| rail   |  search [________________]  Chips: All . Sports  | plan sheet |
| Map    |                                                  | (drawer,   |
| Plans  |           MAPLIBRE LIVE CANVAS                   |  420px)    |
| Chats  |     (You are here radar dot)                     | Badminton  |
| Trips  |            (B)          (B)        (B)           | 5 going    |
| You    |   [floating plan list]                           | [ Join ]   |
|        |                                                  | Avatars    |
| [+Post]|   (time scrubber) Now . Tonight . Tomorrow       | Chat preview
+--------+--------------------------------------------------+------------+
```

---

## 5. Motion Principles

- **Fluid Cursor:** 6px dot with 0.08s quickTo + 34px ring with 0.45s power3.out trailing + velocity stretch (`scaleX(1.35)`) oriented along angle of motion.
- **Spring Standards:** Sheets `{ type: "spring", stiffness: 380, damping: 36 }`, Join avatar flight `{ stiffness: 420, damping: 28 }`, Button press `{ stiffness: 600, damping: 30 }`.
- **Eased Entrances:** `expo.out` / `cubic-bezier(.16, 1, .3, 1)`.
- **Scroll Scrubbing:** GSAP ScrollTrigger with `scrub: 0.8` to `1`.
