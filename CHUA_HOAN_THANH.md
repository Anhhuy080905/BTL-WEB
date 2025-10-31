# 📋 DANH SÁCH CHỨC NĂNG CHƯA HOÀN THÀNH

## Dự án: VolunteerHub - INT3306 Fall 2025

**Ngày cập nhật:** 30/10/2025

---

## ✅ **ĐÃ HOÀN THÀNH TỐT**

### Backend MVC

- ✅ Models: User, Event, Post, Notification
- ✅ Controllers: authController, eventController, postController, notificationController, userController
- ✅ Routes đầy đủ
- ✅ Middleware: JWT authentication, role-based access control
- ✅ Mongoose ODM

### Chức năng đã có

- ✅ Đăng ký/Đăng nhập (email/password)
- ✅ Xem sự kiện, lọc theo category, search
- ✅ Đăng ký/Hủy đăng ký sự kiện
- ✅ Xem lịch sử tham gia (my-events.jsx)
- ✅ In-app notifications
- ✅ Quản lý sự kiện (tạo, sửa, xóa)
- ✅ Xác nhận đăng ký, đánh dấu hoàn thành
- ✅ Xem báo cáo tham gia
- ✅ Kênh trao đổi (post, comment, like, reply)
- ✅ Admin Dashboard (admin-dashboard.jsx)
- ✅ Quản lý người dùng (khóa/mở tài khoản)
- ✅ Export sự kiện & users (CSV/JSON)
- ✅ Validation với Yup (event-management.jsx)
- ✅ JWT Authentication & bcrypt
- ✅ Responsive design

---

## 🔴 CÁC CHỨC NĂNG THIẾU NGHIÊM TRỌNG (BẮT BUỘC - Mất 20-35% điểm)

### 1. ❌ **DASHBOARD CHO VOLUNTEER & EVENT MANAGER - THIẾU HOÀN TOÀN** (~15-20% điểm)

**Yêu cầu đề bài (cho CẢ 3 VAI TRÒ):**

> "**Xem Dashboard**: Xem tổng hợp sự kiện liên quan (mới công bố, có tin bài mới), sự kiện thu hút (tăng thành viên/trao đổi/like nhanh)"

**Hiện trạng:**

- ✅ ĐÃ CÓ Admin Dashboard
- ❌ THIẾU Volunteer Dashboard
- ❌ THIẾU Event Manager Dashboard

**Thiếu:**

#### 1.1. Dashboard Tình Nguyện Viên

**Files cần tạo:**

- `frontend/src/views/volunteer-dashboard.jsx`
- `frontend/src/views/volunteer-dashboard.css`
- `backend/controllers/dashboardController.js`
- `backend/routes/dashboardRoutes.js`
- `frontend/src/services/dashboardService.js`

**Nội dung cần có:**

- [ ] Sự kiện mới công bố (7 ngày gần đây)
- [ ] Sự kiện có tin bài mới (24h)
- [ ] Sự kiện trending (tăng thành viên nhanh)
- [ ] Sự kiện hot (nhiều trao đổi/like)
- [ ] Gợi ý sự kiện theo interests
- [ ] Thống kê cá nhân (tổng events, giờ tình nguyện, upcoming, completed)

#### 1.2. Dashboard Event Manager

**Files cần tạo:**

- `frontend/src/views/manager-dashboard.jsx`
- `frontend/src/views/manager-dashboard.css`

**Nội dung cần có:**

- [ ] Tổng quan sự kiện đang quản lý
- [ ] Số đăng ký chờ duyệt
- [ ] Engagement metrics (participants, posts, comments, likes)
- [ ] Sự kiện hot nhất của mình
- [ ] Sự kiện có tin bài mới
- [ ] Alerts (sự kiện sắp tới, cần duyệt đăng ký)

**Backend API cần thêm:**

- [ ] `GET /api/dashboard/volunteer` - Dashboard cho volunteer
- [ ] `GET /api/dashboard/manager` - Dashboard cho manager
- [ ] `GET /api/dashboard/trending-events` - Sự kiện trending
- [ ] `GET /api/dashboard/hot-events` - Sự kiện hot
- [ ] `GET /api/dashboard/recent-activity` - Hoạt động gần đây

**Components cần tạo:**

- [ ] `StatCard.jsx` - Hiển thị số liệu thống kê
- [ ] `TrendingEventCard.jsx` - Thẻ sự kiện trending
- [ ] `ActivityFeed.jsx` - Feed hoạt động gần đây

**Thời gian ước tính:** 14-18 giờ

---

### 2. ❌ **WEB PUSH NOTIFICATIONS - THIẾU HOÀN TOÀN** (~5-10% điểm)

**Yêu cầu đề bài:**

> "Nhận thông báo trạng thái đăng ký/hoàn thành **(Web Push API)**"

**Hiện trạng:**

- ✅ Có in-app notifications
- ❌ KHÔNG CÓ Web Push API thật sự

**Thiếu:**

**Files cần tạo:**

- [ ] `frontend/public/service-worker.js` - Service Worker xử lý push
- [ ] `frontend/src/utils/pushNotification.js` - Push helper functions
- [ ] `backend/utils/pushNotification.js` - Backend push sender
- [ ] Update `backend/models/User.js` - Thêm pushSubscription field

**Packages cần cài:**

- [ ] Backend: `npm install web-push`
- [ ] Generate VAPID keys: `npx web-push generate-vapid-keys`

**Backend API cần thêm:**

- [ ] `POST /api/notifications/subscribe` - Lưu push subscription
- [ ] `DELETE /api/notifications/unsubscribe` - Xóa subscription
- [ ] Logic gửi push khi:
  - Đăng ký được duyệt
  - Đăng ký bị từ chối
  - Hoàn thành sự kiện
  - Có comment/reply mới
  - Sự kiện sắp diễn ra

**Frontend cần có:**

- [ ] Request notification permission
- [ ] Register Service Worker
- [ ] Subscribe to push notifications
- [ ] Handle push events

**Thời gian ước tính:** 5-8 giờ

---

### 3. ❌ **LỌC THEO THỜI GIAN - THIẾU** (~2-3% điểm)

**Yêu cầu đề bài RÕ RÀNG:**

> "**Nhận thông báo**: Nhận thông báo trạng thái đăng ký/hoàn thành **(Web Push API)**"

**Hiện trạng:**

