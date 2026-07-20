---
name: gepetojj.com
description: CTO portfolio — dark, outcome-driven, signal-lime accent on near-black
colors:
  accent-signal: "#d6ff3f"
  accent-iris: "#8b6cf7"
  bg-void: "#08080a"
  bg-soft: "#0f0f12"
  bg-card: "#121215"
  text-ink: "#f2f2ed"
  text-muted: "#a8a8ad"
  text-dim: "#78787e"
  border-default: "#ffffff14"
  ink-on-accent: "#0a0a0a"
typography:
  display:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: "clamp(3rem, 8vw, 6rem)"
    fontWeight: 600
    lineHeight: 0.98
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)"
    fontWeight: 600
    lineHeight: 1.12
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Source Sans 3, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Source Sans 3, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.08em"
rounded:
  card: "16px"
  button: "40px"
  tag: "20px"
  pill: "999px"
spacing:
  section-y: "140px"
  section-y-mobile: "90px"
  container-x: "32px"
  container-max: "1180px"
  card-padding: "28px"
components:
  button-primary:
    backgroundColor: "{colors.accent-signal}"
    textColor: "{colors.ink-on-accent}"
    rounded: "{rounded.button}"
    padding: "15px 28px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.text-ink}"
    rounded: "{rounded.button}"
    padding: "15px 28px"
  tag:
    backgroundColor: "transparent"
    textColor: "{colors.text-muted}"
    rounded: "{rounded.tag}"
    padding: "7px 13px"
  card-surface:
    backgroundColor: "{colors.bg-card}"
    textColor: "{colors.text-ink}"
    rounded: "{rounded.card}"
    padding: "28px"
---

# Design System: gepetojj.com

## Overview

**Creative North Star: "The Executive Engine Room"**

A near-black technical environment where confidence comes from precision, not decoration. The site reads like a CTO who ships: asymmetric hero with real portrait, business-outcome copy, and a single loud accent (signal lime) reserved for action and focus. Purple iris appears as atmospheric depth — hero ribbons, secondary glows — never as a second primary voice.

The system explicitly rejects generic developer-portfolio templates: no hero metric grids, no repeated section eyebrows, no interchangeable card clones, no glassmorphism defaults. Depth is tonal (surface steps + 1px borders), not shadow stacks.

**Key Characteristics:**

- Near-black canvas (`#08080a`) with three surface steps (void → soft → card)
- Signal lime accent on ≤15% of any viewport — CTAs, focus rings, selection, progress bar
- Bricolage Grotesque display + Source Sans 3 body — geometric voice, humanist readability
- 16px card radius; pill buttons and tags; no ghost-card shadows
- Motion enhances visible defaults; `prefers-reduced-motion` collapses to instant
- Bento work layout: one flagship project, one runner, compact grid below

## Colors

Dark committed palette: the void background carries the brand; lime signals action.

### Primary

- **Signal Lime** (`#d6ff3f`): Primary CTAs (`.btn-primary`), focus rings, scroll progress, text selection, active locale pill tint, skip link background. The only color allowed to shout.

### Secondary

- **Iris Glow** (`#8b6cf7`): Atmospheric accents only — hero SVG ribbons, radial glows in work preview panels, scrollbar thumb hover. Never used for body text or primary buttons.

### Neutral

- **Void Black** (`#08080a`): Page background, deepest surface.
- **Soft Carbon** (`#0f0f12`): Alternating section backgrounds, marquee band, drawer backdrop.
- **Card Slate** (`#121215`): Cards, pillars, stack tiles, repo tiles.
- **Ink White** (`#f2f2ed`): Primary text, headings.
- **Muted Steel** (`#a8a8ad`): Body copy, nav links at rest, descriptions.
- **Dim Steel** (`#78787e`): Labels, metadata, scroll cue, work tags.
- **Whisper Border** (`rgba(255,255,255,0.08)`): Card and nav borders. **Soft Border** (`0.05` opacity): internal dividers.

### Named Rules

**The One Signal Rule.** Signal lime appears on primary actions, focus, and progress — nowhere else as a fill larger than a chip. If lime covers more than ~15% of a fold, you've lost hierarchy.

**The Iris Is Atmosphere Rule.** Purple never competes with lime for CTAs. It lives in gradients, glows, and ambient SVG — never as button fills or heading color.

## Typography

**Display Font:** Bricolage Grotesque (Google Fonts, `opsz` variable)  
**Body Font:** Source Sans 3 (Google Fonts, weights 300–600)

**Character:** Display is angular and opinionated — signals craft without editorial serif cliché. Body is clean and executive-readable at 16px base with 1.6 line-height on dark.

### Hierarchy

- **Display** (600, `clamp(3rem, 8vw, 6rem)`, lh 0.98, ls −0.03em): Hero name only. Max 6rem. `text-wrap: balance`.
- **Headline** (600, `clamp(1.75rem, 3.5vw, 2.75rem)`, lh 1.12): Section titles (`.section-title`). `text-wrap: balance`.
- **Title** (600, 1.125–1.85rem): Card headings, pillar titles, project names.
- **Body** (400, 1rem–1.05rem, lh 1.6–1.75): Prose, descriptions. Max ~42–65ch in about/contact. `text-wrap: pretty` on long paragraphs.
- **Label** (600, 0.72rem, ls 0.08em, uppercase): Work tags, skill group labels, nav drawer numbers.

