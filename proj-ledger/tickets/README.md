# Tickets

`proj-ledger/tickets` is a temporary filesystem handoff area for independent terminal agents. It
replaces copy/paste subagent prompt/result loops; it is not roadmap routing and does not replace
roadmaps, logs, or memories.

The authoritative workflow, roles, boundaries, and contract live in
**`proj-ledger/must-know/tickets-workflow.md`** — read that before creating, assigning,
reviewing, or closing tickets.

```text
proj-ledger/tickets/
  active/T###-<slug>.xml      # one self-contained temp ticket per worker
  templates/worker-ticket.xml # starting point for new tickets
```

The filesystem is the index: list `active/*.xml` to see open tickets. On closeout, promote durable
facts into roadmaps/memories/logs/commands.xml, then delete the active XML or move it under
the relevant roadmap's memory area when retaining the returned artifact helps future agents.
