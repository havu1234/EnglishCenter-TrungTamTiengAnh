# Authentication API Documentation

## Base URL
```
http://localhost:5000/api/auth
```

## Endpoints

### 1. Login
Đăng nhập và nhận JWT token.

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "username": "admin",
  "password": "Admin@123"
}
```

**Success Response (200):**
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

**Error Responses:**

**400 - Missing credentials:**
```json
{
  "success": false,
  "message": "Vui lòng nhập tên đăng nhập và mật khẩu"
}
```

**401 - Invalid credentials:**
```json
{
  "success": false,
  "message": "Tên đăng nhập hoặc mật khẩu không đúng. Còn 4 lần thử."
}
```

**403 - Account locked:**
```json
{
  "success": false,
  "message": "Tài khoản bị khóa tạm thời, vui lòng thử lại sau 15 phút"
}
```

**403 - Account disabled:**
```json
{
  "success": false,
  "message": "Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ Admin."
}
```

---

### 2. Logout
Đăng xuất (client-side xóa token).

**Endpoint:** `POST /api/auth/logout`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Đăng xuất thành công"
}
```

---

### 3. Get Current User
Lấy thông tin user hiện tại.

**Endpoint:** `GET /api/auth/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "admin",
    "fullName": "Quản Trị Viên",
    "role": "Admin",
    "status": "Hoạt động",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Không tìm thấy token xác thực"
}
```

---

### 4. Refresh Token
Làm mới JWT token.

**Endpoint:** `POST /api/auth/refresh`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Token đã được làm mới",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## Default Users

| Username       | Password         | Role        |
|----------------|------------------|-------------|
| admin          | Admin@123        | Admin       |
| teacher1       | Teacher@123      | Giao_Vien   |
| receptionist1  | Receptionist@123 | Le_Tan      |
| accountant1    | Accountant@123   | Ke_Toan     |

## Security Features

### 1. Password Hashing
- Sử dụng bcrypt với cost factor 10
- Mật khẩu không bao giờ được lưu dạng plaintext

### 2. JWT Token
- Thời hạn: 8 giờ (configurable)
- Chứa: userId, username, role
- Secret key: Lưu trong .env

### 3. Account Lockout
- Khóa sau 5 lần đăng nhập sai
- Thời gian khóa: 15 phút
- Tự động mở khóa sau thời gian

### 4. Role-Based Access Control (RBAC)
- Admin: Toàn quyền
- Giao_Vien: Xem lớp, điểm danh
- Le_Tan: Quản lý học viên
- Ke_Toan: Quản lý học phí

## Error Codes

| Code | Description |
|------|-------------|
| 200  | Success |
| 400  | Bad Request - Missing or invalid input |
| 401  | Unauthorized - Invalid credentials or token |
| 403  | Forbidden - Account locked or disabled |
| 500  | Internal Server Error |

## Usage Example (JavaScript)

```javascript
// Login
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: 'admin',
    password: 'Admin@123',
  }),
});

const data = await response.json();

if (data.success) {
  // Save token
  localStorage.setItem('token', data.token);
  localStorage.setItem('userRole', data.role);
  
  // Redirect to dashboard
  window.location.href = '/dashboard';
}

// Use token in subsequent requests
const token = localStorage.getItem('token');

const userResponse = await fetch('http://localhost:5000/api/auth/me', {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});
```

## Testing

### Using cURL
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin@123"}'

# Get current user
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Postman
1. Import collection from `test-login.http`
2. Set environment variable `baseUrl` = `http://localhost:5000`
3. Run requests

### Using REST Client (VS Code)
1. Install REST Client extension
2. Open `test-login.http`
3. Click "Send Request" above each request

---

**Last Updated:** 2024-05-31
