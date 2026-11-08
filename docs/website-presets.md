# Website presets

The editor suggests up to five local website presets after the first title character, while the title field of a new entry is focused. Suggestions match names, aliases and domains. Exact matches and name prefixes take priority. The catalog order breaks ties; it is a curated starter selection, not a measured popularity ranking.

## Catalog

Edit `src/features/vault/data/websitePresets.json` to add or update a preset:

```json
{
  "id": "amazon",
  "name": "Amazon",
  "aliases": ["amazon.com", "amazon.de"],
  "url": "https://www.amazon.de",
  "modules": ["E_MAIL", "PASSWORD", "URL"]
}
```

Use a unique stable ID, an official HTTPS URL and appropriate modules. Supported preset modules are `E_MAIL`, `USERNAME`, `PHONE_NUMBER`, `PASSWORD` and `URL`. Every preset should include `URL`. Aliases can include alternate names and regional domains. German services and some German regional domains are included deliberately; the URL shown on each suggestion makes that choice visible before selection.

These are editable starting points, not complete authentication specifications: sites may offer several identifiers, regional variants, SSO, passkeys or passwordless login. Avoid adding fields that are not relevant to the chosen default login. For example, [Amazon accepts email or a phone number](https://www.aboutamazon.de/news/amazon-prime-und-shopping/amazon-konto-erstellen); the preset chooses email. [Vercel documents email and provider-based login](https://vercel.com/docs/accounts), and [Slack documents password-free sign-in](https://slack.com/help/articles/212681477-Sign-in-to-Slack), so these presets do not add a password. Fitbit is a Google alias rather than a separate login preset, in line with [Google's account requirements](https://support.google.com/product-documentation/answer/14226283).

## Applying a preset

- Changes the title to the preset name.
- Adds only missing module types, with fresh IDs from the standard module factory.
- Leaves new credential fields empty. Does not generate a password.
- Fills a newly added URL module and any existing blank URL module with the preset URL.
- Preserves populated URLs, all existing credentials, unrelated modules, IDs and entry metadata.
- Applies the title and module changes together as one undoable editor action.
- Does not save the entry automatically.

All matching and application run locally, without lookup requests, analytics or sending the typed title anywhere. Suggestion cards load favicons with the same `buildFaviconUrl` helper and `expo-image` as URL modules; only the preset domain is used for that request. Failed icons fall back to a generic website icon.

## Verification

Run `npm run typecheck` and the `websitePresets.test.ts` / `WebsitePresetSuggestions.render.test.tsx` tests. The tests cover catalog structure and vault-schema compatibility, matching, empty credential fields, preserving existing values, duplicate prevention and suggestion selection.

On mobile, open a new blank entry, type `a`, select Amazon with the keyboard open, and verify that email/password are empty and the URL is populated. Repeat from a password template with existing credentials and with blank/populated URL modules. Undo once to restore the previous title and modules. Check that existing saved entries do not show presets and that dismissing suggestions does not prevent entering a custom title.
