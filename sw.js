const V='kasir-v2',C='https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.';
const F=['./','index.html','style.css','manifest.webmanifest','icons/192.png','icons/512.png',...['app','db','logic','printer','views/kasir','views/meja','views/menu','views/laporan'].map(x=>`js/${x}.js`),C+'js',C+'wasm'];
self.oninstall=e=>{self.skipWaiting();e.waitUntil(caches.open(V).then(c=>c.addAll(F)))};
self.onactivate=e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith('kasir-')&&x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));
self.onfetch=e=>e.respondWith(caches.match(e.request,{ignoreVary:true}).then(r=>r||fetch(e.request)));
