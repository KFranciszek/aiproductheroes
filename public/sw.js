// public/sw.js
const CACHE_NAME = 'braintask-v1';
const urlsToCache = [
  '/',
  '/app/page.tsx',
  '/components/navigation.tsx',
  // Wszystkie kluczowe pliki aplikacji
];

// Instalacja Service Workera
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Pobieranie zasobów z cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      }
    )
  );
});

// Synchronizacja danych w tle
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-issues') {
    event.waitUntil(syncIssuesWithServer());
  }
});

async function syncIssuesWithServer() {
  // Mock synchronizacji - w rzeczywistości wyślij dane do API
  const issues = JSON.parse(localStorage.getItem('issues') || '[]');
  console.log('Syncing issues:', issues.length);

  // Symuluj pomyślną synchronizację
  return Promise.resolve();
}


