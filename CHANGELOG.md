# Changelog

## v1.1.3

- Display the actual Mouser Worker error response instead of only `HTTP 500`.
- Add a persistent connection diagnostic in Settings.
- Send both simplified and native Mouser request shapes for proxy compatibility.
- Use the documented Mouser API v1 endpoint for direct mode.
- Add a hardened replacement Cloudflare Worker with `/health`, clearer secret validation, and route compatibility.
- Add `CLOUDFLARE_SETUP.md` with exact repair steps.


## v1.1.2

- Connected the deployed Mouser proxy at `https://mouserparts.mike-268.workers.dev/mouser`.
- Enabled live Mouser draws by default for new installations.
- Added migration for existing installations with no configured Mouser proxy.
- Added automatic conversion of a bare Worker URL to its `/mouser` API route.
- Retained automatic fallback to the offline Mouser discovery catalog.

## 1.1.1

- Made supplier part numbers prominent and directly clickable on result cards.
- Added linked part numbers to saved Shelf cards and Draw History.
- Added manufacturer part number display when it differs from the supplier part number.
- Labeled curated family entries as supplier catalog links instead of claiming a specific part number.

## 1.1.0

- Added category filtering and included category settings.
- Added recent duplicate avoidance with adjustable window.
- Added live Mouser Search API support through direct or proxy mode.
- Added approved customer McMaster Carr proxy support.
- Added automatic fallback to the local catalogs.
- Added connection testing.
- Added searchable and source filtered Shelf and History views.
- Added image, price, currency, and collision note settings.
- Added demo activity, reset controls, and keyboard draw shortcut.
- Expanded the local discovery catalogs.
- Improved responsive navigation and card presentation.

## 1.0.0

- Initial SERENDIPART release.
- Added McMaster Carr, Mouser, and Collision draw modes.
- Added product cards, supplier links, Parts Shelf, notes, Draw History, autosave, JSON import and export, and appearance controls.
