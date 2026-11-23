# Customer documentation

Publish only capabilities customers can use in Cedar or through their authorized integrations. For tools with mixed permissions, select customer-visible actions, parameters and response fields individually. Apply the same selection to navigation, search-visible pages, examples, assets, downloadable catalogs and schemas.

Never include customer or prospect names, real contacts, account identifiers, customer screenshots or copied account data. Write examples from scratch using role labels, generic account placeholders and reserved example domains. Name integration products only to explain their supported functionality.

Before handing off a docs change, inspect rendered pages and generated downloads for these rules. Omit material whose audience or provenance you cannot verify.

## Blocking privacy review before publication

Write each example from a blank page using the public product contract and invented inputs. A customer-derived example is prohibited even after renaming people, changing values, masking IDs, or cropping a screenshot. Never copy from support tickets, calls, exports, logs, internal requirements, or production workspaces. Build screenshots from a synthetic workspace. Integration names belong only where needed to document a supported integration.

Before opening the PR, inspect the diff, generated outputs, rendered pages and assets, including alt text, URLs, filenames, metadata and downloads. Check sample identifiers, email addresses, domains and links. Perform any search for known customer terms privately. Never put a customer-name list, rejected matches or identifying review evidence in this public repository, including issues, PRs or commit messages. Fix generated content at its source and inspect the regenerated result.

The PR author must complete the privacy review checkbox after inspecting the final revision. Anyone changing examples or customer-visible artifacts must repeat the review. If provenance is uncertain, remove or rebuild the example before merging or promoting. A clean name search alone cannot establish that an example is synthetic.
