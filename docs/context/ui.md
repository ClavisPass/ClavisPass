# UI Context

Use this for screens, components, layout, menus, dropdowns, titlebars, mobile/web differences, i18n, and visual polish.

## Platform Model

- Mobile runs Expo / React Native.
- Desktop runs the Expo web bundle inside Tauri.
- Desktop-only UI code often uses `Platform.OS === "web"` plus Tauri detection.

## Important Files

- `App.tsx`
- `src/screens/*`
- `src/shared/components/*`
- `src/shared/components/CustomTitlebar.tsx`
- `src/shared/components/menus/*`
- `src/shared/components/dropdowns/*`
- `src/shared/ui/globalStyles.ts`
- `src/shared/i18n/TranslationSchema.ts`
- `src/shared/i18n/languages/de.ts`
- `src/shared/i18n/languages/en.ts`

## Titlebar And Chrome

When changing headers, compact headers, search placement, titlebars, window controls, or app chrome:

- Verify `CustomTitlebar.tsx`.
- Interactive controls must stay outside drag overlays.
- Empty header space should remain draggable on desktop.

## Menus And Dropdowns

Preferred adaptive pattern:

- Mobile/native: bottom sheet.
- Web/Tauri: dropdown/popover rendered into the global dropdown layer where possible.

Current shared pieces:

- `src/shared/components/dropdowns/AdaptiveDropdown.tsx`
- `src/shared/components/dropdowns/DropdownTextInputTrigger.tsx`
- `src/shared/components/menus/AdaptiveMenu.tsx`
- `src/shared/components/menus/container/MenuContainerWeb.tsx`
- `src/shared/components/web/DropdownLayer.web.tsx`

For trigger-based web menus, prefer measuring the trigger rectangle and passing an anchor rect rather than relying only on raw `x/y`.

## i18n

When adding or changing user-facing text:

1. Update `TranslationSchema.ts`.
2. Add English in `languages/en.ts`.
3. Add German in `languages/de.ts`.

Use real translation keys. Avoid local hardcoded fallbacks except as a temporary bridge.

## Interaction Polish

- Prefer existing shared components and styles.
- For icon-only controls that are not obvious, consider `AppTooltip` or `TooltipIconButton`.
- Be careful with overlays inside clipped containers; use portals/layers when a popup must escape a card or list.
