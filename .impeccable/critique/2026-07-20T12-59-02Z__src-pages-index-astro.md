---
target: homepage (src/pages/index.astro)
total_score: 31
p0_count: 0
p1_count: 3
p2_count: 2
timestamp: 2026-07-20T12-59-02Z
slug: src-pages-index-astro
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Scroll progress bar and active nav states work well |
| 2 | Match System / Real World | 4 | Copy speaks the audience's language; CTAs are concrete |
| 3 | User Control and Freedom | 3 | Esc closes mobile menu; smooth scroll and back-to-top present |
| 4 | Consistency and Standards | 3 | Cohesive system, but every section uses the same card rhythm |
| 5 | Error Prevention | 4 | Static portfolio; external links use rel="noopener" |
| 6 | Recognition Rather Than Recall | 3 | Nav is labeled; work cards lack visual differentiation (no screenshots) |
| 7 | Flexibility and Efficiency | 2 | `cursor: none` on desktop; zero `:focus-visible` styles in codebase |
| 8 | Aesthetic and Minimalist Design | 2 | Six sections of near-identical bordered cards + glow accents |
| 9 | Error Recovery | 4 | n/a for static site |
| 10 | Help and Documentation | 3 | Self-explanatory; no contextual help needed |
| **Total** | | **31/40** | **Good — solid foundation with distinctiveness gaps** |

## Anti-Patterns Verdict

**LLM assessment**: Partially reads as AI-generated. The dark canvas + lime accent (`#d6ff3f`) + purple glow (`#8b6cf7`), Inter + Space Grotesk pairing, uppercase tracked nav links, repeated `.s-tag` kickers on every section, and the 2×2 stats grid (34+ / R$600k+ / 50k+ / 4 continentes) are all high-frequency training-data moves for developer portfolios. What saves it from full slop: a real portrait in an asymmetric hero, outcome-focused Portuguese copy, trilingual support, and a mobile drawer with real craft. Someone might still guess "template portfolio with good copy pasted in."

**Deterministic scan**: 17 findings across `src/` — 15× `overused-font` (Inter + Space Grotesk in `portfolio.css` and `Layout.astro`), 1× `single-font` (false positive — Inter is used for body), 1× `layout-transition` (nav underline animates `width` at line 259). Browser overlay (injected successfully) additionally flagged: repeated section kicker labels, low-contrast scroll cue text, and layout-property animation on the cursor ring.

## Overall Impression

This is a competent, polished CTO portfolio with strong writing and thoughtful interaction details (scroll spy, magnetic buttons, mobile drawer). The single biggest opportunity is **distinctiveness**: the visual system currently signals "2024 AI dev portfolio" louder than it signals "João Nobre." The content has a POV; the design hasn't caught up yet.

## What's Working

1. **Hero composition** — Portrait + oversized name + business-outcome lead breaks the centered-text-only template. The mask fade on the photo integrates it into the dark canvas instead of floating a stock rectangle.
2. **Copy voice** — "Tecnologia a serviço de resultado, não o contrário" and the end-to-end CTO framing read specific and credible, not generic filler.
3. **Mobile navigation** — Full-screen drawer with staggered reveals, numbered links, Esc-to-close, and `inert` when hidden is production-grade interaction design.

## Priority Issues

### [P1] Reflex typography undermines brand distinctiveness
- **What**: Inter (body) + Space Grotesk (display) — both on the Impeccable reflex-reject list.
- **Why it matters**: For a personal brand site where design IS the product, the typeface is the first subconscious signal. These two fonts currently say "default dev portfolio" before the visitor reads a word.
- **Fix**: Pick a pairing with physical character tied to João's voice (e.g., precise + warm, or editorial + mechanical). One display face with committed weight contrast can work if chosen deliberately.
- **Suggested command**: `$impeccable typeset`

### [P1] Section kickers repeat on every block
- **What**: `.s-tag` uppercase tracked label appears before h2 in About, Pillars, Stack, Work, Open Source, and Contact — six times.
- **Why it matters**: This is AI section grammar. It adds visual noise without information (the h2 already names the section). Detector flagged `repeated section kicker labels`.
- **Fix**: Remove kickers from most sections. Keep one deliberate branded kicker moment if needed, or replace with typographic hierarchy alone.
- **Suggested command**: `$impeccable quieter`

### [P1] No keyboard focus styles
- **What**: Grep finds zero `:focus` or `:focus-visible` rules in `src/`. Combined with `cursor: none` on `body`, keyboard navigation is effectively invisible.
- **Why it matters**: Recruiters and clients using keyboard or assistive tech cannot see where they are. This is a WCAG 2.4.7 failure.
- **Fix**: Add a `:focus-visible` ring system using the accent color; restore default cursor for keyboard users (`:focus-visible` on interactive elements).
- **Suggested command**: `$impeccable audit`

### [P2] Hero metrics grid is template scaffolding
- **What**: About section stats block (34+ empresas, R$600k+, 50k+ usuários, 4 continentes) follows the banned hero-metric pattern.
- **Why it matters**: Big number + small label grids are SaaS/portfolio cliché. The numbers are compelling but the presentation makes them feel like filler between card sections.
- **Fix**: Integrate one or two proof points into the About prose, or use a single asymmetric callout — not a 2×2 metric dashboard.
- **Suggested command**: `$impeccable distill`

### [P2] Work section is six identical text-only cards
- **What**: Every project in `#trabalho` uses the same card shell (glow blob + tag + h3 + paragraph + pill tags). No screenshots, logos, or visual proof.
- **Why it matters**: A CTO portfolio's job is to make work tangible. Six cards that look interchangeable force the visitor to read every paragraph to differentiate — high cognitive load, low scan value.
- **Fix**: Add project thumbnails or interface crops; vary layout (feature one project large, others compact); at minimum add client/product logos.
- **Suggested command**: `$impeccable layout`

## Persona Red Flags

**Jordan (First-Timer)**: Five uppercase nav items plus a three-option locale switcher compete for attention in the header before the value prop lands. "Atuação" is domain-appropriate but may not scan as "portfolio/work" for international visitors on the PT page. The stats grid (34+, R$600k+) appears without framing — impressive numbers, unclear baseline.

**Riley (Stress Tester)**: All six work cards have identical visual weight and structure; no way to quickly identify flagship vs. side project. External links open in new tabs (good) but there's no visual preview to validate the projects exist. `[data-reveal]` elements start at `opacity: 0` — if IntersectionObserver fails, sections below the fold could render blank.

**Casey (Mobile)**: Primary bar CTA "Vamos falar" is hidden below 1016px (`nav-cta--bar { display: none }`); mobile users must open the drawer or scroll to contact. Locale pills are ~28px tall (11px font, 4px padding) — below the 44px touch target guideline.

## Minor Observations

- `--text-dimmer` (`#5c5c61`) on `#08080a` likely fails 4.5:1 contrast; detector flagged scroll cue as low contrast.
- Pillars use `01`–`04` numbering — acceptable here since it's a real four-step framework, but pairs with mobile nav numbering to feel scaffold-heavy.
- Nav scrolled state uses `backdrop-filter: blur(10px)` — glassmorphism, use sparingly.
- `border-radius: 24px` on work cards pushes toward over-rounding territory.
- Astro dev toolbar visible in local screenshots; not a production issue.

## Questions to Consider

- What if the work section led with one flagship case study (Spark or Link) at full width instead of six equal cards?
- Does João's brand need the lime accent, or would a single committed color (even just near-black + one warm or cool accent) feel more executive?
- What would this look like if you removed every `.s-tag` and let the headings do the work?
