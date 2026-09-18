# Identity Management Concept

This document captures the product idea of evolving ClavisPass from a classic password manager into a privacy-focused identity manager.

## Core Idea

ClavisPass should not only manage vault entries. It should help users understand the digital identities that emerge from their saved data.

Instead of asking users to manually create and maintain identity profiles, identities should develop naturally from the vault over time.

The user can name, correct, merge, or separate identities, but the identity graph itself should come from context.

## Product Shift

Classic password manager:

- "Here are your passwords and secure items."
- Main mental model: entries, folders, favorites, modules.

Identity-oriented ClavisPass:

- "Here are your digital identities and where they exist."
- Main mental model: identity clusters, exposure, overlap, separation, context.

The goal is not to replace vault entries, but to reveal the structure behind them.

## What Is An Identity?

An identity is an automatically inferred cluster of related vault entries and data points.

Possible signals:

- Same email address.
- Same username.
- Same phone number.
- Same recovery email.
- Same address.
- Same payment card or payment context.
- Same organization or work context.
- Same domain family.
- Same social/profile handle.
- Repeated custom fields.
- Manual user corrections.

Example identities:

- Private identity based on a personal email.
- Work identity based on a company email.
- Shopping identity based on an alias email.
- Gaming identity based on shared usernames across services.
- Public creator identity based on social/profile handles.

## Important Principle

Identities should feel discovered, not configured.

The app should not start with a setup wizard asking users to create identities manually. A better first experience:

> "We found 4 digital identities in your vault."

The user can then rename them:

- `ricardo@gmail.com` -> `Private`
- `name@company.com` -> `Work`
- `shop-alias@example.com` -> `Shopping`

The system remains data-driven underneath.

## Confidence And Trust

The app should avoid pretending it knows everything with certainty.

Suggested language:

- "Likely the same identity"
- "Possibly connected"
- "Kept separate"
- "Manually separated"
- "Manually merged"

This keeps the feature trustworthy and makes room for user correction.

## Identity Tab

A future main tab could be `Identities`.

To make room for this tab, the current password analysis tab should move into the home experience. The analysis should become available from Home, likely through tools/actions, instead of occupying a primary navigation tab.

This keeps analysis as an important feature while freeing the main navigation for the broader identity concept.

The page should answer:

- Which digital identities exist in my vault?
- Which identity is most exposed?
- Where do my private and work contexts overlap?
- Which email, phone number, or username appears in many accounts?
- What would be affected if this email or phone number were compromised?

Example identity card:

```text
Private
ricardo@gmail.com
42 accounts · 8 risks · 5 reused data points
```

Example insights:

```text
Your private email is used by 42 accounts.
9 of those accounts also store your phone number.
3 finance-related accounts share the same recovery email.
2 work-related accounts appear to use private identity data.
```

## Identity Detail View

An identity detail screen could show:

- Primary identifiers, such as email, username, phone, or handle.
- Linked vault entries.
- Common domains and service categories.
- Reused data points.
- Related security risks.
- Accounts with missing or weak separation.
- Manual corrections, such as rename, merge, separate, or ignore.

Useful questions the detail view should answer:

- Where do I use this email?
- Which accounts know this phone number?
- Which accounts belong to this identity?
- Which accounts might not belong here?
- What should I rotate if this identifier is compromised?

## Data Model Direction

Avoid storing a hard `identityId` on every vault entry as the primary model.

Prefer derived identities:

- `IdentitySignal`: extracted data point from an entry.
- `IdentityCluster`: inferred group of related entries/signals.
- `IdentityOverride`: user correction that influences clustering.
- `IdentityInsight`: derived observation or warning.

User decisions should guide the algorithm without turning the feature into manual folder management.

Example override types:

- Rename identity.
- Merge two identities.
- Keep two identities separate.
- Ignore a signal.
- Pin a primary identifier.

## MVP

A useful first version can be small:

1. Extract email and username signals from vault entries.
2. Cluster entries by exact email match.
3. Create automatic identity names from the strongest signal.
4. Let users set a display name for a cluster.
5. Show linked entries for each identity.
6. Show simple insights:
   - This email is used by X accounts.
   - These domains share this identity.
   - This identity has X accounts with security issues.

This is enough to make the feature feel different from folders and favorites.

## Later Ideas

- Cluster by phone number, address, payment data, recovery email, and custom fields.
- Detect overlap between work and private identities.
- Suggest aliases for new accounts.
- Show exposure score per identity.
- Show "blast radius" for a compromised email or phone number.
- Add privacy separation recommendations.
- Integrate password analysis as identity-level health instead of only vault-level health.
- Allow local-only identity insights without external processing.

## Privacy Positioning

This feature fits ClavisPass especially well because identity analysis can happen locally.

Possible product framing:

> ClavisPass helps you understand your digital identities without sending them anywhere.

The feature should avoid cloud profiling and should not require external enrichment to be useful.

## Design Tone

The feature should feel calm and useful, not alarmist.

Good language:

- "This identity is widely used."
- "These accounts share personal contact data."
- "This looks like a work/private overlap."
- "If this email is compromised, these accounts may be affected."

Avoid making the user feel punished for having messy data. The product should give them clarity and control.
