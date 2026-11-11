# 320kbps Addon

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/ajisth69/320kbps-addon)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fajisth69%2F320kbps-addon)

Streaming addon providing 320kbps and 96kbps audio streams with 24-hour edge caching. Built on [Hono](https://hono.dev), deployable directly to Cloudflare Workers or Vercel.

## Features

- 320 kbps (`high`) and 96 kbps (`low`) AAC streams
- 24-hour edge and memory cache
- Pure TypeScript DES decipher without external crypto dependencies
- Zero auth, direct public endpoint
- Next.js / Vercel style dark console with 1-click deploy and documentation

## Deploy

### 1-Click Deploy to Cloudflare Workers

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/ajisth69/320kbps-addon)

Or via CLI:
```bash
git clone https://github.com/ajisth69/320kbps-addon.git
cd 320kbps-addon
npm install
npm run deploy
```

### 1-Click Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fajisth69%2F320kbps-addon)

Or via CLI:
```bash
npx vercel --prod
```

## Local Development

```bash
npm install
npm run dev
```

Server runs on `http://localhost:8787`.

## Endpoints

| Method | Route | Description |
|---|---|---|
| `GET` | `/` | Web UI & documentation |
| `GET` | `/manifest.json` | Addon discovery manifest |
| `GET` | `/search?q={query}&quality={high\|low}` | Search tracks (24h cache) |
| `GET` | `/stream/{id}?quality={high\|low}` | Direct CDN audio stream (24h cache) |
| `GET` | `/prewarm/{id}?quality={high\|low}` | Preload audio into cache |
| `GET` | `/health` | Health status |
