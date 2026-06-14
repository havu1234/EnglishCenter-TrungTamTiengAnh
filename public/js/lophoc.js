/**
 * Lophoc.js - Quản lý lớp học
 */

let currentEditId = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadClasses();
    setupClassModal();
});

/**
 * Setup class modal
 */
function setupClassModal() {
    const btnAdd = document.getElementById('btnAddClass');
    const btnClose = document.getElementById('closeClassModal');
    const btnCancel = document.getElementById('cancelClassModal');
    const form = document.getElementById('classForm');
    
    if (btnAdd) btnAdd.addEventListener('click', () => openClassModal());
    if (btnClose) btnClose.addEventListener('click', closeClassModal);
    if (btnCancel) btnCancel.addEventListener('click', closeClassModal);
    if (form) form.addEventListener('submit', handleSubmitClass);
}

/**
 * Load classes from API
 */
async function loadClasses() {
    try {
        const searchQuery = document.getElementById('searchClass')?.value.trim() || '';
        const url = searchQuery
            ? `${API_BASE}/classes?search=${encodeURIComponent(searchQuery)}`
            : `${API_BASE}/classes`;

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
            const classes = data.data || data || [];
            displayClasses(classes);
        }
    } catch (error) {
        console.error('Error loading classes:', error);
        showNotification('Không thể tải danh sách lớp học', 'error');
    }
}

/**
 * Display classes in table
 */
function displayClasses(classes) {
    const tbody = document.getElementById('classesTableBody');
    
    if (!classes || classes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">Không có lớp học nào</td></tr>';
        return;
    }

    tbody.innerHTML = classes.map(cls => {
        const code = cls.maLop || cls.code || 'N/A';
        const name = cls.tenLop || cls.name || 'N/A';
        const teacher = cls.giaoVien || cls.teacher || 'Chưa phân công';
        const currentSize = cls.siSoHienTai || cls.currentSize || 0;
        const maxSize = cls.siSoToiDa || cls.maxSize || 0;
        const schedule = cls.lichHoc || cls.schedule || 'Chưa xếp lịch';

        return `
            <tr>
                <td>${code}</td>
                <td>${name}</td>
                <td>${teacher}</td>
                <td>${currentSize}/${maxSize}</td>
                <td>${schedule}</td>
                <td>
                    <button class="btn-primary btn-sm" onclick="openClassModal('${cls._id || cls.id}')">Sửa</button>
                    <button class="btn-danger btn-sm" onclick="deleteClass('${cls._id || cls.id}')">Xóa</button>
                </td>
            </tr>
        `;
    }).join('');
}

/**
 * Open class modal
 */
async function openClassModal(classId = null) {
    currentEditId = classId;
    const modal = document.getElementById('classModal');
    const title = document.getElementById('classModalTitle');
    const form = document.getElementById('classForm');
    
    if (classId) {
        title.textContent = 'Sửa Thông Tin Lớp Học';
        await loadClassData(classId);
    } else {
        title.textContent = 'Thêm Lớp Học';
        form.reset();
    }
    
    modal.classList.remove('hidden');
}

/**
 * Close class modal
 */
function closeClassModal() {
    const modal = document.getElementById('classModal');
    modal.classList.add('hidden');
    currentEditId = null;
}

/**
 * Load class data for editing
 */
async function loadClassData(classId) {
    try {
        const response = await fetch(`${API_BASE}/classes/${classId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            const result = await response.json();
            const cls = result.data || result;
            const form = document.getElementById('classForm');
            
            form.querySelector('[name="tenLop"]').value = cls.tenLop || cls.name || '';
            form.querySelector('[name="giaoVien"]').value = cls.giaoVien || cls.teacher || '';
            form.querySelector('[name="loaiKhoaHoc"]').value = cls.loaiKhoaHoc || cls.courseType || '';
            form.querySelector('[name="siSoToiDa"]').value = cls.siSoToiDa || cls.maxSize || '';
            form.querySelector('[name="lichHoc"]').value = cls.lichHoc || cls.schedule || '';
        }
    } catch (error) {
        console.error('Error loading class:', error);
        showNotification('Không thể tải thông tin lớp học', 'error');
    }
}

/**
 * Handle form submit
 */
async function handleSubmitClass(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        tenLop: formData.get('tenLop'),
        giaoVien: formData.get('giaoVien'),
        loaiKhoaHoc: formData.get('loaiKhoaHoc'),
        siSoToiDa: parseInt(formData.get('siSoToiDa')),
        lichHoc: formData.get('lichHoc')
    };
    
    try {
        let response;
        if (currentEditId) {
            response = await fetch(`${API_BASE}/classes/${currentEditId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });
        } else {
            response = await fetch(`${API_BASE}/classes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });
        }
        
        if (response.ok) {
            showNotification(currentEditId ? 'Cập nhật thành công!' : 'Thêm lớp học thành công!', 'success');
            closeClassModal();
            loadClasses();
        } else {
            const error = await response.json();
            showNotification(error.message || 'Có lỗi xảy ra', 'error');
        }
    } catch (error) {
        console.error('Error saving class:', error);
        showNotification('Lỗi kết nối', 'error');
    }
}

/**
 * Delete class
 */
async function deleteClass(id) {
    if (!confirm('Bạn có chắc chắn muốn xóa lớp học này?')) return;
    
    try {
        const response = await fetch(`${API_BASE}/classes/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            showNotification('Xóa lớp học thành công!', 'success');
            loadClasses();
        } else {
            showNotification('Có lỗi xảy ra khi xóa', 'error');
        }
    } catch (error) {
        console.error('Error deleting class:', error);
        showNotification('Lỗi kết nối', 'error');
    }
}
