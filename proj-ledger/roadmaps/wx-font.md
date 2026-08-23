# wx-font

@roadmap wx-font
@log ../logs/wx-font.logfmt
@updated 2026-06-16
@summary Build @epsilonode/wx-font as a registry-driven WMO weather icon font package with Weather Icons compatibility, stable codepoints, generated CSS/TS contracts, and generated attribution docs.
@note primary reference is abstract/comprehensive-engineering-blueprint.md; other abstract docs are supporting context and may be stale.
@note phase 1 is font mapping first; toolbar/interface font integration is planned but deferred.
@note full vision is one authored registry compiling into web fonts, Office fonts, optimized SVGs, CSS mapping layers, TS/JSON contracts, preview/audit artifacts, and generated attribution docs.
@note delivery principle is low-bandwidth reuse: one cached font should replace repeated icon payloads where practical.
@note sequencing principle is unknowns-first: prove the smallest source/provenance/codepoint/compiler/mapping questions that unblock the most downstream work.
@note avoid hard-coded implementation lanes; infer next work from open blockers, proof gaps, and dependency-unlocking value.

## @tier6 high planning gates
### @decision @accepted authoritative references
@memory ../memories/wx-font/strategy/2026-06-16-project-architecture-overview.md
@memory ../memories/wx-font/strategy/2026-06-16-authority-and-wmo-mapping-contract.md
@note abstract/comprehensive-engineering-blueprint.md is the primary architecture reference.
@note abstract/icon-map.html is the definitive WMO-to-existing-font-glyph mapping source.
@note conversation decisions override stale copied project-ledger and supporting abstract material.
@evidence 2026-06-16 user confirmed blueprint is primary, icon-map.html owns WMO mapping, and all other material is potentially stale.

### @decision @accepted package identity
@memory ../memories/wx-font/strategy/2026-06-16-project-architecture-overview.md
@note GitHub repository target is epsilonode/wx-font.
@note NPM package target is @epsilonode/wx-font.
@evidence 2026-06-16 user confirmed repo and npm naming direction.

### @decision @accepted phase priority
@memory ../memories/wx-font/strategy/2026-06-16-downstream-targets-and-delivery.md
@note highest priority is the Weather Icons-compatible font mapping MVP.
@note lower priority is toolbar/interface glyph integration from wx-ui-melt.
@evidence 2026-06-16 user clarified early dev target is font mapping; toolbar integration comes later.

### @decision @accepted sequencing policy
@memory ../memories/wx-font/strategy/2026-06-16-project-architecture-overview.md
@memory ../memories/wx-font/research/2026-06-16-tooling-and-build-pipeline-strategy.md
@note race toward unknowns and fail early before broad implementation depends on assumptions.
@note preferred sequence is source/provenance/codepoint proof, then compiler/template smoke, then WMO mapping/okta semantics, then scaffold/build/docs expansion.
@note thin scaffolding is acceptable only when it directly supports those proofs.
@evidence 2026-06-16 user requested logical sequencing for dev velocity without hard-coded lanes.

### @decision @accepted output artifact contract
@memory ../memories/wx-font/strategy/2026-06-16-project-architecture-overview.md
@memory ../memories/wx-font/strategy/2026-06-16-downstream-targets-and-delivery.md
@note phase 1 emits wx-font.ttf for docx/pptx, wx-font.woff2 for web, optimized weather SVGs, CSS layers, codepoints.json, registry snapshot, TS exports, and generated README.
@note dist is the package payload; source registry/SVGs remain the reproducible authoring inputs.
@evidence 2026-06-16 user confirmed web UI, docx, and pptx are downstream targets and README attribution must be generated for npm/GitHub.

### @decision @accepted public css api
@memory ../memories/wx-font/strategy/2026-06-16-authority-and-wmo-mapping-contract.md
@memory ../memories/wx-font/decisions/2026-06-16-codepoints-and-compatibility-contract.md
@note canonical direct glyph API uses `.wx .wx-*` classes.
@note WMO mapping API uses `.wx .wx-wmo-*` plus `.wx-day` or `.wx-night` and `.wx-okta-0` through `.wx-okta-8`.
@note compatibility API uses `.wi .wi-*` aliases only for glyphs actually shipped.
@note optional generated description CSS may expose registry descriptions through custom properties and `::after`, but TS/JSON remain the semantic description contract.
@evidence 2026-06-16 user selected wx-okta spelling and requested compatibility CSS plus specialized WMO mapping CSS.

