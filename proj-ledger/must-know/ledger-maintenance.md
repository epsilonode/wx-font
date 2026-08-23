# Ledger Maintenance

Roadmaps are active routing state, not long design documents.

Rules:

- Keep roadmap bodies compact and heading/mention-oriented.
- Use `format-guidance.md` before editing `roadmaps/*.md`.
- Roadmap canonical state lives in `## @tierN` sections, `### @noun @state` item headings, and
  explicit @mention lines, not loose prose.
- Put detailed rationale in linked memories.
- Append durable evidence to logs; do not rewrite history.
- Do not log routine progress.
- Do not store secrets, tokens, cookies, private headers, or credentials.
- If a memory supersedes earlier material, mark the older memory superseded or link the replacement.
- Use the status vocabulary in `format-guidance.md`; never mark `@work @done` or `@proof @done`
  without an `@evidence` line in the item block.
- Every memory card carries frontmatter (id, kind, status, refs, hook) per `making-memories.md`;
  status never lives in memories, only in roadmaps. Memory cards also carry `roadmap:` so their
  roadmap ownership is explicit.
- Discover memories grep-first via frontmatter hooks; do not maintain a separate memory index file.
- Temporary XML tickets handle independent-worker handoff. Workers may make narrow in-lane edits;
  orchestrators verify returned work, complete the ticket closeout with corrective actions and
  agent feedback, then promote compact durable outcomes into roadmap headings/mentions, memories,
  and logs.
- Ledger files are for agents to read, not machines to validate. Do not add required validators or
  schema gates for roadmaps, memories, or tickets. Prefer simple formats that make the next agent
  faster.
- Execution-gating facts live in `tools.yaml`. Before project commands, read `tools.yaml`, read the
  relevant package manifest for the canonical command/task name, then grep `commands.xml` by that
  name for known-good invocations.
- Write all ledger files as UTF-8 without BOM. PowerShell 5.1 `Out-File`/`>>` can create UTF-16 LE;
  use an editor/apply_patch or UTF-8 append commands.

## Close-Out Contract

Applies to any bounded work session.

1. **Statuses**: update every owned item heading with an honest `@state`, plus `@evidence` or
   `@proof_gap` when required.
2. **Remainders**: discovered but unfinished work becomes ledger state, never chat-only — add
   `@blocker`, `@gap`, `@unknown`, `@note`, `@proof_gap`, or a new item heading.
3. **Findings**: durable knowledge becomes a memory card with frontmatter and a hook, linked from
   the relevant roadmap with `@memory <path>`.
4. **Tickets**: when ticketing was used, review returned XML, verify the work with human/orchestrator
    judgment, complete the ticket's orchestrator closeout with corrective actions and agent feedback,
    and promote compact durable facts into roadmap headings/mentions, memories, and logs. Retained
    tickets are full-context ownership-cycle memory.
   Research-ticket caveat: returned recommendations are not decisions or proof by default. Promote
   them as `kind: research` memories and keep roadmap `@unknown`/`@gap` items open with `@proof_gap`
   until implementation proof or an explicit human decision settles them.
   After each ticket closeout, re-list active tickets and check for newly returned tickets before
   ending the orchestration pass.
5. **Commands**: for returned command reports, normalize useful verified invocations into
   `commands.xml` per `must-know/tickets-workflow.md`. Worker command text is agent feedback, not
   machine input.
6. **Log**: append one logfmt line (real UTC timestamp, `actor=<you>`) only for meaningful durable
   outcomes, policy corrections, unusual incidents, or closeout facts. Do not log routine ticket
   creation; the ticket file is the index.

The rule: **if it is not in the ledger, it did not happen.** Chat reports are summaries of ledger
writes, not a substitute.
