// Or Barak — service worker
// Guarda la app en el celular para que abra sin señal.
// Sube la versión cada vez que cambies index.html para forzar la actualización.
var VERSION = 'orbarak-v1';
var SHELL = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];

self.addEventListener('install', function(e){
  e.waitUntil(caches.open(VERSION).then(function(c){ return c.addAll(SHELL); }).then(function(){ return self.skipWaiting(); }));
});

self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.map(function(k){ return k === VERSION ? null : caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});

self.addEventListener('fetch', function(e){
  var req = e.request;
  if(req.method !== 'GET') return;                       // las llamadas al Sheet nunca se cachean
  if(new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(
    fetch(req).then(function(res){
      var copia = res.clone();
      caches.open(VERSION).then(function(c){ c.put(req, copia); });
      return res;
    }).catch(function(){ return caches.match(req).then(function(r){ return r || caches.match('./index.html'); }); })
  );
});
