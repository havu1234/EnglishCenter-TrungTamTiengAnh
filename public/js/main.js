/**
 * Main.js - Quản lý học viên
 */

let currentEditId = null;
let allClasses = [];

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadClassesForSelect();
    loadStudents();
    setupStudentModal();
    setupSearch();
});

/**
 * Setup student modal
 */
function setupStudentModal() {
    const btnAdd = document.getElementById('btnAddStudent');
    const btnClose = document.getElementById('closeStudentModal');
    const btnCancel = document.getElementById('cancelStudentModal');
    const form = document.getElementById('studentForm');
    
    if (btnAdd) btnAdd.addEventListener('click', () => openStudentModal());
    if (btnClose) btnClose.addEventListener('click', closeStudentModal);
    if (btnCancel) btnCancel.addEventListener('click', closeStudentModal);
    if (form) form.addEventListener('submit', handleSubmitStudent);
}

/**
 * Setup search
 */
function setupSearch() {
    const searchInput = document.getElementById('searchStudent');
    if (searchInput) {
        searchInput.addEventListener('input', loadStudents);
    }
}

/**
 * Load classes for select dropdown
 */
async function loadClassesForSelect() {
    try {
        const response = await fetch(`${API_BASE}/classes`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const data = await response.json();
            allClasses = data.data || data || [];
            
            const select = document.getElementById('studentClassSelect');
            if (select) {
                select.innerHTML = '<option value="">-- Chọn lớp --</option>';
                allClasses.forEach(cls => {
                    const option = document.createElement('option');
                    option.value = cls._id || cls.id;
                    option.textContent = `${cls.maLop || cls.code} - ${cls.tenLop || cls.name}`;
                    select.appendChild(option);
                });
            }
        }
    } catch (error) {
        console.error('Error loading classes:', error);
    }
}

/**
 * Load students from API
 */
async function loadStudents() {
    try {
        const searchQuery = document.getElementById('searchStudent')?.value.trim() || '';
        const url = searchQuery
            ? `${API_BASE}/students?search=${encodeURIComponent(searchQuery)}`
            : `${API_BASE}/students`;

        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login.html';
            return;
        }

        if (response.ok) {
            const data = await response.json();
            const students = data.data || data || [];
            displayStudents(students);
        }
    } catch (error) {
        console.error('Error loading students:', error);
        showNotification('Không thể tải danh sách học viên', 'error');
    }
}

/**
 * Display students in table
 */
function displayStudents(students) {
    const tbody = document.getElementById('studentsTableBody');
    
    if (!students || students.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">Không có học viên nào</td></tr>';
        return;
    }

    tbody.innerHTML = students.map(student => {
        const name = student.hoTen || student.fullName || 'N/A';
        const phone = student.soDienThoai || student.phone || 'N/A';
        const email = student.email || '-';
        const className = student.lopHoc?.tenLop || student.className || 'Chưa xếp lớp';
        const enrollDate = student.ngayNhapHoc || student.enrollDate;
        const status = student.trangThai || student.status || 'Đang học';
        
        let statusClass = '';
        if (status === 'Đang học') statusClass = 'status-active';
        else if (status === 'Bảo lưu') statusClass = 'status-pending';
        else if (status === 'Đã nghỉ') statusClass = 'status-dropped';
        else if (status === 'Hoàn thành') statusClass = 'status-done';

        return `
            <tr>
                <td>${name}</td>
                <td>${phone}</td>
                <td>${email}</td>
                <td>${className}</td>
                <td>${enrollDate ? formatDate(enrollDate) : 'N/A'}</td>
                <td><span class="status-badge ${statusClass}">${status}</span></td>
                <td>
                    <button class="btn-primary btn-sm" onclick="openStudentModal('${student._id || student.id}')">Sửa</button>
                    <button class="btn-danger btn-sm" onclick="deleteStudent('${student._id || student.id}')">Xóa</button>
                </td>
            </tr>
        `;
    }).join('');
}

/**
 * Open student modal
 */
async function openStudentModal(studentId = null) {
    currentEditId = studentId;
    const modal = document.getElementById('studentModal');
    const title = document.getElementById('studentModalTitle');
    const form = document.getElementById('studentForm');
    
    if (studentId) {
        title.textContent = 'Sửa Thông Tin Học Viên';
        await loadStudentData(studentId);
    } else {
        title.textContent = 'Thêm Học Viên';
        form.reset();
    }
    
    modal.classList.remove('hidden');
}

/**
 * Close student modal
 */
function closeStudentModal() {
    const modal = document.getElementById('studentModal');
    modal.classList.add('hidden');
    currentEditId = null;
}

/**
 * Load student data for editing
 */
async function loadStudentData(studentId) {
    try {
        const response = await fetch(`${API_BASE}/students/${studentId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            const result = await response.json();
            const student = result.data || result;
            const form = document.getElementById('studentForm');
            
            form.querySelector('[name="fullName"]').value = student.hoTen || student.fullName || '';
            form.querySelector('[name="phone"]').value = student.soDienThoai || student.phone || '';
            form.querySelector('[name="email"]').value = student.email || '';
            form.querySelector('[name="classId"]').value = student.lopHoc?._id || student.classId || '';
            form.querySelector('[name="status"]').value = student.trangThai || student.status || 'Đang học';
        }
    } catch (error) {
        console.error('Error loading student:', error);
        showNotification('Không thể tải thông tin học viên', 'error');
    }
}

/**
 * Handle form submit
 */
async function handleSubmitStudent(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        hoTen: formData.get('fullName'),
        soDienThoai: formData.get('phone'),
        email: formData.get('email'),
        lopHoc: formData.get('classId'),
        trangThai: formData.get('status')
    };
    
    try {
        let response;
        if (currentEditId) {
            response = await fetch(`${API_BASE}/students/${currentEditId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });
        } else {
            response = await fetch(`${API_BASE}/students`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });
        }
        
        if (response.ok) {
            showNotification(currentEditId ? 'Cập nhật thành công!' : 'Thêm học viên thành công!', 'success');
            closeStudentModal();
            loadStudents();
        } else {
            const error = await response.json();
            showNotification(error.message || 'Có lỗi xảy ra', 'error');
        }
    } catch (error) {
        console.error('Error saving student:', error);
        showNotification('Lỗi kết nối', 'error');
    }
}

/**
 * Delete student
 */
async function deleteStudent(id) {
    if (!confirm('Bạn có chắc chắn muốn xóa học viên này?')) return;
    
    try {
        const response = await fetch(`${API_BASE}/students/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            showNotification('Xóa học viên thành công!', 'success');
            loadStudents();
        } else {
            showNotification('Có lỗi xảy ra khi xóa', 'error');
        }
    } catch (error) {
        console.error('Error deleting student:', error);
        showNotification('Lỗi kết nối', 'error');
    }
}