### @decision @accepted codepoint range policy
@memory ../memories/wx-font/decisions/2026-06-16-codepoints-and-compatibility-contract.md
@note copied Weather Icons glyphs keep original PUA codepoints when possible.
@note custom weather glyphs such as filled overcast use a project-owned PUA range that does not collide with copied glyphs.
@note future toolbar/interface glyphs use a reserved UI PUA range, but no toolbar glyphs ship in phase 1.
@evidence 2026-06-16 user confirmed codepoints are needed for downstream web UI plus docx/pptx embedding.

### @proof @active source provenance codepoint unlocker
@memory ../memories/wx-font/decisions/2026-06-16-attribution-and-docs-generation.md
@memory ../memories/wx-font/decisions/2026-06-16-codepoints-and-compatibility-contract.md
@memory ../memories/wx-font/research/2026-06-16-tooling-and-build-pipeline-strategy.md
@blocker no broad glyph import or package-build expansion should proceed until one representative mapped glyph proves source, license, codepoint, and extraction shape.
@note this is the smallest proof that unlocks provenance, registry shape, codepoint manifest, compiler smoke, docs generation, and visual fidelity work.
- [ ] @accept one icon-map.html-mapped Weather Icons glyph has authoritative source, original class, original codepoint, and license metadata identified
- [ ] @accept extraction/normalization path can produce a monochrome SVG suitable for src/svg-raw/weather
- [ ] @accept temporary registry/codepoint record can describe the glyph without special-case fields
- [ ] @accept proof states whether full subset extraction should continue, pivot, or stop for license/source reasons

### @proof @ready compiler and css pipeline unlocker
@memory ../memories/wx-font/research/2026-06-16-tooling-and-build-pipeline-strategy.md
@memory ../memories/wx-font/decisions/2026-06-16-codepoints-and-compatibility-contract.md
@note prove the compiler plus generated-CSS stack with the representative glyph before building the full package pipeline.
- [ ] @accept fixed-codepoint glyph compiles to TTF, WOFF2, CSS, JSON, and TS under Bun
- [ ] @accept css-tree can emit canonical wx class, compatibility wi alias, and one WMO selector from registry data
- [ ] @accept Lightning CSS can transform/minify generated CSS without changing public selector behavior
- [ ] @accept repeated builds produce identical codepoints and stable generated CSS/JSON

### @proof @ready mapping semantics unlocker
@memory ../memories/wx-font/strategy/2026-06-16-authority-and-wmo-mapping-contract.md
@memory ../memories/wx-font/decisions/2026-06-16-codepoints-and-compatibility-contract.md
@memory ../memories/wx-font/research/2026-08-23-wmo-4677-renderer-discrepancies.md
@memory ../memories/wx-font/decisions/2026-08-23-hail-glyph-precedence.md
@note prove the dynamic WMO surface before full resolver, CSS, and registry generation depend on guessed rules.
@note preserve two contracts: raw cloud-cover percent normalization into okta/cloudiness state, and WMO glyph resolution from normalized state.
- [ ] @accept icon-map.html dynamic branches are summarized for 00-03, 20-29, and any other stateful conditions
- [ ] @accept cloud-cover percent thresholds from icon-map.html are preserved as explicit normalization provenance rather than hidden JS conditionals
- [ ] @accept normalized wx-okta state is the shared input consumed by downstream JS, generated WMO CSS, and generated TS resolver
- [ ] @accept a small fixture matrix proves percent normalization, normalized-state resolution, CSS selector output, and TS resolver output separately

### @gap @open original font provenance and source path
@memory ../memories/wx-font/decisions/2026-06-16-attribution-and-docs-generation.md
@blocker source glyph import/copy path must preserve Weather Icons attribution and license notices before assets are committed.
@note Weather Icons attribution belongs to the original project; registry and generated README must carry source metadata.
- [ ] @accept Weather Icons license and attribution text captured in generated README/NOTICE plan
- [ ] @accept source glyph acquisition path documented enough to reproduce the subset
- [ ] @accept copied/derived glyphs identify original class, original codepoint, and source project

