# Screen Standardization Context

Use this when a screen should be "angeglichen", when custom backgrounds need to be removed, or when a screen should follow the shared layout.

## Standard Checklist

- Header uses `Header`, `SearchHeader`, or a justified custom header.
- Header has no custom gradient by default.
- Header title color is neutral (`onSurfaceVariant`) through the shared header.
- Content below header uses `getScreenContentStyle(theme)`.
- Repeated rows/cards use `getItemSurfaceStyle(theme)`.
- Spacing is `8px` between header tools, chips, lists, and panel edges.
- Desktop drag regions still work.
- Compact mode uses the same side padding rules as Home/Settings where relevant.
- Run `npm run typecheck`.

## Known Custom Screens

- `HomeScreen`: custom because it owns sidebar/folder filter/tool chips/search/fades.
- `SettingsScreen`: custom because it owns split navigation, compact search, and resizable divider.
- `EditScreen`: custom because it owns title editing, tool chips, undo/folder controls, list fades, and module list.
- Scanner screens may keep camera-specific overlays.

## Common Refactor Targets

- Remove screen-local `LinearGradient` headers unless intentionally immersive.
- Replace page-local backgrounds with `getScreenContentStyle(theme)`.
- Replace item-local background/shadow styles with `getItemSurfaceStyle(theme)`.
- Move tool chip rows into the content panel when they belong visually to the screen content.
- Avoid changing crypto, vault state, or sync behavior during visual standardization.

## Files To Check First

- `src/shared/ui/glass.ts`
- `src/shared/components/Header.tsx`
- `src/shared/components/SearchHeader.tsx`
- `src/shared/components/CustomTitlebar.tsx`
- `src/screens/HomeScreen.tsx`
- `src/screens/SettingsScreen.tsx`
- `src/screens/EditScreen.tsx`
