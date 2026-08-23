---
id: wx-font-hail-glyph-precedence
kind: decision
status: active
created: 2026-08-23
updated: 2026-08-23
roadmap: wx-font
refs:
  - roadmaps/wx-font.md#mapping-semantics-unlocker
  - roadmaps/wx-font.md#weather-glyph-subset
hook: "read before choosing a glyph for WMO 87-90, 96, or 99, or changing hail SVG provenance"
---

# Hail Glyph Precedence

Use the shipped Erik Flowers `wi-hail.svg` glyph, codepoint `F015`, for conditions whose explicit current precipitation is hail or ice pellets.

Apply `wi-hail` for WMO 87-90, 96, and 99. This deliberately makes the visible hail hazard take precedence over the co-occurring thunderstorm in 96 and 99.

Keep `wi-thunderstorm` for WMO 95, 97, and 98: they are active thunderstorms without explicit current hail. WMO 98 is a thunderstorm with dust/sandstorm, never a tornado.

Use the generic, non-diurnal `wi-hail` for both day and night. This preserves the package's existing static-precipitation policy and avoids adding upstream `wi-day-hail` or `wi-night-alt-hail` glyphs.

The decision changes only resolver glyph selection and generated descriptions. WMO values, `wx-wmo-*` selectors, font codepoints, direct `.wx-hail` and `.wi.wi-hail` APIs, cloud/okta policy, and provider mappings remain unchanged.
