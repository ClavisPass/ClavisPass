# Vault Modules Context

Use this for vault module UI, module metadata, edit screen rows, module ordering, and add/delete module behavior.

## Important Boundaries

- Do not add or change a vault module without checking `src/features/vault/utils/modulePolicy.ts`.
- Module data shape lives under `src/features/vault/model`.
- Module rendering is resolved through `src/features/vault/utils/getModule.tsx`.
- Default module instances are created by `src/features/vault/utils/getModuleData.ts`.

## Shared Module UI

- Most edit rows should flow through `EditRowControlsContainer`.
- Standard module card surface should come from `getItemSurfaceStyle(theme)` via `EditRowControlsContainer`.
- `ModuleContainer` provides title/header, icon, fast-access marker, delete handling, and row controls for most modules.
- Task rows are special but still use `EditRowControlsContainer`.
- In `ModulesList`, prediction clicks focus the new module by ID. Native keyboard scrolling reveals the focused input and its prediction together using measured bounds; avoid `scrollToEnd` or adding the full keyboard height after the viewport has already resized.
- Meta information at the bottom of EditScreen should match item surfaces.

## Reorder Flows

- Entry reorder screen: `src/screens/ReorderScreen.tsx`.
- Module reorder screen: `src/screens/ModuleReorderScreen.tsx`.
- Reorder screens should use normal `Header` and `getScreenContentStyle(theme)`, not custom gradient headers.

## Verification

- UI-only module changes: `npm run typecheck`.
- Behavior changes involving module storage, policy, or migration require reading live paths end to end before editing.