### @gap @open deterministic codepoint contract
@memory ../memories/wx-font/decisions/2026-06-16-codepoints-and-compatibility-contract.md
@blocker codepoints are public API for CSS, web font rendering, and docx/pptx embedding.
@note preserve original Weather Icons codepoints where possible; reserve custom ranges for overcast and future toolbar glyphs.
- [ ] @accept registry or codepoints manifest locks every glyph to one PUA codepoint
- [ ] @accept build fails on duplicate, missing, or changed released codepoints
- [ ] @accept generated codepoints.json supports document generation through wx-font.ttf

### @unknown @open compiler and dev-tooling proof
@memory ../memories/wx-font/research/2026-06-16-tooling-and-build-pipeline-strategy.md
@note Fantasticon is the preferred font compiler because it supports explicit codepoints and TTF/WOFF2 outputs, while css-tree/Lightning CSS own production CSS generation.
@proof_gap Bun/Fantasticon compatibility, css-tree CSS generation, and Lightning CSS output still need a smoke proof in this repo.
- [ ] @accept compile one fixed-codepoint SVG into TTF, WOFF2, CSS, JSON, and TS
- [ ] @accept generated CSS pipeline can emit wx classes, wi aliases, and WMO selectors
- [ ] @accept build remains deterministic across repeated runs

### @unknown @open office embedding proof
@memory ../memories/wx-font/decisions/2026-06-16-codepoints-and-compatibility-contract.md
@memory ../memories/wx-font/strategy/2026-06-16-downstream-targets-and-delivery.md
@note TTF output is required for docx and pptx consumers; WOFF2 is web-only.
@proof_gap exact downstream document embedding mechanism is not yet proven.
- [ ] @accept codepoints.json value can render expected glyph through wx-font.ttf in a document-generation path
- [ ] @accept README documents font installation/embedding assumptions for docx/pptx

### @risk @open license compliance and reserved names
@memory ../memories/wx-font/decisions/2026-06-16-attribution-and-docs-generation.md
@blocker Weather Icons copying/derivation cannot proceed until license obligations, attribution, and any OFL reserved-font-name constraints are understood.
@note copied glyphs, copied CSS compatibility names, generated docs, and derived overcast may have different notice requirements.
- [ ] @accept original Weather Icons license files and notices are captured verbatim where required
- [ ] @accept derivative naming constraints are checked before publishing @epsilonode/wx-font
- [ ] @accept README/NOTICE output names original authors and distinguishes copied from derived/custom glyphs

### @unknown @open upstream glyph source and extraction route
@memory ../memories/wx-font/decisions/2026-06-16-attribution-and-docs-generation.md
@memory ../memories/wx-font/research/2026-06-16-tooling-and-build-pipeline-strategy.md
@note source may come from upstream SVGs, an upstream font, or another reproducible source artifact; choose the least lossy reproducible path.
@proof_gap exact source path for Weather Icons glyph SVGs and original codepoint metadata is not yet proven.
- [ ] @accept locate authoritative upstream Weather Icons source assets for mapped glyphs
- [ ] @accept document extraction/conversion path from source asset to src/svg-raw/weather
- [ ] @accept verify extracted glyph outlines match existing Weather Icons rendering closely enough for compatibility

### @unknown @open weather icons codepoint inventory
@memory ../memories/wx-font/decisions/2026-06-16-codepoints-and-compatibility-contract.md
@note codepoint preservation depends on extracting the original `.wi-*::before content` map for every included glyph.
@proof_gap original Weather Icons CSS/codepoint inventory has not been normalized into a project-owned manifest.
- [ ] @accept every shipped legacy class has one original codepoint recorded
- [ ] @accept no copied glyph gets an auto-assigned replacement codepoint unless explicitly justified
- [ ] @accept compatibility CSS renders the same PUA slot names as the original font for included glyphs