### Named Rules

**The −0.03em Floor Rule.** Display letter-spacing never goes below −0.04em. Tighter tracking makes Bricolage feel cramped, not designed.

**The Pairing Rule.** Bricolage carries hierarchy; Source Sans 3 carries reading. Never set body copy in Bricolage or section titles in Source Sans 3.

## Elevation

Flat-by-default. This system does not use `box-shadow` on cards or buttons. Depth is conveyed through:

1. **Surface stepping:** void → soft → card (three background tokens)
2. **1px borders** at `rgba(255,255,255,0.08)` — never paired with drop shadows
3. **Radial gradients** in work preview panels and hero background (atmospheric, not structural)
4. **Hover state:** border-color shift and subtle `translateY` on cards — transform only, never layout properties

Progress bar (2px top), custom cursor ring, and noise overlay sit above content via z-index scale — not elevation shadows.

### Named Rules

**The No Ghost Card Rule.** Never pair `border: 1px solid` with wide soft `box-shadow` on the same element. Pick border OR a tight shadow (≤8px blur), never both.

**The Flat Surface Rule.** Cards rest flat. Lift on hover is `translateY(-4px)` max via transform — not shadow bloom.

## Components

### Buttons

- **Shape:** Full pill (`border-radius: 40px`)
- **Primary:** Signal lime fill, ink-on-accent text (`#0a0a0a`), padding 15×28px, Source Sans 3 500 at 14.5px. Arrow icon nudges on hover (`translate(2px, -2px)`).
- **Secondary:** Transparent, 1px whisper border, ink text. Hover: border lightens to `rgba(255,255,255,0.25)`.
- **Focus:** 2px signal lime outline, 3px offset — all interactive elements.

### Chips / Tags

- **Style:** Transparent, 1px border, dim steel text, 20px radius, 7×13px padding
- **Hover:** Border shifts toward signal lime; text brightens to ink white
- **Context:** Stack skills, work project tags — never used as section eyebrows

### Cards / Containers

- **Corner Style:** 16px radius (cards, pillars grid, stack tiles, work cards)
- **Background:** Card slate (`#121215`)
- **Border:** 1px whisper border — hover shifts toward accent tint via `color-mix`
- **Padding:** 28–44px depending on card type
- **Work flagship:** Horizontal split on desktop — preview panel (domain typography + radial accent) + body. Runner and compact variants below.

### Inputs / Fields

No form inputs on the marketing surface. Contact is `mailto:` links and social icons only.

### Navigation

- **Desktop:** Fixed top bar, 500 z-index. Logo left, centered uppercase links (13px, ls 0.08em), locale pill + CTA right. Active link: ink color + underline via `scaleX` transform (not width animation).
- **Mobile (≤1016px):** Hamburger opens full-screen drawer (490 z-index). Numbered links at large display size. CTA duplicated in drawer footer. Mobile bar shows compact CTA pill.
- **Locale switcher:** Pill container, 44×44px min touch targets per locale.

### Signature: Work Preview Panel

Domain name rendered in Bricolage at large scale inside a radial gradient tinted by per-project `--work-accent`. Replaces screenshot placeholders until real product imagery ships. Each project carries its own accent hex (lime, iris, emerald, sky, amber, pink).

### Signature: Custom Cursor (desktop only)

6px lime dot + 34px ring with 1px lime border at 50% opacity. Hidden on touch devices and when `.keyboard-nav` is active. Never blocks focus visibility.

## Do's and Don'ts

### Do:

- **Do** use signal lime exclusively for primary actions, focus rings, and progress — its scarcity is the hierarchy.
- **Do** pair Bricolage display with Source Sans 3 body on a contrast axis (geometric + humanist).
- **Do** cap hero display at 6rem and section titles at ~2.75rem max.
- **Do** show work with varied layout (flagship → runner → compact) and per-project accent previews.
- **Do** keep content visible without JavaScript; reveal animations enhance, never gate.
- **Do** maintain 44×44px touch targets on mobile locale and nav controls.
- **Do** respect `prefers-reduced-motion` — collapse all transitions to 0.01ms.

### Don't:

- **Don't** use generic dark-mode developer portfolio templates (Inter/Space Grotesk clones, lime-accent SaaS aesthetic).
- **Don't** build hero metric dashboards (2×2 stats grids as section scaffolding).
- **Don't** repeat uppercase section kickers on every block ("SOBRE" / "SKILLS" / "WORK" eyebrows).
- **Don't** ship identical card grids with icon + heading + blurb, repeated endlessly.
- **Don't** use glassmorphism defaults, gradient text, or over-rounded cards (24px+ radius on surfaces).
- **Don't** use side-stripe borders (`border-left` >1px as accent).
- **Don't** pair 1px borders with wide soft drop shadows on the same element.
- **Don't** hide primary CTA on mobile without a drawer or bar alternative.
- **Don't** animate `width`, `height`, or `padding` for UI feedback — use `transform` and `opacity` only.
