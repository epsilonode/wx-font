---
id: tickets-workflow
lifecycle: active
purpose: temporary-xml-ticket-files-for-independent-terminal-agents
---

# Tickets Workflow

**Orchestrator-only.** Workers read their assigned XML ticket; they do not need this page unless a
ticket explicitly points here.

Read this before creating, reviewing, or closing `proj-ledger/tickets` XML tickets.

## Purpose

Tickets are temporary filesystem handoff files for independent terminal agents. A ticket originates
from a roadmap item, is assigned by the human, passes through the orchestrator, and is owned by the
orchestrator until verified and closed out. Active tickets are not roadmap routing. Returned tickets
that are retained become durable ownership-cycle memory: worker result, orchestrator verification,
corrective actions, and prompt/agent feedback stay together in one artifact.

Tickets are for agents to read, not for machines to validate. Do not add schema validators or
machine-required ceremony. Dev velocity is more important than machine-checkable completeness.

## Layout

```text
proj-ledger/tickets/
  active/T###-slug.xml          # one temporary ticket per worker
  attachments/                  # worker-created attachments linked from tickets
  templates/worker-ticket.xml   # starting template
```

The filesystem is the active index: list `active/*.xml` to see open tickets. Do not maintain a
separate ticket index file.

## Creating A Ticket

- Copy/adapt `templates/worker-ticket.xml` into `active/T###-slug.xml`.
- Keep the ticket self-contained: origin roadmap/item, human assignment, prompt, context refs, lane
  guidance, guardrails, worker result, and orchestrator closeout area.
- Keep filenames grepable and format-agnostic: `T###-short-slug.<format>` while active, and
  `YYYY-MM-DD-T###-short-slug.<format>` when retained.
- Record the assigned agent name/model in the ticket after human assignment so failures can be
  grepped across retained tickets.
- Do not log routine ticket creation. The active ticket file is enough. Log only meaningful ticket
  outcomes, policy corrections, unusual incidents, or closeout facts worth preserving.
- Lane guidance is coordination guidance, not a hard sandbox. Workers may touch outside it narrowly
  when the task clearly requires it and they explain why.
- Include `proj-ledger/tools.yaml` when commands may be needed.
- Do not create state sidecars for normal single-worker tickets.
- If attachments are useful, put them under `proj-ledger/tickets/attachments/` and link them from
  the ticket XML. Do not inline long attachments in XML.

## Worker Expectations

- Work directly in the repo when it is clearly in lane.
- Do not commit, push, store secrets, spawn child agents, or leave long-lived processes running.
- Do not create, rename, delete, or assign tickets. Workers put follow-up recommendations in their
  returned ticket; the orchestrator decides whether to do small follow-up directly or create/rerun a
  ticket.
- Update the XML ticket with `status="returned"` and fill `<worker_result>`.
- Report commands actually run in the worker result in any clear, copyable form. Exact formatting is
  not required; include cwd/context when non-obvious.
- Use attachments only when they add signal: proposed ledger updates, diagnostic excerpts, or files
  that should not be materialized directly. Ticket workers must write these only under
  `proj-ledger/tickets/attachments/` and link them from the ticket XML.
- Workers must not write durable memories, roadmap entries, logs, commands.xml, or workflow docs
  directly unless the ticket explicitly grants that lane. Put proposed durable content in the ticket
  attachment folder; the orchestrator promotes or discards it during closeout.

## Closeout

- Review the returned XML.
- Verify the work before closing it out. Verification can be command output, code inspection,
  reproduction, or a direct explanation of why no command is useful. This is orchestrator judgment,
  not machine validation.
- Complete the ticket's orchestrator closeout with verification results, corrective actions,
  accepted/rejected worker claims, and prompt/agent feedback.
- Research tickets close out differently from implementation/proof tickets. Unless the ticket
  explicitly includes implementation acceptance criteria or proof acceptance criteria, treat returned
  recommendations as research inputs, not decisions, proof, or approved work. Retain useful research
  as `kind: research` memory cards, keep roadmap items as `@unknown`/`@gap` with `@proof_gap` when
  choices remain unproven, and use closeout status such as `retained_as_research` rather than
  `accepted` when accepting the artifact but not its recommendations.
- If follow-up work is short, simple, and clearly bounded, the orchestrator may do it directly and
  record it in the ticket closeout. Prefer sending work back when the follow-up is non-trivial,
  meaning more than a few steps, multiple files, unclear design, runtime risk, or multiple open
  acceptance items.
- If a worker creates, assigns, deletes, or renames a ticket, treat it as an agent failure/policy
  violation. Do not treat the worker-created ticket as an active lane until the orchestrator accepts
  or recreates it.
- Promote durable facts into roadmap headings/mentions, memory cards, logs, and commands.xml/tooling
  maintenance. Do not promote a research recommendation into a `@decision` memory or close a roadmap
  unknown as accepted unless the orchestrator has separate evidence that the choice is proven or the
  human explicitly decides it.
- Review linked files in `proj-ledger/tickets/attachments/` during closeout. Attachment files are
  temporary and must not remain there after the ticket is closed: either move durable attachments
  into the appropriate ledger memory area and link them from the retained ticket/roadmap, consolidate
  and condense them into a single memory card, or discard them if they are insignificant.
- For returned command reports, read the worker's command text as agent feedback, not machine input.
  The orchestrator owns normalization: identify useful command/task names, grep commands.xml by
  those names, then add or promote verified invocations only when useful.
- Move the returned XML into the relevant roadmap's memory area if retaining the ownership-cycle
  artifact helps future context; otherwise delete it after durable promotion.
- After closing out any returned ticket, re-list `proj-ledger/tickets/active/*.xml` and check for
  additional tickets that may have returned while closeout was underway. Do not assume the active
  ticket set observed at session start is still current.
- Keep active tickets short-lived. Roadmaps remain routing state and logs remain compact evidence,
  but retained tickets are the full-context record for how a worker performed and how the
  orchestrator corrected or accepted the work.
