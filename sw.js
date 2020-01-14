console.log('Hello from service-worker.js');

//importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');
importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.0.0-rc.1/workbox-sw.js');

workbox.setConfig({
  debug: true
});

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}


/*
//Routing
//route js..network first
workbox.routing.registerRoute(
  /\.js$/,
  new workbox.strategies.NetworkFirst()
);


//route css..cache first but update in background
workbox.routing.registerRoute(
  // Cache CSS files.
  /\.css$/,
  // Use cache but update in the background.
  new workbox.strategies.StaleWhileRevalidate({
    // Use a custom cache name.
    cacheName: 'css-cache',
  })
);

//route images..cache first
workbox.routing.registerRoute(
  // Cache image files.
  /\.(?:png|jpg|jpeg|svg|gif)$/,
  // Use the cache if it's available.
  new workbox.strategies.CacheFirst({
    // Use a custom cache name.
    cacheName: 'image-cache',
    plugins: [
      new workbox.expiration.Plugin({
        // Cache only 20 images.
        maxEntries: 20,
        // Cache for a maximum of a week.
        maxAgeSeconds: 7 * 24 * 60 * 60,
      })
    ],
  })
);


//Precache

const precacheController = new workbox.precaching.PrecacheController();
precacheController.addToCacheList([{
 url: './app.css',
 revision: '234'
}
]);



self.addEventListener('install', (event) => {
  event.waitUntil(precacheController.install());
});
self.addEventListener('activate', (event) => {
  event.waitUntil(precacheController.activate());
});
self.addEventListener('fetch', (event) => {
  const cacheKey = precacheController.getCacheKeyForURL(event.request.url);
 // event.respondWith(caches.match(cacheKey).then(...));
});

*/

//Background sync


const bgSyncPlugin = new workbox.backgroundSync.BackgroundSyncPlugin('myQueueName');

workbox.routing.registerRoute(
  ({url}) => url.pathname === '/sw/example.txt',
  new workbox.strategies.NetworkOnly({
    plugins: [bgSyncPlugin],
  }),
);

workbox.core.skipWaiting();
workbox.core.clientsClaim();




//Event Listeners

self.addEventListener('install', function(event) {
  self.skipWaiting();
});

self.addEventListener('sync', function(event) {
  self.registration.showNotification("Sync event fired!");
});



//push //integrate with firebase
self.addEventListener('push', function(e) {
  var options = {
    body: 'This notification was generated from a push!',
    icon: 'images/example.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '2'
    },
    actions: [
      {action: 'explore', title: 'Explore this new world',
        icon: 'images/checkmark.png'},
      {action: 'close', title: 'Close',
        icon: 'images/xmark.png'},
    ]
  };
  e.waitUntil(
    self.registration.showNotification('Hello world!', options)
  );
});


