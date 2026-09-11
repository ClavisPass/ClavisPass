# ClavisPass Product Strategy Roadmap

This roadmap captures the current product direction for ClavisPass as a local-first password manager with optional networked capabilities.

## Positioning

ClavisPass should not position itself as "Bitwarden, but smaller." Bitwarden is strongest in enterprise, organizations, teams, audits, browser extension maturity, and broad ecosystem trust.

ClavisPass should instead focus on being:

```text
A local-first personal security vault for people who want control, privacy, and a polished app experience without making a cloud account the center of trust.
```

The core promise:

```text
Your vault stays yours: local, encrypted, syncable, and pleasant to use.
```

## Target Users

Primary audiences:

- Privacy-conscious prosumers who want to understand where their vault lives.
- Developers, indie hackers, and technically comfortable users who want local-first control.
- Self-employed users who need a personal security vault without enterprise overhead.
- Design-sensitive users who respect Bitwarden but find it too dry, admin-like, or cloud-account centered.
- German/EU privacy-minded users who value clear privacy language and optional local control.

Avoid targeting these users first:

- Large companies and managed teams.
- Users who primarily need family sharing and mature emergency workflows today.
- Users who choose only based on brand reputation.
- Enterprise buyers who require SSO, SCIM, directory sync, detailed policies, audits, and compliance features.

## Product Principles

- Local-first is the product identity.
- Web and SaaS features are optional capabilities, not the trust foundation.
- Secrets should not require an Arratel/ClavisPass account unless the feature fundamentally needs coordination, sharing, or hosted identity.
- Browser extension polish is a daily trust signal and should be treated as core product quality.
- Do not copy Bitwarden feature-for-feature. Build the features that fit the local-first personal vault identity.

## Strategic Product Lines

### ClavisPass Personal

The main app remains a local-first password manager and personal security vault.

Core themes:

- Local encrypted vault.
- User-chosen sync providers.
- Desktop, mobile, and browser extension workflows.
- Passwords, TOTP, recovery codes, secure notes, cards, documents, and other structured modules.
- Polished daily UX.
- Future passkey support.

### ClavisPass Web

A web app can exist, but it should be presented carefully.

Recommended framing:

```text
Optional web access for your local-first vault.
```

The web app should not become the main trust model unless the product direction intentionally changes. It can be useful for demos, fallback access, hosted convenience, or future account-based optional services.

### ClavisPass Share / Secrets

Sharing, secret links, team secrets, and API-key workflows can become a separate optional SaaS.

This keeps ClavisPass Personal clean:

- No account requirement for the local vault.
- No forced hosted backend for personal password management.
- SaaS is used only where networked identity and coordination are truly needed.

Potential SaaS capabilities:

- Encrypted secret sharing by link.
- Time-limited access.
- Team/project secrets.
- API keys and machine tokens.
- CI/CD-oriented secret delivery.
- Audit events for shared/hosted secrets.

## Priority Roadmap

### 1. Browser Extension Polish

Why it matters:

- The browser extension is the most frequent password-manager touchpoint.
- It directly affects trust, perceived quality, and store reviews.
- It makes ClavisPass feel usable against established competitors.

Focus areas:

- Autofill reliability across common login forms.
- Save/update prompt quality.
- Toolbar badge and page feedback.
- Better locked/unlocked states.
- Native messaging setup reliability.
- Chrome and Firefox parity.
- Clear privacy messaging in the extension UI and store listings.

### 2. Passkeys

Passkeys are the most important strategic feature gap.

Why it matters:

- Password managers without passkey support will feel increasingly outdated.
- Passkeys fit ClavisPass if implemented as local-first, encrypted, portable credentials.
- Developers and privacy-conscious users will expect this.

Research and design areas:

- WebAuthn credential storage.
- RP ID matching.
- Browser extension passkey mediation.
- User verification and biometrics.
- Desktop and mobile behavior.
- Sync and backup of private key material.
- Export/import and portability.
- Recovery story.

This should be planned as a major feature, not a small module addition.

### 3. Emergency Access / Trusted Contact

Emergency access is a strong emotional and practical trust feature.

Possible ClavisPass framing:

```text
Trusted Contact
```

Important design goals:

- User chooses trusted contacts.
- Access requests have a waiting period.
- Active users can deny requests before access is granted.
- Prefer client-side encryption.
- Consider granting access to a recovery package instead of the live vault.
- Make the UX calm and understandable for non-technical family members.

Open questions:

- Does this require ClavisPass accounts?
- Can trusted contacts be represented through public keys only?
- Should emergency access unlock the full vault or only a recovery bundle?
- How does revocation work?
- What happens if the user loses all devices?

### 4. Optional Web App

The web app can support:

- Convenience access.
- Demo mode.
- Account-based optional features.
- Shared secret management.
- Emergency access flows.

Guardrail:

- Do not make the web app feel like the primary vault owner unless ClavisPass intentionally moves away from local-first positioning.

### 5. Separate Secrets Sharing SaaS

This is a larger business/product step and should come after the personal product feels trustworthy.

Good fit if ClavisPass targets developers, freelancers, and small technical teams.

Potential product name directions:

- ClavisPass Share
- ClavisPass Secrets
- Arratel Secrets

This should be designed as optional and interoperable with ClavisPass Personal, not as an account wall in front of the existing vault.

## Bitwarden Gaps To Treat As Strategic

Important gaps worth watching:

- Passkeys.
- Browser extension maturity.
- Emergency access.
- Secure sharing / Send-style workflows.
- Email alias integration.
- SSH keys and optional SSH agent support for developer users.
- Health reports and breach/security coaching.

Gaps to defer intentionally:

- Enterprise organizations.
- Collections.
- SSO.
- SCIM.
- Directory sync.
- Admin policies.
- Event logs.
- Compliance-heavy features.
- Full team password management.

These enterprise features are valuable, but they do not need to define the next phase of ClavisPass.

## Near-Term Execution

Suggested next sequence:

1. Finish the current browser extension release quality pass.
2. Add a short public product/security explanation for the extension and native messaging model.
3. Research passkey architecture before implementation.
4. Draft a Trusted Contact / Emergency Access threat model and UX flow.
5. Decide whether optional account infrastructure is needed for emergency access, web access, or future sharing.
6. Keep sharing/team/secrets SaaS as a separate product track until the personal vault is stable and trusted.

## Decision Notes

- Local-first remains the main differentiator.
- Optional SaaS is acceptable when the feature naturally requires coordination.
- Avoid account requirements for core personal password management.
- Do not compete with Bitwarden on enterprise breadth first.
- Compete on control, privacy, polish, and a more personal security-vault experience.
