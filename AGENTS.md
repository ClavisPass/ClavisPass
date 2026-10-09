# ClavisPass Agent Context

ClavisPass is a privacy-focused password manager with a React Native + Expo UI and a Tauri desktop shell.

Keep this file small. Do not read large docs by default. Pick only the context file that matches the task.

## Always Know

- Vault data is encrypted locally before sync.
- Sync providers are `device`, `dropbox`, `googleDrive`, and `clavispassHub`.
- Desktop runs the Expo web bundle inside Tauri, so desktop-only JS often appears behind `Platform.OS === "web"`.
- User-facing text belongs in the typed i18n contract: `src/shared/i18n/TranslationSchema.ts`, plus both `src/shared/i18n/languages/de.ts` and `src/shared/i18n/languages/en.ts`.

## Context Routing

- Agent workflow, token-saving, Graphify usage, shared assistant artifacts: read [docs/context/agent-workflow.md](/e:/Projects/ClavisPass/docs/context/agent-workflow.md).
- Security, auth, vault state, module metadata/secrets: read [docs/context/security.md](/e:/Projects/ClavisPass/docs/context/security.md).
- Vault crypto formats, V1/V2 envelope behavior, KDF/AEAD rules: read [docs/context/crypto.md](/e:/Projects/ClavisPass/docs/context/crypto.md).
- UI work, React Native/Web/Tauri layout, menus, dropdowns, titlebar drag regions, i18n: read [docs/context/ui.md](/e:/Projects/ClavisPass/docs/context/ui.md).
- Visual polish, glass/content backgrounds, chips, item surfaces, compact search: read [docs/context/ui-patterns.md](/e:/Projects/ClavisPass/docs/context/ui-patterns.md).
- Screen alignment/refactors and removing custom screen backgrounds: read [docs/context/screen-standardization.md](/e:/Projects/ClavisPass/docs/context/screen-standardization.md).
- Vault module UI, edit rows, module reorder, module metadata: read [docs/context/vault-modules.md](/e:/Projects/ClavisPass/docs/context/vault-modules.md).
- Identity clustering, identity list/detail UI, linked entries, aliases, risks: read [docs/context/identity.md](/e:/Projects/ClavisPass/docs/context/identity.md).
- Sync, cloud providers, tokens, storage settings, secure store: read [docs/context/sync-storage.md](/e:/Projects/ClavisPass/docs/context/sync-storage.md).
- Tauri host, tray, desktop windows, fast access popup, native commands: read [docs/context/desktop.md](/e:/Projects/ClavisPass/docs/context/desktop.md).
- Build, release, updates, store/package surface: read [docs/context/build-release.md](/e:/Projects/ClavisPass/docs/context/build-release.md).

## High-Risk Rules

- Do not put secrets, especially the master password, into React state.
- Do not bypass `VaultSession` / `VaultProvider` boundaries casually.
- Do not add or change a vault module without checking `src/features/vault/utils/modulePolicy.ts`.
- Do not change crypto, KDF, AEAD, envelope, or provider parity without reading the live code path end to end.
- When changing app chrome, titlebars, compact headers, search placement, or window controls, verify draggable regions in `src/shared/components/CustomTitlebar.tsx`.

## Fast Map

- `src/app`: app shell, providers, navigation.
- `src/screens`: screen-level containers.
- `src/features`: feature-specific UI, models, utilities.
- `src/infrastructure`: storage, crypto, cloud clients, logging, platform helpers.
- `src/shared`: reusable UI, hooks, i18n, theme.
- `src-tauri`: Rust/Tauri host and native desktop commands.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
- For this repository, use `graphify update .` after code edits. The update command re-extracts code files and does not need an LLM key.
