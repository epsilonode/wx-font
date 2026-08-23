---
id: wx-font-github-esm-release-delivery
kind: decision
status: active
created: 2026-08-23
updated: 2026-08-23
roadmap: wx-font
refs:
  - roadmaps/wx-font.md#release-workflow-and-dist-policy
  - roadmaps/wx-font.md#npm-scope-and-cdn-publish-proof
hook: "read before creating a release, changing dist policy, publishing to npm, or documenting hosted asset URLs"
---

# GitHub esm.sh Release Delivery

Public GitHub tags are the immutable wx-font release source. npm publishing is intentionally out of scope.

- Create the public `epsilonode/wx-font` repository and publish releases as immutable `vMAJOR.MINOR.PATCH` tags.
- Commit generated `dist/` in every release because esm.sh serves the tagged GitHub tree; source files remain authoritative and `dist/` is regenerated only by project commands.
- Retain `package.json` and its exports map because esm.sh requires it to resolve GitHub repository modules.
- Prevent accidental npm publication by keeping `package.json` `private: true`; do not run `npm publish`.
- Serve JavaScript from `https://esm.sh/gh/epsilonode/wx-font@vX.Y.Z/dist/wmo.js`.
- Serve CSS, fonts, SVGs, and JSON from the equivalent `https://esm.sh/gh/epsilonode/wx-font@vX.Y.Z/dist/...` asset paths; validate the exact browser URLs after the first public tag.
- Never document `main` as a consumer URL. Consumers pin a tag or commit SHA and deliberately upgrade it.
- Each release builds and audits the source, verifies committed `dist/` has no regeneration drift, then creates the GitHub tag and release.
- Generate `dist/release-manifest.json` before the first public release with release identifier, critical asset paths, font sizes, glyph count, and SHA-256 integrity hashes.
- Release smoke proof fetches the resolver module, all CSS entrypoints, WOFF2, TTF, SVG, `codepoints.json`, and `wmo-contract.json` from tagged esm.sh URLs, then renders a browser fixture for direct, compatibility, and WMO classes.
- Update generated README hosting instructions only after the tagged esm.sh smoke proof passes.

Current caveat: exact CSS-relative font routing and asset content types are unproven until `epsilonode/wx-font` has its first public tag.
