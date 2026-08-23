---
id: wx-font-codepoints-and-compatibility-contract
kind: contract
status: active
created: 2026-06-16
updated: 2026-06-16
roadmap: wx-font
refs:
  - roadmaps/wx-font.md#deterministic-codepoint-contract
  - roadmaps/wx-font.md#generated-ts-json-contracts
  - roadmaps/wx-font.md#office-embedding-proof
hook: "read before changing glyph codepoints, wi compatibility aliases, or docx/pptx font embedding assumptions"
---

# Codepoints And Compatibility Contract

Unicode codepoints are public API because CSS, web font rendering, and docx/pptx embedding depend on them.

Preserve original Weather Icons codepoints for copied glyphs wherever possible.

Generate canonical `.wx-*` classes and compatibility `.wi-*` aliases for shipped Weather Icons glyphs.

Use Private Use Area slots; reserve custom weather glyphs such as filled overcast outside copied Weather Icons slots.

Never reassign a released codepoint and never reuse a retired codepoint.

Generate `codepoints.json` and TS exports so document pipelines can call `String.fromCodePoint(...)` with `wx-font.ttf`.