### @unknown @open complete wmo dynamic mapping scope
@memory ../memories/wx-font/strategy/2026-06-16-authority-and-wmo-mapping-contract.md
@note icon-map.html is authoritative for WMO-to-glyph mapping and contains executable resolver logic tied up in HTML.
@note extract that authority into registry-ready contracts before resolver/CSS generation; do not obscure intent by copying opaque conditionals.
@proof_gap full mapping table, descriptions, cloud normalization, and dynamic state branches have not been audited into registry-ready rules.
- [ ] @accept extract all WMO code groups and glyph targets from icon-map.html without expanding beyond mapped glyphs
- [ ] @accept capture dynamic branches for day/night, normalized okta/cloudiness, prior weather, or any other icon-map.html state inputs
- [ ] @accept classify descriptions, display categories, source hints, SVG preview behavior, and UI-only behavior as package data, migration evidence, or discardable demo code

### @unknown @open cloud normalization and okta contract
@memory ../memories/wx-font/strategy/2026-06-16-authority-and-wmo-mapping-contract.md
@note icon-map.html normalizes noisy upstream API cloud-cover percentages into visual cloudiness states; downstream JS should consume this contract and emit wx-okta classes explicitly.
@note public CSS consumes normalized `wx-okta-0` through `wx-okta-8`; raw percent handling belongs to the normalization contract and TS helper, not CSS.
@proof_gap normalized okta bucket names, threshold-edge fixtures, and percent-to-okta provenance have not been materialized outside icon-map.html.
- [ ] @accept preserve icon-map.html cloud-cover thresholds as an explicit normalization contract with provenance and rationale
- [ ] @accept define normalized okta/cloudiness states independently from WMO glyph selection
- [ ] @accept generated TS exposes raw-percent normalization and normalized-state glyph resolution as distinct steps
- [ ] @accept generated CSS consumes wx-okta classes and agrees with TS resolution for normalized fixtures

### @risk @open font rendering fidelity drift
@memory ../memories/wx-font/research/2026-06-16-tooling-and-build-pipeline-strategy.md
@memory ../memories/wx-font/decisions/2026-06-16-animation-color-and-overcast-policy.md
@note SVGO/Fantasticon normalization can alter icon scale, baseline, fill rules, or small-size readability.
@proof_gap no visual comparison exists yet against the original Weather Icons rendering or the custom overcast target.
- [ ] @accept preview sheet compares copied glyphs against original Weather Icons reference at common UI sizes
- [ ] @accept font metrics produce aligned icons in inline text, toolbar-like buttons, and WMO table cells
- [ ] @accept overcast remains visibly filled and distinguishable from plain cloud

### @decision @open registry authoring format
@memory ../memories/wx-font/strategy/2026-06-16-project-architecture-overview.md
@memory ../memories/wx-font/strategy/2026-06-16-authority-and-wmo-mapping-contract.md
@note blueprint names registry.json, but the final authoring split between registry, codepoints, mappings, and generated snapshots is not fully settled.
- [ ] @accept decide whether glyphs, WMO mappings, codepoints, and attribution live in one JSON file or small split files
- [ ] @accept decide whether a JSON schema or TypeScript type-only contract is enough for authoring checks
- [ ] @accept decide where generated registry snapshots live in dist

### @decision @accepted release workflow and dist policy
@memory ../memories/wx-font/decisions/2026-08-23-github-esm-release-delivery.md
@note public GitHub version tags are releases; committed generated dist is the esm.sh release payload.
@note npm publishing is out of scope and package metadata must prevent accidental publication.
- [x] @accept release assets are served from tagged esm.sh GitHub paths rather than npm
- [x] @accept dist is committed for releases and regenerated only through the project pipeline
- [x] @accept prove tagged esm.sh module and asset delivery with the first public release
@evidence 2026-08-23 public epsilonode/wx-font v0.1.0 passed release-assets-verify for all manifest assets and CSS-relative WOFF2 routing

### @unknown @dropped npm scope and cdn publish proof
@memory ../memories/wx-font/decisions/2026-08-23-github-esm-release-delivery.md
@note npm registry, unpkg, and jsDelivr delivery are intentionally out of scope; esm.sh GitHub delivery replaces them.

### @decision @open color token taxonomy
@memory ../memories/wx-font/decisions/2026-06-16-animation-color-and-overcast-policy.md
@note optional CSS colors are accepted, but the exact semantic token set and default palette are still open.
- [ ] @accept decide weather color tokens such as --wx-sunny, --wx-rain, --wx-snow, --wx-fog, --wx-thunder, and --wx-overcast
- [ ] @accept decide whether colors apply to direct glyph classes, WMO selectors, compatibility aliases, or all three
- [ ] @accept decide whether color CSS is imported separately or bundled by a convenience entrypoint

