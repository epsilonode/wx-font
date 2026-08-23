# wx-font — Agent Entry

Before ANY action in wx-font, you MUST read `proj-ledger/control.yaml`.
Do not execute commands until you've completed the entry chain.

Registry-driven WMO weather icon font package with Weather Icons compatibility.

Ground rules:

- `src/registry.json` is the authored source of truth for glyph and mapping data.
- Never hand-edit generated outputs in `dist/`; regenerate from registry sources.
- Never modify upstream Weather Icons assets without license and attribution review.
- Before project commands or missing-runtime conclusions, follow `proj-ledger/tools.yaml`.
- For sensitive areas, follow `proj-ledger/must-know/index.md`.
- Never store secrets in ledger files.
