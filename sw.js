importScripts("./scripts/sw-utils.js");

const CACHE_ESTATICO = "estatico-v1";
const CACHE_DINAMICO = "dinamico-v1";
const CACHE_INMUTABLE = "inmutable-v1";

const URLS_ESTATICO = [
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
const URLS_DINAMICO = [
  "https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900",
  "https://cdn.jsdelivr.net/npm/@mdi/font@latest/css/materialdesignicons.min.css",
];

self.addEventListener("install", (e) => {
  const cacheEstatico = agregarCache(CACHE_ESTATICO, URLS_ESTATICO);
  const cacheInmutable = agregarCache(CACHE_INMUTABLE, URLS_DINAMICO);

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
  var respuesta = caches.match(e.request).then((res) => {
    if (res) {
      return res;
    }
    return fetch(e.request).then((res) => {
      return actualizarCacheDinamico(CACHE_DINAMICO, e.request, res);
    });
  });
  e.respondWith(respuesta);
});
