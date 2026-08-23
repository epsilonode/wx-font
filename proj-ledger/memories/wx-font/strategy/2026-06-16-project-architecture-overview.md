---
id: wx-font-project-architecture-overview
kind: strategy
status: active
created: 2026-06-16
updated: 2026-06-16
roadmap: wx-font
refs:
  - roadmaps/wx-font.md#phase-1-font-mapping-mvp
  - roadmaps/wx-font.md#registry-and-mapping-contract
  - roadmaps/wx-font.md#build-pipeline
hook: "read before changing the package layout, source-of-truth model, or treating non-blueprint abstract docs as canonical"
---

# Project Architecture Overview

`@epsilonode/wx-font` is a registry-driven icon font package for WMO weather icons first.

The primary reference is `abstract/comprehensive-engineering-blueprint.md`; supporting abstract docs may be stale.

Phase 1 builds the Weather Icons-compatible WMO font mapping MVP, not the future toolbar integration.

The authored source should be registry plus codepoint manifest plus raw SVGs; generated outputs should not be hand-maintained.

The package emits web font, Office font, SVG payload, CSS layers, TS/JSON contracts, and generated attribution docs.

Keep roadmap state compact; put durable architecture rationale here or in sibling memory cards.
