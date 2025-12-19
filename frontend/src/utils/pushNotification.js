// Lấy VAPID key từ backend
let VAPID_PUBLIC_KEY = null;

const getVapidPublicKey = async () => {
  if (VAPID_PUBLIC_KEY) return VAPID_PUBLIC_KEY;

  try {
    const response = await fetch(
      "http://localhost:5000/api/push/vapid-public",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const data = await response.json();
    VAPID_PUBLIC_KEY = data.vapidPublicKey;
    return VAPID_PUBLIC_KEY;
  } catch (err) {
    console.error("Failed to get VAPID key:", err);
    return null;
  }
};

const urlBase64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    console.log("Browser không hỗ trợ notifications");
    return false;
  }

  if (Notification.permission === "granted") {
    console.log("[Push] Permission already granted");
    return true;
  }

  if (Notification.permission === "denied") {
    console.error("[Push] ❌ Notification permission bị BLOCK!");
    console.error(
      "[Push] 🔧 Cách fix: Click icon 🔒 ở address bar → Notifications → Allow"
    );
    alert(
      "⚠️ Thông báo bị chặn!\n\nCách bật:\n1. Click icon 🔒 bên trái address bar\n2. Notifications → Allow\n3. Reload page"
    );
    return false;
  }

  // Hỏi quyền
  console.log("[Push] Requesting permission...");
  const permission = await Notification.requestPermission();
  console.log("[Push] Permission response:", permission);

  if (permission === "denied") {
    alert(
      "⚠️ Bạn vừa từ chối thông báo!\n\nĐể nhận thông báo push, vui lòng:\n1. Click icon 🔒 ở address bar\n2. Notifications → Allow"
    );
  }

  return permission === "granted";
};

export const subscribePush = async () => {
  console.log("[Push] Checking browser support...");

  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    console.log("[Push] Browser không hỗ trợ Push API");
    return { success: false, message: "Browser không hỗ trợ" };
  }

  try {
    // Request permission trước
    console.log("[Push] Requesting notification permission...");
    const hasPermission = await requestNotificationPermission();
    console.log("[Push] Permission result:", hasPermission);

    if (!hasPermission) {
      return { success: false, message: "Người dùng từ chối quyền thông báo" };
    }

    // Register Service Worker với force update
    console.log("[Push] Registering service worker...");
    const registration = await navigator.serviceWorker.register(
      "/service-worker.js",
      { updateViaCache: "none" }
    );
    console.log("[Push] Service worker registered:", registration);

    // Force update service worker nếu có version mới
    await registration.update();
    console.log("[Push] Service worker updated");

    await navigator.serviceWorker.ready;
    console.log("[Push] Service worker ready");

    // Lấy VAPID key
    console.log("[Push] Getting VAPID key...");
    const vapidKey = await getVapidPublicKey();
    console.log("[Push] VAPID key:", vapidKey ? "OK" : "FAILED");

    if (!vapidKey) {
      return { success: false, message: "Không thể lấy VAPID key" };
    }

    // Check nếu đã subscribe rồi
    console.log("[Push] Checking existing subscription...");
    let subscription = await registration.pushManager.getSubscription();
    console.log("[Push] Existing subscription:", subscription);

    if (!subscription) {
      // Tạo subscription mới
      console.log("[Push] Creating new subscription...");
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });
      console.log("[Push] Subscription created:", subscription);
    }

    // Gửi subscription lên backend
    console.log("[Push] Sending subscription to backend...");
    const response = await fetch("http://localhost:5000/api/push/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ subscription }),
    });

    console.log("[Push] Backend response status:", response.status);
    const data = await response.json();
    console.log("[Push] Backend response data:", data);

    if (data.success) {
      console.log("✅ Đã đăng ký push notification thành công!");
      return { success: true, message: "Đã bật thông báo push!" };
    } else {
      throw new Error(data.message);
    }
  } catch (err) {
    console.error("[Push] Failed to subscribe push:", err);
    return { success: false, message: err.message || "Lỗi đăng ký push" };
  }
};

export const unsubscribePush = async () => {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      await subscription.unsubscribe();

      const response = await fetch(
        "http://localhost:5000/api/push/unsubscribe",
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();
      console.log("Đã hủy push notification");
      return { success: true, message: "Đã tắt thông báo push!" };
    }
  } catch (err) {
    console.error("Failed to unsubscribe:", err);
    return { success: false, message: "Lỗi khi hủy push" };
  }
};
