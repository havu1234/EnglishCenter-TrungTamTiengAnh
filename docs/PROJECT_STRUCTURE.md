# Cấu Trúc Dự Án Chi Tiết

## 📁 Tổng Quan

```
TEST/
├── src/                          # Source code
│   ├── config/                   # Cấu hình ứng dụng
│   │   ├── database.js           # MongoDB connection
│   │   └── constants.js          # App constants
│   ├── models/                   # Mongoose schemas
│   │   ├── User.js               # User model
│   │   ├── Student.js            # Student model
│   │   ├── Class.js              # Class model
│   │   ├── Attendance.js         # Attendance model
│   │   ├── Tuition.js            # Tuition model
│   │   └── LoginHistory.js       # Login history model
│   ├── controllers/              # Request handlers
│   │   ├── authController.js     # Authentication logic
│   │   ├── studentController.js  # Student management
│   │   ├── classController.js    # Class management
│   │   ├── attendanceController.js
│   │   ├── tuitionController.js  # Tuition management
│   │   ├── userController.js     # User management
│   │   └── dashboardController.js
│   ├── routes/                   # API routes
│   │   ├── auth.js               # Auth endpoints
│   │   ├── students.js           # Student endpoints
│   │   ├── classes.js            # Class endpoints
│   │   ├── attendance.js         # Attendance endpoints
│   │   ├── tuition.js            # Tuition endpoints
│   │   ├── users.js              # User endpoints
│   │   └── dashboard.js          # Dashboard endpoints
│   ├── middleware/               # Custom middleware
│   │   ├── auth.js               # JWT verification
│   │   ├── rbac.js               # Role-based access control
│   │   ├── validation.js         # Input validation
│   │   ├── errorHandler.js       # Error handling
│   │   └── logger.js             # Request logging
│   ├── utils/                    # Utility functions
│   │   ├── validators.js         # Validation helpers
│   │   ├── formatters.js         # Data formatting
│   │   ├── generators.js         # Code generators
│   │   ├── jwt.js                # JWT utilities
│   │   └── errors.js             # Custom error classes
│   ├── services/                 # Business logic
│   │   ├── authService.js        # Auth business logic
│   │   ├── studentService.js     # Student business logic
│   │   ├── classService.js       # Class business logic
│   │   ├── attendanceService.js  # Attendance business logic
│   │   ├── tuitionService.js     # Tuition business logic
│   │   └── dashboardService.js   # Dashboard business logic
│   ├── app.js                    # Express app setup
│   └── server.js                 # Entry point (moved to root)
├── public/                       # Frontend files
│   ├── css/
│   │   ├── style.css             # Main stylesheet
│   │   ├── responsive.css        # Responsive styles
│   │   └── components.css        # Component styles
│   ├── js/
│   │   ├── main.js               # Main app logic
│   │   ├── api.js                # API client
│   │   ├── auth.js               # Auth logic
│   │   ├── utils.js              # Frontend utilities
│   │   └── lophoc.js             # Class management
│   ├── pages/
│   │   ├── index.html            # Main page
│   │   ├── hocphi.html           # Tuition page
│   │   └── lophoc.html           # Class page
│   └── assets/                   # Images, icons, etc
├── tests/                        # Test files
│   ├── unit/                     # Unit tests
│   │   ├── models.test.js
│   │   ├── services.test.js
│   │   └── utils.test.js
│   ├── integration/              # Integration tests
│   │   ├── auth.test.js
│   │   ├── students.test.js
│   │   └── classes.test.js
│   └── e2e/                      # End-to-end tests
│       └── workflows.test.js
├── docs/                         # Documentation
│   ├── PROJECT_STRUCTURE.md      # This file
│   ├── API.md                    # API documentation
│   ├── DATABASE.md               # Database schema
│   └── DEPLOYMENT.md             # Deployment guide
├── .kiro/                        # Kiro spec files
│   └── specs/
│       └── english-center-management/
│           ├── requirements.md
│           ├── design.md
│           └── tasks.md
├── .env.example                  # Environment template
├── .gitignore                    # Git ignore rules
├── package.json                  # Dependencies
├── package-lock.json             # Dependency lock
├── server.js                     # Entry point
└── README.md                     # Project README
```

