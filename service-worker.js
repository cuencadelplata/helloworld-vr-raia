const CACHE_NAME = "entorno-vr-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/logo.png",
  "/models/old_tyre_1k.gltf",
  "/models/old_tyre.bin",
  "/models/textures/old_tyre_nor_gl_1k.jpg",
  "/models/textures/old_tyre_arm_1k.jpg",
  "/models/textures/old_tyre_diff_1k.jpg",
  "https://aframe.io/releases/1.4.0/aframe.min.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
});
