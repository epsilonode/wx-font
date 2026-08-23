---
id: wx-font-wmo-4677-renderer-discrepancies
kind: research
status: active
created: 2026-08-23
updated: 2026-08-23
roadmap: wx-font
refs:
  - roadmaps/wx-font.md#mapping-semantics-unlocker
  - roadmaps/wx-font.md#weather-glyph-subset
hook: "read before changing WMO 05 or 80-99 glyph rules, descriptions, fixtures, or generated WMO CSS"
---

# WMO 4677 Renderer Discrepancies

`src/registry.json` is the only authored mapping input. Edit its `staticRules`, matching `staticDescriptions`, and `fixtures`; regenerate `dist/`, never hand-edit it.

Authoritative condition semantics: `https://osdata.gdex.ucar.edu/web/datasets/d464000/docs/WMOtables.html` (WMO Code Table 4677). SVG provenance: Erik Flowers Weather Icons 2.0.10 commit `bb80982bf1f43f2d57f9dd753e7413bf88beb9ed`.

| WMO | Current problem | Required day/night glyph | Description |
| --- | --- | --- | --- |
| 05 | Night maps haze to fog. | `wi-day-haze` / `wi-day-haze` | Haze |
| 85-86 | Snow showers map to hail. | `wi-snow-wind` / `wi-snow-wind` | Snow showers |
| 87-90 | Current ranges split hail incorrectly at 90. | `wi-hail` / `wi-hail` | Ice pellets or hail showers |
| 91-92 | Prior thunderstorm is rendered as an active one. | `wi-rain` / `wi-rain` | Rain; thunderstorm during preceding hour |
| 93-94 | Prior thunderstorm is rendered as an active one. | `wi-rain-mix` / `wi-rain-mix` | Snow/rain mix or hail; thunderstorm during preceding hour |
| 95 | Correct glyph; retain. | `wi-thunderstorm` / `wi-thunderstorm` | Active thunderstorm without hail |
| 96 | Hail policy is intentional; retain glyph. | `wi-hail` / `wi-hail` | Active thunderstorm with hail |
| 97 | Heavy active thunderstorm maps to hail. | `wi-thunderstorm` / `wi-thunderstorm` | Heavy thunderstorm without hail |
| 98 | Thunderstorm with dust/sand maps to tornado. | `wi-thunderstorm` / `wi-thunderstorm` | Active thunderstorm with dust/sandstorm |
| 99 | Hail policy is intentional; retain glyph. | `wi-hail` / `wi-hail` | Heavy active thunderstorm with hail |

All listed glyphs are already packaged from upstream, so do not add SVGs, codepoints, aliases, or direct-class API. Preserve dynamic cloud/okta rules and every `wx-wmo-*` selector; only its selected existing glyph and description change.

Add resolver and generated-CSS fixtures for day and night `05`, `85`, `86`, `89`, `90`, `91`, `93`, `95`, `96`, `97`, `98`, and `99`. Assert glyph IDs, descriptions, and that no WMO selector/codepoint changes. Run WMO contract verification, build, package verification, and the visual preview after the registry edit.
