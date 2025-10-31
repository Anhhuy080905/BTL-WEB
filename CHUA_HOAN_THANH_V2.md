    # 📋 DANH SÁCH CHỨC NĂNG CHƯA HOÀN THÀNH

    ## Dự án: VolunteerHub - INT3306 Fall 2025

    **Ngày cập nhật:** 30/10/2025

    ---

    ## ✅ **ĐÃ HOÀN THÀNH TỐT**

    ### Backend MVC

    - ✅ Models: User, Event, Post, Notification
    - ✅ Controllers đầy đủ
    - ✅ Routes đầy đủ
    - ✅ Middleware: JWT auth, role-based access
    - ✅ Mongoose ODM

    ### Chức năng đã có

    - ✅ Đăng ký/Đăng nhập
    - ✅ Xem/Lọc/Search sự kiện
    - ✅ Đăng ký/Hủy sự kiện
    - ✅ Xem lịch sử tham gia
    - ✅ In-app notifications
    - ✅ Quản lý sự kiện (CRUD)
    - ✅ Xác nhận đăng ký, đánh dấu hoàn thành
    - ✅ Kênh trao đổi (post, comment, like, reply)
    - ✅ Admin Dashboard
    - ✅ Quản lý users (khóa/mở)
    - ✅ Export events & users (CSV/JSON)
    - ✅ Validation Yup trong event-management
    - ✅ JWT + bcrypt
    - ✅ Responsive design

    ---

    ## 🔴 **THIẾU NGHIÊM TRỌNG (BẮT BUỘC - 20-35% điểm)**

    ### 1. ❌ **DASHBOARD CHO VOLUNTEER & EVENT MANAGER** (~15-20% điểm)

    **Yêu cầu đề bài:**

    > "**Xem Dashboard**: Xem tổng hợp sự kiện liên quan (mới công bố, có tin bài mới), sự kiện thu hút (tăng thành viên/trao đổi/like nhanh)" - **CHO CẢ 3 VAI TRÒ**

    **Hiện trạng:**

    - ✅ Có Admin Dashboard
    - ❌ **THIẾU** Volunteer Dashboard
    - ❌ **THIẾU** Manager Dashboard

    **Files cần tạo:**

    - `frontend/src/views/volunteer-dashboard.jsx`
    - `frontend/src/views/volunteer-dashboard.css`
    - `frontend/src/views/manager-dashboard.jsx`
    - `frontend/src/views/manager-dashboard.css`
    - `backend/controllers/dashboardController.js`
    - `backend/routes/dashboardRoutes.js`
    - `frontend/src/services/dashboardService.js`
    - Components: `StatCard.jsx`, `TrendingEventCard.jsx`, `ActivityFeed.jsx`

    **Nội dung Volunteer Dashboard:**

    - [ ] Sự kiện mới công bố (7 ngày)
    - [ ] Sự kiện có tin bài mới (24h)
    - [ ] Sự kiện trending
    - [ ] Sự kiện hot (nhiều like/comment)
    - [ ] Gợi ý theo interests
    - [ ] Thống kê cá nhân

    **Nội dung Manager Dashboard:**

    - [ ] Tổng quan sự kiện quản lý
    - [ ] Đăng ký chờ duyệt
    - [ ] Engagement metrics
    - [ ] Sự kiện hot nhất
    - [ ] Alerts (sắp diễn ra, cần duyệt)

    **API cần thêm:**

    - `GET /api/dashboard/volunteer`
    - `GET /api/dashboard/manager`
    - `GET /api/dashboard/trending-events`
    - `GET /api/dashboard/hot-events`

    **Thời gian:** 14-18 giờ

    ---

    ### 2. ❌ **WEB PUSH NOTIFICATIONS** (~5-10% điểm)

    **Yêu cầu đề bài:**

    > "Nhận thông báo **(Web Push API)**" - **YÊU CẦU RÕ RÀNG**

    **Hiện trạng:**

    - ✅ Có in-app notifications
    - ❌ **KHÔNG CÓ** Web Push API

    **Files cần tạo:**

    - `frontend/public/service-worker.js`
    - `frontend/src/utils/pushNotification.js`
    - `backend/utils/pushNotification.js`

    **Packages cần cài:**

    - `npm install web-push` (backend)
    - Generate VAPID keys

    **API cần thêm:**

    - `POST /api/notifications/subscribe`
    - `DELETE /api/notifications/unsubscribe`
    - Update User model: thêm `pushSubscription` field

    **Trigger push khi:**

    - Đăng ký được duyệt/từ chối
    - Hoàn thành sự kiện
    - Comment/reply mới
    - Sự kiện sắp diễn ra

    **Thời gian:** 5-8 giờ

    ---

    ### 3. ❌ **LỌC THEO THỜI GIAN** (~2-3% điểm)

    **Yêu cầu đề bài:**

    > "**Lọc theo thời gian/danh mục**" - **YÊU CẦU RÕ RÀNG**

    **Hiện trạng:**

    - ✅ Có lọc category
    - ❌ **THIẾU** lọc thời gian

    **Cần thêm:**

    - Backend: Query params `timeRange`, `startDate`, `endDate`
    - Package: `npm install moment`
    - Frontend: Dropdown filter (Hôm nay, Tuần này, Tháng này, Quý này, Tùy chỉnh)
    - Custom date range picker

    **Thời gian:** 2-3 giờ

    ---

    ### 4. ❌ **EXPORT PARTICIPANTS theo Event** (~2-3% điểm)

    **Hiện trạng:**

    - ✅ Có export events
    - ✅ Có export users
    - ❌ **THIẾU** export participants theo từng event

    **Cần thêm:**

    - `GET /api/events/:id/participants/export?format=csv|json`
    - Button trong event-management
    - Service method trong eventsService

    **Thời gian:** 2-3 giờ

    ---

    ## 🟡 **NÊN CẢI THIỆN (Priority High - 8-13% điểm)**

    ### 5. ⚠️ **VALIDATION CHƯA ĐẦY ĐỦ** (~3-5% điểm)

    **Hiện trạng:**

    - ✅ Có validation trong event-management
    - ❌ **THIẾU** trong register.jsx, login.jsx, profile.jsx
    - ❌ **THIẾU** auto-fill/suggestions

    **Cần thêm:**

    - Files: `validation/authSchema.js`, `validation/profileSchema.js`
    - Validation cho Register, Login, Profile forms
    - Auto-complete địa điểm
    - Gợi ý tên tổ chức
    - Auto-format số điện thoại

    **Thời gian:** 5-7 giờ

    ---

    ### 6. ⚠️ **SECURITY** (~3-5% điểm)

    **Hiện trạng:**

    - ✅ JWT, bcrypt, role-based
    - ❌ **THIẾU** nhiều tính năng bảo mật

    **Packages cần cài:**

    ```bash
    npm install helmet express-rate-limit express-mongo-sanitize xss-clean hpp
    ```

    **Cần thêm:**

    - [ ] Rate limiting (login: 5/15min, register: 3/1h, API: 100/15min)
    - [ ] Security headers (helmet)
    - [ ] Input sanitization (mongo-sanitize, xss-clean)
    - [ ] CORS config đúng
    - [ ] HTTP Parameter Pollution

    **Thời gian:** 3 giờ

    ---

    ## 🟢 **CẢI THIỆN TỐT HƠN (Priority Medium - 6-9% điểm)**

    ### 7. 📝 **SEO-FRIENDLY URLs** (~2-3% điểm)

    **Hiện trạng:**

    - URL: `/events#674a1b2c3d4e5f6g7h8i9j0k`

    **Cần cải thiện:**

    - Package: `npm install slugify`
    - Thêm `slug` field vào Event model
    - URL: `/events/trong-cay-xanh-ha-noi-2025`
    - Route: `GET /events/slug/:slug`

    **Thời gian:** 2-3 giờ

    ---

    ### 8. 🎨 **DISCUSSION IMPROVEMENTS** (~2-3% điểm)

    **Cần kiểm tra:**

    - [ ] Chỉ cho phép post sau khi event approved
    - [ ] Kiểm tra user là participant/creator

    **Optional (nâng cao):**

    - [ ] Real-time với Socket.io
    - [ ] Rich text editor (react-quill)
    - [ ] Image upload

    **Thời gian:** 3-4 giờ

    ---

    ### 9. 🗄️ **REPOSITORY PATTERN** (~2-3% điểm)

    **Cần thêm:**

    - `repositories/BaseRepository.js`
    - `repositories/UserRepository.js`
    - `repositories/EventRepository.js`
    - `repositories/PostRepository.js`

    **Thời gian:** 4-5 giờ

    ---

    ## 📊 **TỔNG KẾT**

    ### Bảng ưu tiên:

    | Priority  | Tính năng                     | Thời gian | Điểm    |
    | --------- | ----------------------------- | --------- | ------- |
    | 🔴 **P0** | Volunteer + Manager Dashboard | 14-18h    | ~15-20% |
    | 🔴 **P0** | Web Push Notifications        | 5-8h      | ~5-10%  |
    | 🔴 **P1** | Lọc thời gian                 | 2-3h      | ~2-3%   |
    | 🔴 **P1** | Export Participants           | 2-3h      | ~2-3%   |
    | 🟡 **P2** | Validation đầy đủ             | 5-7h      | ~3-5%   |
    | 🟡 **P2** | Security                      | 3h        | ~3-5%   |
    | 🟢 **P3** | SEO URLs                      | 2-3h      | ~2-3%   |
    | 🟢 **P3** | Discussion                    | 3-4h      | ~2-3%   |
    | 🟢 **P3** | Repository                    | 4-5h      | ~2-3%   |

    ### Khuyến nghị thực hiện:

    **Tuần 1 (CRITICAL):**

    1. Dashboard (P0) - 14-18h
    2. Web Push (P0) - 5-8h
    3. Time Filter (P1) - 2-3h
    4. Export Participants (P1) - 2-3h

    **Tổng: 23-32 giờ**

    **Tuần 2 (HIGH):** 5. Validation - 5-7h 6. Security - 3h

    **Tổng: 8-10 giờ**

    **Nếu còn thời gian (MEDIUM):** 7. SEO URLs - 2-3h 8. Discussion - 3-4h 9. Repository - 4-5h

    ---

    ## 📈 **DỰ KIẾN ĐIỂM**

    | Trạng thái       | Điểm       |
    | ---------------- | ---------- |
    | **Hiện tại**     | ~0.65-0.70 |
    | **Sau P0+P1**    | ~0.80-0.85 |
    | **Sau P0+P1+P2** | ~0.88-0.92 |
    | **Làm tất cả**   | ~0.92-0.95 |

    ---

    ## ⚠️ **YÊU CẦU RÕ RÀNG TRONG ĐỀ BÀI**

    **BẮT BUỘC PHẢI LÀM:**

    1. ✅ Dashboard cho CẢ 3 VAI TRÒ
    2. ✅ Web Push API
    3. ✅ Lọc theo thời gian/danh mục
    4. ✅ Validation (Joi/Yup)
    5. ✅ Export users & events

    **ĐÃ CÓ:**

    - ✅ MVC pattern
    - ✅ JWT Authentication
    - ✅ Kênh trao đổi
    - ✅ Export (partial)
    - ✅ Validation (partial)

    **THIẾU:**

    - ❌ Dashboard (volunteer + manager)
    - ❌ Web Push
    - ❌ Lọc thời gian
    - ❌ Export participants theo event

    ---

    _Cập nhật: 30/10/2025_
