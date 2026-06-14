# Hướng Dẫn Bắt Đầu

## 🎯 Mục Tiêu

Hướng dẫn này giúp bạn thiết lập và chạy dự án English Center Management System.

## 📋 Yêu Cầu Hệ Thống

- **Node.js**: >= 14.0 (khuyến nghị 16.0+)
- **npm**: >= 6.0 hoặc **yarn** >= 1.22
- **MongoDB**: >= 4.0 (local hoặc cloud)
- **Git**: >= 2.0

## 🔧 Cài Đặt

### Bước 1: Clone Repository
```bash
git clone <repository-url>
cd TEST
```

### Bước 2: Cài Đặt Dependencies
```bash
npm install
```

Hoặc nếu dùng yarn:
```bash
yarn install
```

### Bước 3: Cấu Hình Environment

Sao chép file `.env.example` thành `.env`:
```bash
cp .env.example .env
```

Chỉnh sửa `.env` với cấu hình của bạn:
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/english-center

# JWT
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=8h

# Bcrypt
BCRYPT_ROUNDS=10
```

### Bước 4: Khởi Động MongoDB

**Nếu dùng MongoDB local:**
```bash
# Windows
mongod

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

**Hoặc dùng MongoDB Atlas (Cloud):**
1. Tạo tài khoản tại https://www.mongodb.com/cloud/atlas
2. Tạo cluster
3. Lấy connection string
4. Cập nhật `MONGODB_URI` trong `.env`

### Bước 5: Chạy Server

```bash
npm start
```

Server sẽ chạy trên `http://localhost:5000`

Bạn sẽ thấy output:
```
╔════════════════════════════════════════╗
║  English Center Management System      ║
║  Server running on port 5000           ║
║  Environment: development              ║
╚════════════════════════════════════════╝
```

## 🧪 Kiểm Tra Cài Đặt

### Health Check
```bash
curl http://localhost:5000/api/health
```

Response:
```json
{
  "status": "OK",
  "timestamp": "2026-05-31T10:00:00.000Z"
}
```

## 📁 Cấu Trúc Thư Mục

```
TEST/
├── src/                    # Source code
│   ├── config/            # Cấu hình
│   ├── models/            # Database models
│   ├── controllers/       # Request handlers
│   ├── routes/            # API routes
│   ├── middleware/        # Middleware
│   ├── utils/             # Utilities
│   ├── services/          # Business logic
│   ├── app.js             # Express app
│   └── server.js          # Entry point
├── public/                # Frontend
│   ├── css/              # Stylesheets
│   ├── js/               # JavaScript
│   └── pages/            # HTML pages
├── tests/                 # Tests
├── docs/                  # Documentation
├── .env.example           # Environment template
├── package.json           # Dependencies
└── README.md              # Project README
```

## 🚀 Các Lệnh Hữu Ích

### Development
```bash
# Chạy server
npm start

# Chạy server với auto-reload (cần cài nodemon)
npm run dev

# Chạy tests
npm test

# Chạy tests với coverage
npm run test:coverage
```

### Production
```bash
# Build
npm run build

# Chạy production
npm run start:prod
```

## 🔐 Tài Khoản Mặc Định

Sau khi cài đặt, bạn có thể tạo tài khoản admin:

```bash
# Sử dụng script seed (nếu có)
npm run seed
```

Hoặc tạo thủ công qua API:
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "Admin@123",
    "fullName": "Administrator",
    "role": "Admin"
  }'
```

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Giải pháp:**
- Kiểm tra MongoDB đang chạy: `mongosh` hoặc `mongo`
- Kiểm tra `MONGODB_URI` trong `.env`
- Nếu dùng MongoDB Atlas, kiểm tra IP whitelist

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Giải pháp:**
- Thay đổi PORT trong `.env`
- Hoặc kill process đang dùng port 5000:
  ```bash
  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  
  # macOS/Linux
  lsof -i :5000
  kill -9 <PID>
  ```

### Dependencies Installation Error
```
npm ERR! code ERESOLVE
```

**Giải pháp:**
```bash
npm install --legacy-peer-deps
```

## 📚 Tài Liệu Tiếp Theo

- [Project Structure](./PROJECT_STRUCTURE.md) - Cấu trúc dự án chi tiết
- [API Documentation](./API.md) - Tài liệu API
- [Database Schema](./DATABASE.md) - Schema database
- [Deployment Guide](./DEPLOYMENT.md) - Hướng dẫn deploy

## 💡 Tips

1. **Sử dụng Postman** để test API
2. **Sử dụng MongoDB Compass** để quản lý database
3. **Sử dụng VS Code** với extensions: REST Client, MongoDB for VS Code
4. **Đọc logs** để debug: `npm start` sẽ hiển thị logs chi tiết

## 🆘 Cần Giúp?

- Kiểm tra [README.md](../README.md)
- Xem [Issues](https://github.com/your-repo/issues)
- Tạo issue mới nếu gặp vấn đề

---

**Happy Coding! 🎉**
