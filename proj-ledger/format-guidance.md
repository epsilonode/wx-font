# Roadmap Maintenance Guide

Use this guide when editing `proj-ledger/roadmaps/*.md`.

## Heading/Mention Contract

Roadmaps are markdown documents with a dense, grepable heading/mention surface. Markdown headings
provide hierarchy, patch anchors, and line-number jumps. `@mentions` provide scan surfaces for
cross-cutting questions.

Canonical shape:

```md
# wx-font

@roadmap wx-font
@log ../logs/wx-font.logfmt
@updated 2026-06-16

## @tier6 high planning gates
### @risk @open license compliance
@blocker Weather Icons copying/derivation cannot proceed until license obligations are understood
@memory ../memories/wx-font/decisions/2026-06-16-attribution-and-docs-generation.md
@note copied glyphs, CSS compatibility names, and generated docs have different notice requirements

## @tier3 normal active
### @work @ready registry and mapping contract
@memory ../memories/wx-font/strategy/2026-06-16-authority-and-wmo-mapping-contract.md
- [ ] @accept glyph inventory captures id, namespace, file, class names, codepoint, color token, and attribution
- [ ] @accept WMO mapping rules capture code, diurnal state, wx-okta selectors, description, and target glyph
```

Rules:

- `## @tierN <title>` headings are the only place tier lives.
- `### @noun @state <title>` headings are the canonical item identity and current item state.
- The heading title is the item ID. Use short lowercase human phrases, not slug ceremony.
- Document order is sequence within a section. Do not add `seq=` fields.
- Do not put per-item tier, kind, or ID attributes on item headings.
- Keep roadmap grammar to the headings and mentions defined in this guide.
- Use `@blocker` for gates and prerequisites that matter now.
- Use `@decision @accepted ...` for durable project-direction choices.
- Roadmaps should race toward unknowns: expose `@risk`, `@gap`, and `@unknown` items early, then
  close them with practical `@proof` items before broad implementation depends on assumptions.
- Tickets remain handoff artifacts managed by `proj-ledger/tickets`; retained returned tickets are
  full-context ownership-cycle memory, while accepted outcomes are compactly promoted into roadmap
  headings/mentions, memories, and logs.
- Roadmaps are read by agents, not machines. Do not require validators or schema gates for normal
  roadmap maintenance; keep the format simple enough that validation is unnecessary.

## Tiers

Tiers are attention bands. Higher tier means more attention now.

| Tier | Meaning |
|---|---|
| `@tier9` | catastrophic; stop and handle |
| `@tier8` | critical |
| `@tier7` | severe |
| `@tier6` | high |
| `@tier5` | elevated |
| `@tier4` | important |
| `@tier3` | normal active flow |
| `@tier2` | deferred |
| `@tier1` | inactive |
| `@tier0` | closed out |

Do not move a work block just to elevate it. Add a small high-tier `@risk`, `@gap`, `@unknown`, or
`@blocker` pointer that names the work. Close or remove the pointer when the elevated issue is
resolved.

## Item Nouns

Allowed item nouns:

- `@work` — implementation or durable task.
- `@proof` — validation/evidence-producing task.
- `@risk` — possible bad outcome to prevent.
- `@gap` — known missing capability, proof, process, or model.
- `@unknown` — question that must be researched or proven.
- `@blocker` — active gate preventing progress.
- `@decision` — durable decision pointer.
- `@finding` — durable discovery pointer.

## Item States

Allowed item states:

- `@open` — exists and not resolved.
- `@active` — current normal-flow work.
- `@ready` — unblocked but not active.
- `@blocked` — cannot proceed; include `@blocker` lines.
- `@deferred` — intentionally not now.
- `@partial` — partly completed/proven; include `@proof_gap` or `@note`.
- `@done` — evidence-backed complete for work/proof items.
- `@accepted` — accepted decision/finding.
- `@dropped` — explicitly rejected or no longer relevant.

## Detail Mentions

Use detail mentions as standalone lines or inside task-list items:

- `@memory <path>` — linked memory or must-know page.
- `@blocker <text>` — current gate or prerequisite.
- `@evidence <text>` — proof artifact, command, file, transcript, or observation.
- `@closed <date> <text>` — closeout event or outcome.
- `@accept <text>` — acceptance criterion; prefer task-list checkboxes.
- `@proof_gap <text>` — missing proof for partial/researched work.
- `@note <text>` — one-line annotation.

## Grep Recipes

Run from `proj-ledger/`.

- Orientation index: `grep -nE '^(## @tier|### @(work|proof|risk|gap|unknown|blocker|decision|finding) )' roadmaps/*.md`
- Sections only: `grep -n '^## @tier' roadmaps/*.md`
- Actionable sections: `grep -n '^## @tier[3-9]' roadmaps/*.md`
- Parked sections: `grep -n '^## @tier[0-2]' roadmaps/*.md`
- Current blockers: `grep -n '^@blocker ' roadmaps/*.md`
- Memories: `grep -n '^@memory ' roadmaps/*.md`
- Done/closed: `grep -nE '^### .*@done|^@closed ' roadmaps/*.md`
- Unfinished work/proofs: `grep -nE '^### @(work|proof) @(open|active|ready|blocked|partial)' roadmaps/*.md`
- Risks/gaps/unknowns: `grep -nE '^### @(risk|gap|unknown) @(open|active|blocked)' roadmaps/*.md`
- Completed work/proof without evidence: inspect `grep -nE '^### @(work|proof) @done' roadmaps/*.md` and confirm an `@evidence` line in that item block.
- Dangling memories: for each `@memory <path>`, confirm the file exists.

## Patch Contract

Default to adding or editing the smallest heading or mention that reflects current truth. Do not
rewrite history to look current.

Allowed edits:

- Add elevated risk/gap/unknown/blocker pointers without moving the main work block.
- Change an item state in its `###` heading.
- Add `@memory`, `@blocker`, `@evidence`, `@closed`, `@accept`, `@proof_gap`, or `@note` lines.
- Move a whole item only when document order itself is wrong, not just to elevate priority.

Forbidden edits without explicit request:

- Remove caveats, blockers, proof gaps, or closeout history.
- Mark `@work @done` or `@proof @done` without an `@evidence` line in the item block.
- Add canonical roadmap state as untagged loose prose.
- Add credentials, tokens, cookies, or private secrets.

## Close-Out Contract

Before ending a bounded work session:

1. **State**: update each touched item heading to the honest state.
2. **Evidence**: completed work/proof items get `@evidence` and `@closed` lines.
3. **Remainders**: unfinished discoveries become `@blocker`, `@gap`, `@unknown`, `@proof_gap`, or
   `@note` lines.
4. **Findings**: durable rationale becomes a memory card with frontmatter and a `hook`, linked via
   `@memory`.
5. **Log**: append one logfmt line for meaningful durable outcomes or policy corrections. Do not
   log routine ticket creation.

The rule: **if it is not in the ledger, it did not happen.**
