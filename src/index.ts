import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { with24hCache, EDGE_CACHE_HEADERS_24H } from './cache.js';
import { searchJioSaavn, getJioSaavnStream, normalizeQuality } from './jiosaavn/client.js';
import type { AddonManifest } from './jiosaavn/types.js';
import { renderHomeHtml } from './ui/html.js';

const app = new Hono();

app.use(
  '*',
  cors({
    origin: '*',
    allowMethods: ['GET', 'HEAD', 'OPTIONS'],
    allowHeaders: ['*'],
    exposeHeaders: ['Content-Length', 'Content-Range', 'Cache-Control'],
    maxAge: 86400,
  })
);

app.use('/a/:token/*', async (c) => {
  const newPath = c.req.path.replace(/^\/a\/[^/]+/, '') || '/';
  const url = new URL(c.req.url);
  url.pathname = newPath;
  return app.fetch(new Request(url.toString(), c.req.raw), c.env, c.executionCtx);
});

app.get('/', (c) => {
  c.header('Content-Type', 'text/html; charset=utf-8');
  c.header('Cache-Control', 'public, max-age=3600');
  return c.html(renderHomeHtml());
});

app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    service: '320kbps-addon',
    qualities: ['320kbps (high)', '96kbps (low)'],
    cacheTtlHours: 24,
    timestamp: new Date().toISOString(),
  });
});

app.get('/manifest.json', (c) => {
  const manifest: AddonManifest = {
    id: '320kbps-addon',
    name: '320kbps Addon',
    version: '1.0.0',
    resources: ['search', 'stream'],
    settings: [
      {
        key: 'quality',
        type: 'select',
        default: 'high',
        options: [
          { label: 'High (320 kbps AAC)', value: 'high' },
          { label: 'Low (96 kbps Data Saver)', value: 'low' },
        ],
      },
    ],
  };

  for (const [key, val] of Object.entries(EDGE_CACHE_HEADERS_24H)) {
    c.header(key, val);
  }
  return c.json(manifest);
});

app.get('/manifest', (c) => c.redirect('/manifest.json', 301));

app.get('/search', async (c) => {
  const q = String(c.req.query('q') || c.req.query('s') || '').trim();
  const quality = normalizeQuality(c.req.query('quality'));

  if (!q) {
    return c.json({ tracks: [], data: { items: [] } });
  }

  const cacheKey = `search:${quality}:${q.toLowerCase()}`;
  try {
    const tracks = await with24hCache(cacheKey, () => searchJioSaavn(q, quality, 20));

    for (const [key, val] of Object.entries(EDGE_CACHE_HEADERS_24H)) {
      c.header(key, val);
    }
    return c.json({ tracks, data: { items: tracks } });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Search error';
    return c.json({ error: message, tracks: [] }, 500);
  }
});

app.get('/prewarm/:id', async (c) => {
  const trackId = c.req.param('id');
  const quality = normalizeQuality(c.req.query('quality'));

  if (!trackId) {
    return c.json({ error: 'Missing track id' }, 400);
  }

  const preloadJob = with24hCache(`stream:${quality}:${trackId}`, () =>
    getJioSaavnStream(trackId, quality)
  ).catch(() => null);

  if (c.executionCtx && typeof c.executionCtx.waitUntil === 'function') {
    c.executionCtx.waitUntil(preloadJob);
  }

  c.status(202);
  return c.json({ state: 'started', id: trackId, quality });
});

app.get('/stream/:id', async (c) => {
  const trackId = c.req.param('id');
  const quality = normalizeQuality(c.req.query('quality'));

  if (!trackId) {
    return c.json({ error: 'Missing track id' }, 400);
  }

  const cacheKey = `stream:${quality}:${trackId}`;
  try {
    const stream = await with24hCache(cacheKey, () => getJioSaavnStream(trackId, quality));

    if (!stream) {
      return c.json({ error: 'Track not found or stream unavailable' }, 404);
    }

    for (const [key, val] of Object.entries(EDGE_CACHE_HEADERS_24H)) {
      c.header(key, val);
    }

    return c.json(stream);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Stream resolution error';
    return c.json({ error: message }, 500);
  }
});

export default app;