## @tier3 normal active
### @work @ready phase 1 font mapping mvp
@memory ../memories/wx-font/strategy/2026-06-16-project-architecture-overview.md
@memory ../memories/wx-font/decisions/2026-06-16-animation-color-and-overcast-policy.md
@note ship the smallest useful Weather Icons-compatible WMO font subset first.
@note do not broaden this beyond proof-supporting work until source/provenance/codepoint and compiler/template unlockers pass.
- [ ] @accept package name and import surface use @epsilonode/wx-font
- [ ] @accept package compiles wx-font.ttf and wx-font.woff2
- [ ] @accept only WMO-mapped weather glyphs from icon-map.html are included initially
- [ ] @accept filled overcast custom glyph is included as a derived weather glyph
- [ ] @accept no animation layer is shipped

### @work @ready repository scaffold
@memory ../memories/wx-font/strategy/2026-06-16-project-architecture-overview.md
@note scaffold should follow the blueprint while leaving room for future ui namespace glyphs.
@note start with thin proof scaffolding; expand only after the active unlockers reduce source, codepoint, and compiler uncertainty.
- [ ] @accept package.json defines @epsilonode/wx-font, build scripts, files allowlist, and export paths
- [ ] @accept src/svg-raw/weather, src/registry.json, src/codepoints.json, scripts, and template folders exist
- [ ] @accept generated dist output is reproducible and not treated as authored source during development
- [ ] @accept README generation is part of build, not a manual final step

### @work @ready registry and mapping contract
@memory ../memories/wx-font/strategy/2026-06-16-authority-and-wmo-mapping-contract.md
@memory ../memories/wx-font/decisions/2026-06-16-codepoints-and-compatibility-contract.md
@memory ../memories/wx-font/decisions/2026-06-16-attribution-and-docs-generation.md
@note registry is the authored source of truth; generated outputs must not be hand-maintained.
- [ ] @accept glyph inventory captures id, namespace, file, class names, codepoint, color token, and attribution
- [ ] @accept WMO mapping rules capture code, diurnal state, wx-okta selectors, description, and target glyph
- [ ] @accept registry can represent one glyph mapped to many WMO states without duplicating glyph records
- [ ] @accept registry records source_class, legacy_class, canonical_class, codepoint, source license, and source URL for copied glyphs
- [ ] @accept registry can later add ui namespace glyphs without reshaping phase 1 weather data

### @work @ready codepoint manifest
@memory ../memories/wx-font/decisions/2026-06-16-codepoints-and-compatibility-contract.md
@note codepoints are durable public API and must be reviewable as a small manifest.
- [ ] @accept copied Weather Icons glyph names map to original hex codepoints where included
- [ ] @accept filled overcast receives a stable custom codepoint documented as derived/custom
- [ ] @accept future ui range is reserved without emitting ui glyphs in phase 1
- [ ] @accept manifest can generate Fantasticon `codepoints` config without manual translation

### @work @ready weather glyph subset
@memory ../memories/wx-font/strategy/2026-06-16-authority-and-wmo-mapping-contract.md
@memory ../memories/wx-font/decisions/2026-06-16-animation-color-and-overcast-policy.md
@memory ../memories/wx-font/decisions/2026-06-16-attribution-and-docs-generation.md
@memory ../memories/wx-font/research/2026-08-23-wmo-4677-renderer-discrepancies.md
@memory ../memories/wx-font/decisions/2026-08-23-hail-glyph-precedence.md
@note icon-map.html defines the required glyph subset; do not package the full upstream weather font.
- [ ] @accept all mapped Weather Icons glyphs are present under src/svg-raw/weather
- [ ] @accept source extraction records which icon-map.html mapping required each glyph
- [ ] @accept overcast.svg is a filled version of wi-cloud rather than the outline cloud glyph
- [ ] @accept SVGs are static, monochrome-compatible, and suitable for font compilation
- [ ] @accept no unmapped upstream Weather Icons glyphs ship in phase 1

