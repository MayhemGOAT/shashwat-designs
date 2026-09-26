# AppleToe — Raw Cut theme

Locked visual identity for Shashwat Sagar / AppleToe (photographer · videographer · reels & artist content).  
Primary audience: underground rappers + indie artists who need stills and reel-ready footage that look inevitable.

## Design Read

```yaml
Design Read:
  artifact: brand theme system (tokens + preview board; landings later)
  audience: underground / indie artists, labels, managers booking shoots & reels
  visual-language: underground archive / night-shoot zine (brutalist raw × flash photography)
  mode: greenfield theme lock (supersedes prior template recipes as house default)
  visual-variance: 7
  motion-intensity: 4
  information-density: 5
  asset-dependence: 9
  brand-fidelity: 3
```

**Positioning one-liner:** The photographer who makes underground artists look inevitable on camera.

## Anchors (not clones)

| Recipe | What we take | What we leave |
|--------|----------------|---------------|
| `are-na` | Honesty, radius 0, no soft chrome | System fonts / default blue links / pure white |
| `bloomberg-businessweek-turley` | Oversized condensed type, color as violence, crop aggression | Magazine-cover clowning, 3 loud primaries everywhere |
| Custom | Night flash, grain, contact-sheet work, acid accent | SaaS dark mode, purple neon, cream editorial |

## Assets

| Asset | Path | Status |
|-------|------|--------|
| Theme moodboard | `assets/appletoe-brand/raw-cut-mood.png` | AI reference |
| Logo (dark) | `assets/appletoe-brand/appletoe-logo-dark.png` | AI placeholder — swap for real mark |
| Hero still | `assets/appletoe-brand/still-hero-reel.png` | AI placeholder |
| Portfolio stills | `still-01` … `still-07` under same folder | AI placeholders mapped to work titles |
| Site seed | [appletoe.co.in/productions](https://appletoe.co.in/productions) | Content reference |

Public copies live under `public/assets/appletoe-brand/` for Vite.

## Color

| Token | Hex | Role |
|-------|-----|------|
| `--rc-void` | `#0A0A0A` | Page ground (night, not GitHub-dark cosplay) |
| `--rc-surface` | `#141210` | Raised panels / header bars |
| `--rc-ink` | `#F2EDE4` | Primary type (warm off-white) |
| `--rc-mute` | `#8A8478` | Meta, credits, captions |
| `--rc-line` | `#2A2722` | Hairline rules |
| `--rc-flash` | `#E8FF47` | Accent — flyer highlighter / acid cut |
| `--rc-heat` | `#FF4D2A` | Rare urgency (sold out, live, CTA slam) |
| `--rc-grain` | `rgba(242,237,228,0.04)` | Film grain overlay tint |

**Rule:** Max 3 chromatic accents in one viewport (`flash` + optional `heat` + photo color). No purple, no cyan glow, no gradient mesh.

## Typography

| Role | Family | Notes |
|------|--------|-------|
| Display | **Bebas Neue** | Condensed all-caps energy; titles, artist names, hero |
| Body | **IBM Plex Sans** | Credits, paragraphs, UI |
| Meta | **IBM Plex Mono** | Shoot codes, timestamps, ISO-style labels |

Scale (desktop): display clamp 4–8rem · section 2–3rem · body 1–1.125rem · meta 0.75rem tracking wide.

## Spacing · radius · shadow · motion

- **Base unit:** 8px (4 / 8 / 16 / 24 / 32 / 48 / 64 / 96)
- **Radius:** `0` everywhere
- **Shadow:** none — depth from crop, contrast, and rules only
- **Motion:** 180–280ms ease-out on hover underline / opacity; grain is static or very slow; honor `prefers-reduced-motion`
- **Borders:** 1px `--rc-line`; accent rules 2–3px `--rc-flash`

## Layout DNA

1. **Stills first** — full-bleed or edge-to-edge strips; never inset rounded media cards
2. **Contact sheet / reel strip** for work — numbered frames, credits in mono
3. **Brand name is hero-level** in the first viewport (not nav-only)
4. **One job per section** — Offer / Work / Contact
5. **No soft cards** — if a box appears, it’s a flat frame with a hairline, not elevation

## Voice

- Short. Hard consonants. Present tense.
- Prefer: *Shoot. Cut. Post.* over *We craft cinematic narratives.*
- Artist names and track titles outrank generic service fluff.

## Anti-patterns (hard ban)

- Purple → pink → blue gradients
- Rounded marketing cards + left accent borders
- Inter / Roboto / Arial / Fraunces as display
- Fake logo walls, invented chart stats
- CSS silhouettes standing in for shoot stills
- Cream Monocle / MUJI quiet as the house default (kept only as optional contrast experiments)

## CSS entry

Import tokens from `src/theme/raw-cut.css` (class `.theme-raw-cut` or `:root` when this is house default).

## Next (after confirm)

1. Wire Theme Board into chooser as the locked system preview  
2. Rewrite services/copy for photographer · reels · artists  
3. Build landings on these tokens + real or generated stills  
4. Trial landing at `/t4` (Raw Cut Trial)
5. Swap AI placeholders for real logo + shoot stills before launch
