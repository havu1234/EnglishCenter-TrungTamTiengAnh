# 🔐 Hướng Dẫn Sử Dụng Hệ Thống Đăng Nhập

## ✅ Hoàn Thành

Backend API đăng nhập đã được tạo và đang chạy!

## 🌐 Truy Cập

### Trang Đăng Nhập
```
http://localhost:5000/pages/login.html
```

### API Endpoint
```
http://localhost:5000/api/auth/login
```

## 👥 Tài Khoản Mặc Định

| Tên Đăng Nhập | Mật Khẩu         | Vai Trò      | Mô Tả |
|---------------|------------------|--------------|-------|
| `admin`       | `Admin@123`      | Admin        | Quản trị viên - Toàn quyền |
| `teacher1`    | `Teacher@123`    | Giao_Vien    | Giáo viên - Xem lớp, điểm danh |
| `receptionist1` | `Receptionist@123` | Le_Tan    | Lễ tân - Quản lý học viên |
| `accountant1` | `Accountant@123` | Ke_Toan      | Kế toán - Quản lý học phí |

## 🎯 Cách Sử Dụng

### 1. Đăng Nhập Qua Giao Diện Web

1. Mở trình duyệt và truy cập: `http://localhost:5000/pages/login.html`
2. Nhập username và password (ví dụ: `admin` / `Admin@123`)
3. Click "Đăng nhập"
4. Nếu thành công, bạn sẽ được chuyển hướng đến dashboard

### 2. Đăng Nhập Qua API

**Request:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "Admin@123"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "admin",
    "fullName": "Quản Trị Viên",
    "role": "Admin"
  },
  "role": "Admin",
  "fullName": "Quản Trị Viên"
}
```

## 🔒 Tính Năng Bảo Mật

### ✅ Đã Implement

1. **Password Hashing**
   - Sử dụng bcrypt với cost factor 10
   - Mật khẩu không bao giờ lưu dạng plaintext

2. **JWT Authentication**
   - Token có thời hạn 8 giờ
   - Tự động refresh khi cần
   - Lưu trong localStorage

3. **Account Lockout**
   - Khóa tài khoản sau 5 lần đăng nhập sai
   - Thời gian khóa: 15 phút
   - Hiển thị countdown timer

4. **Role-Based Access Control (RBAC)**
   - 4 vai trò: Admin, Giáo viên, Lễ tân, Kế toán
   - Mỗi vai trò có quyền hạn riêng
   - Middleware kiểm tra quyền truy cập

5. **Input Validation**
   - Validate username (3-50 ký tự)
   - Validate password (tối thiểu 8 ký tự)
   - Sanitize input để tránh injection

6. **Error Handling**
   - Thông báo lỗi thân thiện
   - Không tiết lộ thông tin nhạy cảm
   - Log errors cho debugging

## 📁 Cấu Trúc Files

```
src/
├── models/
│   └── User.js                 # User schema với bcrypt
├── controllers/
│   └── authController.js       # Login, logout, refresh
├── routes/
│   └── auth.js                 # Auth endpoints
├── middleware/
│   ├── auth.js                 # JWT verification
│   └── rbac.js                 # Role-based access control
├── utils/
│   ├── jwt.js                  # JWT utilities
│   └── seedUsers.js            # Seed default users
└── config/
    ├── database.js             # MongoDB connection
    └── constants.js            # App constants

public/
├── pages/
│   └── login.html              # Login page
├── css/
│   └── login.css               # Login styles
└── js/
    └── login.js                # Login logic
```

## 🧪 Testing

### Test với REST Client (VS Code)

1. Cài extension "REST Client"
2. Mở file `test-login.http`
3. Click "Send Request" để test

### Test với Postman

1. Import collection từ `test-login.http`
2. Chạy các requests

### Test với Browser

1. Mở `http://localhost:5000/pages/login.html`
2. Thử đăng nhập với các tài khoản khác nhau
3. Thử đăng nhập sai để test lockout

## 🔄 Luồng Đăng Nhập

```
1. User nhập username + password
   ↓
2. Frontend gửi POST /api/auth/login
   ↓
3. Backend validate input
   ↓
4. Tìm user trong database
   ↓
5. Kiểm tra account status (locked/disabled)
   ↓
6. So sánh password với bcrypt
   ↓
7. Nếu đúng:
   - Reset login attempts
   - Generate JWT token
   - Return token + user info
   ↓
8. Frontend lưu token vào localStorage
   ↓
9. Redirect đến dashboard theo role
```

## 🚨 Xử Lý Lỗi

### Sai mật khẩu
- Hiển thị: "Tên đăng nhập hoặc mật khẩu không đúng. Còn X lần thử."
- Tăng login attempts
- Khóa sau 5 lần

### Tài khoản bị khóa
- Hiển thị: "Tài khoản bị khóa tạm thời, vui lòng thử lại sau X phút"
- Countdown timer
- Tự động mở khóa sau 15 phút

### Tài khoản bị vô hiệu
- Hiển thị: "Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ Admin."
- Không cho phép đăng nhập

### Token hết hạn
- Hiển thị: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."
- Redirect về trang login

## 📚 API Documentation

Xem chi tiết tại: `docs/API_AUTH.md`

## 🔧 Cấu Hình

### Environment Variables (.env)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/english-center

# JWT
JWT_SECRET=your_secret_key_change_in_production
JWT_EXPIRE=8h

# Bcrypt
BCRYPT_ROUNDS=10
```

## 🎨 Giao Diện

### Features
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Smooth animations
- ✅ Loading states
- ✅ Error messages
- ✅ Toggle password visibility
- ✅ Remember me checkbox
- ✅ Forgot password link (UI only)

### Colors
- Primary: `#4F46E5` (Indigo)
- Error: `#EF4444` (Red)
- Success: `#10B981` (Green)

## 🚀 Next Steps

### Đã Hoàn Thành ✅
- [x] User model với bcrypt
- [x] JWT authentication
- [x] Login API
- [x] Logout API
- [x] Get current user API
- [x] Refresh token API
- [x] RBAC middleware
- [x] Account lockout
- [x] Login page UI
- [x] Seed default users

### Cần Làm Tiếp 📝
- [ ] Dashboard pages cho từng role
- [ ] Student management API
- [ ] Class management API
- [ ] Attendance API
- [ ] Tuition API
- [ ] User management API
- [ ] Forgot password functionality
- [ ] Email notifications
- [ ] Audit logging

## 💡 Tips

1. **Đổi mật khẩu mặc định** trong production
2. **Đổi JWT_SECRET** trong .env
3. **Enable HTTPS** khi deploy
4. **Backup database** thường xuyên
5. **Monitor login attempts** để phát hiện tấn công

## 🆘 Troubleshooting

### Server không chạy
```bash
# Kiểm tra MongoDB đang chạy
mongosh

# Restart server
npm start
```

### Không đăng nhập được
- Kiểm tra username/password đúng chưa
- Kiểm tra MongoDB có data chưa
- Chạy lại seed: `npm run seed`

### Token không hợp lệ
- Xóa localStorage và đăng nhập lại
- Kiểm tra JWT_SECRET trong .env

---

**Happy Coding! 🎉**
