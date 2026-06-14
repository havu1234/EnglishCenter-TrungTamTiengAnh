/**
 * Authentication Controller
 * Handles login, logout, and token refresh
 */

const User = require('../models/User');
const { generateToken } = require('../utils/jwt');

/**
 * Login user
 * POST /api/auth/login
 */
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập tên đăng nhập và mật khẩu',
      });
    }
    
    // Find user by username
    const user = await User.findOne({ username: username.toLowerCase() });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Tên đăng nhập hoặc mật khẩu không đúng',
      });
    }
    
    // Check if account is locked
    if (user.isLocked) {
      const lockTimeRemaining = Math.ceil((user.lockUntil - Date.now()) / 60000);
      return res.status(403).json({
        success: false,
        message: `Tài khoản bị khóa tạm thời, vui lòng thử lại sau ${lockTimeRemaining} phút`,
      });
    }
    
    // Check if account is disabled
    if (user.status === 'Vô hiệu') {
      return res.status(403).json({
        success: false,
        message: 'Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ Admin.',
      });
    }
    
    // Compare password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      // Increment login attempts
      await user.incLoginAttempts();
      
      // Check if account is now locked
      const updatedUser = await User.findById(user._id);
      if (updatedUser.isLocked) {
        return res.status(403).json({
          success: false,
          message: 'Tài khoản bị khóa tạm thời do đăng nhập sai quá nhiều lần. Vui lòng thử lại sau 15 phút.',
        });
      }
      
      const remainingAttempts = 5 - updatedUser.loginAttempts;
      return res.status(401).json({
        success: false,
        message: `Tên đăng nhập hoặc mật khẩu không đúng. Còn ${remainingAttempts} lần thử.`,
      });
    }
    
    // Reset login attempts on successful login
    await user.resetLoginAttempts();
    
    // Generate JWT token
    const token = generateToken({
      userId: user._id,
      username: user.username,
      role: user.role,
    });
    
    // Return success response
    res.json({
      success: true,
      message: 'Đăng nhập thành công',
      token,
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
      },
      role: user.role,
      fullName: user.fullName,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại sau.',
    });
  }
};

/**
 * Logout user
 * POST /api/auth/logout
 */
const logout = async (req, res) => {
  try {
    // In a stateless JWT system, logout is handled client-side
    // by removing the token from localStorage
    
    // Optionally, you can implement token blacklisting here
    
    res.json({
      success: true,
      message: 'Đăng xuất thành công',
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi đăng xuất',
    });
  }
};

/**
 * Get current user
 * GET /api/auth/me
 */
const getCurrentUser = async (req, res) => {
  try {
    // User is already attached by authenticate middleware
    res.json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi lấy thông tin người dùng',
    });
  }
};

/**
 * Refresh token
 * POST /api/auth/refresh
 */
const refreshToken = async (req, res) => {
  try {
    // User is already attached by authenticate middleware
    const user = req.user;
    
    // Generate new token
    const token = generateToken({
      userId: user._id,
      username: user.username,
      role: user.role,
    });
    
    res.json({
      success: true,
      message: 'Token đã được làm mới',
      token,
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi làm mới token',
    });
  }
};

module.exports = {
  login,
  logout,
  getCurrentUser,
  refreshToken,
};
