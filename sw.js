/* SUME DOCBLOCK
Nombre: caché de aplicación | Tipo: Entrada
Entradas: peticiones del navegador y lista de archivos inyectada al construir.
Acciones: mantener una versión completa por ámbito, activar solo al aceptar actualización.
Salidas: aplicación disponible sin red sin almacenar recursos ajenos.
*/
const prefix = `osaka-lab:${self.registration.scope}:`;
const cacheName = prefix + "1fa66416823f8d0d";
const assets = ["assets/index-kwxzLuUq.js","assets/index-x3fkMvCd.css","icons/icon-192.png","icons/icon-512.png","icons/icon.svg","index.html","manifest.webmanifest"].map((file) => new URL(file, self.registration.scope).href);
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(assets)));
});
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((key) => key.startsWith(prefix) && key !== cacheName).map((key) => caches.delete(key)),
      );
      await self.clients.claim();
    })(),
  );
});
self.addEventListener('message', (event) => {
  if (event.data?.type === 'ACTIVATE_UPDATE') event.waitUntil(self.skipWaiting());
});
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || !url.href.startsWith(self.registration.scope)) return;
  event.respondWith(
    (async () => {
      const cache = await caches.open(cacheName);
      const cached =
        event.request.mode === 'navigate'
          ? await cache.match(new URL('index.html', self.registration.scope).href)
          : await cache.match(event.request, { ignoreSearch: true, ignoreVary: true });
      return cached || fetch(event.request);
    })(),
  );
});
