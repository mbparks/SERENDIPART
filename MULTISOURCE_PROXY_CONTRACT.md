# SERENDIPART Multi-Source Proxy Contract

SERENDIPART sends distributor credentials only to your server. The browser calls a configured proxy with a normalized JSON request.

## Request

`POST <configured endpoint>`

```json
{
  "provider": "digikey",
  "action": "random",
  "operation": "random",
  "keyword": "accelerometer",
  "category": "sensing",
  "discipline": "electronic",
  "inStock": true,
  "limit": 50,
  "offset": 0,
  "requestId": "..."
}
```

For Mouser, the request also contains the native `SearchByKeywordRequest` object for compatibility with the supplied Worker.

## Normalized response

```json
{
  "products": [
    {
      "supplierPartNumber": "123-ABC",
      "manufacturerPartNumber": "ADXL345BCCZ-RL7",
      "manufacturer": "Analog Devices",
      "title": "Three-axis digital accelerometer",
      "description": "...",
      "category": "sensing",
      "price": "$4.12",
      "availability": "1,240 in stock",
      "lifecycle": "Active",
      "productUrl": "https://...",
      "datasheetUrl": "https://...",
      "imageUrl": "https://...",
      "specs": {"Package":"LGA","Interface":"I2C / SPI"}
    }
  ]
}
```

The app also accepts `items`, `results`, `Parts`, or nested `data.products`.

## Provider notes

- DigiKey: perform OAuth 2.0 and Product Information V4 calls on the server.
- Newark / element14: keep the API key and any pricing signature logic on the server.
- TME: keep tokens and signed-request logic on the server.
- McMaster-Carr: use only approved customer API access and certificate handling on the server.
- Mouser: use `cloudflare-worker.mouser.js` and a `MOUSER_API_KEY` secret.
