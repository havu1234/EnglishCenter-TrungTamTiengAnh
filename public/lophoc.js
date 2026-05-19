// Tự động chạy tải danh sách lớp ngay khi mở trang
document.addEventListener("DOMContentLoaded", () => {
  loadClasses();
});

// 1. Hàm tải danh sách lớp học (Kết hợp bộ lọc Tìm kiếm)
async function loadClasses() {
  const searchKeyword = document.getElementById("search-class-input").value;
  const tbody = document.getElementById("class-table-body");
  if (!tbody) return;

  try {
    // Gửi từ khóa tìm kiếm lên API dưới dạng Query Parameter
    const response = await fetch(
      `/api/classes?search=${encodeURIComponent(searchKeyword)}`,
    );
    const classes = await response.json();

    tbody.innerHTML = "";

    if (classes.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#999;">Không tìm thấy lớp học nào</td></tr>`;
      return;
    }

    classes.forEach((c) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
                <td><strong>${c.maLop}</strong></td>
                <td>${c.tenLop}</td>
                <td>${c.giaoVien}</td>
                <td>${c.siSoHienTai}/${c.siSoToiDa}</td>
                <td>${c.lichHoc}</td>
            `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách lớp học:", error);
  }
}

// 2. Hàm xử lý khi bấm Thêm lớp học mới
async function handleAddClass(event) {
  event.preventDefault();

  const data = {
    tenLop: document.getElementById("input-tenLop").value,
    giaoVien: document.getElementById("input-giaoVien").value,
    loaiLop: document.getElementById("select-loaiLop").value,
    siSoToiDa: parseInt(document.getElementById("input-siSoToiDa").value),
    lichHoc: document.getElementById("input-lichHoc").value,
  };

  try {
    const response = await fetch("/api/classes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      alert("Thêm lớp học mới thành công!");
      document.getElementById("add-class-form").reset(); // Xóa sạch form
      loadClasses(); // Tải lại bảng ngay lập tức
    } else {
      const resData = await response.json();
      alert("Lỗi: " + resData.message);
    }
  } catch (error) {
    alert("Lỗi kết nối Server khi thêm lớp!");
  }
}
