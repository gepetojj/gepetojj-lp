---
name: gepetojj.com
description: CTO portfolio — warm graphite canvas, regular-weight type, one committed ember accent
colors:
  bg: "oklch(0.165 0.005 55)"
  bg-sunk: "oklch(0.135 0.004 55)"
  bg-raise: "oklch(0.205 0.006 55)"
  bg-raise-2: "oklch(0.245 0.007 55)"
  ink: "oklch(0.945 0.008 80)"
  ink-2: "oklch(0.79 0.008 70)"
  ink-3: "oklch(0.66 0.008 70)"
  line: "oklch(1 0 0 / 0.08)"
  accent-ember: "oklch(0.7 0.19 42)"
  accent-ember-hi: "oklch(0.76 0.17 48)"
  accent-ink: "oklch(0.18 0.03 40)"
typography:
  display:
    fontFamily: "Schibsted Grotesk, sans-serif"
    fontSize: "clamp(3.25rem, 7.6vw, 6rem)"
    fontWeight: 500
    lineHeight: 0.95
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Schibsted Grotesk, sans-serif"
    fontSize: "clamp(2rem, 4.2vw, 3.4rem)"
    fontWeight: 400
    lineHeight: 1.04
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Schibsted Grotesk, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
  meta:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    letterSpacing: "0.02–0.04em"
rounded:
  surface: "14px"
  button: "10px"
  chip: "6px"
spacing:
  section-y: "clamp(96px, 13vw, 184px)"
  gutter: "clamp(20px, 4vw, 48px)"
  container-max: "1280px"
---

# Design System: gepetojj.com

## North Star: "Ember on Graphite"

Premium comes from restraint, scale and real proof — not decoration. The page reads like
a quiet, expensive office at night: warm graphite walls, ink-white type at regular weight,
and a single ember-orange light that is switched on only where it matters (primary action,
the focus-areas panel, the closing call to action).

Reference studied: opusjake.ai — what we took is the *method*, not the look:

- Headings at **regular weight** and large size (confidence without shouting).
- **Treated portrait** as signature imagery (here: an 8×8 ordered-dither, 1-bit, ink on graphite).
- Few elements per viewport, lots of air, generous section padding.
- **One committed colour** used as a full surface once, not sprinkled.
- **Monospace meta details** (status, local time, domains, stacks) that signal "real system".
- Closing footer as a destination: big statement, columns, status line.

What we deliberately do differently: dark canvas (identity), ember instead of cobalt,
no pixel font, real product screenshots instead of illustrations.

## Colour

Strategy: **restrained + one committed moment**. Tinted neutrals (hue 55, chroma ≤0.008)
carry 90% of the page. Ember appears as:

1. Primary buttons (`.btn-accent`), focus rings, selection.
2. The Pillars panel — the only drenched surface on the page.
3. The closing emphasis line and the email underline.

Project accents (`--work-accent`) only tint each case stage via radial gradients. They never
colour text or buttons.

Contrast: `ink-2` body on `bg` ≈ 9:1; `ink-3` meta ≈ 5:1; `accent-ink` on ember ≈ 7:1.

## Typography

- **Schibsted Grotesk** for everything readable. Display/name at 500; all other headings at
  400. Letter-spacing floor −0.04em.
- **JetBrains Mono** only for meta: status, clock, domains, tags, stack lists, ledger, labels.
  Never for headings or paragraphs.
- No uppercase eyebrows above sections. The only uppercase is the mono `.sub-label` used
  inside a section to name a sub-group (Técnicas, Liderança, Mais produtos, footer columns).

## Layout & components

- **Hero**: dithered portrait (hover reveals the real photo with a clip-path wipe on fine
  pointers) + greeting / name / role / lead / two actions. Meta strip below: status,
  location, live local clock (America/Maceio).
- **About**: one big statement, prose on the left, sticky "proof ledger" on the right
  (mono rows with checks; figures highlighted inline — not a metric grid).
- **Work**: 4 featured cases alternating left/right. Each stage is an accent-tinted panel
  with the real screenshot rising from the bottom edge inside a minimal window (domain in
  mono). Then "Mais produtos" in a 2-column grid of smaller stages.
- **Pillars**: ember panel, 2×2 rows separated by hairlines.
- **Stack**: table rows (icon · title + description · mono stack list), leadership as a
  4-column definition list.
- **Open source**: hairline list rows, mono names, language dot, arrow.
- **Closing/footer**: statement + ember emphasis, big email link + copy button, four
  columns, base line, oversized cropped wordmark in `bg-raise`.

Surfaces: 14px radius max. No border + wide shadow on the same element. Screens inside
stages use a shadow only.

## Motion

- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out) for everything.
- Hero: staggered rise on load; dither portrait fades in in 8 steps.
- Reveal: content is visible by default; JS adds `.reveal-ready` and fades sections in.
  Elements already in view on load are never hidden.
- Hover: case windows drift 2%, screenshots scale 1.025; arrows nudge up-right.
- Cursor label "Ver projeto" follows the pointer over work stages (fine pointers only; the
  system cursor is never hidden).
- `prefers-reduced-motion`: everything collapses to instant, reveals disabled.

## Do / Don't

- **Do** keep ember to actions, the pillars panel and the closing — nowhere else.
- **Do** use real product screenshots; regenerate the portrait with
  `node scripts/dither-portrait.mjs` when `src/assets/eu.png` changes.
- **Don't** add section eyebrows, metric grids, glassmorphism cards, gradient text or a
  second accent colour.
- **Don't** bold headings beyond 500 or tighten tracking past −0.04em.
- **Don't** animate layout properties; transform, opacity and clip-path only.
