self.addEventListener('push', event => {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: './public/bell.png',
    badge: './public/bell.png',
    data: {
      url: data.url || '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = event.notification.data.url;
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      // Nếu đã có tab mở → focus
      for (let client of clientList) {
        if (client.url.includes(url) && 'focus' in client) {
          return client.focus();
        }
      }
      // Nếu chưa → mở tab mới
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});