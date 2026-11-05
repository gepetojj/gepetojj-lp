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

## The page (job: hire)

1. **Hero, Settled 6/6.** The name, one sentence, two actions (email filled, "see work" quiet);
   the 1-bit dithered portrait beside it. Under the pointer, waves start and run out across the
   whole portrait like a swell (canvas, `[data-waves]`): each leads with ember dots and carries
   the photograph in colour just behind. A resting pointer keeps sending a wave every ~1.1s; a
   moving one leaves a wake. On touch, two waves from the face when in view and one per tap.
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
