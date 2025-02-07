const CACHE_NAME = "static-cache-v1"; // Versión del caché
const URLS_TO_CACHE = ["/", "/index.html"];

// Instalación del Service Worker
this.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(URLS_TO_CACHE);
    }).catch((error) => console.error("[Service Worker] Error al cachear:", error))
  );

  this.skipWaiting(); // Activa la nueva versión inmediatamente
});

// Activación y limpieza de caché viejo
this.addEventListener("activate", (event) => {
   event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
                return caches.delete(cache);
          }
        })
      );
    })
  );

  this.clients.claim(); // Reclama control sobre las pestañas abiertas
});

// Intercepción de peticiones para servir desde caché
this.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clonedResponse = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clonedResponse));
        return response;
      })
      .catch(() => caches.match(event.request)))
});
// Manejo de notificaciones Push
this.addEventListener("push", (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: "/icon-192.png",
    };

    event.waitUntil(
      this.registration.showNotification(data.title, options)
    );
  }
});
