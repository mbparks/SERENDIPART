# SERENDIPART

**Field Instrument release: v1.1.3**

SERENDIPART is a one click parts discovery instrument. It draws a mechanical product from McMaster Carr, an electronic component from Mouser Electronics, or one of each in Collision mode.

The instrument does not reduce discovery to shopping. Each pair becomes a design prompt that asks what the two parts could become together and what the smallest useful experiment would be.

## Open the instrument

Open `index.html` in a modern browser. No build process, package manager, web server, or external JavaScript library is required for the local catalogs.

For the most reliable browser storage behavior, serve the folder from a simple static server:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## v1.0 foundation

- One click McMaster Carr draw
- One click Mouser Electronics draw
- Collision mode with one item from each source
- Information rich product cards
- Supplier links and optional datasheet links
- Parts Shelf
- Notes for observations and possible uses
- Draw History
- Collision concept notes
- Local autosave
- JSON import and export
- Light and dark appearance
- Responsive desktop and mobile layout
- Visible release number

## v1.1.3 live Mouser configuration

- Configured `https://mouserparts.mike-268.workers.dev/mouser` as the default Mouser proxy endpoint.
- New installations prefer live Mouser results immediately.
- Existing v1.1 installations without a configured proxy are migrated to the deployed Worker automatically.
- A pasted bare Worker URL is normalized to the required `/mouser` route.
- Local Mouser samples remain available as an automatic fallback when the live request fails.

## v1.1.1 correction

- Displays the supplier part number prominently on every product card when a specific part number is available.
- Makes the displayed part number a direct link to the supplier product page.
- Shows linked part numbers in Parts Shelf and Draw History.
- Distinguishes specific part numbers from local catalog family entries.

## v1.1 additions

- Cryptographically seeded local random selection
- Category filters
- Source aware duplicate avoidance
- Adjustable recent repeat window
- In stock option for live Mouser requests
- Searchable Parts Shelf
- Searchable and filterable Draw History
- Live Mouser Search API adapter
- Direct key mode for local testing
- Recommended proxy mode for public deployment
- McMaster Carr approved customer proxy adapter
- Automatic local fallback when a live service fails
- Connection test controls
- Display controls for images and prices
- Demo activity loader
- Portable full state export
- Keyboard shortcut: Command or Control + Enter draws again

## Data modes

### Local catalogs

This is the default mode and works immediately. The McMaster Carr side contains curated product families and direct catalog links. The Mouser side contains representative electronic component families and category links.

Local entries intentionally do not claim current price or stock. Open the supplier page for current purchasing data.

### Mouser live mode

Mouser provides a Search API that can return detailed product data. SERENDIPART supports:

- Proxy endpoint mode, recommended
- Direct API key mode, useful only for private local testing

Direct mode can expose the API key to browser tools and may be blocked by browser cross origin rules. Use `cloudflare-worker.example.js` as the starting point for a protected public deployment.

After deploying the Worker:

1. Add a Worker secret named `MOUSER_API_KEY`.
2. Optionally restrict `ALLOWED_ORIGINS` in the Worker source.
3. In SERENDIPART Settings, choose **Proxy endpoint**.
4. The included build is already configured for `https://mouserparts.mike-268.workers.dev/mouser`. Replace it only when deploying a different Worker.
5. Enable **Prefer live data when configured**.
6. Press **Test Mouser connection**.

### McMaster Carr live mode

McMaster Carr now documents an official Product Information API for approved customers. The integration requires a client certificate, login credentials, authorization tokens, and subscriptions to known products. Those requirements make direct browser access inappropriate.

SERENDIPART therefore accepts a server proxy that returns one normalized random product from a server maintained pool of permitted products. See `MCMASTER_PROXY_CONTRACT.md`.

## Storage

SERENDIPART stores the following in browser `localStorage`:

- Current draw
- Saved parts
- Notes
- Collision prompts and notes
- Draw history
- Category selections
- API connection settings
- Appearance setting

The Mouser API key is stored locally only when Direct API key mode is used. Do not use direct mode on a shared computer or public website.

## Supplier data notes

- Product names, links, prices, availability, images, and specifications remain the property of their respective owners.
- SERENDIPART is not affiliated with, endorsed by, or sponsored by McMaster Carr or Mouser Electronics.
- Live data can change. Supplier pages remain the source of truth for ordering decisions.
- The built in McMaster Carr catalog is a discovery index of product families, not a copy of the supplier catalog.

## Files

- `index.html` — complete single file Field Instrument
- `cloudflare-worker.example.js` — protected Mouser proxy example
- `MCMASTER_PROXY_CONTRACT.md` — normalized contract for approved McMaster Carr integrations
- `CHANGELOG.md` — release history
- `LICENSE` — MIT license for the SERENDIPART application code

## Suggested next release

A strong v1.2 would add richer Collision Lab worksheets, editable challenge decks, saved category weights, a “surprise me” rarity control, shareable discovery cards, and handoff exports for Makefile or Reliquary.


## Mouser Worker troubleshooting

Version 1.1.3 surfaces the Worker response instead of reducing every problem to a generic HTTP status. The included replacement Worker supports a `/health` endpoint and requires a Cloudflare secret named `MOUSER_API_KEY`. See `CLOUDFLARE_SETUP.md`.
