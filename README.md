# English Center Management System

Hệ thống quản lý học viên cho trung tâm Anh ngữ - một ứng dụng web nội bộ giúp quản lý toàn bộ hoạt động từ hồ sơ học viên, lớp học, lịch học, đến học phí và báo cáo.

## 📋 Tính Năng Chính

- ✅ **Xác thực & Phân quyền** - JWT tokens, bcrypt hashing, 4 vai trò người dùng
- ✅ **Quản lý học viên** - CRUD, tìm kiếm, phân trang
- ✅ **Quản lý lớp học** - Tạo lớp, quản lý sĩ số, danh sách học viên
- ✅ **Điểm danh** - Ghi nhận chuyên cần, tính tỷ lệ
- ✅ **Quản lý học phí** - Theo dõi thanh toán, cảnh báo quá hạn
- ✅ **Dashboard** - Thống kê, báo cáo theo vai trò
- ✅ **Quản lý tài khoản** - Tạo, sửa, vô hiệu hóa tài khoản

## 🏗️ Cấu Trúc Dự Án

```
TEST/
├── src/
│   ├── config/              # Cấu hình (database, constants)
│   ├── models/              # MongoDB schemas
│   ├── controllers/         # Business logic
│   ├── routes/              # API routes
│   ├── middleware/          # Middleware (auth, validation)
│   ├── utils/               # Utility functions
│   ├── services/            # Business services
│   ├── app.js               # Express app setup
│   └── server.js            # Entry point
├── public/
│   ├── css/                 # Stylesheets
│   ├── js/                  # Frontend JavaScript
│   ├── pages/               # HTML pages
│   └── index.html           # Main page
├── tests/                   # Test files
├── docs/                    # Documentation
├── .env.example             # Environment template
├── package.json             # Dependencies
└── README.md                # This file
```

## 🚀 Cài Đặt & Chạy

### Yêu Cầu
- Node.js >= 14.0
- MongoDB >= 4.0
- npm hoặc yarn

### Bước 1: Cài Đặt Dependencies
```bash
npm install
```

### Bước 2: Cấu Hình Environment
```bash
cp .env.example .env
# Chỉnh sửa .env với cấu hình của bạn
```

### Bước 3: Chạy Server
```bash
npm start
```

Server sẽ chạy trên `http://localhost:5000`

## 📚 Tài Liệu Spec

Tài liệu chi tiết về yêu cầu, thiết kế và danh sách công việc:
- **Requirements**: `.kiro/specs/english-center-management/requirements.md`
- **Design**: `.kiro/specs/english-center-management/design.md`
- **Tasks**: `.kiro/specs/english-center-management/tasks.md`

## 🔐 Vai Trò & Quyền Hạn

| Vai Trò | Quyền Hạn |
|---------|-----------|
| **Admin** | Toàn quyền tất cả chức năng |
| **Giáo viên** | Xem lớp, điểm danh, xem lịch dạy |
| **Lễ tân** | Quản lý hồ sơ học viên, xem lớp |
| **Kế toán** | Quản lý học phí, xem báo cáo |

## 🔧 Công Nghệ Sử Dụng

### Backend
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin requests

### Frontend
- **HTML5** - Markup
- **CSS3** - Styling
- **JavaScript (ES6+)** - Interactivity
- **Responsive Design** - Mobile-friendly

## 📝 API Endpoints

### Authentication
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/logout` - Đăng xuất
- `POST /api/auth/refresh` - Làm mới token

### Students
- `GET /api/students` - Danh sách học viên
- `POST /api/students` - Thêm học viên
- `GET /api/students/:id` - Chi tiết học viên
- `PUT /api/students/:id` - Cập nhật học viên
- `DELETE /api/students/:id` - Xóa học viên

### Classes
- `GET /api/classes` - Danh sách lớp
- `POST /api/classes` - Tạo lớp
- `GET /api/classes/:id` - Chi tiết lớp
- `PUT /api/classes/:id` - Cập nhật lớp
- `DELETE /api/classes/:id` - Xóa lớp

### Attendance
- `GET /api/attendance/:classId` - Lịch sử điểm danh
- `POST /api/attendance` - Ghi nhận điểm danh
- `PUT /api/attendance/:id` - Cập nhật điểm danh

### Tuition
- `GET /api/tuition` - Danh sách học phí
- `PUT /api/tuition/:id` - Cập nhật học phí

### Users
- `GET /api/users` - Danh sách tài khoản
- `POST /api/users` - Tạo tài khoản
- `PUT /api/users/:id` - Cập nhật tài khoản
- `DELETE /api/users/:id` - Vô hiệu hóa tài khoản

### Dashboard
- `GET /api/dashboard` - Thống kê chung

## 🧪 Testing

```bash
# Chạy tất cả tests
npm test

# Chạy tests với coverage
npm run test:coverage

# Chạy tests trong watch mode
npm run test:watch
```

## 📦 Build & Deploy

```bash
# Build production
npm run build

# Start production server
npm run start:prod
```

## 🤝 Đóng Góp

Vui lòng tuân theo các quy tắc:
1. Tạo branch mới cho mỗi feature
2. Commit messages rõ ràng
3. Tạo Pull Request với mô tả chi tiết

## 📄 License

MIT License - Xem file LICENSE để chi tiết

## 📞 Liên Hệ

Nếu có câu hỏi hoặc vấn đề, vui lòng tạo issue trên GitHub.

---

**Cập nhật lần cuối**: 2026-05-31
