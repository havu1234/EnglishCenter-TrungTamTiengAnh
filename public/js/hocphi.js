/**
 * Hocphi.js - Quản lý học phí
 */

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadTuitions();
    loadSummary();
});

/**
 * Load tuitions from API
 */
async function loadTuitions() {
    try {
        const searchQuery = document.getElementById('searchTuition')?.value.trim() || '';
        const statusFilter = document.getElementById('filterStatus')?.value || '';
        
        let url = `${API_BASE}/tuition?`;
        if (searchQuery) url += `search=${encodeURIComponent(searchQuery)}&`;
        if (statusFilter) url += `status=${encodeURIComponent(statusFilter)}&`;

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
            const tuitions = data.data || data || [];
            displayTuitions(tuitions);
        }
    } catch (error) {
        console.error('Error loading tuitions:', error);
        showNotification('Không thể tải danh sách học phí', 'error');
    }
}

/**
 * Display tuitions in table
 */
function displayTuitions(tuitions) {
    const tbody = document.getElementById('tuitionTableBody');
    
    if (!tuitions || tuitions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">Không có dữ liệu học phí</td></tr>';
        return;
    }

    tbody.innerHTML = tuitions.map(tuition => {
        const studentName = tuition.hocVien?.hoTen || tuition.studentName || 'N/A';
        const className = tuition.lopHoc?.tenLop || tuition.className || 'N/A';
        const total = tuition.tongSoTienPhaiDong || tuition.totalAmount || 0;
        const paid = tuition.soTienDaDong || tuition.paidAmount || 0;
        const remaining = total - paid;
        const status = tuition.trangThai || tuition.status || calculateStatus(paid, total);
        const deadline = tuition.ngayDenHan || tuition.deadline;
        
        let statusClass = '';
        if (status === 'Đã đóng') statusClass = 'status-active';
        else if (status === 'Chưa đóng') statusClass = 'status-dropped';
        else statusClass = 'status-pending';

        return `
            <tr>
                <td>${studentName}</td>
                <td>${className}</td>
                <td>${formatCurrency(total)}</td>
                <td>${formatCurrency(paid)}</td>
                <td>${formatCurrency(remaining)}</td>
                <td><span class="status-badge ${statusClass}">${status}</span></td>
                <td>${deadline ? formatDate(deadline) : 'N/A'}</td>
            </tr>
        `;
    }).join('');
}

/**
 * Load summary statistics
 */
async function loadSummary() {
    try {
        const response = await fetch(`${API_BASE}/tuition/summary`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const data = await response.json();
            document.getElementById('statUnpaid').textContent = data.unpaidCount || 0;
            document.getElementById('statPartial').textContent = data.partialCount || 0;
            document.getElementById('statRevenue').textContent = formatCurrency(data.totalRevenueThisMonth || 0);
        }
    } catch (error) {
        console.error('Error loading summary:', error);
    }
}

/**
 * Calculate tuition status
 */
function calculateStatus(paid, total) {
    if (paid === 0) return 'Chưa đóng';
    if (paid >= total) return 'Đã đóng';
    return 'Đóng một phần';
}
