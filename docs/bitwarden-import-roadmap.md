# Bitwarden Import Roadmap

This note captures the planned direction for Bitwarden import support. The goal is to keep the ClavisPass vault model as the internal source of truth and map Bitwarden exports into normal ClavisPass entries/modules at import boundaries.

## Direction

- Prefer Bitwarden `.json` import first because it preserves more item types than `.csv`.
- Support `.csv` as a simpler follow-up for login and secure-note imports.
- Treat Bitwarden `.zip` with attachments as a later enhancement after the JSON mapping is stable.
- Avoid one large visible "Identity" module. Prefer focused ClavisPass modules that users can combine freely.
- Preserve unsupported or round-trip-specific Bitwarden data in hidden compatibility metadata where useful.

## Implementation Order

1. [x] Add a `PERSON` module.
   - Suggested fields:
     ```ts
     {
       id: string;
       module: "PERSON";
       firstName?: string;
       middleName?: string;
       lastName?: string;
       displayName?: string;
       username?: string;
       title?: string;
     }
     ```
   - Bitwarden identity name fields should map here.
   - Keep the module useful outside Bitwarden imports too, for personal profile entries.

2. [x] Add an `ADDRESS` module.
   - Suggested fields:
     ```ts
     {
       id: string;
       module: "ADDRESS";
       street1?: string;
       street2?: string;
       postalCode?: string;
       city?: string;
       state?: string;
       country?: string;
     }
     ```
   - Bitwarden identity address fields should map here.
   - Fast access can later offer "copy address" or single-field copy actions.

3. [x] Add a `COMPANY` module.
   - Suggested fields:
     ```ts
     {
       id: string;
       module: "COMPANY";
       name?: string;
       department?: string;
       jobTitle?: string;
     }
     ```
   - Bitwarden identity company fields should map here.
   - This should stay small and focused.

4. [x] Add a `DOCUMENT` module for identity documents.
   - Suggested fields:
     ```ts
     {
       id: string;
       module: "DOCUMENT";
       documentType?: string;
       number?: string;
       issuer?: string;
       expiryDate?: string;
     }
     ```
   - Use this for passport, license, SSN-like, and identity-number fields where a dedicated ClavisPass module is useful.
   - Sensitive document numbers should be treated as secret policy data where appropriate.

5. [x] Extend `CUSTOM_FIELD` with a date input type.
   - Current custom fields support:
     ```ts
     inputType: "text" | "secret" | "number";
     ```
   - Add:
     ```ts
     inputType: "date";
     ```
   - Reuse the existing date picker pattern from the expiry module where possible.
   - Decision: do not add a generic standalone date module for now. Dates that do not belong to expiry-specific behavior should live in custom fields.

6. [x] Add vCard export for compatible EditScreen entries.
   - Add this after the identity-related modules are implemented.
   - In the EditScreen overflow menu, show an "Export as vCard" action only when the entry contains at least one compatible module.
   - Compatible modules should include at least:
     - `PERSON`
     - `ADDRESS`
     - `COMPANY`
     - `PHONE_NUMBER`
     - `E_MAIL`
     - `URL`
     - date custom fields when they represent useful contact dates
   - Generate a `.vcf` file from the compatible modules.
   - Keep incompatible modules out of the vCard instead of forcing them into notes.
   - This is useful independently from Bitwarden, but should wait until the new identity modules exist.

7. [ ] Improve Add Module modal discovery for many modules.
   - Do this after the vCard-related identity work, because the module count will be noticeably higher.
   - Add alias-based module search so users can find modules by related terms, not only the visible module name.
   - Examples:
     - searching for "contact", "name", or "person" should find `PERSON`
     - searching for "mail" should find `E_MAIL`
     - searching for "mobile", "call", or "phone" should find `PHONE_NUMBER`
     - searching for "location", "street", or "address" should find `ADDRESS`
     - searching for "work", "job", or "company" should find `COMPANY`
     - searching for "passport", "license", or "id" should find `DOCUMENT`
   - Add more useful grouping so the modal stays scannable as modules grow.
   - Suggested groups:
     - Login & access
     - Contact & identity
     - Payment & documents
     - Security codes
     - Notes & files
     - Network & technical
     - Custom
   - Keep the existing context-based suggested modules, but make search and grouping feel fast enough when suggestions are not enough.
   - Prefer a central module catalog/registry so labels, icons, groups, aliases, compatibility hints, and add-module behavior do not drift across the app.

