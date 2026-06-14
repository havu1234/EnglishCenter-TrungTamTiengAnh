# 🎓 HỆ THỐNG QUẢN LÝ TRUNG TÂM ANH NGỮ
## Đề Tài Thực Tập - Phiên Bản Đơn Giản

---

## 📋 THÔNG TIN DỰ ÁN

**Tên dự án:** Hệ Thống Quản Lý Học Viên Trung Tâm Anh Ngữ  
**Công nghệ:** Node.js + Express + MongoDB + HTML/CSS/JavaScript  
**Mục đích:** Đề tài thực tập tốt nghiệp  
**Phiên bản:** 1.0.0 (Simple Version)

---

## ✅ TÍNH NĂNG ĐÃ HOÀN THÀNH

### 1. 🔐 Xác Thực & Phân Quyền
- ✅ Đăng nhập với JWT
- ✅ Mã hóa mật khẩu (bcrypt)
- ✅ Khóa tài khoản sau 5 lần sai
- ✅ 4 vai trò: Admin, Giáo viên, Lễ tân, Kế toán
- ✅ Giao diện đăng nhập đẹp

### 2. 📊 Dashboard
- ✅ Trang tổng quan
- ✅ Thống kê cơ bản
- ✅ Menu điều hướng
- ✅ Responsive design

### 3. 👥 Quản Lý Học Viên (Cơ bản)
- ✅ Models đã tạo
- ⏳ CRUD operations (đang phát triển)

### 4. 📚 Quản Lý Lớp Học (Cơ bản)
- ✅ Models đã tạo
- ⏳ CRUD operations (đang phát triển)

---

## 🚀 HƯỚNG DẪN CÀI ĐẶT

### Bước 1: Cài Đặt Dependencies
```bash
npm install
```

### Bước 2: Cấu Hình MongoDB
Đảm bảo MongoDB đang chạy trên máy:
```bash
mongod
```

### Bước 3: Tạo Dữ Liệu Mẫu
```bash
npm run seed
```

### Bước 4: Khởi Động Server
```bash
npm start
```

Server sẽ chạy tại: `http://localhost:5000`

---

## 👤 TÀI KHOẢN MẶC ĐỊNH

| Username | Password | Vai Trò | Quyền Hạn |
|----------|----------|---------|-----------|
| `admin` | `Admin@123` | Admin | Toàn quyền |
| `teacher1` | `Teacher@123` | Giáo viên | Xem lớp, điểm danh |
| `receptionist1` | `Receptionist@123` | Lễ tân | Quản lý học viên |
| `accountant1` | `Accountant@123` | Kế toán | Quản lý học phí |

---

## 🌐 TRUY CẬP HỆ THỐNG

### 1. Trang Đăng Nhập
```
http://localhost:5000/pages/login.html
```

### 2. Dashboard
```
http://localhost:5000/pages/dashboard.html
```
*(Cần đăng nhập trước)*

### 3. API Endpoints
```
POST   /api/auth/login       - Đăng nhập
POST   /api/auth/logout      - Đăng xuất
GET    /api/auth/me          - Thông tin user
POST   /api/auth/refresh     - Refresh token
```

---

## 📁 CẤU TRÚC DỰ ÁN

```
TEST/
├── src/
│   ├── config/
│   │   ├── database.js          # Kết nối MongoDB
│   │   └── constants.js         # Hằng số
│   ├── models/
│   │   ├── User.js              # Model người dùng
│   │   ├── Student.js           # Model học viên
│   │   └── Class.js             # Model lớp học
│   ├── controllers/
│   │   └── authController.js    # Controller xác thực
│   ├── routes/
│   │   └── auth.js              # Routes xác thực
│   ├── middleware/
│   │   ├── auth.js              # JWT middleware
│   │   └── rbac.js              # Phân quyền
│   ├── utils/
│   │   ├── jwt.js               # JWT utilities
│   │   └── seedUsers.js         # Seed dữ liệu
│   └── app.js                   # Express app
├── public/
│   ├── pages/
│   │   ├── login.html           # Trang đăng nhập
│   │   └── dashboard.html       # Trang dashboard
│   ├── css/
│   │   ├── login.css            # Style đăng nhập
│   │   └── dashboard.css        # Style dashboard
│   └── js/
│       ├── login.js             # Logic đăng nhập
│       └── dashboard.js         # Logic dashboard
├── docs/                        # Tài liệu
├── .env                         # Cấu hình môi trường
├── server.js                    # Entry point
└── package.json                 # Dependencies

```

