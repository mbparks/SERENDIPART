# SERENDIPART McMaster Carr proxy contract

SERENDIPART does not place McMaster Carr credentials, passwords, authorization tokens, or client certificates in the browser.

The official McMaster Carr Product Information API is intended for approved customers. It requires a client certificate, an authenticated login, and subscriptions to known products. A server integration must therefore maintain a permitted pool of subscribed part numbers and select from that pool.

## Request from SERENDIPART

`POST https://your-server.example/api/random-mcmaster`

```json
{
  "action": "random-product",
  "includedCategories": ["motion", "fastening", "structure"],
  "avoidIds": ["mcmaster:4936K451"]
}
```

## Expected response

```json
{
  "id": "mcmaster:4936K451",
  "title": "Compact Extreme Pressure Steel Pipe Fitting",
  "partNumber": "4936K451",
  "category": "fluid",
  "description": "Adapter, 1/2 NPT female, M20 × 1.5 mm male thread",
  "specs": {
    "Shape": "Straight",
    "For use with": "Water, air, hydraulic fluid, oil"
  },
  "price": "$3.46 each",
  "availability": "Active product",
  "productUrl": "https://www.mcmaster.com/4936K451",
  "imageUrl": "https://your-server.example/api/mcmaster/image/4936K451",
  "datasheetUrl": "https://your-server.example/api/mcmaster/datasheet/4936K451",
  "tags": ["pipe fitting", "adapter", "steel"]
}
```

## Server responsibilities

1. Store the client certificate and credentials only on the server.
2. Log in to McMaster Carr and cache the authorization token until shortly before expiration.
3. Maintain a permitted list of subscribed product numbers.
4. Select a random eligible product while respecting `avoidIds` when possible.
5. Fetch product information and price through the official API.
6. Proxy binary images or datasheets only when your integration permissions allow it.
7. Return CORS headers only for trusted SERENDIPART origins.
8. Rate limit the endpoint and avoid exposing raw upstream credentials or error details.

## Category mapping

SERENDIPART recognizes these category IDs:

- `motion`
- `fastening`
- `sensing`
- `power`
- `control`
- `fluid`
- `structure`
- `optical`
- `thermal`
- `interface`

The proxy can use its own internal taxonomy and map each returned product to the closest SERENDIPART category.
