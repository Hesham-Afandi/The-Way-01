const CACHE_NAME = "the-way-v1";

self.addEventListener("install", (event) => {
console.log("The Way Service Worker installing...");

// Activate the new service worker immediately
self.skipWaiting();
});

self.addEventListener("activate", (event) => {
console.log("The Way Service Worker activated.");

event.waitUntil(
caches
.keys()
.then((cacheNames) => {
return Promise.all(
cacheNames
.filter((cacheName) => cacheName !== CACHE_NAME)
.map((cacheName) => caches.delete(cacheName))
);
})
.then(() => self.clients.claim())
);
});

self.addEventListener("fetch", (event) => {
// Only handle GET requests
if (event.request.method !== "GET") {
return;
}

event.respondWith(
fetch(event.request).catch(() => {
return caches.match(event.request);
})
);
});
