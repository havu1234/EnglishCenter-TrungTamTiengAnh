# Hướng Dẫn Điều Hướng - English Center Management System

## 📋 Tổng Quan

Hệ thống đã được tách các chức năng thành các trang riêng biệt để dễ quản lý và sử dụng.

---

## 🏠 Cấu Trúc Trang

### 1. **Trang Chủ (Landing Page)**

- **URL**: `http://localhost:5000/` hoặc `http://localhost:5000/home.html`
- **Mục đích**: Trang giới thiệu hệ thống
- **Chức năng**:
  - Hiển thị các tính năng chính
  - Nút đăng nhập
  - Nút chuyển đến Dashboard
  - Hiển thị tài khoản mẫu

---

### 2. **Trang Đăng Nhập**

- **URL**: `http://localhost:5000/login.html`
- **Chức năng**:
  - Đăng nhập với username và password
  - Tự động chuyển đến Dashboard sau khi đăng nhập thành công
  - Lưu JWT token vào localStorage

**Tài khoản mẫu:**

- `admin / Admin@123` (Quản trị viên)
- `teacher1 / Teacher@123` (Giáo viên)
- `receptionist1 / Receptionist@123` (Lễ tân)
- `accountant1 / Accountant@123` (Kế toán)

---

### 3. **Dashboard (Tổng Quan)**

- **URL**: `http://localhost:5000/dashboard.html`
- **Chức năng**:
  - Hiển thị thống kê tổng quan:
    - Tổng số học viên
    - Tổng số lớp học
    - Số học viên đang học
    - Doanh thu tháng
  - Sidebar menu để điều hướng đến các trang khác
  - Thông tin user đang đăng nhập
  - Nút đăng xuất

---

### 4. **Quản Lý Học Viên**

- **URL**: `http://localhost:5000/index.html`
- **Chức năng**:
  - Hiển thị danh sách học viên
  - Tìm kiếm học viên theo tên hoặc số điện thoại
  - Thêm học viên mới
  - Các cột hiển thị:
    - Họ tên
    - Số điện thoại
    - Email
    - Lớp học
    - Ngày nhập học
    - Trạng thái (Đang học, Bảo lưu, Đã nghỉ, Hoàn thành)

---

### 5. **Quản Lý Lớp Học**

- **URL**: `http://localhost:5000/lophoc.html`
- **Chức năng**:
  - Hiển thị danh sách lớp học
  - Tìm kiếm lớp học theo mã hoặc tên
  - Thêm lớp học mới
  - Các cột hiển thị:
    - Mã lớp
    - Tên lớp
    - Giáo viên
    - Sĩ số (hiện tại/tối đa)
    - Lịch học

---

### 6. **Quản Lý Điểm Danh**

- **URL**: `http://localhost:5000/diemdanh.html`
- **Chức năng**:
  - Hiển thị danh sách điểm danh
  - Lọc theo lớp học
  - Lọc theo ngày
  - Điểm danh nhanh tất cả học viên trong lớp
  - Thống kê:
    - Tổng có mặt
    - Tổng vắng mặt
    - Tỷ lệ có mặt (%)
  - Các cột hiển thị:
    - STT
    - Họ tên
    - Lớp học
    - Ngày
    - Trạng thái (Có mặt, Vắng mặt, Có phép)
    - Ghi chú
    - Thao tác (Sửa)

---

### 7. **Quản Lý Học Phí**

- **URL**: `http://localhost:5000/hocphi.html`
- **Chức năng**:
  - Hiển thị danh sách học phí
  - Tìm kiếm theo tên học viên hoặc lớp
  - Lọc theo trạng thái (Đã đóng, Chưa đóng, Đóng một phần)
  - Thống kê:
    - Số học viên chưa đóng
    - Số học viên đóng một phần
    - Tổng doanh thu tháng
  - Các cột hiển thị:
    - Học viên
    - Lớp học
    - Tổng học phí
    - Đã đóng
    - Còn lại
    - Trạng thái
    - Hạn đóng

---

## 🔄 Sidebar Menu (Có trên tất cả các trang chính)