8. [ ] Add a separate `CREDIT_CARD` module.
   - Do not merge credit cards into `DIGITAL_CARD`.
   - `DIGITAL_CARD` should stay focused on scannable/member cards such as loyalty cards, customer cards, barcode cards, and similar use cases.
   - Suggested fields:
     ```ts
     {
       id: string;
       module: "CREDIT_CARD";
       cardholderName?: string;
       number?: string;
       brand?: string;
       expiryMonth?: string;
       expiryYear?: string;
       securityCode?: string;
       bankName?: string;
       note?: string;
     }
     ```
   - Bitwarden card items should map to `CREDIT_CARD`.
   - Treat card number and security code as secret data.
   - Fast access can later offer copy actions for card number, security code, and expiry.

9. [ ] Support multiple login URLs.
   - Bitwarden login items can contain multiple URIs and match behavior metadata.
   - Preferred ClavisPass direction:
     - either extend the existing URL module to support multiple URLs,
     - or map extra URLs to additional URL modules while preserving match metadata in hidden compatibility data.
   - Decide before final Bitwarden JSON import.

10. [ ] Add an `SSH_KEY` module.
   - Suggested fields:
     ```ts
     {
       id: string;
       module: "SSH_KEY";
       name?: string;
       publicKey?: string;
       privateKey?: string;
       fingerprint?: string;
       passphrase?: string;
     }
     ```
   - Bitwarden JSON can include SSH keys.
   - Treat private keys and passphrases as secret data.

11. [ ] Add Bitwarden compatibility metadata.
   - Suggested hidden entry metadata:
     ```ts
     externalRefs?: {
       bitwarden?: {
         id?: string;
         organizationId?: string | null;
         collectionIds?: string[];
         folderId?: string | null;
         type?: number;
         reprompt?: number;
       };
     };
     ```
   - Keep this out of visible modules.
   - Purpose: preserve IDs, folder/collection references, item type, and reprompt behavior for import notes or future export.

12. [ ] Build initial Bitwarden JSON import.
    - Map Bitwarden item types:
      - login -> title, username, password, TOTP, URL(s), notes, custom fields
      - secure note -> note module
      - card -> digital card module
      - identity -> person, address, company, phone, email, document, custom fields
      - ssh key -> SSH key module
    - Map folders to ClavisPass folders.
    - Map favorites to `fav`.
    - Map custom fields to `CUSTOM_FIELD`.
    - Report unsupported data instead of silently dropping it.

13. [ ] Add Bitwarden CSV import.
    - CSV should be treated as a simpler import format.
    - It mainly covers logins and secure notes.
    - If a user needs cards, identities, passkeys, SSH keys, or attachments, recommend JSON/ZIP.

14. [ ] Add Bitwarden ZIP import with attachments.
    - Bitwarden ZIP exports include JSON plus attachment files.
    - Map attachments to the existing `ATTACHMENT` module.
    - Keep the same practical ClavisPass attachment limits and show warnings for skipped files.

15. [ ] Decide passkey handling.
    - Bitwarden JSON can include stored passkeys.
    - Real passkey support is a larger feature because it touches browser/app integration and credential flows.
    - For the first import, either:
      - report passkeys as unsupported,
      - or preserve basic metadata in hidden compatibility metadata without pretending they are usable.

## Compatibility Notes

- Bitwarden `.json` is the best first target because it includes more item types than `.csv`.
- Bitwarden `.csv` is useful for simple imports but loses richer data.
- Attachments require ZIP export and should be implemented only after attachment limits and warnings feel stable.
- Reprompt is not the same as ClavisPass unlock security. Import it as metadata first; decide later whether ClavisPass should offer an "ask again before revealing" feature.
- Collections are organization-specific and do not map perfectly to ClavisPass folders. Preserve them as metadata first, and optionally map them to tags later if that feels useful.

## Useful References

- Bitwarden Export Vault Data: https://bitwarden.com/help/export-your-data/
- Bitwarden Custom Import Format: https://bitwarden.com/help/condition-bitwarden-import/
- Bitwarden Organization Export: https://bitwarden.com/help/export-organization-items/
