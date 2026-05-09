const CACHE_NAME = "gestao-financeira-v2"
// Apenas assets verdadeiramente estáticos (nunca mudam entre deploys)
const STATIC_ASSETS = ["/icon-192x192.png", "/icon-512x512.png"]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        )
      )
      .then(() => self.clients.claim())
  )
})

self.addEventListener("fetch", (event) => {
  // Ignorar requisições não-GET, requests para a API e esquemas não suportados
  if (
    event.request.method !== "GET" ||
    event.request.url.includes("/api/") ||
    !event.request.url.startsWith("http")
  ) {
    return
  }

  // Não interceptar requisições de navegação (HTML pages).
  // iOS Safari rejeita respostas de redirect servidas pelo SW em modo standalone.
  // Além disso, cachear HTML causa "Application error" após novos deploys
  // porque os JS chunks referenciados no HTML antigo não existem mais.
  if (event.request.mode === "navigate") {
    return
  }

  // Para assets estáticos: cache-first
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse
      }
      return fetch(event.request).then((response) => {
        // Não cachear respostas inválidas ou opacas
        if (
          !response ||
          response.status !== 200 ||
          response.type === "opaque"
        ) {
          return response
        }
        const responseToCache = response.clone()
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache)
        })
        return response
      })
    })
  )
})

self.addEventListener("push", (event) => {
  if (!event.data) return

  const data = event.data.json()
  const options = {
    body: data.body,
    icon: data.icon || "/icon-192x192.png",
    badge: "/icon-192x192.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      url: data.url || "/home",
    },
  }

  event.waitUntil(self.registration.showNotification(data.title, options))
})

self.addEventListener("notificationclick", (event) => {
  event.notification.close()
  const url = event.notification.data?.url || "/home"
  event.waitUntil(clients.openWindow(url))
})