Tất cả các trang quản lý đều có **sidebar menu** giống nhau với các mục:

1. **📊 Tổng Quan** → `dashboard.html`
2. **👥 Học viên** → `index.html`
3. **📚 Lớp học** → `lophoc.html`
4. **✓ Điểm danh** → `diemdanh.html`
5. **💰 Học phí** → `hocphi.html`

Mục đang được chọn sẽ có class `active` và được highlight.

---

## 🔐 Xác Thực (Authentication)

- Tất cả các trang quản lý (trừ login và home) **yêu cầu đăng nhập**
- JWT token được lưu trong `localStorage`
- Nếu token không tồn tại hoặc hết hạn → Tự động chuyển về trang login
- Token hết hạn sau **8 giờ**

---

## 🎨 Giao Diện Thống Nhất

Các trang sử dụng hệ thống CSS riêng biệt (như login.css, dashboard.css) để đảm bảo hiệu năng và giao diện đặc thù cho từng chức năng.

**Các thành phần chung:**

- Sidebar với logo và menu
- Search bar ở đầu trang
- Bảng dữ liệu với styling nhất quán
- Form thêm mới ở cuối trang
- Notification popup khi thực hiện thao tác

---

## 🚀 Cách Sử Dụng

### Bước 1: Khởi động server

```bash
npm start
```

### Bước 2: Truy cập trang chủ

Mở trình duyệt và vào: `http://localhost:5000/`

### Bước 3: Đăng nhập

Click "Đăng Nhập" và sử dụng một trong các tài khoản mẫu

### Bước 4: Điều hướng

Sử dụng sidebar menu để chuyển đổi giữa các chức năng

---

## 📁 Cấu Trúc File

```
public/
├── pages/
│   ├── home.html          # Trang chủ (landing page)
│   ├── login.html         # Trang đăng nhập
│   ├── dashboard.html     # Dashboard (Tổng quan)
│   ├── index.html         # Quản lý học viên
│   ├── lophoc.html        # Quản lý lớp học
│   ├── diemdanh.html      # Quản lý điểm danh
│   └── hocphi.html        # Quản lý học phí
├── js/
│   ├── login.js           # Logic đăng nhập
│   ├── dashboard.js       # Logic dashboard
│   ├── main.js            # Logic học viên
│   ├── lophoc.js          # Logic lớp học
│   ├── diemdanh.js        # Logic điểm danh
│   └── hocphi.js          # Logic học phí
└── css/
    ├── style.css          # CSS chung cho các trang quản lý
    ├── dashboard.css      # CSS riêng cho dashboard
    └── login.css          # CSS riêng cho trang login
```

---

## 🔗 API Endpoints

### Authentication

- `POST /api/auth/login` - Đăng nhập

### Students

- `GET /api/students` - Lấy danh sách học viên
- `POST /api/students` - Thêm học viên mới
- `PUT /api/students/:id` - Cập nhật học viên
- `DELETE /api/students/:id` - Xóa học viên

### Classes

- `GET /api/classes` - Lấy danh sách lớp học
- `POST /api/classes` - Thêm lớp học mới

### Attendance

- `GET /api/attendance` - Lấy danh sách điểm danh
- `POST /api/attendance/mark-all` - Điểm danh tất cả
- `GET /api/attendance/stats` - Thống kê điểm danh

### Tuition

- `GET /api/tuition` - Lấy danh sách học phí
- `GET /api/tuition/summary` - Thống kê học phí

---

## ✅ Hoàn Thành

Hệ thống đã được **tách hoàn toàn** các chức năng:

- ✅ Dashboard chỉ hiển thị tổng quan
- ✅ Học viên có trang riêng (index.html)
- ✅ Lớp học có trang riêng (lophoc.html)
- ✅ Điểm danh có trang riêng (diemdanh.html)
- ✅ Học phí có trang riêng (hocphi.html)
- ✅ Sidebar menu thống nhất trên tất cả các trang
- ✅ Mỗi trang có JavaScript riêng để xử lý logic

---

**Chúc bạn sử dụng hệ thống hiệu quả! 🎉**