- ✅ Có in-app notifications (hiển thị trong trang web)
- ✅ Notification bell với số lượng thông báo chưa đọc
- ❌ **KHÔNG CÓ Push Notifications thật sự** (push khi đóng browser)
- ❌ **KHÔNG CÓ Service Worker**
- ❌ **KHÔNG CÓ Push Subscription**

**ĐÂY LÀ YÊU CẦU RÕ RÀNG TRONG ĐỀ BÀI - BẮT BUỘC PHẢI LÀM!**

**Thiếu:**

#### 2.1. Frontend - Service Worker & Push Subscription

**File cần tạo:**

```
frontend/public/service-worker.js (TẠO MỚI)
frontend/src/utils/pushNotification.js (TẠO MỚI)
```

**Code mẫu Service Worker:**

```javascript
// frontend/public/service-worker.js
self.addEventListener("push", (event) => {
  const data = event.data.json();

  const options = {
    body: data.body,
    icon: "/logo192.png",
    badge: "/badge-72x72.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: data.notificationId,
    },
    actions: [
      { action: "view", title: "Xem chi tiết" },
      { action: "close", title: "Đóng" },
    ],
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "view") {
    event.waitUntil(clients.openWindow(event.notification.data.url));
  }
});
```

**Push Subscription Helper:**

```javascript
// frontend/src/utils/pushNotification.js
export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    console.log("Browser không hỗ trợ notifications");
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === "granted";
};

export const registerServiceWorker = async () => {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    console.log("Browser không hỗ trợ Web Push");
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register(
      "/service-worker.js"
    );
    return registration;
  } catch (error) {
    console.error("Service Worker registration failed:", error);
    return null;
  }
};

export const subscribeToPush = async (registration) => {
  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.REACT_APP_VAPID_PUBLIC_KEY
      ),
    });

    return subscription;
  } catch (error) {
    console.error("Push subscription failed:", error);
    return null;
  }
};

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
```

**Tích hợp vào App/Component:**

```javascript
// frontend/src/App.js hoặc Navigation.jsx
import {
  requestNotificationPermission,
  registerServiceWorker,
  subscribeToPush,
} from "./utils/pushNotification";

useEffect(() => {
  const setupPushNotifications = async () => {
    const hasPermission = await requestNotificationPermission();

    if (hasPermission) {
      const registration = await registerServiceWorker();

      if (registration) {
        const subscription = await subscribeToPush(registration);

        if (subscription) {
          // Gửi subscription lên server
          await api.post("/notifications/subscribe", {
            subscription: subscription.toJSON(),
          });
        }
      }
    }
  };

  if (isLoggedIn) {
    setupPushNotifications();
  }
}, [isLoggedIn]);
```

#### 2.2. Backend - Web Push Setup

**Cài đặt package:**

```bash
cd backend
npm install web-push
```

**Tạo VAPID Keys:**

```bash
npx web-push generate-vapid-keys
```

**Thêm vào .env:**

```
VAPID_PUBLIC_KEY=BKx...
VAPID_PRIVATE_KEY=xyz...
VAPID_SUBJECT=mailto:your-email@example.com
```

**File cần tạo:**

```
backend/utils/pushNotification.js (TẠO MỚI)
```

**Code mẫu:**

```javascript
// backend/utils/pushNotification.js
const webpush = require("web-push");

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

exports.sendPushNotification = async (subscription, payload) => {
  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload));
    return { success: true };
  } catch (error) {
    console.error("Push notification error:", error);
    return { success: false, error };
  }
};

exports.sendToUser = async (userId, notification) => {
  const user = await User.findById(userId);

  if (user && user.pushSubscription) {
    await this.sendPushNotification(user.pushSubscription, {
      title: notification.title,
      body: notification.message,
      notificationId: notification._id,
      url: notification.link || "/",
    });
  }
};
```

#### 2.3. Update User Model

```javascript
// backend/models/User.js
pushSubscription: {
  endpoint: String,
  keys: {
    p256dh: String,
    auth: String
  }
}
```

#### 2.4. API Endpoints

**Thêm vào notificationController.js:**

```javascript
// POST /api/notifications/subscribe
exports.subscribePush = async (req, res) => {
  try {
    const { subscription } = req.body;

    await User.findByIdAndUpdate(req.user.id, {
      pushSubscription: subscription,
    });

    res.json({
      success: true,
      message: "Push subscription saved",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to save subscription",
    });
  }
};

// DELETE /api/notifications/unsubscribe
exports.unsubscribePush = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $unset: { pushSubscription: 1 },
    });

    res.json({
      success: true,
      message: "Push subscription removed",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to remove subscription",
    });
  }
};
```

**Thêm routes:**

```javascript
// backend/routes/notificationRoutes.js
router.post("/subscribe", auth, subscribePush);
router.delete("/unsubscribe", auth, unsubscribePush);
```

#### 2.5. Trigger Push Notifications

**Gửi push khi có sự kiện quan trọng:**

```javascript
// Trong eventController.js - khi duyệt đăng ký
const { sendToUser } = require("../utils/pushNotification");

// Sau khi approve registration
await sendToUser(participant.user, {
  title: "Đăng ký được duyệt! 🎉",
  message: `Bạn đã được phê duyệt tham gia sự kiện "${event.title}"`,
  link: `/events#${event._id}`,
});

// Khi hoàn thành sự kiện
await sendToUser(participant.user, {
  title: "Hoàn thành sự kiện! ✅",
  message: `Bạn đã hoàn thành sự kiện "${event.title}". Cảm ơn bạn!`,
  link: `/my-events`,
});

