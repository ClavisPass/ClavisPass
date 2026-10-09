# Identity Context

Use this for identity clustering, identity list/detail UI, linked entries, aliases, websites, and risk summaries.

## Core Files

- Identity list screen: `src/screens/IdentitiesScreen.tsx`
- Identity detail screen: `src/screens/IdentityDetailScreen.tsx`
- Cluster derivation: `src/features/identity/utils/deriveIdentityClusters.ts`
- Display naming: `src/features/identity/utils/identityDisplayName.ts`
- Identity logo/avatar: `src/features/identity/components/IdentityEmailLogo.tsx`

## Current Product Direction

- Identity is a privacy insight surface, not a full separate data model.
- The first useful summary is "how many identities exist".
- Detailed info belongs in Identity Detail, not in every list item.
- Use "Alias" wording for usernames in detail views.
- Linked entries should have dividers and modern row styling.
- Risk sections should use the same visual language as other identity panels.

## UI Rules

- Identity list cards use `getItemSurfaceStyle(theme)`.
- Linked entry rows in details use `getItemSurfaceStyle(theme)`.
- Avoid chips inside list entries unless they add immediate scan value.
- Mobile layouts should avoid dense multi-column metadata in rows.
- Use neutral header/title text, not primary, unless indicating action or status.

## Verification

- Identity UI changes: `npm run typecheck`.
- Cluster logic changes require checking representative vault entries and risk count behavior.
