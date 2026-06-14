/**
 * Dashboard JavaScript
 * Simple version for internship project
 */

const API_BASE = 'http://localhost:5000/api';
let currentUser = null;
let token = localStorage.getItem('token');

// Check authentication
if (!token) {
    window.location.href = '/pages/login.html';
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadCurrentUser();
    setupLogout();
    updateDate();
    loadDashboardData();
});

// Load current user
async function loadCurrentUser() {
    try {
        const response = await fetch(`${API_BASE}/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            currentUser = await response.json();
            document.getElementById('userName').textContent = currentUser.user.fullName;
            document.getElementById('userRole').textContent = currentUser.user.role;
        } else {
            localStorage.removeItem('token');
            window.location.href = '/pages/login.html';
        }
    } catch (error) {
        console.error('Error loading user:', error);
    }
}

// Setup logout
function setupLogout() {
    document.getElementById('btnLogout').addEventListener('click', async () => {
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
        window.location.href = '/pages/login.html';
    });
}

// Update date
function updateDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('currentDate').textContent = now.toLocaleDateString('vi-VN', options);
}

// Load dashboard data
async function loadDashboardData() {
    try {
        // Load students count
        const studentsResponse = await fetch(`${API_BASE}/students`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (studentsResponse.ok) {
            const studentsData = await studentsResponse.json();
            const students = studentsData.data || studentsData || [];
            const totalStudents = students.length;
            const activeStudents = students.filter(s => 
                (s.trangThai || s.status) === 'Đang học'
            ).length;
            
            document.getElementById('totalStudents').textContent = totalStudents;
            document.getElementById('activeStudents').textContent = activeStudents;
        }
        
        // Load classes count
        const classesResponse = await fetch(`${API_BASE}/classes`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (classesResponse.ok) {
            const classesData = await classesResponse.json();
            const classes = classesData.data || classesData || [];
            document.getElementById('totalClasses').textContent = classes.length;
        }
        
        // Load tuition summary
        const tuitionResponse = await fetch(`${API_BASE}/tuition/summary`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (tuitionResponse.ok) {
            const tuitionData = await tuitionResponse.json();
            const revenue = tuitionData.totalRevenueThisMonth || 0;
            document.getElementById('revenue').textContent = formatCurrency(revenue);
        }
    } catch (error) {
        console.error('Error loading dashboard data:', error);
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
