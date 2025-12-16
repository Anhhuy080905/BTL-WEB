# 🌟 VolunteerHub - Nền tảng quản lý hoạt động tình nguyện

Hệ thống quản lý và kết nối các hoạt động tình nguyện, giúp tổ chức sự kiện và quản lý tình nguyện viên hiệu quả.

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
- 🔑 Cấp quyền chính

- 🎪 Tạo và quản lý sự kiện tình nguyện
- 👥 Đăng ký và check-in tham gia sự kiện
- 💬 Kênh trao đổi và chia sẻ trải nghiệm
- 🔔 Hệ thống thông báo real-time
- 📊 Dashboard thống kê cho từng vai trò v5
- **HTTP Client**: Axios
- **Styling**: Custom CSS
- **Build Tool**: Craco (Create React App Configuration Override)
- **Form Validation**: Yup
- **State Management**: React Hooks (useState, useEffect, useContext)
- \*\*UI Component

**Backend:** Node.js, Express.js, MongoDB, JWT  
**Frontend:** React 17, React Router, Axios  
**Security:** Helmet, bcryptjs, Rate Limiting

```env
PORT=5000
MONGODB_URI=your-mongodb-uri
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
```

Chạy backend:

```bash
npm start
```

### 3. Setup Frontend

```bash
cd frontend
npm install
npm start
```

### 4. Tạo Admi

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
│
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

####� Phân quyền

| Role              | Quyền hạn                               |
| ----------------- | --------------------------------------- |
| **Volunteer**     | Xem sự kiện, đăng ký tham gia, check-in |
| **Event Manager** | Tạo sự kiện, quản lý đăng ký, phê duyệt |
| **Admin**         | Quản lý toàn bộ hệ thống                |

## 📡 API Endpoints

```
POST   /api/auth/register         - Đăng ký
POST   /api/auth/login            - Đăng nhập
GET    /api/events                - Danh sách sự kiện
POST   /api/events                - Tạo sự kiện
GET    /api/events/:id            - Chi tiết sự kiện
POST   /api/events/:id/register   - Đăng ký tham gia
POST   /api/posts                 - Tạo bài viết
GET    /api/notifications         - Xem thông báo
```

# Test security features

.\test-security-demo.ps1

````

### Frontend Testing

```bash
cd frontend
npm test
````

### Manual Testing

Tham khảo file [TESTING_GUIDE.md](backend/TESTING_GUIDE.md) để biết chi tiết về các test case và kịch bản testing.

## 🚀 Deployment

### Deploy Backend

#### Option 1: Heroku

```bash
# Install Heroku CLI
# Login
heroku login

# Create app
heroku create volunteerhub-api

# Set environment variables
heroku config:set JWT_SECRET=your-secret
heroku config:set MONGODB_URI=your-mongodb-uri

# Deploy
git push heroku main
```

#### Option 2: Railway.app

1. Connect GitHub repository
2. Set environment variables trong dashboard
3. Deploy automatically on push

#### Option 3: VPS (Ubuntu)

```bash
# Install Node.js & MongoDB
sudo apt update
sudo apt install nodejs npm mongodb

# Clone & setup
git clone https://github.com/Anhhuy080905/BTL-WEB.git
cd BTL-WEB/backend
npm install

# Use PM2 for process management
npm install -g pm2
pm2 start server.js --name volunteerhub-api
pm2 startup
pm2 save
```

### Deploy Frontend

#### Option 1: Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel --prod
```

#### Option 2: Netlify

```bash
# Build
npm run build

# Deploy build folder qua Netlify dashboard
```

#### Option 3: Static Hosting (Nginx)

```bash
# Build production
npm run build

# Copy build folder to web server
sudo cp -r build/* /var/www/html/
```

### Environment Variables for Production

#### Backend (.env)

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_EXPIRE=7d
FRONTEND_URL=https://your-frontend-domain.com
```

#### Frontend (.env)

```env
REACT_APP_API_URL=https://your-backend-domain.com/api
```

## 🐛 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Failed

**Lỗi**: `MongooseServerSelectionError: connect ECONNREFUSED`

**Giải pháp**:

```bash
# Kiểm tra MongoDB đang chạy
sudo systemctl status mongodb

# Start MongoDB nếu chưa chạy
sudo systemctl start mongodb

# Hoặc sử dụng MongoDB Atlas cloud
# Kiểm tra MONGODB_URI trong .env có đúng không
```

#### 2. CORS Error

**Lỗi**: `Access to XMLHttpRequest blocked by CORS policy`

**Giải pháp**:

- Kiểm tra frontend URL trong backend CORS config
- Đảm bảo `credentials: true` trong Axios config

```javascript
// backend/server.js
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
```

#### 3. JWT Token Invalid

**Lỗi**: `JsonWebTokenError: invalid signature`

**Giải pháp**:

- Clear localStorage trong browser
- Kiểm tra JWT_SECRET trong .env
- Login lại để lấy token mới

#### 4. Port Already in Use

**Lỗi**: `Error: listen EADDRINUSE: address already in use :::5000`

**Giải pháp**:

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
Team

- **Nguyễn Anh Huy** - [@Anhhuy080905](https://github.com/Anhhuy080905)
- **Nguyễn Mạnh Hà** - [@Hardiant2802](https://github.com/Hardiant2802)
- **Đặng Anh Quế** - [@cinnamoll](https://github.com/cinnamoll)

**UET - VNU Hanoi** | **Web Programming 2024.1**

## 📞 Liên hệ

- Email: anhhuy050908@gmail.com
- GitHub: [BTL-WEB](https://github.com/Anhhuy080905/BTL-WEB)

---
⭐ Star repo nếu bạn thấy hữu ích
```