---

## 🔧 CÔNG NGHỆ SỬ DỤNG

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **HTML5** - Markup
- **CSS3** - Styling
- **JavaScript (ES6+)** - Logic
- **Fetch API** - HTTP requests

---

## 🎨 GIAO DIỆN

### Trang Đăng Nhập
- Thiết kế hiện đại với gradient background
- Form validation
- Loading states
- Error handling
- Toggle password visibility
- Remember me checkbox

### Dashboard
- Sidebar navigation
- Stats cards
- Responsive design
- Clean & professional

---

## 🔒 BẢO MẬT

### Đã Implement
1. ✅ Password hashing với bcrypt
2. ✅ JWT authentication
3. ✅ Account lockout (5 lần sai = khóa 15 phút)
4. ✅ Role-based access control (RBAC)
5. ✅ Input validation
6. ✅ Secure HTTP headers

### Khuyến Nghị Cho Production
- [ ] HTTPS
- [ ] Rate limiting
- [ ] CORS configuration
- [ ] Environment variables
- [ ] Logging & monitoring
- [ ] Backup strategy

---

## 📝 HƯỚNG DẪN SỬ DỤNG

### 1. Đăng Nhập
1. Mở `http://localhost:5000/pages/login.html`
2. Nhập username: `admin`
3. Nhập password: `Admin@123`
4. Click "Đăng nhập"

### 2. Sử Dụng Dashboard
1. Sau khi đăng nhập, bạn sẽ vào dashboard
2. Sử dụng menu bên trái để điều hướng
3. Xem thống kê tổng quan
4. Quản lý học viên, lớp học (đang phát triển)

### 3. Đăng Xuất
- Click nút "Đăng xuất" ở sidebar

---

## 🧪 TESTING

### Test Login API
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin@123"}'
```

### Test với REST Client
1. Mở file `test-login.http`
2. Click "Send Request"

---

## 🐛 TROUBLESHOOTING

### Server không chạy
```bash
# Kiểm tra MongoDB
mongosh

# Restart server
npm start
```

### Không đăng nhập được
```bash
# Chạy lại seed
npm run seed

# Xóa localStorage
# Mở DevTools > Application > Local Storage > Clear
```

### Port 5000 đã được sử dụng
```bash
# Đổi PORT trong .env
PORT=3000
```

---

## 📚 TÀI LIỆU THAM KHẢO

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT.io](https://jwt.io/)

---

## 🎯 KẾ HOẠCH PHÁT TRIỂN

### Phase 1: Hoàn Thành (✅)
- [x] Setup project
- [x] Authentication system
- [x] Login page
- [x] Dashboard layout
- [x] User models

### Phase 2: Đang Phát Triển (⏳)
- [ ] Student CRUD API
- [ ] Class CRUD API
- [ ] Student management UI
- [ ] Class management UI

### Phase 3: Tương Lai (📝)
- [ ] Attendance system
- [ ] Tuition management
- [ ] Reports & analytics
- [ ] Email notifications

---

## 💡 GỢI Ý CẢI TIẾN

### Cho Đề Tài Thực Tập
1. Thêm chức năng tìm kiếm nâng cao
2. Export dữ liệu ra Excel
3. In báo cáo PDF
4. Gửi email thông báo
5. Upload ảnh học viên
6. Biểu đồ thống kê

### Cho Production
1. Deploy lên cloud (Heroku, AWS, etc.)
2. CI/CD pipeline
3. Unit tests & integration tests
4. API documentation (Swagger)
5. Admin panel nâng cao
6. Mobile app

---

## 👨‍💻 THÔNG TIN LIÊN HỆ

**Sinh viên:** VuTrungHa  
**Dự án:** Hệ Thống Quản Lý Trung Tâm Anh Ngữ  
**Năm:** 2024

---

## 📄 LICENSE

MIT License - Tự do sử dụng cho mục đích học tập

---

**🎉 Chúc bạn thành công với đề tài thực tập!**
