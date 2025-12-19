// Service Worker version - tăng khi có thay đổi
const SW_VERSION = 'v1.1';
console.log('[SW] Service Worker started:', SW_VERSION);

self.addEventListener("push", (event) => {
  console.log('[SW] Push received:', event);
  
  const data = event.data.json();
  console.log('[SW] Push data:', data);
  
  const options = {
    body: data.body,
    icon: "./public/bell.png",
    badge: "./public/bell.png",
    data: {
      url: data.url || "/",
      timestamp: Date.now(),
    },
    tag: "notification-" + Date.now(),
    requireInteraction: false,
  };

  event.waitUntil(
    Promise.all([
      // Hiển thị notification
      self.registration.showNotification(data.title, options)
        .then(() => console.log('[SW] Notification displayed')),

      // Gửi message đến tất cả clients để reload notifications
      self.clients
        .matchAll({ type: "window", includeUncontrolled: true })
        .then((clients) => {
          console.log('[SW] Found clients:', clients.length);
          clients.forEach((client) => {
            console.log('[SW] Sending message to client:', client.url);
            client.postMessage({
              type: "NEW_NOTIFICATION",
              notification: data,
            });
          });
        }),
    ])
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data.url;
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // Nếu đã có tab mở → focus
        for (let client of clientList) {
          if (client.url.includes(url) && "focus" in client) {
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
