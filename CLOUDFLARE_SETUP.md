# Fixing Mouser Worker Errors

SERENDIPART sends live Mouser requests to:

`https://mouserparts.mike-268.workers.dev/mouser`

## Required secret

The Worker must have a secret named exactly:

`MOUSER_API_KEY`

Its value must be an approved Mouser Search API key.

### Cloudflare dashboard

1. Open **Workers & Pages**.
2. Select `mouserparts`.
3. Open **Settings → Variables and Secrets**.
4. Add a **Secret** named `MOUSER_API_KEY`.
5. Paste the Mouser Search API key as its value.
6. Save and redeploy the Worker.

Do not put the Mouser key directly into the HTML app or a plain-text Worker variable.

## Replace the Worker code

Deploy `cloudflare-worker.example.js` from this package. It adds:

- clear JSON errors instead of unexplained HTTP 500 responses
- a `/health` route
- compatibility with both SERENDIPART and native Mouser request bodies
- support for `/`, `/mouser`, and `/api/mouser`
- API v1 with a v2 fallback
- explicit handling for invalid keys and rate limits

## Health check

Open:

`https://mouserparts.mike-268.workers.dev/health`

A correctly configured Worker should return JSON containing:

```json
{
  "ok": true,
  "apiKeyConfigured": true,
  "postEndpoint": "/mouser"
}
```

If `apiKeyConfigured` is `false`, add the `MOUSER_API_KEY` secret and redeploy.
