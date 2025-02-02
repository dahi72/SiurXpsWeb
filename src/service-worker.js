const CACHE_NAME = "static-cache-v1"; // Versión del caché
const URLS_TO_CACHE = ["/", "/index.html"];

// Instalación del Service Worker
self.addEventListener("install", (event) => {
  console.log("[Service Worker] Instalando...");

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Caché creado:", CACHE_NAME);
      return cache.addAll(URLS_TO_CACHE);
    }).catch((error) => console.error("[Service Worker] Error al cachear:", error))
  );

  self.skipWaiting(); // Activa la nueva versión inmediatamente
});

// Activación y limpieza de caché viejo
self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activando...");

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("[Service Worker] Eliminando caché viejo:", cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );

  self.clients.claim(); // Reclama control sobre las pestañas abiertas
});

// Intercepción de peticiones para servir desde caché
self.addEventListener("fetch", (event) => {
  console.log("[Service Worker] Interceptando:", event.request.url);

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }).catch(() => console.error("[Service Worker] Error en fetch:", event.request.url))
  );
});

// Manejo de notificaciones Push
self.addEventListener("push", (event) => {
  console.log("[Service Worker] Notificación push recibida.");

  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: "/icon-192.png",
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});
