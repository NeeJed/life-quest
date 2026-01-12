const CACHE_NAME = "audio-cache-v1";
const AUDIO_CACHE = [
  "/audio/nature1.mp3",
  "/audio/nature2.mp3",
  "/audio/city1.mp3",
  "/audio/city2.mp3",
  "/audio/Madcon - Beggin.mp3",
  "/audio/Madcon - Freaky Like Me.mp3",
  "/audio/complete.mp3",
  "/audio/xp.mp3",
  "/audio/click.mp3",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(AUDIO_CACHE))
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.url.includes("/audio/")) {
    event.respondWith(
      caches
        .match(event.request)
        .then((response) => response || fetch(event.request))
    );
  }
});