### @work @ready build pipeline
@memory ../memories/wx-font/research/2026-06-16-tooling-and-build-pipeline-strategy.md
@note Bun orchestrates registry validation, SVG optimization, font compilation, CSS/TS generation, and docs generation.
- [ ] @accept SVGO stages optimized SVGs into dist/svg/weather
- [ ] @accept Fantasticon compiles dist/svg inputs with explicit codepoints
- [ ] @accept css-tree generates provenance-aware readable CSS layers from registry and mapping contracts
- [ ] @accept Lightning CSS transforms/minifies generated production CSS with deterministic output and source maps where useful
- [ ] @accept Fantasticon is used for font binaries/codepoint artifacts, not as the owner of complex WMO CSS semantics
- [ ] @accept generated README and generated TS/JSON contracts run in the same build command
- [ ] @accept generated artifacts are reproducible from clean checkout inputs

### @work @ready developer tooling commands
@memory ../memories/wx-font/research/2026-06-16-tooling-and-build-pipeline-strategy.md
@note dev commands should make icon incorporation safe without hiding codepoint or attribution changes.
- [ ] @accept icon:build runs the full registry-to-dist pipeline
- [ ] @accept icon:audit detects missing SVGs, unmapped glyphs, duplicate codepoints, missing attribution, and stale aliases
- [ ] @accept icon:preview generates a visual sheet for glyphs and WMO state selectors
- [ ] @accept icon:watch rebuilds during local SVG/registry/template iteration
- [ ] @accept icon:add is designed for later assisted imports but does not bypass review of attribution and codepoint changes

### @work @ready generated css layers
@memory ../memories/wx-font/strategy/2026-06-16-authority-and-wmo-mapping-contract.md
@memory ../memories/wx-font/decisions/2026-06-16-animation-color-and-overcast-policy.md
@note CSS layers should allow consumers to choose canonical, compatibility, WMO, and color behavior.
- [ ] @accept wx-icons.css emits canonical .wx .wx-* classes
- [ ] @accept wx-icons.compat.css emits .wi .wi-* aliases only for shipped glyphs
- [ ] @accept wx-wmo.css emits .wx-wmo-* selectors with .wx-day/.wx-night and .wx-okta-0 through .wx-okta-8 modifiers
- [ ] @accept wx-icons.colors.css provides optional one-color semantic presets through CSS variables
- [ ] @accept wx-wmo.descriptions.css optionally exposes descriptions with custom properties and `::after` while TS/JSON remain authoritative for semantic descriptions
- [ ] @accept public CSS generation disables CSS Modules/scoping and safely escapes class names, string content, font URLs, and description text

### @work @ready generated ts json contracts
@memory ../memories/wx-font/decisions/2026-06-16-codepoints-and-compatibility-contract.md
@note TypeScript and JSON contracts support web UI imports and document pipelines.
- [ ] @accept generated exports expose glyph ids, class names, codepoints, and WMO resolver data
- [ ] @accept codepoints.json is stable and usable by docx/pptx generation
- [ ] @accept TypeScript resolver can mirror the WMO CSS mapping without divergence
- [ ] @accept package exports support weather-only imports without requiring future ui modules

### @work @ready generated attribution readme
@memory ../memories/wx-font/decisions/2026-06-16-attribution-and-docs-generation.md
@note README is generated for both GitHub and NPM from registry metadata.
- [ ] @accept README includes install, CSS usage, WMO selector usage, docx/pptx codepoint usage, and attribution
- [ ] @accept per-glyph source table distinguishes original Weather Icons glyphs from custom/derived glyphs
- [ ] @accept generated docs preserve Weather Icons license/attribution notices

### @work @ready package distribution contract
@memory ../memories/wx-font/strategy/2026-06-16-downstream-targets-and-delivery.md
@memory ../memories/wx-font/decisions/2026-06-16-attribution-and-docs-generation.md
@note npm package should be small, deterministic, and CDN-friendly.
- [ ] @accept published package includes dist assets, generated README, and required license/attribution files
- [ ] @accept package exports expose CSS files, fonts, codepoints, and generated JS/TS entrypoints
- [ ] @accept unpkg/jsDelivr URLs for fonts, CSS, and SVGs are documented by generated README
- [ ] @accept source-only planning docs and ledger files do not ship in npm payload

