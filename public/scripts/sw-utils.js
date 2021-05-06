/**
 * Almacena las respuestas de las rutas que serán almacenadas en caché
 * @param { string } cacheNombre
 * @param { string[] } rutas
 */
const agregarCache = async (cacheNombre, rutas) => {
  var cache = await caches.open(cacheNombre);
  cache.addAll(rutas);
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
 * @param { string[] } rutas
 * @param { RequestInfo } request
 * @param { Response } response
 */
const actualizarCacheDinamico = async (
  cacheNombre,
  rutas,
  request,
  response
) => {
  var ruta = rutas.find((ruta) => request.url.includes(ruta));
  if (ruta) {
    return actualizarCache(cacheNombre, request, response);
  }
  return response;
};
