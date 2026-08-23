---
id: wx-font-downstream-targets-and-delivery
kind: strategy
status: active
created: 2026-06-16
updated: 2026-06-16
roadmap: wx-font
refs:
  - roadmaps/wx-font.md#phase-priority
  - roadmaps/wx-font.md#office-embedding-proof
  - roadmaps/wx-font.md#toolbar-font-integration
  - roadmaps/wx-font.md#wx-ui-melt-sync
hook: "read before optimizing delivery shape, adding toolbar glyphs, or integrating with wx-ui-melt/docx/pptx consumers"
---

# Downstream Targets And Delivery

Primary web consumer is the weather UI path; early work focuses on font mapping, not toolbar migration.

Document consumers need `wx-font.ttf` plus stable codepoints for docx and pptx embedding.

Web consumers need one cached `wx-font.woff2` for low-bandwidth rendering.

Future toolbar/interface glyphs should also ship through the same font to reduce repeated inline SVG pageweight.

Downstream workflow merge target is `R:\Code\web\wx-ui-melt`.

Toolbar integration and `wx-ui-melt` icon sync are deferred until the weather font mapping MVP is proven.