### @proof @ready license and provenance audit
@memory ../memories/wx-font/decisions/2026-06-16-attribution-and-docs-generation.md
@note close the legal/provenance blocker before committing copied glyph assets as project-owned source.
- [ ] @accept Weather Icons license, author, source URL, and copyright notice are captured
- [ ] @accept derived overcast attribution text is approved for generated README/NOTICE
- [ ] @accept package license metadata and included license files match copied code/font obligations

### @proof @ready upstream glyph acquisition proof
@memory ../memories/wx-font/decisions/2026-06-16-attribution-and-docs-generation.md
@memory ../memories/wx-font/research/2026-06-16-tooling-and-build-pipeline-strategy.md
@note prove the source-to-svg path with a tiny mapped subset before extracting the full WMO set.
- [ ] @accept obtain one copied Weather Icons glyph SVG and its original codepoint from authoritative sources
- [ ] @accept normalize the glyph into src/svg-raw/weather without losing visual compatibility
- [ ] @accept record source metadata in registry and generated attribution output

### @proof @ready icon-map-to-contract transformation
@memory ../memories/wx-font/strategy/2026-06-16-authority-and-wmo-mapping-contract.md
@note icon-map.html is authoritative for WMO-to-glyph mapping and cloud-cover normalization, but the package end state must not depend on HTML.
@note preserve two separate contracts: cloud-cover percent normalization into okta/cloudiness state, and WMO glyph resolution from normalized state.
@note transformation should keep provenance explicit and upstream so intent is not obscured by generated code.
- [ ] @accept extract cloud-cover thresholds from getCloudDescriptorAndIcon into an explicit normalization contract with provenance and rationale
- [ ] @accept extract getWeatherMapping WMO-to-glyph behavior into a separate resolution contract that consumes normalized state
- [ ] @accept list every WMO code and every mapped legacy glyph class used by icon-map.html
- [ ] @accept derive the required unique Weather Icons glyph subset from returned wi-* classes only, with wi-overcast marked custom/local
- [ ] @accept classify icon-map.html content as package data, migration evidence, source-acquisition hint, preview-only behavior, or discardable UI behavior
- [ ] @accept produce human-reviewable fixtures for raw percent normalization, normalized-state resolution, and final glyph outputs before assets are copied

### @proof @ready okta and resolver semantics proof
@memory ../memories/wx-font/strategy/2026-06-16-authority-and-wmo-mapping-contract.md
@memory ../memories/wx-font/decisions/2026-06-16-codepoints-and-compatibility-contract.md
@note ensure CSS selectors and TypeScript resolver cannot drift for day/night/normalized-okta states.
- [ ] @accept define fixture cases for wx-okta-0, wx-okta-1, wx-okta-7, and wx-okta-8 in day and night states
- [ ] @accept raw cloud-cover percent edge cases from icon-map.html normalize into the expected wx-okta states before glyph resolution
- [ ] @accept generated wx-wmo CSS and TS resolver return the same codepoint for every fixture
- [ ] @accept invalid or missing okta handling is documented for consumers

### @proof @ready codepoint inventory audit
@memory ../memories/wx-font/decisions/2026-06-16-codepoints-and-compatibility-contract.md
@note codepoint preservation is easy to regress when adding glyphs or regenerating fonts.
- [ ] @accept extracted Weather Icons CSS content values match codepoints.json for all included legacy classes
- [ ] @accept Fantasticon output JSON matches project codepoints manifest exactly
- [ ] @accept audit fails if a released glyph's codepoint changes without an explicit migration decision

### @proof @ready font metrics and visual regression proof
@memory ../memories/wx-font/research/2026-06-16-tooling-and-build-pipeline-strategy.md
@memory ../memories/wx-font/decisions/2026-06-16-animation-color-and-overcast-policy.md
@note visual compatibility is a primary goal, so font generation needs a practical visual proof path.
- [ ] @accept generated preview renders original reference, wx class, wi alias, and WMO selector side by side
- [ ] @accept icons align consistently at 12px, 16px, 24px, and 48px sizes
- [ ] @accept filled overcast is approved against the intended wi-cloud-derived silhouette

