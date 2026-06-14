/**
 * Role-Based Access Control Middleware
 * Checks if user has required role to access resource
 */

/**
 * Check if user has one of the allowed roles
 * @param {Array} allowedRoles - Array of allowed role names
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Vui lòng đăng nhập để tiếp tục',
      });
    }
    
    // Check if user has required role
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền thực hiện thao tác này',
      });
    }
    
    next();
  };
};

/**
 * Check if user is admin
 */
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Vui lòng đăng nhập để tiếp tục',
    });
  }
  
  if (req.user.role !== 'Admin') {
    return res.status(403).json({
      success: false,
      message: 'Chỉ Admin mới có quyền thực hiện thao tác này',
    });
  }
  
  next();
};

/**
 * Check if user is teacher
 */
const isTeacher = (req, res, next) => {
  return authorize('Admin', 'Giao_Vien')(req, res, next);
};

/**
 * Check if user is receptionist
 */
const isReceptionist = (req, res, next) => {
  return authorize('Admin', 'Le_Tan')(req, res, next);
};

/**
 * Check if user is accountant
 */
const isAccountant = (req, res, next) => {
  return authorize('Admin', 'Ke_Toan')(req, res, next);
};

module.exports = {
  authorize,
  isAdmin,
  isTeacher,
  isReceptionist,
  isAccountant,
};
