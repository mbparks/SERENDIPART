# SERENDIPART v1.5

SERENDIPART is a local-first Field Instrument for randomized parts discovery, supplier comparison, and cross-domain design prompts. Open `index.html` in a modern browser.

## v1.5 — Workflow consolidation

The Discover screen now separates three independent decisions:

1. **Draw type** — Mixed Parts, Mechanical, Electronics, Collision Lab, or Supplier Sweep.
2. **Quantity** — 1, 2, 4, 6, or 8 products for normal draws; 1–4 pairs in Collision Lab.
3. **Source pool** — all enabled suppliers, a supplier pack, or one compatible distributor.

Supplier Sweep draws one product from every eligible source in the selected pool. A full sweep can therefore return products from all ten enabled suppliers rather than stopping at two.

Other v1.5 changes:

- Multi-product batches with Save All and Clear Draw actions
- Multiple numbered Collision Lab pairs and independent prompts
- One-click saving for an individual collision pair or the complete batch
- Active-source chips showing which suppliers can contribute to the current draw
- Clear explanation that source weights affect frequency, not quantity
- Advanced source matrices, proxy endpoints, and category scopes moved into expandable Settings sections
- More compact responsive result grid for larger batches
- In-batch duplicate protection when enough unique catalog records are available
- Automatic migration from the original two-part default to a four-part Mixed Parts draw

## Included sources

**Core distributors:** McMaster-Carr, MISUMI, Mouser Electronics, DigiKey, Newark / element14, and TME.

**Maker Bench:** Adafruit, SparkFun, and Pololu.

**Industrial Automation:** AutomationDirect.

## Live data

Every source has a local discovery catalog. Mouser is preconfigured for the supplied Cloudflare Worker endpoint. Other live sources use the normalized proxy contract in `MULTISOURCE_PROXY_CONTRACT.md`. Distributor credentials must remain on the server; the browser stores only proxy URLs.

## Mouser Worker

The included Worker expects a Cloudflare secret named `MOUSER_API_KEY`. After deployment, `/health` should report `apiKeyConfigured: true`.

## Storage and export

The app autosaves in browser local storage. JSON export contains settings, draw quantities, history, saved parts, and notes. No distributor secrets are stored or exported.
