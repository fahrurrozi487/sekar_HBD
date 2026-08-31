// Simple SW for Happy Birthday Sekar — cache-first for assets
const CACHE = "sekar-bday-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./assets/og-image.jpg",
  "./assets/favicon.svg",
  "./assets/music.mp3",
  "./assets/music.ogg"
];
// add sekar images dynamically
for(let i=1;i<=9;i++){
  ASSETS.push(`./assets/sekar-${String(i).padStart(2,'0')}.jpg`);
  ASSETS.push(`./assets/sekar-${String(i).padStart(2,'0')}.webp`);
}
self.addEventListener("install", e=>{
  e.waitUntil(caches.open(CACHE).then(c=> c.addAll(ASSETS).catch(()=>{})));
  self.skipWaiting();
});
self.addEventListener("activate", e=>{
  e.waitUntil(caches.keys().then(keys=> Promise.all(keys.filter(k=>k!==CACHE).map(k=> caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", e=>{
  const req=e.request;
  if(req.method!=="GET") return;
  e.respondWith(
    caches.match(req).then(cached=> cached || fetch(req).then(res=>{
      // cache images dynamically
      if(req.url.includes("/assets/") && res.ok){
        const clone=res.clone();
        caches.open(CACHE).then(c=> c.put(req, clone));
      }
      return res;
    }).catch(()=> cached))
  );
});
