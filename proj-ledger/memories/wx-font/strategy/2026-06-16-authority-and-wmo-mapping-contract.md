---
id: wx-font-authority-and-wmo-mapping-contract
kind: contract
status: active
created: 2026-06-16
updated: 2026-06-16
roadmap: wx-font
refs:
  - roadmaps/wx-font.md#authoritative-references
  - roadmaps/wx-font.md#registry-and-mapping-contract
  - roadmaps/wx-font.md#generated-css-layers
  - roadmaps/wx-font.md#mapping-and-rendering-verification
hook: "read before extracting or changing WMO mapping rules, wx-okta selectors, or the icon-map.html authority model"
---

# Authority And WMO Mapping Contract

`abstract/icon-map.html` is the definitive mapping from WMO conditions to existing Weather Icons glyph classes.

`icon-map.html` also owns the authoritative prototype logic for interpreting noisy upstream cloud-cover percentages into visual cloudiness states.

Do not infer a larger icon set from the upstream font; include only glyphs mapped by `icon-map.html` in phase 1.

The registry should separate glyph inventory from WMO mapping rules so one glyph can serve many WMO states.

Preserve two separate contracts: cloud-cover normalization and WMO glyph resolution. Normalization converts raw percent data into explicit okta/cloudiness state; glyph resolution consumes WMO code, day/night, and normalized okta state.

Downstream JS may consume the normalization contract and emit `wx-okta-*` classes explicitly. CSS should consume normalized `wx-okta-*` state, not raw percent values.

WMO CSS selectors use `wx-wmo-*`, `wx-day`, `wx-night`, and `wx-okta-0` through `wx-okta-8`.

The `wx-okta` spelling is canonical; do not use `wx-octa` in public selectors.

Descriptions should be owned by registry/TS/JSON contracts. Optional generated description CSS may expose them through custom properties and `::after` for previews and static tables, but it is not the semantic description source.

The filled `overcast` glyph is a custom/derived variant based on `wi-cloud`, not the normal outline cloud glyph.
