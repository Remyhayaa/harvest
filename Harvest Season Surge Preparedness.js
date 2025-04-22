// Service worker strategy for unstable networks
workbox.routing.registerRoute(
  /\/products\/.*/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'ug-products-cache',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 50,
        maxAgeSeconds: 86400 // 24h (freshness critical for produce)
      }),
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200] // Cache even if offline
      })
    ]
  })
);