/* offline cache for חידוד: everything is stored on install, then served from the phone */
const CACHE = 'hidud-8dd7a6b630';
const FILES = ["./", "index.html", "manifest.webmanifest", "icons/apple-touch-icon.png", "icons/icon-192.png", "icons/icon-512.png", "icons/maskable-512.png", "fonts/fonts.css", "fonts/250613af4ba0afaa.woff2", "fonts/7febd16d7cafe70e.woff2", "fonts/d41ec0a93ee1297d.woff2", "fonts/7f25d9307a925647.woff2", "fonts/d196e8ee774851ce.woff2", "fonts/ea6907c89f912ffb.woff2", "fonts/64963edf6dfd8eb0.woff2", "fonts/0e01ed2dc339d23c.woff2", "fonts/bf8910cb402ad6a9.woff2", "fonts/9b8270599413b510.woff2", "fonts/e7034287e25fdb2d.woff2", "fonts/03df6645579c4bad.woff2", "fonts/e08bdbbb89f6d5c7.woff2", "fonts/1292e86783221138.woff2", "fonts/4bcc5fb106f2493a.woff2", "fonts/9ee1be9c7644a612.woff2", "fonts/cf4781976fae672c.woff2", "fonts/f0f117952cdd0111.woff2", "fonts/190c56c4c098e4d2.woff2", "fonts/ab551142541b0cd7.woff2", "fonts/e64a112e84c98d9d.woff2", "fonts/e31cccbbbd6b6a52.woff2", "fonts/0e84b803ae58080b.woff2", "fonts/26a92bb057ce7697.woff2", "fonts/dc02e545dc91e7a2.woff2", "fonts/cf048ef2b5a69d27.woff2", "fonts/ee81c1f06d4166b3.woff2", "fonts/ed7504d6292a2d07.woff2", "fonts/d4d0cc70f81afdfa.woff2", "fonts/cfb9fccde2850c41.woff2", "fonts/af641ac2c30ea513.woff2", "fonts/7b9e02a4e12807b5.woff2", "fonts/041c229728db907b.woff2", "fonts/f9d55deea689bdf9.woff2", "fonts/7a9126d59433be01.woff2", "fonts/a28cca9c0265e1f1.woff2", "fonts/658abfd8a790466f.woff2"];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(caches.open(CACHE).then(async c => {
    const hit = await c.match(req, { ignoreSearch: true }) || (req.mode === 'navigate' ? await c.match('./') : null);
    if (hit) return hit;
    const res = await fetch(req);
    if (res.ok) c.put(req, res.clone());
    return res;
  }));
});
