# Making Memories

Memories keep roadmaps compact. A roadmap routes agents to current state, next actions,
constraints, and evidence. A memory holds durable rationale for a roadmap-linked concern. A memory
never holds status — status lives only in roadmaps.

Memories correlate to roadmaps. Every memory card should identify the roadmap it came from with a
`roadmap:` frontmatter field and use `refs:` for the specific roadmap/must-know consumers. A memory
without a roadmap relationship is usually misplaced project trivia.

Each roadmap has its own area under `memories/`. Put retained artifacts, including closed ticket
ownership-cycle records, in the memory area for the roadmap they came from. Do not use a global
ticket memory bucket unless the artifact is genuinely cross-roadmap.

Memory files are read by agents, not machines. Do not add validators, schemas, or ceremony to prove
memory correctness. Prefer concise, grepable text that lets the next agent move faster.

## Creation Gate

Create or update a memory only when it preserves durable value:

- it records a decision future agents must not re-litigate;
- it captures non-obvious design rationale (e.g. why `src/registry.json` is the authored source of truth for glyph/mapping data);
- it records a reusable implementation pattern (e.g. the Fantasticon codepoints + custom template pipeline);
- it links evidence or artifacts to an active roadmap target;
- a future agent would waste time re-deriving it without it.

Do not create memories for routine progress, tiny edits, or facts already captured compactly in
a roadmap or log entry.

## Card + Asset Pattern

A memory is a small index card. Anything heavy (long specs, schemas, code) is a sibling asset
file the card points to.

- Card: `.md`, target ≤ 40 lines, summary in the first two lines.
- Asset: `.yaml`, `.json`, code, or longer `.md` — same directory, named after the card.

## Frontmatter (required on every card)

```yaml
---
id: registry-source-of-truth
kind: decision               # decision | research | strategy | contract | evidence | inventory | snippet
status: active                # active | draft | superseded
created: 2026-06-16
updated: 2026-06-16
roadmap: wx-font
refs:
  - roadmaps/wx-font.md#registry-and-mapping-contract
hook: "why src/registry.json is the authored source of truth for glyph/mapping data; read before changing
  the registry or codepoint model"
---
```

Rules:

- One fact per line, `key: value`, no wrapping when practical — every line is a grep target.
- `roadmap` names the roadmap this memory belongs to. Use one roadmap unless the memory is
  intentionally cross-roadmap.
- Place the memory file in the owning roadmap's memory area. The exact subfolder is a human
  organization choice; the rule is roadmap ownership, not a hardcoded path.
- `hook` is the highest-value field: one line saying when a future agent should read this.
- `refs` are live consumers (roadmap targets, must-know pages). Verify on write: grep your `id`
  across `roadmaps/`.
- Optional fields: `assets:` (sibling asset files), `caveat:` (one-line health warning),
  `supersedes:` / `superseded_by:` (ids).

## Discovery Is Grep-First

- Find memories about a topic: `grep -ri "topic" memories/ --include="*.md" -l`
- List all hooks: `grep -rh "^hook:" memories/ --include="*.md"`
- Find memories for a roadmap: `grep -rl "^roadmap: wx-font" memories/ --include="*.md"`
- Find dead memories: `grep -rl "^status: superseded" memories/`

## Supersession

If a memory becomes obsolete, do not delete it. Set `status: superseded` and
`superseded_by: <id>`, add `supersedes: <id>` to the replacement, and update `refs`.
