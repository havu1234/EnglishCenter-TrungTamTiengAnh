let currentEditId = null;

// 🟢 BƯỚC 1: KHAI BÁO LINK SERVER RENDER CỦA BẠN Ở ĐÂY
const BASE_URL = "https://english-center-moc7.onrender.com";

// 1. Hàm hiển thị danh sách
async function loadStudents() {
  try {
    // SỬA: Thêm BASE_URL vào trước đường dẫn
    const response = await fetch(`${BASE_URL}/api/students`);
    const data = await response.json();
    const tbody = document.querySelector("tbody");
    if (!tbody) return;
    tbody.innerHTML = "";

    data.forEach((s, index) => {
      const tr = document.createElement("tr");

      // Xử lý Class màu sắc dựa trên CSS của bạn
      let colorClass = "";
      if (s.trangThai === "Đang học") colorClass = "status-active";
      else if (s.trangThai === "Bảo lưu") colorClass = "status-pending";
      else if (s.trangThai === "Đã nghỉ") colorClass = "status-dropped";
      else if (s.trangThai === "Hoàn thành") colorClass = "status-done";

      // ĐÃ CẬP NHẬT: Thêm ô hiển thị số điện thoại vào đúng vị trí cột
      tr.innerHTML = `
                <td>#${index + 1}</td>
                <td>${s.hoTen}</td>
                <td>${s.lopHoc}</td>
                <td>${s.ngayNhapHoc ? s.ngayNhapHoc.substring(0, 10) : ""}</td>
                <td>${s.soDienThoai || "---"}</td> <td><span class="status ${colorClass}">${s.trangThai || "Đang học"}</span></td>
                <td>
                    <button class="btn btn-edit" onclick="prepareEdit('${s._id}')">Sửa</button>
                    <button class="btn btn-delete" onclick="deleteStudent('${s._id}')">Xóa</button>
                </td>
            `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error("Lỗi khi load danh sách:", error);
  }
}
// 2. Hàm lưu dữ liệu (Dùng chung cho cả Thêm và Sửa) - ĐÃ THÊM SỐ ĐIỆN THOẠI
async function handleSave(event) {
  event.preventDefault();

  const hoTen = document.getElementById("input-hoTen").value;
  const lopHoc = document.getElementById("select-lopHoc").value;
  const ngayNhapHoc = document.getElementById("input-ngayNhapHoc").value;

  // 1. LẤY THÊM GIÁ TRỊ SỐ ĐIỆN THOẠI TỪ FORM GIAO DIỆN
  const soDienThoai = document.getElementById("input-soDienThoai").value;

  // 2. ĐƯA SỐ ĐIỆN THOẠI VÀO ĐỐI TƯỢNG DATA ĐỂ GỬI ĐI
  const data = { hoTen, lopHoc, ngayNhapHoc, soDienThoai };

  if (currentEditId) {
    // Khi ĐANG SỬA: Lấy thêm giá trị trạng thái từ ô chọn
    data.trangThai = document.getElementById("select-trangThai").value;

    // SỬA: Thêm BASE_URL vào đây
    await fetch(`${BASE_URL}/api/students/${currentEditId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } else {
    // Khi THÊM MỚI: Không gửi trangThai (Server sẽ tự hiểu là "Đang học")
    // SỬA: Thêm BASE_URL vào đây
    await fetch(`${BASE_URL}/api/students`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }
  resetForm();
  loadStudents();
}
// 3. Hàm chuẩn bị sửa
async function prepareEdit(id) {
  // SỬA: Thêm BASE_URL vào đây
  const response = await fetch(`${BASE_URL}/api/students`);
  const students = await response.json();
  const s = students.find((item) => item._id === id);

  if (s) {
    currentEditId = id; // Giữ nguyên dòng lưu ID đang sửa

    // ĐỔ DỮ LIỆU VÀO CÁC Ô INPUT TRONG CỬA SỔ MODAL POPUP
    document.getElementById("modal-hoTen").value = s.hoTen;
    document.getElementById("modal-lopHoc").value = s.lopHoc;
    document.getElementById("modal-ngayNhapHoc").value = s.ngayNhapHoc;
    document.getElementById("modal-soDienThoai").value = s.soDienThoai || "";

    // Đổ trạng thái hiện tại từ database vào ô select trong Modal
    document.getElementById("modal-trangThai").value =
      s.trangThai || "Đang học";

    // LỆNH QUAN TRỌNG: Mở cửa sổ Modal lên bằng cách đổi style thành 'flex'
    document.getElementById("editModal").style.display = "flex";
  }
}
// Hàm đóng cửa sổ Modal khi nhấn nút X hoặc lưu xong
function closeEditModal() {
  document.getElementById("editModal").style.display = "none";
  currentEditId = null;
}

// Hàm gửi dữ liệu đã cập nhật từ trong Modal về Server (ĐÃ THÊM SỐ ĐIỆN THOẠI)
async function handleUpdateSave(event) {
  event.preventDefault(); // Ngăn trình duyệt tải lại trang

  const data = {
    hoTen: document.getElementById("modal-hoTen").value,
    lopHoc: document.getElementById("modal-lopHoc").value,
    ngayNhapHoc: document.getElementById("modal-ngayNhapHoc").value,
    trangThai: document.getElementById("modal-trangThai").value,

    // 🛠️ THÊM DÒNG NÀY: Lấy số điện thoại mới sửa từ Modal để đóng gói gửi đi
    soDienThoai: document.getElementById("modal-soDienThoai").value,
  };

  try {
    // SỬA: Thêm BASE_URL vào đây
    const response = await fetch(`${BASE_URL}/api/students/${currentEditId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      alert("Cập nhật thông tin học viên thành công!");
      closeEditModal(); // Đóng popup lại
      loadStudents(); // Tải lại bảng danh sách để cập nhật màu chữ mới
    }
  } catch (error) {
    alert("Lỗi kết nối khi cập nhật thông tin!");
  }
}
// 4. Các hàm hỗ trợ khác
function resetForm() {
  currentEditId = null;
  document.getElementById("student-form").reset();
  document.getElementById("form-title").innerText = "Thêm học viên mới";
  document.getElementById("btn-main").innerText = "Lưu thông tin";
  document.getElementById("btn-cancel").style.display = "none";
}

async function deleteStudent(id) {
  if (confirm("Bạn có chắc chắn muốn xóa?")) {
    // SỬA: Thêm BASE_URL vào đây
    await fetch(`${BASE_URL}/api/students/${id}`, { method: "DELETE" });
    loadStudents();
  }
}

window.onload = () => {
  loadStudents();
  // Gán sự kiện cho nút Lưu duy nhất
  const mainForm = document.getElementById("student-form");
  if (mainForm) mainForm.onsubmit = handleSave;

  const cancelBtn = document.getElementById("btn-cancel");
  if (cancelBtn) cancelBtn.onclick = resetForm;
};
// Hàm tìm kiếm và lọc học viên trực tiếp trên giao diện bảng
function filterStudents() {
  // 1. Lấy từ khóa bạn nhập, chuyển thành chữ thường và xóa khoảng trắng thừa
  const keyword = document
    .getElementById("search-student")
    .value.toLowerCase()
    .trim();

  // 2. Nhắm chính xác vào phần thân của bảng (tbody) nơi chứa các dòng học viên
  const tbody =
    document.getElementById("student-table-body") ||
    document.querySelector("tbody");
  if (!tbody) return;

  // Lấy danh sách tất cả các dòng (tr) đang hiển thị trong bảng
  const rows = tbody.getElementsByTagName("tr");

  // 3. Vòng lặp quét qua từng dòng một để kiểm tra thông tin
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    // Cột 1 là ID (Mã số), Cột 2 là Họ và Tên (Dựa theo cấu trúc bảng của bạn)
    const idText = row.cells[0] ? row.cells[0].innerText.toLowerCase() : "";
    const nameText = row.cells[1] ? row.cells[1].innerText.toLowerCase() : "";

    // 4. KIỂM TRA: Nếu cột ID hoặc cột Tên chứa từ khóa tìm kiếm
    if (idText.includes(keyword) || nameText.includes(keyword)) {
      row.style.display = ""; // Khớp từ khóa -> Hiển thị dòng này
    } else {
      row.style.display = "none"; // Không khớp -> Ẩn dòng này đi
    }
  }
}
