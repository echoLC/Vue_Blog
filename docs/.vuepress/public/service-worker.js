workbox.setConfig({
  debug: false
})

console.log(workbox)

const ONE_DAY_SECOND = 30 * 24 * 60 * 60  // 30 Days

function getExpirationPlugin (maxEntries = 60, maxAgeSeconds = ONE_DAY_SECOND) {
  return new workbox.expiration.Plugin({
    maxEntries,
    maxAgeSeconds
  })
}

self.addEventListener('message', (e) => {
  if (e.data.action === 'skipWaiting') {
    self.skipWaiting()
  }
})

self.addEventListener('activate', () => self.clients.claim())

workbox.precaching.precacheAndRoute(self.__precacheManifest || [])

workbox.routing.registerRoute(
  /\.(?:js|css)$/,
  new workbox.strategies.CacheFirst({
    cacheName: 'css-js',
    plugins: [
      getExpirationPlugin()
    ]
  })
)

workbox.routing.registerRoute(
  /\.(?:png|gif|jpg|jpeg|svg|webp)$/,
  new workbox.strategies.CacheFirst({
    cacheName: 'images',
    plugins: [
      getExpirationPlugin()
    ]
  })
)