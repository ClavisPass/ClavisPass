# Store Release Roadmap

This note captures the planned store/distribution path for ClavisPass across desktop, mobile, and browser extension channels.

## Goals

- Reduce trust friction during install, especially "unknown publisher" warnings.
- Move stable builds into trusted store channels where practical.
- Keep direct downloads available where useful, but avoid confusing users with multiple update systems.
- Treat store-specific release behavior as part of the product, not only packaging.

## Publisher Naming

- [ ] Decide on the long-term publisher / umbrella brand before creating store accounts where possible.
- Current top candidate: `Arratel`.
  - Inspired by `arrátel`, a historical Portuguese unit of mass.
  - Strong because it feels like an existing, serious word while staying uncommon in software/company search results.
  - Easy to pronounce as `Ar-ra-tel` / `Ah-ra-tell`.
  - Works well as a standalone umbrella brand without forcing suffixes such as `Software`, `Labs`, or `Studio`.
  - Preferred domain style: `arratel.*`, not `arratel-software.*`.
- Strong alternative: `Rivamado`.
  - Built from parts of `Ricardo Valente de Matos`.
  - Personal without exposing the full legal name as the brand.
  - Easy to pronounce as `Ri-va-ma-do`.
  - Early Google check looked promising: no directly known term, brand, or company with the exact name `rivamado`.
- Candidate display names to compare:
  - `Arratel`
  - `Rivamado`
  - `Valdemat`
  - `Valenx`
- Before using it officially, verify exact availability for domains, GitHub organization, Microsoft Store publisher, Google Play developer name, Apple developer identity, Chrome Web Store publisher, DPMA, EUIPO, and WIPO.

## Arratel Setup Plan

1. [ ] Secure the Arratel foundation.
   - Buy exactly one Arratel domain first, preferably `arratel.app` if pricing stays acceptable.
   - Set up one low-cost business email such as `hello@arratel.app`.
   - Avoid paid hosting for now; use static hosting through GitHub Pages, Cloudflare Pages, Netlify, or a similar free static host.
   - Avoid buying many defensive domains until Arratel or the products generate revenue.

2. [ ] Create a separate private Arratel homepage repository.
   - Suggested repository name: `arratel-homepage`.
   - Use the existing SaaS/homepage template as the base.
   - Start with a small static site:
     - `/`
     - `/products`
     - `/clavispass`
     - `/privacy`
     - `/imprint`
     - `/contact`
   - Point `arratel.app` to this site through DNS.

3. [ ] Add a reusable release manager configuration.
   - Use a YAML-based product config so future apps/SaaS projects can be added quickly.
   - First product entry should be `clavispass`.
   - Track product domains, store targets, privacy policy URLs, support email, download links, and release channels in the config.
   - Keep this generic enough to reuse for later products such as Splice or other SaaS ideas.

4. [ ] Build the first ClavisPass product page under Arratel.
   - Initial path: `arratel.app/clavispass`.
   - Include downloads, store links, security notes, privacy policy, changelog, support contact, and import/export capabilities.
   - Present ClavisPass as `ClavisPass by Arratel`.

5. [ ] Decide whether ClavisPass needs its own product domain.
   - If the Arratel page is enough, keep using `arratel.app/clavispass` to reduce fixed yearly costs.
   - If ClavisPass needs stronger standalone branding, buy one product domain such as `clavispass.app`.
   - Avoid buying multiple ClavisPass domains until the app has active users or revenue.

6. [ ] Defer GitHub organization renaming until the release infrastructure is ready.
   - Current Tauri updater URLs point to `github.com/ClavisPass/ClavisPass`.
   - Before renaming the GitHub organization to Arratel, audit updater URLs, release scripts, docs, extension references, native messaging paths, website links, and badges.
   - Do not rely on GitHub redirects for security-sensitive updater flows.

7. [ ] Register store/developer accounts after the public Arratel presence exists.
   - If a legal business identity exists by then, prefer company accounts where possible.
   - If no business identity exists yet, use individual accounts and keep Arratel as the public umbrella brand on the website.
   - Revisit company accounts once a Gewerbe/business identity, domain email, and verification documents are available.

