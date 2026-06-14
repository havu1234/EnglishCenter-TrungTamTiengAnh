/**
 * Diemdanh.js - Quản lý điểm danh
 */

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('filterDate');
    const attendanceDateInput = document.getElementById('inputAttendanceDate');
    if (dateInput) dateInput.value = today;
    if (attendanceDateInput) attendanceDateInput.value = today;
    
    loadClassesForFilter();
    loadAttendance();
    loadStats();
});

/**
 * Load classes for filter dropdown
 */
async function loadClassesForFilter() {
    try {
        const response = await fetch(`${API_BASE}/classes`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const data = await response.json();
            const classes = data.data || data || [];
            
            // Populate filter dropdown
            const filterSelect = document.getElementById('filterClass');
            if (filterSelect) {
                filterSelect.innerHTML = '<option value="">Tất cả lớp</option>';
                classes.forEach(cls => {
                    const option = document.createElement('option');
                    option.value = cls._id || cls.id;
                    option.textContent = `${cls.maLop || cls.code} - ${cls.tenLop || cls.name}`;
                    filterSelect.appendChild(option);
                });
            }

            // Populate quick attendance dropdown
            const attendanceSelect = document.getElementById('selectClassAttendance');
            if (attendanceSelect) {
                attendanceSelect.innerHTML = '<option value="">-- Chọn lớp --</option>';
                classes.forEach(cls => {
                    const option = document.createElement('option');
                    option.value = cls._id || cls.id;
                    option.textContent = `${cls.maLop || cls.code} - ${cls.tenLop || cls.name}`;
                    attendanceSelect.appendChild(option);
                });
            }
        }
    } catch (error) {
        console.error('Error loading classes:', error);
    }
}

/**
 * Load attendance records from API
 */
async function loadAttendance() {
    try {
        const searchQuery = document.getElementById('searchAttendance')?.value.trim() || '';
        const classFilter = document.getElementById('filterClass')?.value || '';
        const dateFilter = document.getElementById('filterDate')?.value || '';
        
        let url = `${API_BASE}/attendance?`;
        if (searchQuery) url += `search=${encodeURIComponent(searchQuery)}&`;
        if (classFilter) url += `classId=${encodeURIComponent(classFilter)}&`;
        if (dateFilter) url += `date=${encodeURIComponent(dateFilter)}&`;

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
            const attendanceRecords = data.data || data || [];
            displayAttendance(attendanceRecords);
            updateStats(attendanceRecords);
        }
    } catch (error) {
        console.error('Error loading attendance:', error);
        showNotification('Không thể tải danh sách điểm danh', 'error');
    }
}

/**
 * Display attendance in table
 */
function displayAttendance(records) {
    const tbody = document.getElementById('attendanceTableBody');
    
    if (!records || records.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">Không có dữ liệu điểm danh</td></tr>';
        return;
    }

    tbody.innerHTML = records.map((record, index) => {
        const studentName = record.hocVien?.hoTen || record.studentName || 'N/A';
        const className = record.lopHoc?.tenLop || record.className || 'N/A';
        const date = record.ngay || record.date;
        const status = record.trangThai || record.status || 'Chưa điểm danh';
        const note = record.ghiChu || record.note || '';
        
        let statusClass = '';
        if (status === 'Có mặt') statusClass = 'status-active';
        else if (status === 'Vắng mặt') statusClass = 'status-dropped';
        else if (status === 'Có phép') statusClass = 'status-pending';

        return `
            <tr>
                <td>${index + 1}</td>
                <td>${studentName}</td>
                <td>${className}</td>
                <td>${date ? formatDate(date) : 'N/A'}</td>
                <td><span class="status-badge ${statusClass}">${status}</span></td>
                <td>${note}</td>
                <td>
                    <button class="btn-primary btn-sm" onclick="editAttendance('${record._id || record.id}')">Sửa</button>
                </td>
            </tr>
        `;
    }).join('');
}

/**
 * Update statistics
 */
function updateStats(records) {
    const present = records.filter(r => (r.trangThai || r.status) === 'Có mặt').length;
    const absent = records.filter(r => (r.trangThai || r.status) === 'Vắng mặt').length;
    const total = records.length;
    const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : 0;

    document.getElementById('statPresent').textContent = present;
    document.getElementById('statAbsent').textContent = absent;
    document.getElementById('statPercentage').textContent = `${percentage}%`;
}

/**
 * Load summary statistics
 */
async function loadStats() {
    try {
        const response = await fetch(`${API_BASE}/attendance/stats`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const data = await response.json();
            document.getElementById('statPresent').textContent = data.presentCount || 0;
            document.getElementById('statAbsent').textContent = data.absentCount || 0;
            document.getElementById('statPercentage').textContent = `${data.percentage || 0}%`;
        }
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

/**
 * Mark all students present
 */
async function markAllPresent() {
    const classId = document.getElementById('selectClassAttendance')?.value;
    const date = document.getElementById('inputAttendanceDate')?.value;

    if (!classId || !date) {
        showNotification('Vui lòng chọn lớp học và ngày', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/attendance/mark-all`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                lopHoc: classId,
                ngay: date,
                trangThai: 'Có mặt',
            }),
        });

        if (response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login.html';
            return;
        }

        if (response.ok) {
            showNotification('Đã điểm danh tất cả có mặt!', 'success');
            loadAttendance();
        } else {
            const errorData = await response.json();
            showNotification(errorData.message || 'Không thể điểm danh', 'error');
        }
    } catch (error) {
        console.error('Error marking attendance:', error);
        showNotification('Lỗi kết nối', 'error');
    }
}

/**
 * Mark all students absent
 */
async function markAllAbsent() {
    const classId = document.getElementById('selectClassAttendance')?.value;
    const date = document.getElementById('inputAttendanceDate')?.value;

    if (!classId || !date) {
        showNotification('Vui lòng chọn lớp học và ngày', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/attendance/mark-all`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                lopHoc: classId,
                ngay: date,
                trangThai: 'Vắng mặt',
            }),
        });

        if (response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login.html';
            return;
        }

        if (response.ok) {
            showNotification('Đã điểm danh tất cả vắng mặt!', 'success');
            loadAttendance();
        } else {
            const errorData = await response.json();
            showNotification(errorData.message || 'Không thể điểm danh', 'error');
        }
    } catch (error) {
        console.error('Error marking attendance:', error);
        showNotification('Lỗi kết nối', 'error');
    }
}

/**
 * Edit attendance record
 */
function editAttendance(id) {
    showNotification('Chức năng chỉnh sửa đang được phát triển', 'info');
}
