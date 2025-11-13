// Service Worker cho Web Push Notifications
// Cache version
const CACHE_VERSION = 'v1';

// Install event
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Push event - nhận notification từ server
self.addEventListener('push', (event) => {
  let data = {
    title: 'Thông báo mới',
    body: 'Bạn có thông báo mới',
    icon: 'bell.png',
    data: {}
  };

  if (event.data) {
    try {
      data = event.data.json();
    } catch (error) {
      console.error(error);
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || 'bell.png',
    vibrate: [200, 100, 200],
    data: data.data || {},
    tag: data.tag || 'default',
    requireInteraction: data.requireInteraction || false,
    actions: [
      {
        action: 'open',
        title: 'Xem ngay'
      },
      {
        action: 'close',
        title: 'Đóng'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  // Xử lý action 'open' hoặc click vào notification
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      const data = event.notification.data;
      
      // URL để mở
      let urlToOpen = '/';
      
      if (data.type === 'registration') {
        urlToOpen = '/my-registrations';
      } else if (data.type === 'event') {
        urlToOpen = data.eventId ? `/events/${data.eventId}` : '/events';
      } else if (data.type === 'comment' || data.type === 'reply') {
        urlToOpen = data.eventId ? `/events/${data.eventId}#comments` : '/events';
      } else if (data.type === 'reminder') {
        urlToOpen = data.eventId ? `/events/${data.eventId}` : '/events';
      }

      // Kiểm tra xem đã có tab nào mở app chưa
      for (let client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.focus();
          client.postMessage({
            type: 'NOTIFICATION_CLICKED',
            url: urlToOpen,
            data: data
          });
          return;
        }
      }

      // Nếu chưa có tab nào, mở tab mới
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Background sync (optional - cho offline support)
self.addEventListener('sync', (event) => {
  console.log('Background sync:', event.tag);
  
  if (event.tag === 'sync-notifications') {
    event.waitUntil(syncNotifications());
  }
});

async function syncNotifications() {
  // Logic để sync notifications khi online trở lại
  console.log('Syncing notifications...');
}

// Message event - nhận message từ main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker received message:', event.data);
  
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});