## Suggested Order

1. [ ] Microsoft Store for Windows.
   - Most useful first desktop store because it can remove the unknown-publisher install friction.
   - Prefer MSIX if Tauri can produce a clean package for ClavisPass.
   - Microsoft Store MSIX submissions are re-signed by Microsoft after certification, so no separate CA-trusted signing certificate should be needed for Store-distributed MSIX.
   - EXE/MSI Store submission is possible, but Microsoft does not re-sign the installer. A CA-trusted Authenticode certificate would still be required for the installer and relevant binaries.
   - Store-managed updates and the existing Tauri updater need a clear strategy. Store builds should probably not update outside the Store.
   - Cost note: Microsoft currently documents free developer account creation for individual and company accounts.

2. [ ] Google Play Store for Android.
   - Makes sense next because the Android app already works well.
   - Google Play Console developer account cost: US$25 one-time registration fee.
   - Requires a Google account, Play Developer Distribution Agreement, payment method, developer account type, and identity/contact verification.
   - Personal accounts may have additional testing requirements before production distribution.
   - Organization accounts may require more public contact/company information.
   - Need to verify current Android package name, signing setup, Play App Signing, privacy/data safety answers, screenshots, app icon, feature graphic, store description, and age/content rating.

3. [ ] Decide between Chrome Web Store and Apple Developer Program as the next investment.
   - Chrome Web Store is attractive because the ClavisPass browser extension is already part of the ecosystem.
   - Chrome Web Store requires developer registration and a one-time registration fee before publishing.
   - Cost note: Google documentation confirms a one-time fee, but verify the exact current amount in the Chrome Web Store developer dashboard at signup.
   - Needs extension listing assets, privacy disclosure, permissions review, and a clear native-messaging setup flow.

4. [ ] Apple Developer Program for macOS/iOS.
   - Important if the macOS app should no longer require manual allowlisting/quarantine workarounds.
   - Also needed to continue iOS development seriously and eventually release the iOS app in the App Store.
   - Apple Developer Program cost: US$99 annual membership.
   - Enables TestFlight, App Store distribution, Apple platform capabilities, and normal signing/notarization workflows.
   - macOS release needs proper signing and notarization planning even before App Store distribution.

## Store-Specific Notes

### Microsoft Store

- Preferred package: MSIX, if compatible with the current Tauri build.
- Main benefit: trusted Windows install experience.
- Avoid mixing Store updates with the GitHub/Tauri updater unless there is a clean channel distinction.

### Google Play

- Preferred next store after Microsoft Store.
- Cost: US$25 one-time registration fee.
- Prepare:
  - Production app signing key / Play App Signing decision.
  - App bundle build path.
  - Privacy policy URL.
  - Data safety form.
  - Screenshots and store listing text.
  - Internal testing track before production.

### Chrome Web Store

- Useful for extension trust and discoverability.
- Cost: one-time developer registration fee; exact amount should be verified during dashboard registration.
- Prepare:
  - Extension privacy disclosures.
  - Permission justifications.
  - Screenshots and promotional assets.
  - Native messaging setup docs from the app.

### Apple Developer Program

- Cost: US$99/year.
- Prepare:
  - Apple developer account enrollment.
  - Signing certificates/profiles.
  - macOS notarization pipeline.
  - iOS bundle identifiers and capabilities.
  - TestFlight path for iOS testing.

## References

- Microsoft Store code signing options: https://learn.microsoft.com/en-us/windows/apps/package-and-deploy/code-signing-options
- Microsoft Store get started: https://learn.microsoft.com/en-us/windows/apps/publish/get-started
- Google Play Console get started: https://support.google.com/googleplay/android-developer/answer/6112435
- Google Play required account information: https://support.google.com/googleplay/android-developer/answer/13628312
- Chrome Web Store developer registration: https://developer.chrome.com/docs/webstore/register/
- Apple Developer Program: https://developer.apple.com/programs/
