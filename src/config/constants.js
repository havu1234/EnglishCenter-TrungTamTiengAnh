/**
 * Application Constants
 */

const USER_ROLES = {
  ADMIN: 'Admin',
  TEACHER: 'Giao_Vien',
  RECEPTIONIST: 'Le_Tan',
  ACCOUNTANT: 'Ke_Toan',
};

const STUDENT_STATUS = {
  ACTIVE: 'Đang học',
  RESERVED: 'Bảo lưu',
  INACTIVE: 'Đã nghỉ',
  COMPLETED: 'Hoàn thành',
};

const CLASS_STATUS = {
  OPEN: 'Đang mở',
  CLOSED: 'Đã kết thúc',
  PAUSED: 'Tạm dừng',
};

const COURSE_TYPES = {
  IELTS: 'IELTS',
  TOEIC: 'TOEIC',
  CONVERSATION: 'Giao tiếp',
};

const TUITION_STATUS = {
  PAID: 'Đã đóng',
  PARTIAL: 'Đóng một phần',
  UNPAID: 'Chưa đóng',
};

const ATTENDANCE_STATUS = {
  PRESENT: 'Có mặt',
  ABSENT_EXCUSED: 'Vắng có phép',
  ABSENT: 'Vắng không phép',
};

const ACCOUNT_STATUS = {
  ACTIVE: 'Hoạt động',
  DISABLED: 'Vô hiệu',
  LOCKED: 'Bị khóa',
};

const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

const JWT_CONFIG = {
  EXPIRE: process.env.JWT_EXPIRE || '8h',
  SECRET: process.env.JWT_SECRET || 'your_secret_key',
};

const BCRYPT_CONFIG = {
  ROUNDS: parseInt(process.env.BCRYPT_ROUNDS) || 10,
};

const ACCOUNT_LOCKOUT = {
  MAX_ATTEMPTS: 5,
  LOCK_TIME: 15 * 60 * 1000, // 15 minutes
};

const VALIDATION = {
  USERNAME_MIN: 3,
  USERNAME_MAX: 50,
  PASSWORD_MIN: 8,
  PASSWORD_MAX: 72,
  PHONE_LENGTH: 10,
  NAME_MAX: 100,
  CLASS_CODE_LENGTH: 9, // e.g., IELTS-1234
};

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
};

module.exports = {
  USER_ROLES,
  STUDENT_STATUS,
  CLASS_STATUS,
  COURSE_TYPES,
  TUITION_STATUS,
  ATTENDANCE_STATUS,
  ACCOUNT_STATUS,
  PAGINATION,
  JWT_CONFIG,
  BCRYPT_CONFIG,
  ACCOUNT_LOCKOUT,
  VALIDATION,
  HTTP_STATUS,
};
