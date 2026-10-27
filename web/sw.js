// Prima la rete, senza cache intermedie (così gli aggiornamenti arrivano subito);
// se non c'è connessione usa l'ultima copia salvata.
const CACHE = "calendario-lavoro-v2";
self.addEventListener("install", e => { self.skipWaiting(); });
self.addEventListener("activate", e => e.waitUntil((async () => {
  for (const k of await caches.keys()) if (k !== CACHE) await caches.delete(k);
  await self.clients.claim();
})()));
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const same = new URL(e.request.url).origin === location.origin;
  e.respondWith(fetch(e.request, same ? { cache: "no-store" } : {}).then(r => {
    if (r.ok || r.type === "opaque") { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
    return r;
  }).catch(() => caches.match(e.request).then(m => m || caches.match("./index.html") || caches.match("./"))));
});
