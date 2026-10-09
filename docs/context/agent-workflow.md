# Agent Workflow Context

Use this for repository navigation, token-saving workflow, Graphify usage, and when deciding what context to read.

## Default Flow

1. Read `AGENTS.md`.
2. For codebase questions, run a narrow `graphify query` when `graphify-out/graph.json` exists.
3. Read only the routed context file from `docs/context`.
4. Read source files only after the graph or context file identifies likely targets.
5. After code edits, run the smallest relevant verification command. For TypeScript/UI work, use `npm run typecheck`.
6. After code edits, run `graphify update .` when Graphify is installed and the graph exists.

## Graphify Commands

- Broad but scoped search: `graphify query "<question>" --graph graphify-out/graph.json`
- Focused symbol/file: `graphify explain "<symbol-or-file>" --graph graphify-out/graph.json`
- Relationship check: `graphify path "<A>" "<B>" --graph graphify-out/graph.json`
- Refresh graph after code edits: `graphify update .`

Prefer narrow questions. If output is too broad, ask about a specific symbol, screen, or helper.

## Token Budget Rules

- Prefer context docs over reading many source files.
- Prefer Graphify query/explain/path over repo-wide source reads.
- Prefer `rg` for exact text and `rg --files` for file discovery.
- Do not read generated output, caches, build artifacts, or lockfiles unless the task is specifically about them.
- Do not read large docs by default. Use the route in `AGENTS.md`.

## Shared Artifacts

Commit project-scoped assistant setup when intentionally enabling it for the repo:

- `.codex/`
- `.claude/`
- `AGENTS.md`
- `CLAUDE.md`

Graphify output is mostly local. If sharing a graph, commit only:

- `graphify-out/graph.json`
- `graphify-out/GRAPH_REPORT.md` when present
- `graphify-out/manifest.json` when useful for incremental updates

Do not commit `graphify-out/cache/`, `.graphify_root`, `.graphify_python`, or other machine-local Graphify files.
