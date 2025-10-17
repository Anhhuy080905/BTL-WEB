# XÓA CÁC TÀI KHOẢN CÓ VAI TRÒ CŨ

## CÁCH 1: Dùng MongoDB Compass (KHUYẾN NGHỊ)

### Bước 1: Mở MongoDB Compass

- Kết nối tới database `volunteerhub`
- Chọn collection `users`

### Bước 2: Chạy Filter Query

Vào tab Filter và paste query này:

```json
{
  "role": {
    "$in": ["USER", "ORGANIZER", "user", "organizer"]
  }
}
```

Nhấn `Find` để xem danh sách users sẽ bị xóa.

### Bước 3: Xóa Users

- Nhấn vào icon 🗑️ (Delete) bên cạnh mỗi user
- HOẶC chọn nhiều users và xóa hàng loạt
- HOẶC dùng tab "Delete" với filter trên

---

## CÁCH 2: Chạy Script Node.js

### Trong terminal, chạy:

```bash
cd backend
node scripts/cleanOldRoles.js
```

Script sẽ:

1. Tìm tất cả users có role cũ (USER, ORGANIZER)
2. Hiển thị danh sách
3. Xóa tất cả
4. Hiển thị users còn lại

---

## CÁCH 3: MongoDB Shell

### Nếu bạn có MongoDB Shell:

```javascript
// Kết nối database
use volunteerhub

// Xem users có role cũ
db.users.find({
  role: { $in: ["USER", "ORGANIZER", "user", "organizer"] }
})

// Xóa users có role cũ
db.users.deleteMany({
  role: { $in: ["USER", "ORGANIZER", "user", "organizer"] }
})

// Kiểm tra users còn lại
db.users.find({}, { username: 1, email: 1, role: 1 })
```

---

## CÁCH 4: Temporary API Endpoint

### Tạo endpoint tạm để xóa (chạy 1 lần)

Thêm vào `server.js`:

```javascript
// TEMPORARY - Delete old role users
app.get("/api/cleanup-old-roles", async (req, res) => {
  try {
    const User = require("./models/User");

    const result = await User.deleteMany({
      role: { $in: ["USER", "ORGANIZER", "user", "organizer"] },
    });

    const remaining = await User.find().select("username email role");

    res.json({
      success: true,
      deleted: result.deletedCount,
      remaining: remaining,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

Sau đó vào browser:

```
http://localhost:5000/api/cleanup-old-roles
```

**⚠️ NHỚ XÓA ENDPOINT NÀY SAU KHI DÙNG!**

---

## ✅ VAI TRÒ HỢP LỆ TRONG HỆ THỐNG MỚI:

- `volunteer` - Tình nguyện viên
- `event_manager` - Quản lý sự kiện
- `admin` - Quản trị viên

## ✅ TÀI KHOẢN ADMIN HIỆN TẠI:

Email: `anhhuy050908@gmail.com`
Username: `huy321`
Role: `admin` ✓
