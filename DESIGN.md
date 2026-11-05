---
name: gepetojj.com
description: CTO portfolio — warm graphite paper, regular-weight grotesk, one ember accent; built and checked with Hallmark
tokens: src/styles/tokens.css
colors:
  paper: "oklch(16.5% 0.009 55)"
  paper-2: "oklch(20.5% 0.01 55)"
  paper-3: "oklch(24.5% 0.011 55)"
  paper-sunk: "oklch(13.5% 0.008 55)"
  ink: "oklch(94.5% 0.008 80)"
  ink-2: "oklch(79% 0.008 70)"
  muted: "oklch(68% 0.008 70)"
  rule: "oklch(29% 0.01 55)"
  accent: "oklch(70% 0.19 42)"
  accent-ink: "oklch(18% 0.03 40)"
  field: "oklch(70% 0.19 42)"
typography:
  display: "Schibsted Grotesk 400 (the hero name 500), tracking -0.03em"
  body: "Schibsted Grotesk 400, 16px, line-height 1.6"
  outlier: "JetBrains Mono 500, one role: code and handles (the wordmark gepetojj, repo names)"
scale: "Hallmark scale in tokens.css (--text-display … --text-sm, --space-3xs … --space-4xl)"
radius: "card 12px, controls 10px, tags pill"
---

# Design System: gepetojj.com

## North star: "Ember on Graphite"

Premium comes from restraint, scale and real proof. Warm graphite paper, ink type at regular
weight, real product screenshots and one ember accent that appears only where it matters.

Reference studied: opusjake.ai. We took its method (regular-weight display, a treated portrait as
signature, few elements per screen, one committed colour moment, a closing statement) and none of
its look.

The page is built and checked with the Hallmark skill (`/hallmark redesign`). The stamp at the top
of `src/styles/portfolio.css` records every decision, waiver and dropped item. Run
`node ~/.claude/skills/hallmark/scripts/sloplint.mjs src/styles/portfolio.css --render --url http://localhost:4321/`
before shipping a change.

## The mark ("laço")

The J and the P share one stem: the P's bowl opens top right, the curve runs through the
middle of the stem and becomes the J's hook bottom left, closing back on the stem. Where the
curve crosses the stem, the old mark's hourglass idea survives as the waist, and an ember grain
sits there.

- Source: `src/assets/brand/mark.svg` (viewBox `12 2 42 60`, stroke 6 on a 64 grid, grain r 3.4).
- In the nav it is inline, stroke `currentColor` (ink) and the grain `--color-accent`.
- `public/favicon.svg` switches the stroke for light and dark tabs; `public/favicon.ico`
  (16/32/48) and `public/apple-touch-icon.png` sit on the graphite tile and are rebuilt with
  `node scripts/build-icons.mjs`.
- `public/og-image.png` (1200×630): mark + wordmark, the name, the hero sentence and the
  dithered portrait.
- Never recolour the stroke ember; the grain is the only ember in the mark.

## The page (job: hire)

1. **Hero, Settled 6/6.** The name, one sentence, two actions (email filled, "see work" quiet);
   the portrait beside it as a halftone on water (`src/scripts/portrait-waves.ts`, WebGL2 + ogl,
   loaded on demand): a wave equation runs under the dots, the pointer pushes the surface and a
   click splashes; ripples travel, cross and bounce off the edges. Crests turn the dots ember,
   the wake shows the photograph in colour and dries back to ink. The pre-rendered dither
   (`scripts/dither-portrait.mjs`) is the LCP and the fallback (no WebGL2, reduced motion).
2. **Showcase.** One capture across (Link Soluções), two beneath at 7 and 5 (Spark, Disppa), each
   with its fact and a visible "Visitar site".
3. **Index.** Every product as a hairline row (name, fact, role) that opens in place with its
   capture, description, tags and link.
4. **About.** A statement, three short paragraphs, and the owner's own figures as a `<dl>`.
5. **Frentes.** The one ember band: four rows.
6. **Stack.** A table (area, what for, tools).
7. **Liderança.** Four across, ink top rule.
8. **Open source.** Hairline rows, repo names in mono.
9. **Close.** Statement footer: the question, the email large, copy button, links in one row,
   place and handle.

## Rules

- Every colour and face through `tokens.css`; spacing through `--space-*`.
- Ember only on the primary control, focus, link underlines and the Frentes band.
- Labels, captions, table heads and nav links in the body face, sentence case, untracked. No
  eyebrows, no middle-dot meta strings, no status dots, no clocks or locale strips.
- Screenshots come from `capture.mjs` (2x, 1440×900) and sit in `data-slot` frames with an
  inset outline. Never a drawn browser bar.
- One reveal (`[data-reveal]`, scoped under `.js`), one hero settle; everything off under
  `prefers-reduced-motion`. No cursor followers, no parallax.
- Hero: headline, one sentence of twelve words or fewer, two actions. About 80 words per screen.
- Regenerate the portrait with `node scripts/dither-portrait.mjs` when `src/assets/eu.png` changes.
