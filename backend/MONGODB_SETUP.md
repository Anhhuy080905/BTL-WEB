# 🔧 Hướng Dẫn Khắc Phục Lỗi MongoDB

## ❌ Lỗi: "bad auth : authentication failed"

### Nguyên nhân:

Password MongoDB trong file `.env` chưa được thay thế đúng.

### ✅ Cách sửa:

#### Bước 1: Lấy password từ MongoDB Atlas

1. Truy cập: https://cloud.mongodb.com/
2. Đăng nhập vào tài khoản MongoDB Atlas
3. Vào **Database Access** → Tìm user `anhhuy050908_db_user`
4. Copy password (hoặc reset password mới nếu quên)

#### Bước 2: Cập nhật file `.env`

Mở file `backend/.env` và sửa dòng:

**TRƯỚC (SAI):**

```env
MONGODB_URI=mongodb+srv://anhhuy050908_db_user:<db_password>@volunteerhub.aipwx0f.mongodb.net/volunteerhub?retryWrites=true&w=majority
```

**SAU (ĐÚNG):**

```env
MONGODB_URI=mongodb+srv://anhhuy050908_db_user:PASSWORD_THẬT_CỦA_BẠN@volunteerhub.aipwx0f.mongodb.net/volunteerhub?retryWrites=true&w=majority
```

**Ví dụ:**

```env
MONGODB_URI=mongodb+srv://anhhuy050908_db_user:Abc123456@volunteerhub.aipwx0f.mongodb.net/volunteerhub?retryWrites=true&w=majority
```

⚠️ **Lưu ý:** Không có dấu `<` `>` và không có khoảng trắng!

#### Bước 3: Khởi động lại server

```bash
cd backend
node server.js
```

### ✅ Kết quả thành công:

```
Server is running on port 5000
Environment: development
MongoDB Connected: volunteerhub.aipwx0f.mongodb.net
Database: volunteerhub
```

---

## 📋 API Endpoints Đã Tạo

### 🔐 Authentication APIs

#### 1️⃣ Đăng ký

```
POST http://localhost:5000/api/auth/register
```

**Body:**

```json
{
  "fullName": "nguyenvana",
  "username": "Nguyễn Văn A",
  "email": "test@example.com",
  "password": "123456",
  "phone": "0123456789",
  "nationality": "🇻🇳 Tình nguyện viên",
  "birthDate": "2000-01-01",
  "interests": {
    "environment": true,
    "education": true
  }
}
```

#### 2️⃣ Đăng nhập

```
POST http://localhost:5000/api/auth/login
```

**Body:**

```json
{
  "email": "test@example.com",
  "password": "123456"
}
```

#### 3️⃣ Lấy thông tin user

```
GET http://localhost:5000/api/auth/me
Headers: Authorization: Bearer {your_token}
```

---

## 🧪 Test API bằng Frontend

1. Đảm bảo backend đang chạy (port 5000)
2. Đảm bảo frontend đang chạy (port 3000)
3. Truy cập: http://localhost:3000/register
4. Điền form và click "Đăng Ký"
5. Nếu thành công → chuyển về trang chủ và đăng nhập được

---

## 🔑 Thông Tin Quan Trọng

### JWT Secret

File `.env` có JWT_SECRET để mã hóa token. Trong production nên đổi thành chuỗi phức tạp hơn!

```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### Token Expiration

Token hết hạn sau 7 ngày. Có thể thay đổi:

```env
JWT_EXPIRE=7d
```

---

## 🐛 Debug Tips

### Check MongoDB Connection

```bash
# Trong terminal backend
node -e "require('dotenv').config(); console.log(process.env.MONGODB_URI)"
```

### View All Environment Variables

```bash
node -e "require('dotenv').config(); console.log(process.env)"
```

### Test Register API với curl

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "testuser",
    "username": "Test User",
    "email": "test@test.com",
    "password": "123456"
  }'
```

---

## 📞 Liên Hệ Support

Nếu vẫn gặp lỗi, check:

1. MongoDB Atlas có bật **Network Access** cho IP của bạn chưa?
2. User `anhhuy050908_db_user` có quyền **Read/Write** chưa?
3. Database name có đúng là `volunteerhub` không?
