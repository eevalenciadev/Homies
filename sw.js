importScripts("./scripts/sw-utils.js");

const CACHE_INMUTABLE = "inmutable-v1";
const CACHE_ESTATICO = "estatico-v1";
const CACHE_DINAMICO = "dinamico-v1";

const RUTAS_INMUTABLE = [
  "https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900",
  "https://cdn.jsdelivr.net/npm/@mdi/font@latest/css/materialdesignicons.min.css",
];
const RUTAS_ESTATICO = [
  "./",
  "./icons/android-chrome-192x192.png",
  "./icons/android-chrome-512x512.png",
  "./icons/apple-touch-icon.png",
  "./icons/favicon-16x16.png",
  "./icons/favicon-32x32.png",
  "./favicon.ico",
  "./manifest.json",
  "./script.js",
  "./scripts/sw-utils.js",
];
const RUTAS_DINAMICO = [
  "/js",
  "/css",
  "/img",
  "https://cdn",
  "https://fonts.gstatic.com/",
];

self.addEventListener("install", (e) => {
  const cacheEstatico = agregarCache(CACHE_ESTATICO, RUTAS_ESTATICO);
  const cacheInmutable = agregarCache(CACHE_INMUTABLE, RUTAS_INMUTABLE);

  var respuesta = Promise.all([cacheEstatico, cacheInmutable]).then(() => {
    self.skipWaiting();
  });
  e.waitUntil(respuesta);
});

self.addEventListener("activate", (e) => {
  const respuesta = depurarCache([CACHE_ESTATICO, CACHE_INMUTABLE]);
  e.waitUntil(respuesta);
});

self.addEventListener("fetch", (e) => {
  var respuesta = caches.match(e.request).then((response) => {
    if (response) {
      return response;
    }
    return fetch(e.request).then((response) => {
      return actualizarCacheDinamico(
        CACHE_DINAMICO,
        RUTAS_DINAMICO,
        e.request,
        response
      );
    });
  });
  e.respondWith(respuesta);
});
