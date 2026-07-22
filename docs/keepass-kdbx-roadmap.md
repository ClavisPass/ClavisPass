# KeePass / KDBX Compatibility Roadmap

This note captures the agreed direction for future KeePass/KDBX work. The goal is to keep the ClavisPass vault model as the internal source of truth and map to/from KDBX only at import/export boundaries.

## Direction

- Keep ClavisPass' own vault format as the internal data model.
- Start with one-way KDBX import.
- Add export only after the ClavisPass model can preserve the most important KeePass concepts.
- Treat a future KDBX-backed provider as a later, larger feature.
- Avoid a generic visible "KeePass module" for all compatibility data. Prefer real ClavisPass features for user-visible data and hidden metadata for round-trip support.

## Implementation Order

1. [x] Add `tags?: string[]` to entries.
   - Tags should live on `ValuesType`, not as a module.
   - Reason: Tags are searchable/filterable metadata like folder, favorite, and pin state.

2. [x] Add an `ATTACHMENT` module.
   - Suggested shape:
     ```ts
     {
       id: string;
       module: "ATTACHMENT";
       files: Array<{
         id: string;
         name: string;
         mimeType?: string;
         size: number;
         dataBase64: string;
         protected?: boolean;
         importedFrom?: "kdbx";
       }>;
     }
     ```
   - Keep practical limits conservative, e.g. 10-25 MB per file at first.
   - Warn users that attachments increase vault size, memory use, and sync cost.

3. [x] Extend custom fields.
   - Existing `CUSTOM_FIELD` already maps well to KeePass custom string fields.
   - ClavisPass already has typed custom fields via:
     ```ts
     inputType: "text" | "secret" | "number";
     ```
   - KeePass protected custom strings map to `inputType: "secret"`.
   - Normal KeePass custom strings map to `inputType: "text"` or `"number"` when numeric intent is detected.
   - No extra visible `protected` or `sourceFieldName` field is planned for now; if round-trip metadata becomes necessary, keep it in hidden compatibility metadata instead of the user-facing custom field UI.

4. [x] Add KeePass compatibility metadata.
   - Suggested hidden entry metadata:
     ```ts
     externalRefs?: {
       keepass?: {
         uuid?: string;
         originalGroupPath?: string[];
         originalIconId?: string | null;
       };
     };
     ```
   - Keep this out of visible modules.
   - Purpose: preserve IDs/group/icon references for later export or better round-tripping.
   - Implemented as optional entry-level `externalRefs`, so existing ClavisPass entries and vaults remain valid without it.

5. [x] Decide how to normalize expiry and access timestamps.
   - ClavisPass already has `created`, `lastUpdated`, and an `EXPIRY` module.
   - KeePass has several time fields such as creation, modification, last access, and expiry.
   - Mapping decision:
     - KeePass creation time maps to ClavisPass `created`.
     - KeePass modification time maps to ClavisPass `lastUpdated`.
     - KeePass expiry maps to the existing ClavisPass `EXPIRY` module.
     - KeePass last access time is intentionally not imported or tracked.
   - Do not add entry-level `lastAccessed` for now; it would add usage metadata without a clear ClavisPass product benefit.
   - Do not add entry-level `expiresAt` for now; the existing `EXPIRY` module stays the single user-facing source for expiry.
   - If KDBX export requires last access values later, write a neutral/default value and mention the limitation in import/export notes.

6. [x] Build initial KDBX import.
   - Map KeePass standard fields to existing ClavisPass modules:
     - Title -> entry title
     - UserName -> `USERNAME`
     - Password -> `PASSWORD`
     - URL -> `URL`
     - Notes -> `NOTE`
   - Map groups to folders.
   - Map custom strings to `CUSTOM_FIELD`.
   - Map TOTP when recognized.
   - Map tags and attachments once the model supports them.
   - Warn or report unsupported data instead of silently dropping it.
   - Initial implementation uses `kdbxweb`, keeps parsing separate from `mapKdbxToClavisPass`, and imports entries, folders, tags, standard fields, custom fields, TOTP fields when recognized, expiry, attachments, and KeePass compatibility metadata.
   - Unsupported data such as entry history, auto-type, override URL, and custom icons is not user-visible yet and can be added to an import summary later.

7. [ ] Add KDBX export.
   - Export only after import mapping and compatibility metadata are stable.
   - Preserve KeePass UUIDs and group paths when available.
   - Be careful with custom fields, protected fields, tags, expiry, and attachments.

8. [ ] Consider additional compatibility features later.
   - Auto-Type module:
     ```ts
     {
       enabled: boolean;
       defaultSequence?: string;
       associations?: { window: string; sequence: string }[];
     }
     ```
   - Override URL / launch behavior.
   - Entry history.
   - Custom icons.
   - Read-only KDBX provider.
   - Full KDBX read/write provider.

## Compatibility Notes

- KeePass attachments can technically be large, but they are intended for a limited number of small files. ClavisPass should use stricter UX limits to keep sync and mobile performance healthy.
- Entry history should not block the first import. It can be reported as unsupported initially.
- Unknown KeePass data should be surfaced in an import summary and, where reasonable, preserved in hidden compatibility metadata.
- A local file provider for the ClavisPass vault format is a separate useful feature and should be easier than a KDBX-backed provider.

## Useful References

- KeePass Entry Dialog: https://keepass.info/help/v2/entry.html
- KDBX Format: https://keepass.info/help/kb/kdbx.html
- KDBX 4: https://keepass.info/help/kb/kdbx_4.html
- KDBX 4.1: https://keepass.info/help/kb/kdbx_4.1.html
