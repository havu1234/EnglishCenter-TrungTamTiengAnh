/**
 * Login Page JavaScript
 * Handles authentication and form validation
 */

// DOM Elements
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const btnLogin = document.getElementById('btnLogin');
const btnText = document.querySelector('.btn-text');
const btnLoader = document.querySelector('.btn-loader');
const togglePassword = document.getElementById('togglePassword');
const alertError = document.getElementById('alertError');
const alertMessage = document.getElementById('alertMessage');
const usernameError = document.getElementById('usernameError');
const passwordError = document.getElementById('passwordError');
const rememberMe = document.getElementById('rememberMe');

// Constants
const API_BASE_URL = 'http://localhost:5000/api';
const MAX_USERNAME_LENGTH = 50;
const MIN_PASSWORD_LENGTH = 8;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes

// State
let loginAttempts = 0;
let isLocked = false;

// ===========================
// Initialization
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    checkLockoutStatus();
    loadRememberedUsername();
    setupEventListeners();
    
    // Auto-focus username field
    usernameInput.focus();
});

// ===========================
// Event Listeners
// ===========================
function setupEventListeners() {
    // Form submission
    loginForm.addEventListener('submit', handleLogin);
    
    // Toggle password visibility
    togglePassword.addEventListener('click', togglePasswordVisibility);
    
    // Real-time validation
    usernameInput.addEventListener('input', () => validateField('username'));
    passwordInput.addEventListener('input', () => validateField('password'));
    
    // Clear errors on focus
    usernameInput.addEventListener('focus', () => clearError('username'));
    passwordInput.addEventListener('focus', () => clearError('password'));
    
    // Prevent spaces in username
    usernameInput.addEventListener('keypress', (e) => {
        if (e.key === ' ') {
            e.preventDefault();
        }
    });
    
    // Enable/disable login button based on input
    usernameInput.addEventListener('input', updateLoginButtonState);
    passwordInput.addEventListener('input', updateLoginButtonState);
}

// ===========================
// Login Handler
// ===========================
async function handleLogin(e) {
    e.preventDefault();
    
    // Check if locked
    if (isLocked) {
        showAlert('Tài khoản bị khóa tạm thời. Vui lòng thử lại sau 15 phút.', 'error');
        return;
    }
    
    // Validate all fields
    const isUsernameValid = validateField('username');
    const isPasswordValid = validateField('password');
    
    if (!isUsernameValid || !isPasswordValid) {
        return;
    }
    
    // Get form data
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    const remember = rememberMe.checked;
    
    // Show loading state
    setLoadingState(true);
    hideAlert();
    
    try {
        // Call login API
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Login successful
            handleLoginSuccess(data, username, remember);
        } else {
            // Login failed
            handleLoginFailure(data.message || 'Đăng nhập thất bại');
        }
    } catch (error) {
        console.error('Login error:', error);
        handleLoginFailure('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
    } finally {
        setLoadingState(false);
    }
}

// ===========================
// Login Success/Failure
// ===========================
function handleLoginSuccess(data, username, remember) {
    // Reset login attempts
    loginAttempts = 0;
    localStorage.removeItem('loginAttempts');
    localStorage.removeItem('lockoutTime');
    
    // Save JWT token
    localStorage.setItem('token', data.token);
    localStorage.setItem('userRole', data.role);
    localStorage.setItem('userName', data.fullName || username);
    
    // Remember username if checked
    if (remember) {
        localStorage.setItem('rememberedUsername', username);
    } else {
        localStorage.removeItem('rememberedUsername');
    }
    
    // Show success message
    showAlert('Đăng nhập thành công! Đang chuyển hướng...', 'success');
    
    // Redirect based on role
    setTimeout(() => {
        redirectToDashboard(data.role);
    }, 1000);
}

function handleLoginFailure(message) {
    // Increment login attempts
    loginAttempts++;
    localStorage.setItem('loginAttempts', loginAttempts);
    
    // Check if should lock account
    if (loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        lockAccount();
        showAlert('Tài khoản bị khóa tạm thời do đăng nhập sai quá nhiều lần. Vui lòng thử lại sau 15 phút.', 'error');
    } else {
        const remainingAttempts = MAX_LOGIN_ATTEMPTS - loginAttempts;
        showAlert(`${message}. Còn ${remainingAttempts} lần thử.`, 'error');
    }
    
    // Shake the form
    loginForm.classList.add('shake');
    setTimeout(() => loginForm.classList.remove('shake'), 500);
}

