# @epsilonode/wx-font

Focused registry-driven weather icon font for web, DOCX, PPTX, and PDF pipelines.

## Hosted Release

This project publishes immutable GitHub tags and serves them through esm.sh. Pin a release tag or commit SHA; do not use `main` as a consumer URL.

    import { resolveWmo } from 'https://esm.sh/gh/epsilonode/wx-font@v0.1.0/dist/wmo.js';
    resolveWmo(0, { isDay: true, cloudPercent: 18 });

## CSS

    <link rel="stylesheet" href="https://esm.sh/gh/epsilonode/wx-font@v0.1.0/dist/wx-icons.css">
    <link rel="stylesheet" href="https://esm.sh/gh/epsilonode/wx-font@v0.1.0/dist/wx-wmo.css">

Optional layers are `wx-icons.compat.css`, `wx-icons.colors.css`, and `wx-wmo.descriptions.css`. Font, SVG, JSON, and contract paths are listed with integrity hashes in `release-manifest.json`.

    <i class="wx wx-few-clouds wx-night"></i>
    <i class="wi wi-night-alt-partly-cloudy"></i>
    <i class="wx wx-wmo-00 wx-day wx-okta-2"></i>
    <span class="wx wx-wmo-60 wx-day wx-wmo-description"></span>

WMO selectors use `wx-day` or `wx-night`; dynamic cloud states additionally use `wx-okta-0` through `wx-okta-8`.

## Documents

Use `wx-font.woff2` for web and `wx-font.ttf` with `codepoints.json` for DOCX/PPTX generators. Document tools must embed or install the TTF according to their own API.

## Glyph Sources

| Glyph | Compatibility class | Source |
| --- | --- | --- |
| clear-day | wi-day-sunny | Weather Icons 2.0.10 |
| clear-night | wi-night-clear | Weather Icons 2.0.10 |
| day-haze | wi-day-haze | Weather Icons 2.0.10 |
| dust | wi-dust | Weather Icons 2.0.10 |
| few-clouds-day | wi-day-sunny-overcast | Weather Icons 2.0.10 |
| few-clouds-night | wi-night-alt-partly-cloudy | Weather Icons 2.0.10 |
| fog | wi-fog | Weather Icons 2.0.10 |
| hail | wi-hail | Weather Icons 2.0.10 |
| lightning | wi-lightning | Weather Icons 2.0.10 |
| night-fog | wi-night-fog | Weather Icons 2.0.10 |
| mostly-cloudy | wi-cloudy | Weather Icons 2.0.10 |
| overcast | wi-overcast | Derived project glyph |
| partly-cloudy | wi-cloud | Weather Icons 2.0.10 |
| rain | wi-rain | Weather Icons 2.0.10 |
| rain-mix | wi-rain-mix | Weather Icons 2.0.10 |
| rain-wind | wi-rain-wind | Weather Icons 2.0.10 |
| sandstorm | wi-sandstorm | Weather Icons 2.0.10 |
| showers | wi-showers | Weather Icons 2.0.10 |
| sleet | wi-sleet | Weather Icons 2.0.10 |
| smoke | wi-smoke | Weather Icons 2.0.10 |
| snow | wi-snow | Weather Icons 2.0.10 |
| snow-wind | wi-snow-wind | Weather Icons 2.0.10 |
| snowflake-cold | wi-snowflake-cold | Weather Icons 2.0.10 |
| sprinkle | wi-sprinkle | Weather Icons 2.0.10 |
| storm-showers | wi-storm-showers | Weather Icons 2.0.10 |
| strong-wind | wi-strong-wind | Weather Icons 2.0.10 |
| thunderstorm | wi-thunderstorm | Weather Icons 2.0.10 |
| tornado | wi-tornado | Weather Icons 2.0.10 |

## Attribution

27 glyphs are pinned to Weather Icons 2.0.10 by Erik Flowers, with original icon designs by Lukas Bischoff, under SIL OFL 1.1. The filled `overcast` glyph is project-generated and uses U+E900. See `NOTICE` and `LICENSE`.