// Khi có comment mới trên post của user
await sendToUser(post.author, {
  title: "Bình luận mới 💬",
  message: `${commentAuthor} đã bình luận trên bài viết của bạn`,
  link: `/discussion/${eventId}#${postId}`,
});
```

**Thời gian ước tính:**

- Frontend Service Worker: 2-3 giờ
- Backend Web Push: 2-3 giờ
- Integration & Testing: 1-2 giờ
- **TỔNG: 5-8 giờ**

---

### 3. ❌ **LỌC THEO THỜI GIAN - THIẾU** (Ảnh hưởng ~2-3% điểm)

**Yêu cầu đề bài (Admin):**

> "**Xuất dữ liệu**: Export danh sách sự kiện/**tình nguyện viên** (CSV/JSON)"

**Hiện trạng:**

- ✅ Có `exportEvents` (export sự kiện)
- ❌ KHÔNG CÓ `exportUsers` (export tình nguyện viên)
- ❌ KHÔNG CÓ export danh sách participants theo sự kiện cụ thể

**Thiếu:**

#### 3.1. Backend API

- [ ] `GET /api/users/export?format=csv|json` (Admin only)
- [ ] `GET /api/events/:id/participants/export?format=csv|json` (Manager/Admin)

#### 3.2. Frontend UI

- [ ] Nút "Export Users (CSV/JSON)" trong Admin Dashboard
- [ ] Nút "Export Participants" trong Event Management
- [ ] Modal chọn định dạng (CSV/JSON)
- [ ] Toast thông báo export thành công

**Backend code cần thêm:**

```javascript
// File: backend/controllers/userController.js
exports.exportUsers = async (req, res) => {
  const { format = "json" } = req.query;
  // Export all users với stats
  // Format: CSV hoặc JSON
};

// File: backend/controllers/eventController.js
exports.exportEventParticipants = async (req, res) => {
  const { format = "json" } = req.query;
  // Export participants của 1 event cụ thể
};
```

---

## 🟡 CÁC CHỨC NĂNG CẦN CẢI THIỆN (Priority High)

### 4. ⚠️ **VALIDATION FRONTEND - CHƯA ĐẦY ĐỦ** (Ảnh hưởng ~3-5% điểm)

**Yêu cầu đề bài:**

> "**Quản lý sự kiện**: Tạo, sửa, xóa sự kiện (tên, ngày, địa điểm, mô tả). **Validate input (Joi/Yup)**"
> "**Xử lý nhập liệu**: Kiểm tra hợp thức, tự động điền, gợi ý, chuyển đổi, ..."

**Hiện trạng:**

- ✅ Backend có validation với Mongoose
- ❌ Frontend KHÔNG CÓ validation với Yup/Joi
- ❌ Không có auto-fill/suggestions
- ⚠️ Real-time validation feedback chưa tốt

**Thiếu:**

#### 4.1. Frontend Validation với Yup

- [ ] Cài đặt Yup: `npm install yup`
- [ ] Tạo validation schemas cho:
  - Register form
  - Login form
  - Create Event form
  - Update Event form
  - Profile form
- [ ] Real-time error messages khi nhập sai
- [ ] Disable submit button nếu form invalid

#### 4.2. Auto-fill & Suggestions

- [ ] Auto-complete địa điểm (có thể dùng Google Places API)
- [ ] Gợi ý tên tổ chức phổ biến
- [ ] Tự động format số điện thoại
- [ ] Tự động format ngày tháng

**Code mẫu cần thêm:**

```javascript
// File: frontend/src/validation/eventSchema.js (CẦN TẠO)
import * as Yup from "yup";

