# 🌟 VolunteerHub - Nền tảng quản lý hoạt động tình nguyện

Hệ thống quản lý và kết nối các hoạt động tình nguyện, giúp tổ chức sự kiện và quản lý tình nguyện viên hiệu quả.

## 📋 Mục lục

- [Tổng quan](#-tổng-quan)
- [Tính năng](#-tính-năng)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Cài đặt](#-cài-đặt)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [API Documentation](#-api-documentation)
- [Phân quyền](#-phân-quyền)

## 🎯 Tổng quan

VolunteerHub là một ứng dụng web full-stack giúp:

- 🎪 Tổ chức và quản lý các sự kiện tình nguyện
- 👥 Kết nối tình nguyện viên với các hoạt động phù hợp
- 📊 Theo dõi và quản lý đăng ký tham gia
- 💬 Trao đổi và chia sẻ trải nghiệm
- 🏆 Ghi nhận đóng góp của tình nguyện viên

## ✨ Tính năng

### Cho Tình nguyện viên (Volunteer)

- ✅ Đăng ký tài khoản và quản lý thông tin cá nhân
- 🔍 Tìm kiếm và xem chi tiết các sự kiện
- 📝 Đăng ký tham gia sự kiện
- ✔️ Check-in tại sự kiện
- 💬 Tham gia kênh trao đổi của sự kiện
- 📱 Xem lịch sử tham gia và chứng chỉ

### Cho Người quản lý sự kiện (Event Manager)

- ➕ Tạo và quản lý sự kiện
- 👥 Quản lý danh sách đăng ký (phê duyệt/từ chối)
- 📋 Theo dõi trạng thái tham gia (pending, approved, checked-in, completed)
- 📊 Xem thống kê sự kiện
- 🖨️ In danh sách tham gia
- ✅ Đánh dấu hoàn thành cho tình nguyện viên

### Cho Quản trị viên (Admin)

- 👑 Quản lý tất cả người dùng
- 🔑 Cấp quyền event_manager
- 📈 Xem thống kê tổng quan hệ thống
- 🗑️ Xóa sự kiện, người dùng

### Tính năng chung

- 🔔 Hệ thống thông báo real-time
- 💬 Kênh trao đổi theo sự kiện (Discussion Channel)
- 📰 Bảng tin chia sẻ (Facebook-style feed)
- 🎨 Giao diện responsive, thân thiện
- 🔐 Xác thực JWT và phân quyền

## 🛠️ Công nghệ sử dụng

### Backend

- **Runtime**: Node.js v18+
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Token)
- **Password Hashing**: bcryptjs
- **Validation**: validator.js
- **CORS**: cors middleware

### Frontend

- **Framework**: React 17
- **Routing**: React Router DOM v5
- **HTTP Client**: Axios
- **Styling**: Custom CSS
- **Build Tool**: Craco (Create React App Configuration Override)
- **Form Validation**: Yup

## 🚀 Cài đặt

### Yêu cầu hệ thống

- Node.js >= 18.x
- MongoDB >= 4.x
- npm hoặc yarn

### 1. Clone repository

```bash
git clone https://github.com/Anhhuy080905/BTL-WEB.git
cd BTL-WEB
```

### 2. Cài đặt Backend

```bash
cd backend
npm install
```

#### Cấu hình môi trường Backend

Tạo file `.env` trong thư mục `backend/`:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/volunteerhub
# hoặc sử dụng MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/volunteerhub

# JWT Secret
JWT_SECRET=your_very_secure_jwt_secret_key_here

# Server Port
PORT=5000
```

#### Chạy Backend

```bash
# Development mode (với nodemon - tự động restart khi code thay đổi)
npm run dev

# Production mode
npm start
```

Backend sẽ chạy tại: **http://localhost:5000**

### 3. Cài đặt Frontend

```bash
cd ../frontend
npm install
```

#### Cấu hình API endpoint Frontend

Kiểm tra file `frontend/src/services/api.js` để đảm bảo API URL đúng:

```javascript
const API_URL = "http://localhost:5000/api";
```

#### Chạy Frontend

```bash
npm start
```

Frontend sẽ chạy tại: **http://localhost:3000**

### 4. Tạo tài khoản Admin đầu tiên

```bash
cd backend
node scripts/createAdmin.js
```

Làm theo hướng dẫn để tạo tài khoản admin.

## 📁 Cấu trúc dự án

```
BTL-WEB/
├── backend/
│   ├── config/
│   │   └── database.js          # Cấu hình kết nối MongoDB
│   ├── controllers/
│   │   ├── authController.js    # Xử lý đăng ký/đăng nhập
│   │   ├── eventController.js   # Quản lý sự kiện
│   │   ├── postController.js    # Quản lý bài viết
│   │   ├── userController.js    # Quản lý người dùng
│   │   └── notificationController.js # Quản lý thông báo
│   ├── middleware/
│   │   └── auth.js              # Middleware xác thực JWT
│   ├── models/
│   │   ├── User.js              # Schema người dùng
│   │   ├── Event.js             # Schema sự kiện
│   │   ├── Post.js              # Schema bài viết
│   │   └── Notification.js      # Schema thông báo
│   ├── routes/
│   │   ├── authRoutes.js        # Routes xác thực
│   │   ├── eventRoutes.js       # Routes sự kiện
│   │   ├── postRoutes.js        # Routes bài viết
│   │   ├── userRoutes.js        # Routes người dùng
│   │   └── notificationRoutes.js # Routes thông báo
│   ├── scripts/
│   │   └── createAdmin.js       # Script tạo admin
│   ├── .env                     # Biến môi trường (không commit)
│   ├── package.json
│   ├── README.md
│   └── server.js                # Entry point
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── navigation.jsx        # Header navigation
│   │   │   ├── footer.jsx            # Footer
│   │   │   ├── user-dropdown.jsx     # User menu dropdown
│   │   │   ├── notification-bell.jsx # Notification icon
│   │   │   └── EventCard.jsx         # Card hiển thị sự kiện
│   │   ├── services/
│   │   │   ├── api.js                # Axios config
│   │   │   ├── eventsService.js      # API calls cho events
│   │   │   ├── postsService.js       # API calls cho posts
│   │   │   ├── notificationService.js # API calls cho notifications
│   │   │   └── adminService.js       # API calls cho admin
│   │   ├── views/
│   │   │   ├── home.jsx              # Trang chủ
│   │   │   ├── login.jsx             # Đăng nhập
│   │   │   ├── register.jsx          # Đăng ký
│   │   │   ├── events.jsx            # Danh sách sự kiện
│   │   │   ├── my-events.jsx         # Sự kiện của tôi
│   │   │   ├── event-management.jsx  # Quản lý sự kiện (manager)
│   │   │   ├── discussion-channel.jsx # Kênh trao đổi sự kiện
│   │   │   ├── discussion-list-fb.jsx # Bảng tin chung
│   │   │   ├── profile.jsx           # Trang cá nhân
│   │   │   ├── admin-dashboard.jsx   # Dashboard admin
│   │   │   ├── about.jsx             # Về chúng tôi
│   │   │   └── not-found.jsx         # 404 page
│   │   ├── index.js              # Entry point & Router setup
│   │   └── style.css             # Global styles
│   ├── craco.config.js
│   └── package.json
│
└── README.md                     # File này
```

## 📡 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication Endpoints

#### POST `/auth/register`

Đăng ký tài khoản mới

**Request Body:**

```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "fullName": "string",
  "phone": "string"
}
```

#### POST `/auth/login`

Đăng nhập

**Request Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**

```json
{
  "token": "jwt_token",
  "user": {
    "_id": "string",
    "username": "string",
    "email": "string",
    "role": "volunteer|event_manager|admin",
    "fullName": "string"
  }
}
```

### Event Endpoints

#### GET `/events`

Lấy danh sách tất cả sự kiện (public)

#### GET `/events/my-events`

Lấy danh sách sự kiện đã đăng ký (authenticated)

**Headers:**

```
Authorization: Bearer <token>
```

#### GET `/events/:id`

Lấy chi tiết sự kiện

#### POST `/events`

Tạo sự kiện mới (event_manager, admin)

**Request Body:**

```json
{
  "title": "string",
  "description": "string",
  "date": "ISO8601 date",
  "location": "string",
  "category": "string",
  "maxParticipants": "number",
  "requirements": ["string"],
  "benefits": ["string"],
  "duration": "string"
}
```

#### PUT `/events/:id`

Cập nhật sự kiện (creator only)

#### DELETE `/events/:id`

Xóa sự kiện (creator, admin)

#### POST `/events/:id/register`

Đăng ký tham gia sự kiện (volunteer)

#### POST `/events/:id/registrations/:registrationId/approve`

Phê duyệt đăng ký (event manager)

#### POST `/events/:id/registrations/:registrationId/reject`

Từ chối đăng ký (event manager)

#### POST `/events/:id/registrations/:registrationId/checkin`

Check-in cho người tham gia (event manager)

#### POST `/events/:id/complete`

Đánh dấu hoàn thành cho tất cả (event manager)

### User Endpoints

#### GET `/users/profile`

Lấy thông tin profile (authenticated)

#### PUT `/users/profile`

Cập nhật profile (authenticated)

#### GET `/users` (admin only)

Lấy danh sách tất cả users

#### POST `/users/:id/make-manager` (admin only)

Cấp quyền event_manager

### Post Endpoints

#### GET `/posts`

Lấy tất cả posts

#### GET `/posts/event/:eventId`

Lấy posts của 1 sự kiện

#### POST `/posts`

Tạo post mới

**Request Body:**

```json
{
  "eventId": "string",
  "content": "string"
}
```

#### POST `/posts/:id/like`

Like/Unlike post

#### POST `/posts/:id/comment`

Thêm comment

**Request Body:**

```json
{
  "content": "string"
}
```

#### DELETE `/posts/:id`

Xóa post (owner, admin)

### Notification Endpoints

#### GET `/notifications`

Lấy danh sách thông báo (authenticated)

#### PUT `/notifications/:id/read`

Đánh dấu đã đọc

#### PUT `/notifications/read-all`

Đánh dấu tất cả đã đọc

## 👥 Phân quyền

### Roles

| Role              | Quyền hạn                                                                                                                                                        |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **volunteer**     | - Xem sự kiện<br>- Đăng ký tham gia<br>- Check-in<br>- Tham gia discussion<br>- Tạo post                                                                         |
| **event_manager** | - Tất cả quyền của volunteer<br>- Tạo sự kiện<br>- Quản lý sự kiện của mình<br>- Phê duyệt/từ chối đăng ký<br>- Check-in người tham gia<br>- Đánh dấu hoàn thành |
| **admin**         | - Tất cả quyền của event_manager<br>- Xem tất cả users<br>- Cấp quyền event_manager<br>- Xóa bất kỳ sự kiện/user nào                                             |

### Authorization Flow

1. User đăng nhập → Nhận JWT token
2. Client gửi request với header: `Authorization: Bearer <token>`
3. Backend verify token và kiểm tra quyền
4. Nếu hợp lệ → Xử lý request
5. Nếu không hợp lệ → Return 401 Unauthorized hoặc 403 Forbidden

## 🔒 Bảo mật

- ✅ Password được hash bằng bcryptjs (10 rounds)
- ✅ JWT token cho authentication
- ✅ CORS được cấu hình chặt chẽ
- ✅ Input validation trên cả frontend và backend
- ✅ Protected routes yêu cầu authentication
- ✅ Role-based access control (RBAC)

## 🤝 Đóng góp

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📝 License

Dự án này thuộc về nhóm BTL WEB - Trường Đại học Bách Khoa Hà Nội.

## 👨‍💻 Nhóm phát triển

- **Nguyễn Anh Huy** - [@Anhhuy080905](https://github.com/Anhhuy080905)

## 📞 Liên hệ

- Email: anhhuy050908@gmail.com
- Repository: [https://github.com/Anhhuy080905/BTL-WEB](https://github.com/Anhhuy080905/BTL-WEB)

---

⭐ Nếu bạn thấy dự án hữu ích, hãy cho chúng tôi một star trên GitHub!
