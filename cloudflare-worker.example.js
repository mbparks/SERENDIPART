/**
 * SERENDIPART Mouser proxy for Cloudflare Workers — v1.1.3
 *
 * Required Cloudflare secret:
 *   MOUSER_API_KEY = an approved Mouser Search API key
 *
 * Accepted routes:
 *   GET  /             health summary
 *   GET  /health       health summary
 *   POST /mouser       Mouser keyword search
 *   POST /             Mouser keyword search (compatibility)
 *   POST /api/mouser   Mouser keyword search (compatibility)
 */

const ALLOWED_ORIGINS = [
  // 'https://mbparks.com',
  // 'http://localhost:8000',
];

function corsHeaders(request) {
  const origin = request.headers.get('Origin') || '*';
  const allowed = ALLOWED_ORIGINS.length === 0 || ALLOWED_ORIGINS.includes(origin);
  return {
    'Access-Control-Allow-Origin': allowed ? origin : (ALLOWED_ORIGINS[0] || 'null'),
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}

function json(data, status, request) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders(request),
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

function apiKeyFromEnv(env) {
  // MOUSER_API_KEY is canonical. The aliases make migration from older
  // deployments less fragile without exposing the key to the browser.
  return env.MOUSER_API_KEY || env.MOUSER_KEY || env.API_KEY || '';
}

function errorText(payload, fallback = '') {
  if (!payload) return fallback;
  if (typeof payload === 'string') return payload;
  const direct = payload.error || payload.message || payload.Message || payload.ErrorMessage;
  if (direct) return typeof direct === 'string' ? direct : JSON.stringify(direct);
  const errors = payload.Errors || payload.errors;
  if (Array.isArray(errors) && errors.length) {
    return errors.map((item) => typeof item === 'string' ? item : (item.Message || item.message || JSON.stringify(item))).join('; ');
  }
  return fallback;
}

async function parseBody(request) {
  try {
    return await request.json();
  } catch {
    throw new Response(JSON.stringify({ error: 'Expected a JSON request body' }), {
      status: 400,
      headers: { ...corsHeaders(request), 'Content-Type': 'application/json; charset=utf-8' },
    });
  }
}

export default {
  async fetch(request, env) {
    try {
      if (request.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: corsHeaders(request) });
      }

      const url = new URL(request.url);
      const apiKey = apiKeyFromEnv(env);

      if (request.method === 'GET' && (url.pathname === '/' || url.pathname === '/health')) {
        return json({
          ok: true,
          service: 'SERENDIPART Mouser proxy',
          version: '1.1.3',
          apiKeyConfigured: Boolean(apiKey),
          postEndpoint: '/mouser',
        }, 200, request);
      }

      const validPath = ['/', '/mouser', '/api/mouser'].includes(url.pathname);
      if (request.method !== 'POST' || !validPath) {
        return json({ error: 'Not found', postEndpoint: '/mouser' }, 404, request);
      }

      if (!apiKey) {
        return json({
          error: 'MOUSER_API_KEY is not configured',
          action: 'Add a Cloudflare Worker secret named MOUSER_API_KEY containing your approved Mouser Search API key, then redeploy.',
        }, 503, request);
      }

      const input = await parseBody(request);
      const native = input.SearchByKeywordRequest || input.searchByKeywordRequest || {};
      const keyword = String(input.keyword || native.keyword || '').trim().slice(0, 120);
      const records = Math.min(50, Math.max(1, Number(input.records ?? native.records) || 50));
      const startingRecord = Math.max(0, Number(input.startingRecord ?? native.startingRecord) || 0);
      const inStock = input.inStock !== undefined
        ? Boolean(input.inStock)
        : String(native.searchOptions || '').toLowerCase().includes('instock');

      if (!keyword) {
        return json({ error: 'keyword is required' }, 400, request);
      }

      const body = {
        SearchByKeywordRequest: {
          keyword,
          records,
          startingRecord,
          searchOptions: inStock ? 'InStock' : '',
          searchWithYourSignUpLanguage: native.searchWithYourSignUpLanguage || 'English',
        },
      };

      // v1 is the documented stable endpoint. v2 remains as a fallback for
      // accounts or deployments already using it.
      const configuredVersion = String(env.MOUSER_API_VERSION || '1').replace(/[^0-9]/g, '') || '1';
      const versions = [...new Set([configuredVersion, '1', '2'])];
      let lastStatus = 502;
      let lastPayload = { error: 'Mouser request failed' };

      for (const version of versions) {
        const endpoint = `https://api.mouser.com/api/v${version}/search/keyword?apiKey=${encodeURIComponent(apiKey)}`;
        try {
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(body),
          });

          const text = await response.text();
          let payload;
          try { payload = text ? JSON.parse(text) : {}; }
          catch { payload = { error: text || `Mouser returned HTTP ${response.status}` }; }

          if (response.ok) {
            return json(payload, 200, request);
          }

          lastStatus = response.status;
          lastPayload = payload;

          // Credentials and throttling will not be repaired by trying another API version.
          if ([401, 403, 429].includes(response.status)) break;
        } catch (error) {
          lastStatus = 502;
          lastPayload = { error: error instanceof Error ? error.message : 'Mouser network error' };
        }
      }

      return json({
        error: errorText(lastPayload, `Mouser returned HTTP ${lastStatus}`),
        upstreamStatus: lastStatus,
        upstream: lastPayload,
      }, lastStatus >= 500 ? 502 : lastStatus, request);
    } catch (error) {
      if (error instanceof Response) return error;
      return json({
        error: error instanceof Error ? error.message : 'Unexpected Worker error',
      }, 500, request);
    }
  },
};
