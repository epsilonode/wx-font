---
id: wx-font-animation-color-and-overcast-policy
kind: decision
status: active
created: 2026-06-16
updated: 2026-06-16
roadmap: wx-font
refs:
  - roadmaps/wx-font.md#weather-glyph-subset
  - roadmaps/wx-font.md#generated-css-layers
  - roadmaps/wx-font.md#phase-1-font-mapping-mvp
hook: "read before adding animations, multi-color SVG dependencies, or changing the filled overcast glyph policy"
---

# Animation Color And Overcast Policy

Drop animations entirely for this package; no keyframes, animated SVG, or runtime animation layer in phase 1.

Font glyphs are static and monochrome, so source vectors must compile as single-color silhouettes.

Preserve color intent through optional CSS color variables, not multi-color font glyphs.

Raw optimized SVG output should follow the same static asset policy unless a later phase explicitly adds richer SVG variants.

The overcast glyph should remain a filled version of `wi-cloud` to distinguish dense cloud cover from the normal cloud glyph.
