self.addEventListener('push', event => {
  const data = event.data.json() ?? {};
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
  const url = event.notification.data;
  event.waitUntil(clients.openWindow(url || '/'));
});

self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event);
});