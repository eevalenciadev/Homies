/**
 * Almacena las respuestas de las URL que serán almacenadas en caché
 * @param { string } cacheNombre
 * @param { string[] } urls
 */
const agregarCache = async (cacheNombre, urls) => {
  var cache = await caches.open(cacheNombre);
  cache.addAll(urls);
};

/**
 * Elimina la versiones anteriores del caché que ya no están siendo utilizadas.
 * @param { string[] } cacheNombres - Nombres de los registros de caché actuales
 */
const depurarCache = async (cacheNombres) => {
  const keys = await caches.keys();
  const keysAntiguos = keys.filter((key) => !cacheNombres.includes(key));
  keysAntiguos.forEach((keyAntiguo) => {
    return caches.delete(keyAntiguo);
  });
};

/**
 *
 * @param { string } cacheNombre
 * @param { RequestInfo } request
 * @param { Response } response
 */
const actualizarCache = async (cacheNombre, request, response) => {
  const cache = await caches.open(cacheNombre);
  cache.put(request, response);
  return response;
};

/**
 *
 * @param { string } cacheNombre
 * @param { RequestInfo } request
 * @param { Response } response
 */
const actualizarCacheDinamico = async (cacheNombre, request, response) => {
  if (
    request.url.includes("/js") ||
    request.url.includes("/css") ||
    request.url.includes("/img") ||
    request.url.includes("cdn") ||
    request.url.includes("https://fonts.gstatic.com/")
  ) {
    return actualizarCache(cacheNombre, request, response);
  }
  return response;
};
