**Lưu ý:** Trang này yêu cầu đăng nhập với quyền Admin hoặc Lễ tân để truy cập dữ liệu.
# 🎓 HƯỚNG DẪN SỬ DỤNG CHỨC NĂNG HỌC VIÊN

## ✅ ĐÃ HOÀN THÀNH

Chức năng quản lý học viên đã được tích hợp đầy đủ với:

- ✅ Thêm học viên
- ✅ Sửa học viên
- ✅ Xóa học viên
- ✅ Tìm kiếm học viên
- ✅ Hiển thị danh sách

---

## 🌐 TRUY CẬP

### Trang Quản Lý Học Viên

```
http://localhost:5000/pages/index.html
```

**Lưu ý:** Trang này yêu cầu đăng nhập với quyền Admin hoặc Lễ tân để truy cập dữ liệu.

---

## 📋 API ENDPOINTS

### 1. Lấy Danh Sách Học Viên

```
GET /api/students
```

**Response:**

```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "hoTen": "Nguyễn Văn A",
    "lopHoc": "IELTS",
    "ngayNhapHoc": "2024-01-15",
    "soDienThoai": "0123456789",
    "trangThai": "Đang học"
  }
]
```

### 2. Thêm Học Viên Mới

```
POST /api/students
```

**Request Body:**

```json
{
  "hoTen": "Nguyễn Văn A",
  "lopHoc": "IELTS",
  "ngayNhapHoc": "2024-01-15",
  "soDienThoai": "0123456789"
}
```

### 3. Cập Nhật Học Viên

```
PUT /api/students/:id
```

**Request Body:**

```json
{
  "hoTen": "Nguyễn Văn A",
  "lopHoc": "TOEIC",
  "ngayNhapHoc": "2024-01-15",
  "soDienThoai": "0123456789",
  "trangThai": "Đang học"
}
```

### 4. Xóa Học Viên

```
DELETE /api/students/:id
```

### 5. Tìm Kiếm Học Viên

```
GET /api/students/search?q=keyword
```

---

## 🎯 CÁCH SỬ DỤNG

### 1. Mở Trang Quản Lý

```
http://localhost:5000/pages/index.html
```

### 2. Thêm Học Viên

1. Nhập họ tên
2. Chọn lớp học (IELTS, TOEIC, Giao tiếp)
3. Chọn ngày nhập học
4. Nhập số điện thoại (10 số)
5. Click "Lưu thông tin"

### 3. Sửa Học Viên

1. Click nút "Sửa" trên dòng học viên
2. Cửa sổ popup hiện ra
3. Chỉnh sửa thông tin
4. Có thể đổi trạng thái:
   - Đang học
   - Bảo lưu
   - Đã nghỉ
   - Hoàn thành
5. Click "Cập nhật"

### 4. Xóa Học Viên

1. Click nút "Xóa" trên dòng học viên
2. Xác nhận xóa
3. Học viên sẽ bị xóa khỏi database

### 5. Tìm Kiếm

1. Nhập tên hoặc số điện thoại vào ô tìm kiếm
2. Kết quả tự động lọc

---

## 🎨 TRẠNG THÁI HỌC VIÊN

| Trạng Thái | Màu Sắc    | Ý Nghĩa                   |
| ---------- | ---------- | ------------------------- |
| Đang học   | Xanh lá    | Đang theo học bình thường |
| Bảo lưu    | Vàng       | Tạm nghỉ, sẽ quay lại     |
| Đã nghỉ    | Đỏ         | Đã nghỉ học               |
| Hoàn thành | Xanh dương | Hoàn thành khóa học       |

---

## 📚 LỚP HỌC

Hệ thống hỗ trợ 3 loại lớp:

- **IELTS** - Luyện thi IELTS
- **TOEIC** - Luyện thi TOEIC
- **Giao tiếp** - Giao tiếp cơ bản

Khi thêm học viên vào lớp chưa tồn tại, hệ thống tự động tạo lớp mới!

---

## 🔍 TÌM KIẾM

Tìm kiếm theo:

- ✅ Họ tên (không phân biệt hoa thường)
- ✅ Số điện thoại
- ✅ Mã số học viên

Kết quả hiển thị ngay khi gõ!

---

## 🧪 TEST API

### Test với cURL

**Thêm học viên:**

