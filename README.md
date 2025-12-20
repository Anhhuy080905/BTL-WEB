# 🌟 VolunteerHub

Nền tảng quản lý và kết nối các hoạt động tình nguyện.

## ✨ Tính năng chính

- 🔐 Xác thực và phân quyền (Volunteer, Event Manager, Admin)
- 🎪 Quản lý sự kiện tình nguyện
- 👥 Đăng ký và phê duyệt tham gia
- 💬 Kênh thảo luận
- 🔔 Thông báo realtime
- 📊 Dashboard và báo cáo thống kê

## 💻 Công nghệ

**Backend:** Node.js, Express.js, MongoDB, JWT  
**Frontend:** React, React Router, Axios

## 🚀 Cài đặt

### 1. Clone repository

```bash
git clone https://github.com/Anhhuy080905/BTL-WEB.git
cd BTL-WEB
```

### 2. Backend

```bash
cd backend
npm install
```

Tạo file `.env`:

```env
PORT=5000
MONGODB_URI=your-mongodb-uri
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
```

Chạy server:

```bash
npm start
```

### 3. Frontend

```bash
cd frontend
npm install
npm start
```

### 4. Tạo Admin

```bash
cd backend
node scripts/createAdmin.js
```

## 📡 API Endpoints

```
POST   /api/auth/register         - Đăng ký
POST   /api/auth/login            - Đăng nhập
GET    /api/events                - Danh sách sự kiện
POST   /api/events                - Tạo sự kiện
POST   /api/events/:id/register   - Đăng ký tham gia
GET    /api/posts                 - Bài viết
GET    /api/notifications         - Thông báo
```

## 👥 Team

- **Nguyễn Anh Huy** - [@Anhhuy080905](https://github.com/Anhhuy080905)
- **Nguyễn Mạnh Hà** - [@Hardiant2802](https://github.com/Hardiant2802)
- **Đặng Anh Quế** - [@cinnamoll](https://github.com/cinnamoll)

**UET - VNU Hanoi** | **Web Programming 2024.1**

## 📞 Liên hệ

- Email: anhhuy050908@gmail.com
- GitHub: [BTL-WEB](https://github.com/Anhhuy080905/BTL-WEB)

---

⭐ Star repo nếu bạn thấy hữu ích
