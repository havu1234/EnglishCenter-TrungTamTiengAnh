/**
 * Attendance Routes
 * Handles attendance-related API endpoints
 */

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');

/**
 * @route   GET /api/attendance
 * @desc    Get attendance records with optional filters
 * @access  Private
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const { search, classId, date } = req.query;
    
    // Mock data for now - will be replaced with actual database queries
    const mockAttendance = [
      {
        _id: '1',
        hocVien: { hoTen: 'Nguyễn Văn A' },
        lopHoc: { tenLop: 'IELTS 6.5' },
        ngay: '2024-01-15',
        trangThai: 'Có mặt',
        ghiChu: '',
      },
      {
        _id: '2',
        hocVien: { hoTen: 'Trần Thị B' },
        lopHoc: { tenLop: 'COMM Beginner' },
        ngay: '2024-01-15',
        trangThai: 'Vắng mặt',
        ghiChu: 'Xin phép',
      },
    ];

    let filteredData = mockAttendance;

    // Apply filters
    if (search) {
      const searchLower = search.toLowerCase();
      filteredData = filteredData.filter(record =>
        record.hocVien.hoTen.toLowerCase().includes(searchLower) ||
        record.lopHoc.tenLop.toLowerCase().includes(searchLower)
      );
    }

    if (classId) {
      filteredData = filteredData.filter(record => record.lopHoc._id === classId);
    }

    if (date) {
      filteredData = filteredData.filter(record => record.ngay === date);
    }

    res.json({
      success: true,
      data: filteredData,
    });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch attendance records',
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/attendance/stats
 * @desc    Get attendance statistics
 * @access  Private
 */
router.get('/stats', authenticate, async (req, res) => {
  try {
    // Mock statistics - will be replaced with actual database queries
    const stats = {
      presentCount: 45,
      absentCount: 5,
      percentage: 90.0,
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching attendance stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch attendance statistics',
      error: error.message,
    });
  }
});

/**
 * @route   POST /api/attendance/mark-all
 * @desc    Mark attendance for all students in a class
 * @access  Private
 */
router.post('/mark-all', authenticate, async (req, res) => {
  try {
    const { lopHoc, ngay, trangThai } = req.body;

    if (!lopHoc || !ngay || !trangThai) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp đầy đủ thông tin: lopHoc, ngay, trangThai',
      });
    }

    // Mock response - will be replaced with actual database operations
    res.json({
      success: true,
      message: `Đã điểm danh tất cả học viên ${trangThai.toLowerCase()}`,
      data: {
        lopHoc,
        ngay,
        trangThai,
        soLuong: 20, // Mock count
      },
    });
  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark attendance',
      error: error.message,
    });
  }
});

/**
 * @route   POST /api/attendance
 * @desc    Create single attendance record
 * @access  Private
 */
router.post('/', authenticate, async (req, res) => {
  try {
    const { hocVien, lopHoc, ngay, trangThai, ghiChu } = req.body;

    if (!hocVien || !lopHoc || !ngay || !trangThai) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp đầy đủ thông tin',
      });
    }

    // Mock response - will be replaced with actual database operations
    const newRecord = {
      _id: Date.now().toString(),
      hocVien,
      lopHoc,
      ngay,
      trangThai,
      ghiChu: ghiChu || '',
      createdAt: new Date(),
    };

    res.status(201).json({
      success: true,
      message: 'Đã tạo bản ghi điểm danh',
      data: newRecord,
    });
  } catch (error) {
    console.error('Error creating attendance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create attendance record',
      error: error.message,
    });
  }
});

/**
 * @route   PUT /api/attendance/:id
 * @desc    Update attendance record
 * @access  Private
 */
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { trangThai, ghiChu } = req.body;

    // Mock response - will be replaced with actual database operations
    res.json({
      success: true,
      message: 'Đã cập nhật bản ghi điểm danh',
      data: {
        _id: id,
        trangThai,
        ghiChu,
        updatedAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Error updating attendance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update attendance record',
      error: error.message,
    });
  }
});

module.exports = router;