```bash
curl -X POST http://localhost:5000/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "hoTen": "Trần Thị B",
    "lopHoc": "TOEIC",
    "ngayNhapHoc": "2024-02-01",
    "soDienThoai": "0987654321"
  }'
```

**Lấy danh sách:**

```bash
curl http://localhost:5000/api/students
```

**Tìm kiếm:**

```bash
curl "http://localhost:5000/api/students/search?q=Trần"
```

---

## 💾 DATABASE

### Student Schema

```javascript
{
  fullName: String,        // Họ tên
  phone: String,           // Số điện thoại (10 số)
  email: String,           // Email (optional)
  dateOfBirth: Date,       // Ngày sinh (optional)
  gender: String,          // Giới tính (optional)
  address: String,         // Địa chỉ (optional)
  enrollmentDate: Date,    // Ngày nhập học
  classId: ObjectId,       // Lớp học (ref Class)
  status: String,          // Trạng thái
  createdAt: Date,         // Ngày tạo
  updatedAt: Date          // Ngày cập nhật
}
```

---

## 🎯 TÍNH NĂNG NỔI BẬT

### 1. Tự Động Tạo Lớp

Khi thêm học viên vào lớp chưa tồn tại:

- Hệ thống tự động tạo lớp mới
- Sinh mã lớp tự động (VD: IELT-1234)
- Cập nhật sĩ số

### 2. Quản Lý Sĩ Số

- Tự động tăng sĩ số khi thêm học viên
- Tự động giảm sĩ số khi xóa học viên
- Cập nhật khi chuyển lớp

### 3. Validation

- Họ tên: Bắt buộc, tối đa 100 ký tự
- Số điện thoại: Bắt buộc, đúng 10 số
- Email: Đúng định dạng (nếu có)

### 4. Tìm Kiếm Thông Minh

- Không phân biệt hoa thường
- Tìm theo nhiều trường
- Kết quả realtime

---

## 🐛 XỬ LÝ LỖI

### Lỗi: "Họ tên và số điện thoại là bắt buộc"

**Nguyên nhân:** Thiếu thông tin bắt buộc  
**Giải pháp:** Nhập đầy đủ họ tên và số điện thoại

### Lỗi: "Số điện thoại phải có đúng 10 chữ số"

**Nguyên nhân:** Số điện thoại không đúng định dạng  
**Giải pháp:** Nhập đúng 10 số, không có ký tự đặc biệt

### Lỗi: "Không tìm thấy học viên"

**Nguyên nhân:** ID không tồn tại  
**Giải pháp:** Kiểm tra lại ID hoặc refresh trang

---

## 📊 THỐNG KÊ

Trang hiển thị 3 thẻ thống kê:

1. **Tổng học viên** - Tổng số học viên trong hệ thống
2. **Lớp đang mở** - Số lớp đang hoạt động
3. **Chưa đóng phí** - Số học viên chưa đóng học phí

_(Hiện tại là số liệu mẫu, sẽ cập nhật từ database)_

---

## 🔄 LUỒNG DỮ LIỆU

```
1. User nhập thông tin học viên
   ↓
2. Frontend gửi POST /api/students
   ↓
3. Backend validate dữ liệu
   ↓
4. Tìm hoặc tạo lớp học
   ↓
5. Tạo student trong database
   ↓
6. Cập nhật sĩ số lớp
   ↓
7. Trả về kết quả
   ↓
8. Frontend reload danh sách
```

---

## 💡 TIPS

1. **Nhập nhanh:** Dùng Tab để chuyển giữa các ô
2. **Tìm kiếm:** Gõ ngay không cần nhấn Enter
3. **Sửa nhanh:** Double click vào dòng để sửa
4. **Xóa an toàn:** Luôn có confirm trước khi xóa

---

## 🚀 PHÁT TRIỂN TIẾP

Các tính năng có thể thêm:

- [ ] Upload ảnh học viên
- [ ] Export Excel
- [ ] In danh sách
- [ ] Gửi SMS thông báo
- [ ] Lịch sử học tập
- [ ] Điểm số
- [ ] Chứng chỉ

---

## 📞 HỖ TRỢ

Nếu gặp vấn đề:

1. Kiểm tra server đang chạy
2. Kiểm tra MongoDB đang chạy
3. Xem console log (F12)
4. Kiểm tra network tab

---

**🎉 Chúc bạn sử dụng hiệu quả!**
