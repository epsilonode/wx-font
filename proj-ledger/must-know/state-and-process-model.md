# Source Of Truth And Codepoint Model

## Authored sources

The authored source of truth is the registry plus codepoint manifest plus raw SVGs under `src/`. Generated outputs in `dist/` are never hand-maintained. Do not edit generated CSS, JSON, TS, or README directly; regenerate them from registry data.

Fantasticon is an implementation tool, not the source of truth. Registry and codepoints manifest own intent; Fantasticon compiles font binaries/codepoint artifacts from what the registry describes.

Generated public CSS is registry-owned, not Fantasticon-owned. Use a provenance-aware CSS generation stage before final CSS transform/minification.

## Codepoint stability

Unicode codepoints in the Private Use Area are public API. CSS selectors, web font rendering, and docx/pptx embedding all depend on stable codepoints.

Rules:
- Preserve original Weather Icons codepoints for copied glyphs wherever possible.
- Custom/derived glyphs (e.g. filled overcast) use a project-owned PUA range outside copied slots.
- Never reassign a released codepoint. Never reuse a retired codepoint.
- If a codepoint must change, it requires an explicit migration decision in the roadmap.

## WMO mapping authority

`abstract/icon-map.html` is the definitive mapping from WMO conditions to Weather Icons glyph classes. It also contains authoritative prototype logic for normalizing noisy upstream cloud-cover percentages into visual okta/cloudiness state. Do not infer a larger icon set from the upstream font.

Phase 1 includes only glyphs mapped by icon-map.html. The registry should separate glyph inventory from WMO mapping rules so one glyph can serve many WMO states.

Preserve two contracts: cloud-cover normalization and WMO glyph resolution. Downstream JS can normalize raw percent values and emit `wx-okta-*`; generated CSS consumes normalized `wx-okta-*` classes.

The `wx-okta` spelling is canonical; do not use `wx-octa` in public selectors.

## Separation of concern

- Source SVGs → SVGO optimization → Fantasticon compilation → font files
- Registry → codepoints manifest → codepoints.json + TS exports
- Registry + codepoints + WMO contracts → css-tree readable CSS layers (canonical, compat, WMO, color, optional descriptions) → Lightning CSS production CSS
- Registry attribution metadata → generated README and NOTICE
- Generated fonts → opentype.js/fontkit/fonttools audits when codepoint, metrics, or subset verification requires them
- Svelte preview/demo routes may use UnoCSS for wx-ui-melt merge compatibility
- Exported `src/lib` Svelte components should use scoped CSS/CSS variables, not require downstream UnoCSS scanning

Each pipeline stage reads from authored sources and writes to generated output. Crossing these boundaries by hand-editing generated files creates drift.
