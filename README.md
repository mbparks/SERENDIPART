# SERENDIPART v1.4

SERENDIPART is a local-first Field Instrument for randomized parts discovery, supplier comparison, and cross-domain design prompts. Open `index.html` in a modern browser.

## v1.2 — Weighted source network

- DigiKey and MISUMI source adapters
- Mechanical, Electronics, Collision, and Any Part pools
- Per-source enable switches and draw weights
- Cross-distributor duplicate avoidance using normalized manufacturer part numbers
- Secure server-proxy contract for live distributor integrations

## v1.3 — Catalog packs

- Newark / element14 and TME distributor references
- Adafruit, SparkFun, and Pololu Maker Bench pack
- AutomationDirect Industrial Automation pack
- Source-specific category scopes in addition to global category filters
- Ten source catalogs and more than one hundred local discovery records

## v1.4 — Supplier Intelligence

- Compare the same manufacturer part across Mouser, DigiKey, Newark, and TME
- Product-card supplier reference counts
- Price, stock, lifecycle, and retrieval columns for live proxy results
- Lifecycle warnings when live data reports obsolete, NRND, discontinued, or end-of-life status
- Direct part-number links on draw cards, the Parts Shelf, Supplier Intelligence, and Draw History

## Included sources

Core: McMaster-Carr, MISUMI, Mouser Electronics, DigiKey, Newark / element14, TME.

Maker Bench: Adafruit, SparkFun, Pololu.

Industrial Automation: AutomationDirect.

## Live data

Every source works locally. Mouser is preconfigured for the supplied Cloudflare Worker endpoint. Other live sources use the normalized proxy contract in `MULTISOURCE_PROXY_CONTRACT.md`. Distributor credentials must stay on the server; the browser stores only proxy URLs.

## Mouser Worker

The included Worker expects a Cloudflare secret named `MOUSER_API_KEY`. After deployment, `/health` should report `apiKeyConfigured: true`.

## Storage and export

The app autosaves in browser local storage. JSON export contains settings, history, saved parts, and notes. No distributor secrets are stored or exported.
