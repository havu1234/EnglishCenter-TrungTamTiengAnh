# Implementation Plan: English Center Management System

## Overview

This implementation plan breaks down the English Center Management System into discrete, executable tasks organized by feature and layer. Tasks are sequenced to ensure dependencies are satisfied and incremental progress can be validated. The plan follows a backend-first approach with frontend integration, allowing API testing before UI implementation.

## Tasks

- [ ] 1. Set up project structure and dependencies
  - Initialize Node.js project with Express, Mongoose, bcrypt, JWT, CORS
  - Create folder structure: `/models`, `/routes`, `/middleware`, `/controllers`, `/utils`
  - Set up environment configuration (.env file with MongoDB URI, JWT secret, PORT)
  - Create main server.js with Express app initialization and middleware setup
  - _Requirements: 1.1, 1.2, 1.9_

- [ ] 2. Implement User authentication model and utilities
  - Create User schema with validation (tenDangNhap, matKhau, hoTen, vaiTro, trangThai)
  - Implement password hashing with bcrypt (cost factor 10)
  - Create JWT utility functions (generate token with 8-hour expiration, verify token)
  - Implement password validation function (8-72 chars, uppercase, lowercase, digit)
  - _Requirements: 1.1, 1.2, 1.9_

- [ ] 3. Implement login endpoint with security features
  - Create POST /api/auth/login endpoint
  - Implement credential validation (username/password check)
  - Implement account lockout logic (5 failed attempts = 15 min lockout)
  - Return JWT token and user role on success
  - Return generic error message on failure (don't reveal which field failed)
  - _Requirements: 1.1, 1.2, 1.3, 1.10_

- [ ] 4. Implement logout and token verification endpoints
  - Create POST /api/auth/logout endpoint (invalidate session)
  - Create GET /api/auth/verify endpoint (verify JWT validity)
  - Implement middleware to check JWT on protected routes
  - _Requirements: 1.1, 1.5, 1.6_

- [ ] 5. Implement RBAC middleware and permission checks
  - Create middleware to verify user role and permissions
  - Implement permission matrix for all roles (Admin, Giao_Vien, Le_Tan, Ke_Toan)
  - Return HTTP 403 with generic message for unauthorized access
  - Apply middleware to all protected routes
  - _Requirements: 1.7, 1.8_

- [ ] 6. Implement login history tracking
  - Create LoginHistory schema (tenDangNhap, thoiGianDangNhap, diaChiIP, trangThaiDangNhap)
  - Log successful and failed login attempts with IP address
  - Create GET /api/users/login-history endpoint (Admin only)
  - _Requirements: 7.6_

- [ ] 7. Checkpoint - Authentication system complete
  - Ensure all authentication endpoints work correctly
  - Test JWT token generation and verification
  - Test RBAC permission checks
  - Test account lockout mechanism
  - Verify all error messages are generic and secure

- [ ] 8. Create Student model and validation
  - Create Student schema with all required fields (hoTen, ngaySinh, gioiTinh, soDienThoai, email, diaChi, ngayNhapHoc, lopHoc, trangThai)
  - Implement validation: hoTen (required, max 100), soDienThoai (required, 10 digits), email (optional, valid format)
  - Add indexes on soDienThoai and lopHoc for query performance
  - _Requirements: 2.1_

- [ ] 9. Implement Student CRUD endpoints with validation
  - Create GET /api/students endpoint with pagination (20 per page) and search (name/phone)
  - Create POST /api/students endpoint with client-side validation feedback
  - Create PUT /api/students/:id endpoint with update validation
  - Create DELETE /api/students/:id endpoint (Admin only)
  - Implement search filtering (name partial match, phone exact match from start)
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10_

- [ ] 10. Create Class model and auto-generate class codes
  - Create Class schema with all required fields (maLop, tenLop, loaiKhoaHoc, giaoVien, lichHoc, siSoToiDa, siSoHienTai, trangThai)
  - Implement auto-generation of maLop in format [LOAI]-[4 random digits]
  - Implement uniqueness check and regeneration if collision
  - Add indexes on maLop (unique) and tenLop for query performance
  - _Requirements: 3.1, 3.2_

- [ ] 11. Implement Class CRUD endpoints with business logic
  - Create GET /api/classes endpoint with pagination and search (name/code)
  - Create POST /api/classes endpoint with auto-generated maLop
  - Create PUT /api/classes/:id endpoint with validation (siSoToiDa >= siSoHienTai)
  - Create DELETE /api/classes/:id endpoint (only if no active students)
  - Create GET /api/classes/:id/students endpoint (return students with status)
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9_

- [ ] 12. Create Attendance model and tracking
  - Create Attendance schema (lopHoc, ngayDiemDanh, bangDiemDanh, giaoVien, ngayTao, ngayCapNhat)
  - Implement attendance status enum (Co_Mat, Vang_Co_Phep, Vang_Khong_Phep)
  - Add indexes on lopHoc and ngayDiemDanh for query performance
  - _Requirements: 4.1, 4.2_

- [ ] 13. Implement Attendance endpoints with teacher authorization
  - Create GET /api/attendance/classes/:classId endpoint (only teacher's classes)
  - Create POST /api/attendance endpoint with teacher ownership verification
  - Create PUT /api/attendance/:id endpoint for updating past records
  - Create GET /api/attendance/student/:studentId/history endpoint with attendance rate calculation
  - Implement attendance rate formula: (present count / total records) × 100%
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

- [ ] 14. Create Tuition model with automatic status calculation
  - Create Tuition schema (hocVien, lopHoc, tongSoTienPhaiDong, soTienDaDong, kyDong, ngayDenHan, ngayDongThucTe, trangThai, nguoiCapNhat)
  - Implement automatic status calculation (Da_Dong, Dong_Mot_Phan, Chua_Dong)
  - Add indexes on hocVien and lopHoc for query performance
  - _Requirements: 5.1_

- [ ] 15. Implement Tuition endpoints with payment tracking
  - Create GET /api/tuition endpoint with pagination, filtering (status, class), and search
  - Create PUT /api/tuition/:id endpoint to update payment amount with validation
  - Create GET /api/tuition/summary endpoint (unpaid count, partial count, monthly revenue)
  - Implement validation: soTienDaDong <= tongSoTienPhaiDong
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_

- [ ] 16. Implement User management endpoints (Admin only)
  - Create GET /api/users endpoint with pagination
  - Create POST /api/users endpoint with username uniqueness check and password validation
  - Create PUT /api/users/:id endpoint to update hoTen, vaiTro, trangThai
  - Implement account disable logic (set trangThai to Vo_Hieu, invalidate active sessions)
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.7_

- [ ] 17. Implement Dashboard endpoints for each role
  - Create GET /api/dashboard/admin endpoint (4 metric cards: active students, open classes, unpaid tuition, monthly revenue)
  - Create GET /api/dashboard/teacher endpoint (teacher's classes, weekly schedule)
  - Create GET /api/dashboard/receptionist endpoint (recent student enrollments)
  - Create GET /api/dashboard/accountant endpoint (tuition summary)
  - Ensure all data loads within 2 seconds
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [ ] 18. Checkpoint - All backend APIs complete and tested
  - Test all CRUD endpoints with valid and invalid data
  - Verify RBAC permissions on all endpoints
  - Test pagination and search functionality
  - Test automatic calculations (attendance rate, tuition status)
  - Verify error responses are appropriate and secure

- [ ] 19. Create login page UI and authentication flow
  - Create login.html with username and password inputs
  - Implement client-side validation (both fields required)
  - Implement login button enable/disable logic
  - Create login.js to handle form submission and API call
  - Store JWT token in localStorage on success
  - Redirect to appropriate dashboard based on role
  - Display error message on login failure
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [ ] 20. Create main layout with responsive sidebar navigation
  - Create base HTML layout with header, sidebar, main content area, footer
  - Implement responsive design (768px+ support)
  - Create sidebar navigation with role-based menu items
  - Implement hamburger menu for mobile
  - Add user profile dropdown with logout button
  - Implement logout functionality (clear localStorage, redirect to login)
  - _Requirements: 1.6, 8.1, 8.2, 8.4_

- [ ] 21. Create shared UI components
  - Implement Toast notification component (auto-dismiss after 3 seconds)
  - Implement Loading spinner component (show when loading > 200ms)
  - Implement Confirmation dialog component (for delete operations)
  - Implement Pagination component (previous/next, page display)
  - Create CSS for responsive design and component styling
  - _Requirements: 8.3, 8.5, 8.6_

- [ ] 22. Create Student management page UI
  - Create students.html with search bar, table, pagination
  - Implement search functionality with 500ms debounce
  - Create Add Student modal with form validation
  - Create Edit Student modal with pre-filled data
  - Create Delete confirmation dialog
  - Implement table display with 20 students per page
  - Hide Delete button for Le_Tan role
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10_

- [ ] 23. Create Class management page UI
  - Create classes.html with search bar, table, pagination
  - Implement search functionality (class name/code)
  - Create Add Class modal with form
  - Create Edit Class modal with validation (siSoToiDa >= siSoHienTai)
  - Create Delete confirmation dialog
  - Display "Full" badge for classes at capacity
  - Implement "View Students" button to show class roster
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9_

- [ ] 24. Create Attendance page UI
  - Create attendance.html with class selector and date picker
  - Display student list with attendance status checkboxes
  - Implement save attendance functionality
  - Create attendance history view with attendance rate display
  - Implement edit capability for past records
  - Restrict to teacher's own classes
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

- [ ] 25. Create Tuition management page UI
  - Create tuition.html with search bar, filters (status, class), table
  - Implement search and filter functionality
  - Display overdue warning badges (red, >30 days overdue)
  - Create Edit Payment modal for updating payment amount
  - Display summary cards (unpaid count, partial count, monthly revenue)
  - Implement pagination (20 per page)
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_

- [ ] 26. Create User management page UI (Admin only)
  - Create users.html with user list table
  - Create Add User modal with password validation display
  - Create Edit User modal for hoTen, vaiTro, trangThai
  - Create Disable User confirmation dialog
  - Display login history view
  - Implement pagination (20 per page)
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7_

- [ ] 27. Create role-specific dashboard pages
  - Create admin-dashboard.html with 4 metric cards and enrollment chart
  - Create teacher-dashboard.html with class list and weekly schedule
  - Create receptionist-dashboard.html with recent student enrollments
  - Create accountant-dashboard.html with tuition summary
  - Implement chart visualization for enrollment data (12 months)
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [ ] 28. Implement client-side form validation and error display
  - Create validation utility functions for all input types
  - Implement inline error messages below form fields
  - Validate on blur and on submit
  - Display specific error messages (e.g., "Số điện thoại phải có đúng 10 chữ số")
  - Prevent form submission if validation fails
  - _Requirements: 2.2, 2.3, 7.2_

- [ ] 29. Implement API integration and error handling
  - Create API utility functions for all endpoints
  - Implement JWT token management (add to headers, refresh if needed)
  - Implement error handling with user-friendly messages
  - Handle network errors gracefully
  - Implement retry logic for failed requests
  - _Requirements: 1.1, 8.6_

- [ ] 30. Checkpoint - Frontend UI complete and integrated
  - Test all pages load correctly
  - Verify RBAC menu visibility
  - Test all CRUD operations through UI
  - Verify form validation works
  - Test error messages display correctly
  - Verify responsive design on 768px+ screens

- [ ] 31. Implement browser compatibility testing
  - Test on Chrome (latest stable)
  - Test on Firefox (latest stable)
  - Test on Edge (latest stable)
  - Verify no JavaScript errors in console
  - Verify all buttons and links work
  - Verify layout displays correctly
  - _Requirements: 8.1_

- [ ] 32. Implement responsive design for mobile (768px+)
  - Test layout on 768px, 1024px, 1440px breakpoints
  - Implement horizontal scroll for tables on smaller screens
  - Verify sidebar collapses on mobile
  - Verify modals display correctly on mobile
  - Verify touch interactions work
  - _Requirements: 8.2_

- [ ] 33. Optimize database queries and add indexes
  - Add indexes on frequently queried fields (tenDangNhap, soDienThoai, maLop, lopHoc)
  - Add compound indexes for common filter combinations
  - Implement query optimization with Mongoose lean() for read-only queries
  - Test query performance with large datasets
  - _Requirements: 6.2_

- [ ] 34. Implement data export functionality (optional)
  - Add export to CSV for student list
  - Add export to CSV for attendance records
  - Add export to CSV for tuition records
  - Implement export button on each management page
  - _Requirements: 2.8, 4.4, 5.3_

- [ ] 35. Implement audit logging and monitoring
  - Log all user actions (create, update, delete)
  - Log all API errors with stack traces
  - Create admin dashboard for viewing audit logs
  - Implement email notifications for critical errors
  - _Requirements: 7.6_

- [ ] 36. Implement data backup and recovery procedures
  - Create MongoDB backup script
  - Schedule daily backups
  - Document recovery procedures
  - Test backup and recovery process
  - _Requirements: General best practice_

- [ ] 37. Implement rate limiting and security hardening
  - Add rate limiting to login endpoint (prevent brute force)
  - Add rate limiting to API endpoints (prevent abuse)
  - Implement CORS whitelist for production
  - Add security headers (CSP, X-Frame-Options, etc.)
  - _Requirements: 1.10_

- [ ] 38. Create comprehensive API documentation
  - Document all endpoints with request/response examples
  - Document authentication flow
  - Document RBAC permissions
  - Document error codes and messages
  - Create Postman collection for API testing
  - _Requirements: General best practice_

- [ ] 39. Create user documentation and training materials
  - Create user guide for each role
  - Create video tutorials for common tasks
  - Create FAQ document
  - Create troubleshooting guide
  - _Requirements: General best practice_

- [ ] 40. Final checkpoint - System complete and ready for deployment
  - Run full test suite
  - Verify all requirements are met
  - Perform security audit
  - Perform performance testing
  - Prepare deployment documentation
  - Conduct user acceptance testing

---

## Notes

- Tasks marked with `*` are optional and can be skipped for MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Backend-first approach allows parallel frontend development
- All code should follow consistent naming conventions and be well-commented
- Database indexes should be created during model definition
- Error handling should be comprehensive and user-friendly
- Security should be considered at every step

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1"] },
    { "id": 1, "tasks": ["2"] },
    { "id": 2, "tasks": ["3"] },
    { "id": 3, "tasks": ["4", "6"] },
    { "id": 4, "tasks": ["5"] },
    { "id": 5, "tasks": ["7"] },
    { "id": 6, "tasks": ["8", "10", "12", "14"] },
    { "id": 7, "tasks": ["9", "11", "13", "15", "16"] },
    { "id": 8, "tasks": ["17"] },
    { "id": 9, "tasks": ["18"] },
    { "id": 10, "tasks": ["19"] },
    { "id": 11, "tasks": ["20"] },
    { "id": 12, "tasks": ["21"] },
    { "id": 13, "tasks": ["22", "23", "24", "25", "26", "27"] },
    { "id": 14, "tasks": ["28", "29"] },
    { "id": 15, "tasks": ["30"] },
    { "id": 16, "tasks": ["31", "32", "33", "34", "35", "36", "37", "38", "39"] },
    { "id": 17, "tasks": ["40"] }
  ]
}
```