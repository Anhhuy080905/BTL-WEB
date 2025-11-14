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
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb+srv://anhhuy050908_db_user:Huydz123@volunteerhub.aipwx0f.mongodb.net/volunteerhub?retryWrites=true&w=majority

# JWT Secret (thay đổi thành chuỗi bí mật của bạn)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

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

## 📡 Các chức năng API

### Địa chỉ API

```
http://localhost:5000/api
```

### 🔐 Xác thực tài khoản

#### Đăng ký tài khoản mới → `/api/auth/register`

Tạo tài khoản mới cho người dùng

**Thông tin cần cung cấp:**

```json
{
  "username": "Tên đăng nhập",
  "email": "Email của bạn",
  "password": "Mật khẩu",
  "fullName": "Họ và tên đầy đủ",
  "phone": "Số điện thoại"
}
```

#### Đăng nhập → `/api/auth/login`

Đăng nhập vào hệ thống

**Thông tin cần cung cấp:**

```json
{
  "email": "Email của bạn",
  "password": "Mật khẩu"
}
```

**Hệ thống trả về:**

```json
{
  "token": "Mã xác thực để sử dụng các chức năng khác",
  "user": {
    "_id": "ID người dùng",
    "username": "Tên đăng nhập",
    "email": "Email",
    "role": "Vai trò (volunteer/event_manager/",
    "fullName": "Họ và tên"
  }
}
```

### 🎪 Quản lý Sự kiện

#### Xem tất cả sự kiện → `/api/events` (xem danh sách)

Xem danh sách tất cả các sự kiện (không cần đăng nhập)

#### Xem sự kiện đã đăng ký → `/api/events/my-events` (xem danh sách)

Xem các sự kiện mình đã đăng ký (cần đăng nhập)

#### Xem chi tiết sự kiện → `/api/events/:id` (xem chi tiết)

Xem thông tin chi tiết của một sự kiện cụ thể

#### Tạo sự kiện mới → `/api/events` (gửi dữ liệu tạo mới)

Tạo sự kiện mới (chỉ dành cho event_manager và admin)

**Thông tin cần cung cấp:**

```json
{
  "title": "Tên sự kiện",
  "description": "Mô tả chi tiết",
  "date": "Ngày tổ chức",
  "location": "Địa điểm",
  "category": "Lĩnh vực",
  "maxParticipants": "Số người tối đa",
  "requirements": ["Yêu cầu 1", "Yêu cầu 2"],
  "benefits": ["Quyền lợi 1", "Quyền lợi 2"],
  "duration": "Thời lượng"
}
```

#### Cập nhật sự kiện → `/api/events/:id` (gửi dữ liệu cập nhật)

Chỉnh sửa thông tin sự kiện (chỉ người tạo mới được sửa)

#### Xóa sự kiện → `/api/events/:id` (yêu cầu xóa)

Xóa sự kiện (người tạo hoặc admin)

#### Đăng ký tham gia → `/api/events/:id/register` (gửi đơn đăng ký)

Đăng ký tham gia một sự kiện (dành cho tình nguyện viên)

#### Phê duyệt đăng ký → `/api/events/:id/registrations/:registrationId/approve` (xác nhận duyệt)

Chấp nhận đơn đăng ký (dành cho người quản lý sự kiện)

#### Từ chối đăng ký → `/api/events/:id/registrations/:registrationId/reject` (xác nhận từ chối)

Từ chối đơn đăng ký (dành cho người quản lý sự kiện)

#### Check-in người tham gia → `/api/events/:id/registrations/:registrationId/checkin` (xác nhận điểm danh)

Điểm danh người tham gia tại sự kiện (dành cho người quản lý)

#### Đánh dấu hoàn thành → `/api/events/:id/complete` (xác nhận hoàn thành)

Đánh dấu tất cả người tham gia đã hoàn thành sự kiện

### 👤 Quản lý Người dùng

#### Xem thông tin cá nhân → `/api/users/profile` (xem thông tin)

Xem thông tin profile của bản thân

#### Cập nhật thông tin → `/api/users/profile` (gửi dữ liệu cập nhật)

Chỉnh sửa thông tin cá nhân

#### Xem danh sách người dùng → `/api/users` (xem danh sách - chỉ admin)

Xem tất cả người dùng (chỉ admin)

#### Cấp quyền quản lý → `/api/users/:id/make-manager` (xác nhận cấp quyền - chỉ admin)

Nâng cấp người dùng lên event_manager (chỉ admin)

### 💬 Bài viết và Trao đổi

#### Xem tất cả bài viết → `/api/posts` (xem danh sách)

Xem toàn bộ bài viết trong hệ thống

#### Xem bài viết theo sự kiện → `/api/posts/event/:eventId` (xem danh sách)

Xem các bài viết của một sự kiện cụ thể

#### Tạo bài viết mới → `/api/posts` (gửi dữ liệu tạo mới)

Đăng bài viết mới

**Thông tin cần cung cấp:**

```json
{
  "eventId": "ID sự kiện",
  "content": "Nội dung bài viết"
}
```

#### Thích/Bỏ thích → `/api/posts/:id/like` (bật/tắt like)

Bày tỏ cảm xúc với bài viết

#### Bình luận → `/api/posts/:id/comment` (gửi bình luận mới)

**Thông tin cần cung cấp:**

```json
{
  "content": "Nội dung bình luận"
}
```

#### Xóa bài viết → `/api/posts/:id` (yêu cầu xóa)

Xóa bài viết (chủ bài hoặc admin)

### 🔔 Thông báo

#### Xem thông báo → `/api/notifications` (xem danh sách)

Xem danh sách thông báo của bạn

#### Đánh dấu đã đọc → `/api/notifications/:id/read` (cập nhật trạng thái)

Đánh dấu một thông báo đã đọc

#### Đánh dấu tất cả đã đọc → `/api/notifications/read-all` (cập nhật trạng thái)

Đánh dấu tất cả thông báo đã đọc

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

Dự án này thuộc về nhóm BTL WEB - Trường Đại học Công Nghệ - Đại Học Quốc Gia Hà Nội.

## 👨‍💻 Nhóm phát triển

- **Nguyễn Anh Huy** - [@Anhhuy080905](https://github.com/Anhhuy080905)
- **Nguyễn Mạnh Hà** - [@Hardiant2802](https://github.com/Hardiant2802)
- **Đặng Anh Quế** - [@cinnamoll](https://github.com/cinnamoll)

## 📞 Liên hệ

- Email: anhhuy050908@gmail.com
- Repository: [https://github.com/Anhhuy080905/BTL-WEB](https://github.com/Anhhuy080905/BTL-WEB)

---

⭐ Nếu bạn thấy dự án hữu ích, hãy cho chúng tôi một star trên GitHub!