## 📂 Mô Tả Chi Tiết

### `src/config/`
Chứa các file cấu hình toàn cục:
- **database.js**: Kết nối MongoDB
- **constants.js**: Hằng số ứng dụng (vai trò, trạng thái, etc)

### `src/models/`
Mongoose schemas cho các entity:
- **User**: Tài khoản người dùng
- **Student**: Hồ sơ học viên
- **Class**: Thông tin lớp học
- **Attendance**: Bản ghi điểm danh
- **Tuition**: Thông tin học phí
- **LoginHistory**: Lịch sử đăng nhập

### `src/controllers/`
Xử lý request từ routes:
- Validate input
- Gọi services
- Format response
- Handle errors

### `src/routes/`
Định nghĩa API endpoints:
- Ánh xạ HTTP methods
- Gọi controllers
- Áp dụng middleware

### `src/middleware/`
Middleware tùy chỉnh:
- **auth.js**: Xác thực JWT
- **rbac.js**: Kiểm tra quyền hạn
- **validation.js**: Validate dữ liệu
- **errorHandler.js**: Xử lý lỗi
- **logger.js**: Ghi log request

### `src/utils/`
Hàm tiện ích:
- **validators.js**: Hàm validate
- **formatters.js**: Format dữ liệu
- **generators.js**: Sinh mã lớp, token, etc
- **jwt.js**: Xử lý JWT
- **errors.js**: Custom error classes

### `src/services/`
Business logic:
- Xử lý logic phức tạp
- Tương tác với models
- Tính toán, xử lý dữ liệu

### `public/`
Frontend files:
- **css/**: Stylesheets
- **js/**: JavaScript files
- **pages/**: HTML pages
- **assets/**: Images, icons

### `tests/`
Test files:
- **unit/**: Unit tests
- **integration/**: Integration tests
- **e2e/**: End-to-end tests

### `docs/`
Tài liệu dự án:
- API documentation
- Database schema
- Deployment guide

## 🔄 Luồng Dữ Liệu

```
Request
  ↓
Routes (định tuyến)
  ↓
Middleware (xác thực, validate)
  ↓
Controllers (xử lý request)
  ↓
Services (business logic)
  ↓
Models (tương tác database)
  ↓
Response (trả về client)
```

## 📋 Quy Tắc Đặt Tên

### Files
- Controllers: `*Controller.js` (e.g., `studentController.js`)
- Routes: `*.js` (e.g., `students.js`)
- Models: `*.js` (e.g., `Student.js`)
- Services: `*Service.js` (e.g., `studentService.js`)
- Middleware: `*.js` (e.g., `auth.js`)
- Utils: `*.js` (e.g., `validators.js`)

### Functions
- Controllers: `get*`, `create*`, `update*`, `delete*`
- Services: `get*`, `create*`, `update*`, `delete*`
- Utils: `validate*`, `format*`, `generate*`

### Variables
- Constants: `UPPER_CASE`
- Variables: `camelCase`
- Classes: `PascalCase`

## 🚀 Workflow Phát Triển

1. **Tạo Model** → Định nghĩa schema
2. **Tạo Service** → Implement business logic
3. **Tạo Controller** → Xử lý request
4. **Tạo Route** → Định tuyến API
5. **Tạo Middleware** → Xác thực, validate
6. **Tạo Frontend** → UI components
7. **Viết Tests** → Unit, integration, e2e
8. **Documentation** → API docs, guides

## 📝 Ghi Chú

- Luôn sử dụng async/await
- Validate input ở middleware
- Xử lý error một cách nhất quán
- Viết tests cho mỗi feature
- Giữ code DRY (Don't Repeat Yourself)
- Sử dụng constants thay vì magic strings
