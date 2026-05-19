// SoarTV service worker — minimal offline shell.
// Streaming itself is online-only; we cache the app shell so the UI
// keeps rendering when the network is flaky.

const CACHE_NAME = 'soartv-shell-v1'
const SHELL_URLS = [
  '/',
  '/movies',
  '/shows',
  '/library',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(SHELL_URLS).catch(() => {/* offline at install time — fine */})
    )
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return

  const url = new URL(req.url)

  // Never cache:
  // - TMDB / ElevenLabs / Firebase API calls
  // - Cross-origin iframe video sources
  // - Hot reload websockets / __next internals
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/_next/webpack-hmr') ||
    url.origin !== self.location.origin
  ) {
    return
  }

  // Network-first for HTML so users get the latest UI when online;
  // fall back to cached shell when offline.
  if (req.mode === 'navigate' || req.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone()
          caches.open(CACHE_NAME).then((c) => c.put(req, copy))
          return res
        })
        .catch(() => caches.match(req).then((cached) => cached || caches.match('/')))
    )
    return
  }

  // Cache-first for static assets (icons, fonts, JS, CSS chunks).
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached
      return fetch(req).then((res) => {
        if (res.ok && url.origin === self.location.origin) {
          const copy = res.clone()
          caches.open(CACHE_NAME).then((c) => c.put(req, copy))
        }
        return res
      })
    })
  )
})