// ===========================
// Account Lockout
// ===========================
function lockAccount() {
    isLocked = true;
    const lockoutTime = Date.now() + LOCKOUT_TIME;
    localStorage.setItem('lockoutTime', lockoutTime);
    
    // Disable form
    usernameInput.disabled = true;
    passwordInput.disabled = true;
    btnLogin.disabled = true;
    
    // Start countdown
    startLockoutCountdown(lockoutTime);
}

function checkLockoutStatus() {
    const lockoutTime = localStorage.getItem('lockoutTime');
    const attempts = localStorage.getItem('loginAttempts');
    
    if (lockoutTime) {
        const now = Date.now();
        if (now < parseInt(lockoutTime)) {
            // Still locked
            isLocked = true;
            usernameInput.disabled = true;
            passwordInput.disabled = true;
            btnLogin.disabled = true;
            startLockoutCountdown(parseInt(lockoutTime));
        } else {
            // Lockout expired
            unlockAccount();
        }
    }
    
    if (attempts) {
        loginAttempts = parseInt(attempts);
    }
}

function unlockAccount() {
    isLocked = false;
    loginAttempts = 0;
    localStorage.removeItem('lockoutTime');
    localStorage.removeItem('loginAttempts');
    
    usernameInput.disabled = false;
    passwordInput.disabled = false;
    btnLogin.disabled = false;
    
    hideAlert();
}

function startLockoutCountdown(lockoutTime) {
    const updateCountdown = () => {
        const now = Date.now();
        const remaining = lockoutTime - now;
        
        if (remaining <= 0) {
            unlockAccount();
            return;
        }
        
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        
        showAlert(`Tài khoản bị khóa. Vui lòng thử lại sau ${minutes}:${seconds.toString().padStart(2, '0')}`, 'error');
        
        setTimeout(updateCountdown, 1000);
    };
    
    updateCountdown();
}

// ===========================
// Validation
// ===========================
function validateField(fieldName) {
    if (fieldName === 'username') {
        const username = usernameInput.value.trim();
        
        if (!username) {
            showFieldError('username', 'Vui lòng nhập tên đăng nhập');
            return false;
        }
        
        if (username.length > MAX_USERNAME_LENGTH) {
            showFieldError('username', `Tên đăng nhập không được vượt quá ${MAX_USERNAME_LENGTH} ký tự`);
            return false;
        }
        
        clearError('username');
        return true;
    }
    
    if (fieldName === 'password') {
        const password = passwordInput.value;
        
        if (!password) {
            showFieldError('password', 'Vui lòng nhập mật khẩu');
            return false;
        }
        
        clearError('password');
        return true;
    }
    
    return true;
}

function showFieldError(fieldName, message) {
    if (fieldName === 'username') {
        usernameInput.classList.add('error');
        usernameError.textContent = message;
        usernameError.classList.add('show');
    } else if (fieldName === 'password') {
        passwordInput.classList.add('error');
        passwordError.textContent = message;
        passwordError.classList.add('show');
    }
}

function clearError(fieldName) {
    if (fieldName === 'username') {
        usernameInput.classList.remove('error');
        usernameError.classList.remove('show');
    } else if (fieldName === 'password') {
        passwordInput.classList.remove('error');
        passwordError.classList.remove('show');
    }
}

// ===========================
// UI Helpers
// ===========================
function togglePasswordVisibility() {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    
    // Update icon (optional: change eye icon)
    togglePassword.classList.toggle('active');
}

function updateLoginButtonState() {
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    
    btnLogin.disabled = !username || !password || isLocked;
}

function setLoadingState(loading) {
    if (loading) {
        btnLogin.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'flex';
        usernameInput.disabled = true;
        passwordInput.disabled = true;
    } else {
        btnLogin.disabled = false;
        btnText.style.display = 'block';
        btnLoader.style.display = 'none';
        usernameInput.disabled = false;
        passwordInput.disabled = false;
    }
}

function showAlert(message, type = 'error') {
    alertMessage.textContent = message;
    alertError.className = `alert alert-${type}`;
    alertError.style.display = 'flex';
}

function hideAlert() {
    alertError.style.display = 'none';
}

// ===========================
// Remember Username
// ===========================
function loadRememberedUsername() {
    const rememberedUsername = localStorage.getItem('rememberedUsername');
    if (rememberedUsername) {
        usernameInput.value = rememberedUsername;
        rememberMe.checked = true;
        passwordInput.focus();
    }
}

// ===========================
// Redirect
// ===========================
function redirectToDashboard(role) {
    // Redirect to dashboard for all roles
    window.location.href = '/pages/dashboard.html';
}

// ===========================
// Keyboard Shortcuts
// ===========================
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to submit
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        loginForm.dispatchEvent(new Event('submit'));
    }
});