export const createEventSchema = Yup.object().shape({
  title: Yup.string()
    .min(10, "Tiêu đề phải có ít nhất 10 ký tự")
    .max(200, "Tiêu đề không được vượt quá 200 ký tự")
    .required("Vui lòng nhập tiêu đề"),
  // ... các field khác
});
```

---

### 5. ⚠️ **LỌC SỰ KIỆN THEO THỜI GIAN - THIẾU** (Ảnh hưởng ~2-3% điểm)

**Yêu cầu đề bài (Tình nguyện viên):**

> "**Xem sự kiện**: Xem danh sách sự kiện (tên, ngày, địa điểm, mô tả), **lọc theo thời gian/danh mục**"

**Yêu cầu đề bài (Event Manager/Admin):**

> "**Xuất dữ liệu**: Export danh sách sự kiện/**tình nguyện viên** (CSV/JSON)"

**Hiện trạng:**

- ✅ Có export events (CSV/JSON) - ✅ ĐÃ CÓ
- ✅ Có export users (CSV/JSON) - ✅ ĐÃ CÓ trong userController.js
- ❌ **KHÔNG CÓ** export participants theo từng sự kiện cụ thể

**Thiếu:**

#### 4.1. Backend API - Export Participants

**Thêm vào file: `backend/controllers/eventController.js`**

```javascript
// GET /api/events/:id/participants/export?format=csv|json
exports.exportEventParticipants = async (req, res) => {
  try {
    const { format = "json" } = req.query;
    const eventId = req.params.id;

    const event = await Event.findById(eventId).populate(
      "participants.user",
      "username fullName email phone"
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sự kiện",
      });
    }

    // Check permission: chỉ creator hoặc admin mới export được
    if (
      event.createdBy.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền export danh sách này",
      });
    }

    const participantsData = event.participants.map((p) => ({
      username: p.user?.username || "",
      fullName: p.user?.fullName || "",
      email: p.user?.email || "",
      phone: p.user?.phone || "",
      status: p.status,
      isCompleted: p.isCompleted,
      joinedAt: p.joinedAt ? new Date(p.joinedAt).toISOString() : "",
      completedAt: p.completedAt ? new Date(p.completedAt).toISOString() : "",
    }));

    if (format === "csv") {
      const csv = [
        [
          "Username",
          "Full Name",
          "Email",
          "Phone",
          "Status",
          "Completed",
          "Joined Date",
          "Completed Date",
        ],
        ...participantsData.map((p) => [
          p.username,
          p.fullName,
          p.email,
          p.phone,
          p.status,
          p.isCompleted ? "Yes" : "No",
          p.joinedAt,
          p.completedAt,
        ]),
      ]
        .map((row) => row.join(","))
        .join("\n");

      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=participants-${event.title.replace(
          /\s+/g,
          "-"
        )}.csv`
      );
      return res.send("\uFEFF" + csv); // UTF-8 BOM
    }

    // JSON format
    res.json({
      success: true,
      event: {
        id: event._id,
        title: event.title,
        date: event.date,
        location: event.location,
      },
      participants: participantsData,
      totalParticipants: participantsData.length,
      exportedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Export participants error:", error);
    res.status(500).json({
      success: false,
      message: "Không thể export danh sách tham gia",
    });
  }
};
```

**Thêm route:**

```javascript
// backend/routes/eventRoutes.js
router.get("/:id/participants/export", auth, exportEventParticipants);
```

#### 4.2. Frontend UI - Export Button

**Thêm vào `event-management.jsx` hoặc `events-manager.jsx`:**

```jsx
const handleExportParticipants = async (eventId, format) => {
  try {
    const response = await eventsService.exportEventParticipants(
      eventId,
      format
    );

    if (format === "csv") {
      // CSV được download tự động từ backend
      showToast("success", "Export thành công!");
    } else {
      // JSON - có thể download hoặc hiển thị
      const dataStr = JSON.stringify(response.data, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `participants-${eventId}.json`;
      link.click();
      URL.revokeObjectURL(url);

      showToast("success", "Export JSON thành công!");
    }
  } catch (error) {
    console.error("Export error:", error);
    showToast("error", "Không thể export danh sách");
  }
};

// JSX
<div className="export-actions">
  <button
    onClick={() => handleExportParticipants(event._id, "csv")}
    className="btn-export"
  >
    <i className="fas fa-file-csv"></i> Export CSV
  </button>
  <button
    onClick={() => handleExportParticipants(event._id, "json")}
    className="btn-export"
  >
    <i className="fas fa-file-code"></i> Export JSON
  </button>
</div>;
```

**Service method:**

```javascript
// frontend/src/services/eventsService.js
exportEventParticipants: (eventId, format) => {
  return api.get(`/events/${eventId}/participants/export?format=${format}`, {
    responseType: format === "csv" ? "blob" : "json",
  });
};
```

**Thời gian ước tính:**

- Backend: 1-2 giờ
- Frontend: 1 giờ
- **TỔNG: 2-3 giờ**

---

## 🟡 CÁC CHỨC NĂNG CẦN CẢI THIỆN (Priority High)

### 5. ⚠️ **VALIDATION FRONTEND - CHƯA ĐẦY ĐỦ** (Ảnh hưởng ~3-5% điểm)

**Yêu cầu đề bài:**

> "**Quản lý sự kiện**: Tạo, sửa, xóa sự kiện (tên, ngày, địa điểm, mô tả). **Validate input (Joi/Yup)**"
> "**Xử lý nhập liệu**: Kiểm tra hợp thức, **tự động điền, gợi ý**, chuyển đổi, ..."

**Hiện trạng:**

- ✅ Backend có validation với Mongoose
- ✅ **ĐÃ CÓ** validation với Yup trong `event-management.jsx`
- ❌ **THIẾU** validation trong `register.jsx`, `login.jsx`, `profile.jsx`
- ❌ **KHÔNG CÓ** auto-fill/suggestions
- ⚠️ Real-time validation feedback chưa đồng nhất

**Thiếu:**

#### 5.1. Frontend Validation với Yup cho các form còn lại

**Cài đặt (nếu chưa có):**

```bash
cd frontend
npm install yup
```

**File cần tạo:**

```
frontend/src/validation/authSchema.js (TẠO MỚI)
frontend/src/validation/profileSchema.js (TẠO MỚI)
```

**Code mẫu - Register Validation:**

```javascript
// frontend/src/validation/authSchema.js
import * as Yup from "yup";

export const registerSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Tên đăng nhập phải có ít nhất 3 ký tự")
    .max(30, "Tên đăng nhập không được vượt quá 30 ký tự")
    .matches(
      /^[a-zA-Z0-9_]+$/,
      "Tên đăng nhập chỉ chứa chữ, số và dấu gạch dưới"
    )
    .required("Vui lòng nhập tên đăng nhập"),

  fullName: Yup.string()
    .min(3, "Họ tên phải có ít nhất 3 ký tự")
    .required("Vui lòng nhập họ và tên"),

  email: Yup.string()
    .email("Email không hợp lệ")
    .required("Vui lòng nhập email"),

  password: Yup.string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .matches(/[A-Z]/, "Mật khẩu phải có ít nhất 1 chữ hoa")
    .matches(/[0-9]/, "Mật khẩu phải có ít nhất 1 số")
    .required("Vui lòng nhập mật khẩu"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Mật khẩu xác nhận không khớp")
    .required("Vui lòng xác nhận mật khẩu"),

  phone: Yup.string()
    .matches(/^[0-9]{10,11}$/, "Số điện thoại phải có 10-11 chữ số")
    .nullable(),

  role: Yup.string()
    .oneOf(["volunteer", "event_manager"], "Vai trò không hợp lệ")
    .required("Vui lòng chọn vai trò"),
});

export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Email không hợp lệ")
    .required("Vui lòng nhập email"),

  password: Yup.string().required("Vui lòng nhập mật khẩu"),
});
```

**Code mẫu - Profile Validation:**

```javascript
// frontend/src/validation/profileSchema.js
import * as Yup from "yup";

export const profileSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Tên hiển thị phải có ít nhất 3 ký tự")
    .required("Vui lòng nhập tên hiển thị"),

  fullName: Yup.string()
    .min(3, "Họ tên phải có ít nhất 3 ký tự")
    .required("Vui lòng nhập họ và tên"),

  phone: Yup.string()
    .matches(/^[0-9]{10,11}$/, "Số điện thoại phải có 10-11 chữ số")
    .nullable(),

  birthDate: Yup.date()
    .max(new Date(), "Ngày sinh không thể là ngày trong tương lai")
    .nullable(),

  nationality: Yup.string()
    .max(100, "Quốc tịch không được vượt quá 100 ký tự")
    .nullable(),
});

export const changePasswordSchema = Yup.object().shape({
  currentPassword: Yup.string().required("Vui lòng nhập mật khẩu hiện tại"),

  newPassword: Yup.string()
    .min(6, "Mật khẩu mới phải có ít nhất 6 ký tự")
    .matches(/[A-Z]/, "Mật khẩu phải có ít nhất 1 chữ hoa")
    .matches(/[0-9]/, "Mật khẩu phải có ít nhất 1 số")
    .notOneOf(
      [Yup.ref("currentPassword")],
      "Mật khẩu mới phải khác mật khẩu cũ"
    )
    .required("Vui lòng nhập mật khẩu mới"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Mật khẩu xác nhận không khớp")
    .required("Vui lòng xác nhận mật khẩu mới"),
});
```

**Áp dụng vào Register.jsx:**

```jsx
import { registerSchema } from "../validation/authSchema";

const [errors, setErrors] = useState({});

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // Validate với Yup
    await registerSchema.validate(formData, { abortEarly: false });
    setErrors({});

    // Tiếp tục submit
    const response = await api.post("/auth/register", formData);
    // ...
  } catch (error) {
    if (error.name === "ValidationError") {
      // Hiển thị lỗi validation
      const validationErrors = {};
      error.inner.forEach((err) => {
        validationErrors[err.path] = err.message;
      });
      setErrors(validationErrors);
    }
  }
};

// Real-time validation cho từng field
const handleFieldChange = async (fieldName, value) => {
  setFormData({ ...formData, [fieldName]: value });

  try {
    await registerSchema.validateAt(fieldName, { [fieldName]: value });
    setErrors({ ...errors, [fieldName]: "" });
  } catch (error) {
    setErrors({ ...errors, [fieldName]: error.message });
  }
};

// JSX
<input
  type="text"
  name="username"
  value={formData.username}
  onChange={(e) => handleFieldChange("username", e.target.value)}
  className={errors.username ? "input-error" : ""}
/>;
{
  errors.username && <span className="error-message">{errors.username}</span>;
}
```

#### 5.2. Auto-fill & Suggestions

**Gợi ý tên tổ chức:**

```jsx
// Trong event-management.jsx
const popularOrganizations = [
  "Đoàn Thanh niên Cộng sản Hồ Chí Minh",
  "Hội Chữ thập đỏ Việt Nam",
  "Quỹ Vì người nghèo",
  "Hội Liên hiệp Thanh niên Việt Nam",
  "Trung ương Hội Sinh viên Việt Nam",
  "Quỹ Bảo trợ Trẻ em Việt Nam",
  "Tổ chức Y tế Thế giới (WHO)",
  "UNICEF Việt Nam",
];

<div className="form-group">
  <label>Tên tổ chức *</label>
  <input
    list="organizations"
    name="organization"
    value={formData.organization}
    onChange={handleChange}
    placeholder="Nhập hoặc chọn tên tổ chức"
  />
  <datalist id="organizations">
    {popularOrganizations.map((org, index) => (
      <option key={index} value={org} />
    ))}
  </datalist>
  {errors.organization && <span className="error">{errors.organization}</span>}
</div>;
```

**Auto-format số điện thoại:**

```jsx
const formatPhoneNumber = (value) => {
  // Chỉ giữ lại số
  const numbers = value.replace(/\D/g, "");

  // Format: 0xxx xxx xxx hoặc 0xxx xxxx xxxx
  if (numbers.length <= 10) {
    return numbers.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3");
  }
  return numbers.replace(/(\d{4})(\d{4})(\d{3})/, "$1 $2 $3");
};

<input
  type="tel"
  value={formData.phone}
  onChange={(e) => {
    const formatted = formatPhoneNumber(e.target.value);
    handleFieldChange("phone", formatted);
  }}
  placeholder="0xxx xxx xxx"
/>;
```

**Auto-complete địa điểm (đơn giản):**

```jsx
const popularLocations = [
  'Hà Nội',
  'TP. Hồ Chí Minh',
  'Đà Nẵng',
  'Hải Phòng',
  'Cần Thơ',
  // Thêm các địa điểm phổ biến
];

<input
  list="locations"
  name="location"
  value={formData.location}
  onChange={handleChange}
  placeholder="Nhập địa điểm"
/>
<datalist id="locations">
  {popularLocations.map((loc, idx) => (
    <option key={idx} value={loc} />
  ))}
</datalist>
```

**Thời gian ước tính:**

- Validation schemas: 2 giờ
- Áp dụng vào forms: 2-3 giờ
- Auto-fill/suggestions: 1-2 giờ
- **TỔNG: 5-7 giờ**

---

### 6. ⚠️ **SECURITY ENHANCEMENTS - CHƯA ĐẦY ĐỦ** (Ảnh hưởng ~3-5% điểm)

**Yêu cầu đề bài:**

> "**An ninh**: Xác thực, quản lý phiên, điều khiển truy cập, **mã hóa**, ..."

**Hiện trạng:**

- ✅ JWT authentication
- ✅ Password hashing (bcrypt)
- ✅ Role-based access control
- ❌ THIẾU nhiều tính năng bảo mật nâng cao

**Thiếu:**

#### 6.1. Rate Limiting

- [ ] Cài đặt `express-rate-limit`
- [ ] Giới hạn login attempts: 5 lần/15 phút
- [ ] Giới hạn API calls: 100 requests/15 phút

#### 6.2. Security Headers

- [ ] Cài đặt `helmet`
- [ ] Configure CSP, HSTS, X-Frame-Options, etc.

#### 6.3. Input Sanitization

- [ ] Cài đặt `express-mongo-sanitize` (chống NoSQL injection)
- [ ] Cài đặt `xss-clean` (chống XSS)
- [ ] Validate và sanitize tất cả input

#### 6.4. CSRF Protection

- [ ] Cài đặt `csurf` middleware
- [ ] Add CSRF token vào forms

#### 6.5. Session Management

- [ ] Implement Refresh Token
- [ ] Token rotation
- [ ] Blacklist tokens khi logout

**Cài đặt:**

```bash
cd backend
npm install helmet express-rate-limit express-mongo-sanitize xss-clean csurf
```

**Code mẫu:**

```javascript
// backend/server.js
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

app.use(helmet());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);
```

**Yêu cầu đề bài:**

> "**An ninh**: Xác thực, quản lý phiên, điều khiển truy cập, **mã hóa**, ..."

**Hiện trạng:**

- ✅ JWT authentication
- ✅ Password hashing (bcrypt)
- ✅ Role-based access control
- ❌ **THIẾU** Rate Limiting
- ❌ **THIẾU** Security Headers (helmet)
- ❌ **THIẾU** Input Sanitization
- ❌ **THIẾU** CSRF Protection

**Thiếu:**

#### 6.1. Rate Limiting - Chống brute force

**Cài đặt:**

```bash
cd backend
npm install express-rate-limit
```

**Code:**

```javascript
// backend/middleware/rateLimiter.js (TẠO MỚI)
const rateLimit = require("express-rate-limit");

// Rate limit cho login - 5 lần / 15 phút
exports.loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per windowMs
  message: {
    success: false,
    message: "Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau 15 phút.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limit cho register - 3 lần / 1 giờ
exports.registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: {
    success: false,
    message: "Quá nhiều lần đăng ký. Vui lòng thử lại sau 1 giờ.",
  },
});

// Rate limit chung cho API - 100 requests / 15 phút
exports.apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Quá nhiều requests. Vui lòng thử lại sau.",
  },
});
```

**Áp dụng:**

```javascript
// backend/server.js
const { apiLimiter } = require("./middleware/rateLimiter");

// Apply to all API routes
app.use("/api/", apiLimiter);

// backend/routes/authRoutes.js
const { loginLimiter, registerLimiter } = require("../middleware/rateLimiter");

router.post("/login", loginLimiter, login);
router.post("/register", registerLimiter, register);
```

#### 6.2. Security Headers với Helmet

**Cài đặt:**

```bash
npm install helmet
```

**Code:**

```javascript
// backend/server.js
const helmet = require("helmet");

// Use helmet with custom configuration
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:", "http:"],
        scriptSrc: ["'self'"],
        connectSrc: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
```

#### 6.3. Input Sanitization - Chống NoSQL Injection & XSS

**Cài đặt:**

```bash
npm install express-mongo-sanitize xss-clean
```

**Code:**

```javascript
// backend/server.js
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

// Data sanitization against NoSQL injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());
```

#### 6.4. CORS Configuration

**Cập nhật CORS:**

```javascript
// backend/server.js
const cors = require("cors");

const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
```

#### 6.5. Additional Security Measures

**HTTP Parameter Pollution:**

```bash
npm install hpp
```

```javascript
const hpp = require("hpp");

// Prevent HTTP Parameter Pollution
app.use(hpp());
```

**Environment Variables:**

```javascript
// Đảm bảo .env không bị commit
// .gitignore
.env
.env.local
.env.development
.env.production
```

**JWT Best Practices:**

```javascript
// backend/middleware/auth.js

// Thêm token expiration check
if (decoded.exp < Date.now() / 1000) {
  return res.status(401).json({
    success: false,
    message: "Token đã hết hạn",
  });
}

// Thêm token blacklist (optional - advanced)
// Lưu revoked tokens vào Redis hoặc DB
```

**Complete Security Setup:**

```javascript
// backend/server.js - Tổng hợp
const express = require("express");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");
const { apiLimiter } = require("./middleware/rateLimiter");

const app = express();

// Security Middleware
app.use(helmet()); // Set security headers
app.use(cors(corsOptions)); // CORS
app.use(mongoSanitize()); // Prevent NoSQL injection
app.use(xss()); // Prevent XSS
app.use(hpp()); // Prevent HTTP Parameter Pollution

// Rate limiting
app.use("/api/", apiLimiter);

// Body parsers (with size limits)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ... rest of the app
```

**Thời gian ước tính:**

- Cài đặt và config: 2 giờ
- Testing: 1 giờ
- **TỔNG: 3 giờ**

---

## 🟢 CÁC CHỨC NĂNG NÊN CẢI THIỆN (Priority Medium)

### 7. 📝 **URL ROUTING - CHƯA TỐI ƯU** (Ảnh hưởng ~2-3% điểm)

**Yêu cầu đề bài:**

> "**Viết lại và/hoặc định tuyến URL**"

**Hiện trạng:**

- ⚠️ URL không SEO-friendly
- ⚠️ Dùng ID thay vì slug

**Cần cải thiện:**

#### 7.1. SEO-Friendly URLs

- [ ] Thêm `slug` field vào Event model
- [ ] Generate slug từ title (dùng `slugify` package)
- [ ] URL format: `/events/trong-cay-xanh-thanh-pho` thay vì `/events/123abc`
- [ ] Keep backward compatibility với ID

#### 7.2. Breadcrumbs

- [ ] Component Breadcrumb đã có nhưng chưa dùng đầy đủ
- [ ] Thêm breadcrumbs vào tất cả các trang

**Code mẫu:**

```javascript
// backend/models/Event.js
const slugify = require("slugify");

eventSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, locale: "vi" });
  }
  next();
});
```

---

### 8. 🎨 **DISCUSSION CHANNEL - THIẾU MỘT SỐ TÍNH NĂNG** (Ảnh hưởng ~2-3% điểm)

**Yêu cầu đề bài:**

> "**Truy cập kênh trao đổi**: Post bài, comment, like trên kênh sự kiện (tương tự wall Facebook), **chỉ sau khi sự kiện được duyệt**"

**Hiện trạng:**

- ✅ Post, comment, like, reply
- ⚠️ Không rõ có kiểm tra "chỉ sau khi sự kiện được duyệt" không
- ❌ Không có real-time updates

**Cần bổ sung:**

#### 8.1. Kiểm tra Event Status

- [ ] Chỉ cho phép post/comment nếu event.status === 'approved' (nếu có flow duyệt)
- [ ] Hoặc chỉ cho phép khi event.status !== 'cancelled'

#### 8.2. Real-time Updates (Optional - Nâng cao)

- [ ] Socket.io cho real-time notifications
- [ ] Cập nhật posts/comments mà không reload trang
- [ ] Online users indicator

#### 8.3. Rich Text Editor

- [ ] Thay textarea bằng rich text editor (react-quill, draft.js)
- [ ] Hỗ trợ bold, italic, list, link

#### 8.4. Image Upload

- [ ] Upload ảnh trong post/comment
- [ ] Integration với cloud storage (Cloudinary, AWS S3)

---

### 9. 🗄️ **DATABASE ABSTRACTION - CHƯA TỐT** (Ảnh hưởng ~2-3% điểm)

**Yêu cầu đề bài:**

> "**Thao tác CSDL theo lập trình hướng đối và độc lập CSDL**"

**Hiện trạng:**

- ✅ Dùng Mongoose (ODM) - OK
- ⚠️ Code bị tight coupling với MongoDB
- ❌ Không có abstraction layer

**Cần cải thiện:**

#### 9.1. Repository Pattern

- [ ] Tạo BaseRepository với các method CRUD cơ bản
- [ ] UserRepository, EventRepository, PostRepository extend từ BaseRepository
- [ ] Controllers chỉ gọi Repository, không trực tiếp gọi Model

**Cấu trúc:**

```
backend/
  repositories/
    BaseRepository.js
    UserRepository.js
    EventRepository.js
    PostRepository.js
```

**Code mẫu:**

```javascript
// repositories/BaseRepository.js
class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async findAll(query = {}) {
    return await this.model.find(query);
  }

  async findById(id) {
    return await this.model.findById(id);
  }

  // ... các method khác
}
```

---

## 📊 TỔNG KẾT

### Mức độ ưu tiên thực hiện:

| Priority        | Tính năng                 | Thời gian ước tính | Điểm ảnh hưởng |
| --------------- | ------------------------- | ------------------ | -------------- |
| 🔴 **CRITICAL** | Dashboard (cả 3 vai trò)  | 8-10 giờ           | ~15-20%        |
| 🔴 **CRITICAL** | Web Push Notifications    | 4-6 giờ            | ~5-10%         |
| 🔴 **CRITICAL** | Export Users/Participants | 2-3 giờ            | ~3-5%          |
| 🟡 **HIGH**     | Frontend Validation (Yup) | 3-4 giờ            | ~3-5%          |
| 🟡 **HIGH**     | Filter theo thời gian     | 2-3 giờ            | ~2-3%          |
| 🟡 **HIGH**     | Security enhancements     | 3-4 giờ            | ~3-5%          |
| 🟢 **MEDIUM**   | SEO-friendly URLs         | 2-3 giờ            | ~2-3%          |
| 🟢 **MEDIUM**   | Discussion improvements   | 4-5 giờ            | ~2-3%          |
| 🟢 **MEDIUM**   | Repository Pattern        | 3-4 giờ            | ~2-3%          |

### Khuyến nghị:

1. **Làm ngay (trong 1-2 ngày):**

   - ✅ Dashboard (ưu tiên #1)
   - ✅ Export Users
   - ✅ Frontend Validation

2. **Làm tiếp (2-3 ngày sau):**

   - ✅ Web Push Notifications
   - ✅ Security hardening
   - ✅ Filter theo thời gian

3. **Nếu còn thời gian:**
   - URL routing
   - Discussion enhancements
   - Repository pattern

**Yêu cầu đề bài:**

> "**Viết lại và/hoặc định tuyến URL**"

**Hiện trạng:**

- ⚠️ URL không SEO-friendly (dùng ID MongoDB)
- ⚠️ URL như `/events#674a1b2c3d4e5f6g7h8i9j0k`

**Cần cải thiện:**

#### 7.1. SEO-Friendly URLs với Slug

**Cài đặt:**

```bash
cd backend
npm install slugify
```

**Update Event Model:**

```javascript
// backend/models/Event.js
const slugify = require("slugify");

const eventSchema = new mongoose.Schema({
  // ... existing fields ...

  slug: {
    type: String,
    unique: true,
    index: true,
  },
});

// Auto-generate slug before save
eventSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, {
      lower: true,
      locale: "vi",
      strict: true,
      remove: /[*+~.()'"!:@]/g,
    });

    // Handle duplicate slugs
    const timestamp = Date.now();
    this.slug = `${this.slug}-${timestamp}`;
  }
  next();
});
```

**Update Routes:**

```javascript
// backend/routes/eventRoutes.js

// Giữ route cũ để backward compatibility
router.get("/:id", getEventById);

// Thêm route mới với slug
router.get("/slug/:slug", getEventBySlug);
```

**Add Controller Method:**

```javascript
// backend/controllers/eventController.js

exports.getEventBySlug = async (req, res) => {
  try {
    const event = await Event.findOne({ slug: req.params.slug }).populate(
      "createdBy",
      "username email"
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sự kiện",
      });
    }

    res.json({
      success: true,
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
    });
  }
};
```

**Frontend - Update URLs:**

```jsx
// Thay vì: /events#674a1b2c3d4e5f6g7h8i9j0k
// Dùng: /events/trong-cay-xanh-ha-noi-2025

<Link to={`/events/${event.slug}`}>{event.title}</Link>
```

**Thời gian ước tính:** 2-3 giờ

---

### 8. 🎨 **DISCUSSION CHANNEL - CẢI THIỆN** (Ảnh hưởng ~2-3% điểm)

**Yêu cầu đề bài:**

> "Truy cập kênh trao đổi: Post bài, comment, like trên kênh sự kiện (tương tự wall Facebook), **chỉ sau khi sự kiện được duyệt**"

**Hiện trạng:**

- ✅ Post, comment, like, reply
- ⚠️ Cần kiểm tra rõ flow "sau khi được duyệt"
- ❌ Không có real-time updates
- ❌ Chỉ có plain text editor

**Cần bổ sung:**

#### 8.1. Kiểm tra Event Status

```javascript
// backend/controllers/postController.js

exports.createPost = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Check if event exists and is approved/active
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sự kiện",
      });
    }

    // Check if event is cancelled
    if (event.status === "cancelled") {
      return res.status(403).json({
        success: false,
        message: "Không thể post trên sự kiện đã hủy",
      });
    }

    // Check if user is participant
    const isParticipant = event.participants.some(
      (p) => p.user.toString() === req.user.id && p.status === "approved"
    );

    // Check if user is creator
    const isCreator = event.createdBy.toString() === req.user.id;

    if (!isParticipant && !isCreator && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Chỉ thành viên đã được duyệt mới có thể post",
      });
    }

    // Create post...
  } catch (error) {
    // Handle error
  }
};
```

#### 8.2. Rich Text Editor (Optional)

**Cài đặt:**

```bash
cd frontend
npm install react-quill
```

**Usage:**

```jsx
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const [content, setContent] = useState("");

const modules = {
  toolbar: [
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
};

<ReactQuill
  value={content}
  onChange={setContent}
  modules={modules}
  placeholder="Viết gì đó..."
/>;
```

**Thời gian ước tính:** 3-4 giờ

---

### 9. 🗄️ **DATABASE ABSTRACTION - CẢI THIỆN** (Ảnh hưởng ~2-3% điểm)

**Yêu cầu đề bài:**

> "Thao tác CSDL theo lập trình hướng đối và **độc lập CSDL**"

**Hiện trạng:**

- ✅ Dùng Mongoose (ODM) - đã OK
- ⚠️ Code bị tight coupling với MongoDB
- ❌ Không có abstraction layer

**Cần cải thiện (Optional - nếu còn thời gian):**

#### 9.1. Repository Pattern

**Cấu trúc:**

```
backend/
  repositories/
    BaseRepository.js (TẠO MỚI)
    UserRepository.js (TẠO MỚI)
    EventRepository.js (TẠO MỚI)
    PostRepository.js (TẠO MỚI)
```

**Code mẫu:**

```javascript
// backend/repositories/BaseRepository.js
class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async findAll(query = {}, options = {}) {
    return await this.model
      .find(query)
      .populate(options.populate || "")
      .sort(options.sort || {})
      .limit(options.limit || 0);
  }

  async findById(id, options = {}) {
    return await this.model.findById(id).populate(options.populate || "");
  }

  async create(data) {
    return await this.model.create(data);
  }

  async update(id, data) {
    return await this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return await this.model.findByIdAndDelete(id);
  }

  async count(query = {}) {
    return await this.model.countDocuments(query);
  }
}

module.exports = BaseRepository;
```

```javascript
// backend/repositories/EventRepository.js
const BaseRepository = require("./BaseRepository");
const Event = require("../models/Event");

class EventRepository extends BaseRepository {
  constructor() {
    super(Event);
  }

  async findByCategory(category) {
    return await this.findAll({ category });
  }

  async findUpcoming() {
    return await this.findAll(
      { date: { $gte: new Date() }, status: "upcoming" },
      { sort: { date: 1 } }
    );
  }

  async findTrending(days = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Logic tính trending...
    return await this.model.aggregate([
      // aggregation pipeline
    ]);
  }
}

module.exports = new EventRepository();
```

**Sử dụng trong Controller:**

```javascript
// backend/controllers/eventController.js
const eventRepository = require("../repositories/EventRepository");

exports.getAllEvents = async (req, res) => {
  try {
    const { category } = req.query;

    let events;
    if (category && category !== "all") {
      events = await eventRepository.findByCategory(category);
    } else {
      events = await eventRepository.findAll();
    }

    res.json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
```

**Thời gian ước tính:** 4-5 giờ

---

## 📊 TỔNG KẾT & ƯU TIÊN

### Bảng ưu tiên thực hiện:

| Priority  | Tính năng                               | Thời gian | Điểm ảnh hưởng | Bắt buộc |
| --------- | --------------------------------------- | --------- | -------------- | -------- |
| 🔴 **P0** | **Volunteer Dashboard**                 | 8-10h     | ~8-10%         | ✅ YES   |
| 🔴 **P0** | **Manager Dashboard**                   | 8-10h     | ~8-10%         | ✅ YES   |
| 🔴 **P0** | **Web Push Notifications**              | 5-8h      | ~5-10%         | ✅ YES   |
| 🔴 **P1** | **Lọc theo thời gian**                  | 3h        | ~2-3%          | ✅ YES   |
| 🔴 **P1** | **Export Participants**                 | 2-3h      | ~2-3%          | ✅ YES   |
| 🟡 **P2** | **Validation (Register/Login/Profile)** | 5-7h      | ~3-5%          | ⚠️ NÊN   |
| 🟡 **P2** | **Security (helmet, rate-limit, etc.)** | 3h        | ~3-5%          | ⚠️ NÊN   |
| 🟢 **P3** | **SEO URLs (slug)**                     | 2-3h      | ~2-3%          | ❌ TÙY   |
| 🟢 **P3** | **Discussion improvements**             | 3-4h      | ~2-3%          | ❌ TÙY   |
| 🟢 **P3** | **Repository Pattern**                  | 4-5h      | ~2-3%          | ❌ TÙY   |

---

## 🎯 KHUYẾN NGHỊ THỰC HIỆN

### Tuần 1-2 (CRITICAL - Làm ngay):

1. ✅ **Volunteer Dashboard** (8-10h)
2. ✅ **Manager Dashboard** (8-10h)
3. ✅ **Web Push Notifications** (5-8h)
4. ✅ **Lọc theo thời gian** (3h)
5. ✅ **Export Participants** (2-3h)

**Tổng: 26-34 giờ**

### Tuần 3 (HIGH - Nên làm):

6. ✅ **Validation đầy đủ** (5-7h)
7. ✅ **Security hardening** (3h)

**Tổng: 8-10 giờ**

### Nếu còn thời gian (MEDIUM):

8. ❌ SEO URLs (2-3h)
9. ❌ Discussion improvements (3-4h)
10. ❌ Repository Pattern (4-5h)

**Tổng: 9-12 giờ**

---

## 📈 DỰ KIẾN ĐIỂM SỐ

| Trạng thái            | Điểm dự kiến | Ghi chú                        |
| --------------------- | ------------ | ------------------------------ |
| **Hiện tại**          | ~0.65-0.70   | Thiếu các tính năng quan trọng |
| **Sau P0 (Critical)** | ~0.80-0.85   | Đủ yêu cầu cơ bản              |
| **Sau P0 + P1**       | ~0.82-0.87   | Hoàn thiện tốt                 |
| **Sau P0 + P1 + P2**  | ~0.88-0.92   | Rất tốt                        |
| **Làm tất cả**        | ~0.92-0.95   | Xuất sắc                       |

---

## ⚠️ LƯU Ý QUAN TRỌNG

### Các yêu cầu RÕ RÀNG trong đề bài PHẢI LÀM:

1. ✅ **Dashboard cho CẢ 3 VAI TRÒ** - Đề bài nói rõ
2. ✅ **Web Push API** - Đề bài ghi rõ "Web Push API"
3. ✅ **Lọc theo thời gian/danh mục** - Đề bài yêu cầu
4. ✅ **Validation (Joi/Yup)** - Đề bài chỉ định cụ thể
5. ✅ **Export users & events** - Đề bài yêu cầu

### Những gì ĐÃ TỐT:

- ✅ Backend MVC chuẩn
- ✅ JWT Authentication
- ✅ Kênh trao đổi (post, comment, like)
- ✅ Admin Dashboard đầy đủ
- ✅ Export events & users
- ✅ Responsive design

---

## 🚀 KẾT LUẬN

**Tổng thời gian cần thiết để hoàn thiện:** ~34-44 giờ

**Thứ tự ưu tiên:**

1. Dashboard (P0) - 16-20h
2. Web Push (P0) - 5-8h
3. Time Filter + Export (P1) - 5-6h
4. Validation + Security (P2) - 8-10h
5. Phần còn lại (P3) - Nếu còn thời gian

**Điểm dự kiến sau khi hoàn thiện P0+P1+P2:** ~0.88-0.92 / 1.0

---

_Cập nhật lần cuối: 30/10/2025_
