# CitePulse GEO

Free, 100% browser-based Generative Engine Optimization (GEO) & AI Search Visibility Toolkit.

- **Live Site**: https://xuj43761-coder.github.io/citepulse-geo/
- **Hosting Cost**: `$0/month` on GitHub Pages (pure static HTML/CSS/ES modules, zero backend, zero cold start)
- **Monetization**: Transparent affiliate recommendations centralized in `assets/affiliates.js`

## Included Interactive Tools
1. **100-Point GEO Citation Readiness Auditor (`#auditor`)** — Scores HTML or Markdown across 5 dimensions (Crawler Hygiene, JSON-LD Schema, Entity Clarity, Citability & Fact Density, FAQ & Scannable Structure) with copy/download Markdown report export.
2. **`llms.txt` Generator & Spec Validator (`#llmstxt`)** — Builds and validates spec-compliant `/llms.txt` files in real time.
3. **AI Crawler `robots.txt` Policy Builder (`#robots`)** — 3 presets + per-bot rules for 9 major AI search and model-training crawlers.

## Included Editorial Guides
- `best-geo-tools-2026.html` — Commercial comparison of 6 GEO & AI visibility suites
- `llms-txt-guide.html` — 2026 specification and deployment guide
- `robots-txt-ai-crawlers.html` — AI search vs. training crawler matrix

## Swapping Live Affiliate Links (1-Minute Update)
Edit `assets/affiliates.js` and replace any `affiliateUrl` with your approved partner link. Every page CTA and contextual audit recommendation updates automatically with `rel="sponsored noopener noreferrer"`, `target="_blank"`, and UTM parameters.

## Verification
```bash
node tests/verify_site.mjs
```