### @proof @ready package install and export smoke proof
@memory ../memories/wx-font/strategy/2026-06-16-downstream-targets-and-delivery.md
@note prove consumer ergonomics before depending on the package from wx-ui-melt or document tooling.
- [ ] @accept local package install/import works from a throwaway web fixture
- [ ] @accept CSS imports load font files through package-relative URLs
- [ ] @accept TS imports expose resolver/codepoints without importing CSS side effects

### @proof @ready generated docs audit
@memory ../memories/wx-font/decisions/2026-06-16-attribution-and-docs-generation.md
@note README quality is part of the product because it is generated for both GitHub and npm.
- [ ] @accept generated README includes complete install, web, WMO CSS, docx/pptx, CDN, and attribution sections
- [ ] @accept generated README does not include stale @your-org placeholders from abstract drafts
- [ ] @accept generated source table includes every shipped glyph exactly once

### @proof @ready mapping and rendering verification
@memory ../memories/wx-font/strategy/2026-06-16-authority-and-wmo-mapping-contract.md
@memory ../memories/wx-font/research/2026-06-16-tooling-and-build-pipeline-strategy.md
@note verify generated outputs against the authoritative mapping before expanding scope.
- [ ] @accept every icon-map.html mapped WMO condition resolves to a shipped glyph
- [ ] @accept every generated wx-wmo selector maps to the same codepoint as the TS resolver for matching state inputs
- [ ] @accept wx class, wi compatibility class, and WMO selector render the same glyph where applicable
- [ ] @accept visual preview sheet renders all glyphs and WMO dynamic states

### @proof @ready payload and compatibility verification
@memory ../memories/wx-font/strategy/2026-06-16-downstream-targets-and-delivery.md
@memory ../memories/wx-font/decisions/2026-06-16-codepoints-and-compatibility-contract.md
@note prove low-bandwidth and compatibility goals before adding toolbar scope.
- [ ] @accept WOFF2 payload contains only phase 1 mapped weather glyphs plus custom overcast
- [ ] @accept existing included `.wi-*` examples render through wx-font without loading Weather Icons CDN
- [ ] @accept TTF renders at least one copied Weather Icons glyph and the custom overcast glyph by codepoint
- [ ] @accept package size and glyph count are recorded in generated preview or build summary

## @tier2 deferred
### @work @deferred toolbar font integration
@memory ../memories/wx-font/strategy/2026-06-16-downstream-targets-and-delivery.md
@note future phase includes wx-ui-melt toolbar/interface icons in the shared font for low-bandwidth pageweight reduction.
@note reserve codepoint space for ui glyphs, but do not make toolbar integration part of the phase 1 MVP.
@note future target is one cached font carrying both weather and toolbar glyphs where that reduces repeated inline SVG pageweight.
- [ ] @accept later ui glyph namespace uses reserved codepoint range and does not disturb released weather codepoints
- [ ] @accept later toolbar glyphs can still emit SVG/TS metadata for preview and fallback needs

### @work @deferred wx-ui-melt sync
@memory ../memories/wx-font/strategy/2026-06-16-downstream-targets-and-delivery.md
@note downstream merge target is R:\Code\web\wx-ui-melt.
@note future tooling should ingest or sync toolbar icon contracts from wx-ui-melt catalog/ui-elements metadata.
@note wx-ui-melt currently has catalog/ui-elements metadata and generated inline SVG manifests; future sync should preserve those attribution fields.
- [ ] @accept later sync reads wx-ui-melt icon contracts without making wx-ui-melt the phase 1 source of truth
- [ ] @accept later web UI migration can switch toolbar icons from inline SVG to font-backed classes gradually

### @work @deferred subset and advanced delivery variants
@memory ../memories/wx-font/strategy/2026-06-16-downstream-targets-and-delivery.md
@note primary web target is one cached WOFF2 font; optional subset fonts can be considered later if payload size requires them.
@note do not optimize into multiple subset files until the combined font payload has been measured.

### @work @deferred rich svg variants
@memory ../memories/wx-font/decisions/2026-06-16-animation-color-and-overcast-policy.md
@note phase 1 drops animations and uses optional CSS colors; richer multi-color SVG variants require a future explicit decision.
@note future rich SVGs must not change the static font contract or released codepoints.
