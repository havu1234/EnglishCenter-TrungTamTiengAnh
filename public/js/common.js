/**
 * Common JavaScript - Shared functionality across all pages
 */

const API_BASE = 'http://localhost:5000/api';
let currentUser = null;
let token = localStorage.getItem('token');

// Check authentication
if (!token) {
    window.location.href = '/login.html';
}

/**
 * Initialize common functionality
 */
function initCommon() {
    loadCurrentUser();
    setupLogout();
    updateDate();
}

/**
 * Load current user info
 */
async function loadCurrentUser() {
    try {
        const response = await fetch(`${API_BASE}/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            currentUser = await response.json();
            const userNameEl = document.getElementById('userName');
            const userRoleEl = document.getElementById('userRole');
            
            if (userNameEl) userNameEl.textContent = currentUser.user?.fullName || currentUser.user?.username || 'User';
            if (userRoleEl) userRoleEl.textContent = getRoleDisplayName(currentUser.user?.role);
        } else {
            localStorage.removeItem('token');
            window.location.href = '/login.html';
        }
    } catch (error) {
        console.error('Error loading user:', error);
        // If API not available, show default
        const userNameEl = document.getElementById('userName');
        const userRoleEl = document.getElementById('userRole');
        if (userNameEl) userNameEl.textContent = 'User';
        if (userRoleEl) userRoleEl.textContent = 'Unknown';
    }
}

/**
 * Get role display name
 */
function getRoleDisplayName(role) {
    const roleMap = {
        'Admin': 'Quản trị viên',
        'Giao_Vien': 'Giáo viên',
        'Le_Tan': 'Lễ tân',
        'Ke_Toan': 'Kế toán'
    };
    return roleMap[role] || role || 'Unknown';
}

/**
 * Setup logout button
 */
function setupLogout() {
    const logoutBtn = document.getElementById('btnLogout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await fetch(`${API_BASE}/auth/logout`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            } catch (error) {
                console.error('Logout error:', error);
            }
            
            localStorage.removeItem('token');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userName');
            window.location.href = '/login.html';
        });
    }
}

/**
 * Update current date display
 */
function updateDate() {
    const dateEl = document.getElementById('currentDate');
    if (dateEl) {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateEl.textContent = now.toLocaleDateString('vi-VN', options);
    }
}

/**
 * Format currency
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);
}

/**
 * Format date
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6'};
        color: white;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        font-size: 0.875rem;
        font-weight: 500;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .status-pending {
        background: #FEF3C7;
        color: #92400E;
    }
    
    .status-dropped {
        background: #FEE2E2;
        color: #991B1B;
    }
    
    .status-done {
        background: #DBEAFE;
        color: #1E40AF;
    }
`;
document.head.appendChild(style);

// Auto-initialize common functionality
document.addEventListener('DOMContentLoaded', initCommon);
