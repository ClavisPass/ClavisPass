# UI Patterns Context

Use this for visual consistency, spacing, glass/background structure, item surfaces, headers, search, and screen polish.

## Current Visual Direction

- App-level ambient/glass background lives globally.
- Header/sidebar areas are glassy/transparent.
- Page content below the header uses a real background panel.
- Standard spacing is `8px` unless a component has a clear density reason.
- Page titles and passive chrome text use `theme.colors.onSurfaceVariant`, not primary.

## Standard Screen Structure

Use these shared helpers:

- Content panel: `getScreenContentStyle(theme)` from `src/shared/ui/glass.ts`.
- Item/card/list surface: `getItemSurfaceStyle(theme)` from `src/shared/ui/glass.ts`.
- Glass chrome: `getGlassChromeStyle(darkmode)` from `src/shared/ui/glass.ts`.

Typical order:

1. `AnimatedContainer`
2. `FocusAwareStatusBar` when the screen owns statusbar behavior
3. `Header` or `SearchHeader`
4. Content container using `getScreenContentStyle(theme)`
5. List/items using `getItemSurfaceStyle(theme)`

## Headers

- Use `Header` for ordinary detail/action screens.
- Use `SearchHeader` for searchable screens.
- Home and Settings have custom headers because they handle compact search, panes, and split layouts.
- Do not add custom header gradients unless the screen is intentionally immersive, such as scanner/camera flows.
- Empty header space should remain draggable on desktop.
- Interactive header controls must not be inside drag regions.

## Content Panels

- The area under the header should use `getScreenContentStyle(theme)`.
- Avoid custom page backgrounds inside screens unless it is a truly special surface.
- Content panels should normally have `borderRadius: 8` through the shared helper.
- Do not nest page-sized cards inside page-sized cards.

## Item Surfaces

- Standard repeated items should use `getItemSurfaceStyle(theme)`.
- Light mode item surfaces are solid white.
- Dark mode item surfaces are subtle translucent surfaces.
- Borders should be relaxed; separation primarily comes from the shared soft shadow.
- Keep item overflow visible when shadows need to render. Clip only the inner ripple/content layer when needed.

Current expected users of item surfaces:

- Home list items: `ListItem`, `CardItem`, `TotpItem`
- Settings rows: `SettingsItem`
- Vault module rows: `EditRowControlsContainer` / `ModuleContainer`
- Identity cards and linked entry rows
- Analysis/device/browser extension cards where they behave as repeated rows

## Chips

- Chips use `AppChip`.
- Horizontal chip rows should scroll naturally on web/mobile; avoid extra left/right buttons unless a screen has a specific reason.
- Compact chip containers should use `8px` side padding.
- Labels should usually be neutral text, not primary, unless the chip is selected or a primary action.

## Compact Search Behavior

When adding compact search to a screen, mirror Home/Settings behavior:

- Search can open in compact header.
- Search hides again on blur/back/escape when empty.
- Search remains visible when it contains text.
- Web Escape should dismiss compact search before navigating away.

## Verification

For UI refactors, run:

- `npm run typecheck`

When changing app chrome, titlebars, compact headers, search placement, or window controls, inspect `src/shared/components/CustomTitlebar.tsx` and verify drag regions conceptually.
