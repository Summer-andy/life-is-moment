/* ../util.sw.js Service Worker 逻辑 */
self.addEventListener('message', function (e) {
  console.log('service worker receive message', e.data);
  e.waitUntil(
      self.clients.matchAll().then(function (clients) {
          if (!clients || clients.length === 0) {
              return;
          }
          clients.forEach(function (client) {
              client.postMessage(e.data);
          });
      })
  );
});