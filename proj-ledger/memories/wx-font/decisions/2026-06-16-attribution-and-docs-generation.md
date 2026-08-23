---
id: wx-font-attribution-and-docs-generation
kind: contract
status: active
created: 2026-06-16
updated: 2026-06-16
roadmap: wx-font
refs:
  - roadmaps/wx-font.md#original-font-provenance-and-source-path
  - roadmaps/wx-font.md#generated-attribution-readme
  - roadmaps/wx-font.md#weather-glyph-subset
hook: "read before editing README generation, license notices, Weather Icons attribution, or per-glyph source metadata"
---

# Attribution And Docs Generation

Attribution belongs to the original Weather Icons project for copied glyphs.

Do not hand-maintain the package README attribution table; generate it from registry metadata.

Generated README serves both GitHub and NPM package display.

Registry entries should identify original class, original codepoint, source project, author, license, and URL.

Custom or derived glyphs, especially filled overcast from `wi-cloud`, must be labeled as derived/custom.

If license separation becomes useful, generate `ATTRIBUTION.md` or `NOTICE.md` from the same registry data.
