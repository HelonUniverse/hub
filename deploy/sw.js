const V='dlr-v1';const CORE=['./','index.html','logo.webp','manifest.json'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET')return;
if(u.pathname.startsWith('/api/'))return;
if(u.hostname==='cdn.jsdelivr.net'||u.hostname==='fonts.gstatic.com'||u.hostname==='fonts.googleapis.com'){e.respondWith(caches.open(V).then(async c=>{const h=await c.match(e.request);if(h)return h;const r=await fetch(e.request);if(r.ok)c.put(e.request,r.clone());return r}));return}
if(u.origin===location.origin){e.respondWith(fetch(e.request).then(r=>{if(r.ok)caches.open(V).then(c=>c.put(e.request,r.clone()));return r}).catch(()=>caches.match(e.request)))}});
