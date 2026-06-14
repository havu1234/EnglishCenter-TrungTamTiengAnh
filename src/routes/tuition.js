/**
 * Tuition Routes
 * API endpoints for tuition management
 */

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');

// Get all tuitions (mock data for now)
router.get('/', authenticate, async (req, res) => {
  try {
    const { search, status } = req.query;
    
    // Mock data - replace with actual database query later
    let tuitions = [
      {
        _id: '1',
        hocVien: { hoTen: 'Nguyễn Văn A' },
        lopHoc: { tenLop: 'IELTS-4821' },
        tongSoTienPhaiDong: 5000000,
        soTienDaDong: 5000000,
        trangThai: 'Đã đóng',
        ngayDenHan: new Date('2024-06-15'),
      },
      {
        _id: '2',
        hocVien: { hoTen: 'Trần Thị B' },
        lopHoc: { tenLop: 'TOEIC-01' },
        tongSoTienPhaiDong: 4500000,
        soTienDaDong: 2000000,
        trangThai: 'Đóng một phần',
        ngayDenHan: new Date('2024-06-20'),
      },
      {
        _id: '3',
        hocVien: { hoTen: 'Lê Văn C' },
        lopHoc: { tenLop: 'COMM-3456' },
        tongSoTienPhaiDong: 3500000,
        soTienDaDong: 0,
        trangThai: 'Chưa đóng',
        ngayDenHan: new Date('2024-06-10'),
      },
    ];

    // Apply filters
    if (search) {
      tuitions = tuitions.filter(t => 
        t.hocVien.hoTen.toLowerCase().includes(search.toLowerCase()) ||
        t.lopHoc.tenLop.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status) {
      tuitions = tuitions.filter(t => t.trangThai === status);
    }

    res.json({ success: true, data: tuitions });
  } catch (error) {
    console.error('Error fetching tuitions:', error);
    res.status(500).json({ success: false, message: 'Lỗi khi tải danh sách học phí' });
  }
});

// Get tuition summary
router.get('/summary', authenticate, async (req, res) => {
  try {
    // Mock data - replace with actual calculations later
    const summary = {
      unpaidCount: 15,
      partialCount: 8,
      totalRevenueThisMonth: 45000000,
    };

    res.json({ success: true, ...summary });
  } catch (error) {
    console.error('Error fetching summary:', error);
    res.status(500).json({ success: false, message: 'Lỗi khi tải thống kê' });
  }
});

module.exports = router;
