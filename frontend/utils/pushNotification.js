import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

/**
 * Convert base64 VAPID key to Uint8Array
 */
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Kiểm tra xem trình duyệt có hỗ trợ push notifications không
 */
export function isPushNotificationSupported() {
  return 'serviceWorker' in navigator && 'PushManager' in window;
}

/**
 * Đăng ký service worker
 */
export async function registerServiceWorker() {
  if (!isPushNotificationSupported()) {
    throw new Error('Push notifications are not supported');
  }

  try {
    const registration = await navigator.serviceWorker.register('/service-worker.js');
    console.log('Service Worker registered:', registration);
    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    throw error;
  }
}

/**
 * Yêu cầu quyền thông báo từ user
 */
export async function requestNotificationPermission() {
  if (!isPushNotificationSupported()) {
    throw new Error('Push notifications are not supported');
  }

  const permission = await Notification.requestPermission();
  return permission;
}

/**
 * Lấy VAPID public key từ server
 */
async function getVapidPublicKey() {
  try {
    const response = await axios.get(`${API_URL}/api/notifications/push/vapid-public-key`);
    return response.data.publicKey;
  } catch (error) {
    console.error('Error fetching VAPID key:', error);
    throw error;
  }
}

/**
 * Subscribe to push notifications
 */
export async function subscribeToPushNotifications() {
  try {
    // 1. Kiểm tra hỗ trợ
    if (!isPushNotificationSupported()) {
      throw new Error('Push notifications are not supported');
    }

    // 2. Yêu cầu quyền
    const permission = await requestNotificationPermission();
    if (permission !== 'granted') {
      throw new Error('Notification permission denied');
    }

    // 3. Đăng ký service worker
    const registration = await registerServiceWorker();

    // 4. Lấy VAPID public key
    const vapidPublicKey = await getVapidPublicKey();
    const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

    // 5. Subscribe
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedVapidKey
    });

    // 6. Gửi subscription lên server
    const token = localStorage.getItem('token');
    await axios.post(
      `${API_URL}/api/notifications/push/subscribe`,
      { subscription: subscription.toJSON() },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Push notification subscription successful');
    return subscription;
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
    throw error;
  }
}

/**
 * Unsubscribe from push notifications
 */
export async function unsubscribeFromPushNotifications() {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      // Unsubscribe từ browser
      await subscription.unsubscribe();

      // Xóa khỏi server
      const token = localStorage.getItem('token');
      await axios.delete(
        `${API_URL}/api/notifications/push/unsubscribe`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          data: {
            endpoint: subscription.endpoint
          }
        }
      );

      console.log('Push notification unsubscription successful');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error unsubscribing from push notifications:', error);
    throw error;
  }
}

/**
 * Kiểm tra trạng thái subscription
 */
export async function getPushSubscriptionStatus() {
  try {
    if (!isPushNotificationSupported()) {
      return { 
        supported: false, 
        subscribed: false, 
        permission: 'denied' 
      };
    }

    const permission = Notification.permission;
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    return {
      supported: true,
      subscribed: subscription !== null,
      permission: permission,
      subscription: subscription
    };
  } catch (error) {
    console.error('Error checking push subscription status:', error);
    return { 
      supported: false, 
      subscribed: false, 
      permission: 'denied' 
    };
  }
}

/**
 * Test push notification
 */
export async function sendTestNotification() {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_URL}/api/notifications/push/test`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error sending test notification:', error);
    throw error;
  }
}

/**
 * Listen for service worker messages
 */
export function listenForServiceWorkerMessages(callback) {
  if (!isPushNotificationSupported()) {
    return;
  }

  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data.type === 'NOTIFICATION_CLICKED') {
      callback(event.data);
    }
  });
}