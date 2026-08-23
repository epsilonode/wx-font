# Publishing & Contract Architecture

---

## 1. CDN / Shipping Strategy

| Strategy | Workflow | Target / Velocity | Global Performance |
|---|---|---|---|
| **NPM + Auto-CDN** *(Recommended)* | Build to `/dist`. Run `bun publish`. Accessible via `unpkg.com/package@version/dist/font.woff2`. | **Highest velocity.** Native `package.json` for Web; clean URLs for desktop templates. | Global Anycast Edge (Cloudflare/Fastly). |
| **GitHub Releases + jsDelivr** | Push git tag → jsDelivr fetches from public release artifacts. | **Low overhead.** Bypasses NPM for restricted visibility. | Mirrors GitHub infra. |
| **Monorepo Workspaces** | Bun Workspaces (`"font-pkg": "workspace:*"`) if Svelte + font share a repo. | **Instant local velocity.** Zero wait for publishes during dev. | Local dev; NPM for prod builds. |

---

## 2. Contract Resolution Engine

The core mapping must be a declarative **JSON Schema mapping matrix** + a stateless **Pure Evaluation Function**. Three parameters resolve the target glyph:

1. **WMO Code** (`00–99`)
2. **Solar/Diurnal State** (`day` vs `night`)
3. **Cloud Cover Fraction** (`0%–100%`)

### Type Definitions

```typescript
export type DiurnalState = 'day' | 'night';

export interface WeatherConditionContract {
  wmoCode: number;
  baseDescription: string;
  resolvedIconId: string;
  resolvedGlyphCodepoint: string;
}
```

### Stateless Resolution Engine

```typescript
export function resolveWmoContract(
  code: number,
  state: DiurnalState,
  cloudCover: number
): WeatherConditionContract {
  // Dynamic block: WMO 00–03 (clear/cloudy)
  if (code >= 0 && code <= 3) {
    const isDay = state === 'day';

    if (cloudCover < 10) {
      return {
        wmoCode: code,
        baseDescription: "Clear Sky / No Clouds",
        resolvedIconId: isDay ? "wmo-clear-day" : "wmo-clear-night",
        resolvedGlyphCodepoint: isDay ? "\uE001" : "\uE002",
      };
    } else if (cloudCover <= 70) {
      return {
        wmoCode: code,
        baseDescription: "Partly Cloudy / Scattered Clouds",
        resolvedIconId: isDay
          ? "wmo-partly-cloudy-day"
          : "wmo-partly-cloudy-night",
        resolvedGlyphCodepoint: isDay ? "\uE003" : "\uE004",
      };
    } else {
      return {
        wmoCode: code,
        baseDescription: "Overcast / Dense Cloud Layers",
        resolvedIconId: "wmo-overcast",
        resolvedGlyphCodepoint: "\uE005",
      };
    }
  }

  // Static fallback for deterministic codes (e.g., 61 = Continuous Rain)
  return fetchStaticMapping(code);
}
```
