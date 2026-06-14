/**
 * Class Routes
 * API endpoints for class management
 */

const express = require('express');
const router = express.Router();
const Class = require('../models/Class');
const { authenticate } = require('../middleware/auth');

// Get all classes
router.get('/', authenticate, async (req, res) => {
  try {
    const { search } = req.query;
    
    let query = {};
    if (search) {
      query = {
        $or: [
          { code: { $regex: search, $options: 'i' } },
          { name: { $regex: search, $options: 'i' } },
        ],
      };
    }

    const classes = await Class.find(query);
    
    // Transform to match frontend expectations
    const transformedClasses = classes.map(cls => ({
      _id: cls._id,
      maLop: cls.code,
      tenLop: cls.name,
      giaoVien: cls.teacher,
      siSoToiDa: cls.maxSize,
      siSoHienTai: cls.currentSize,
      lichHoc: cls.schedule,
      trangThai: cls.status,
    }));

    res.json({ success: true, data: transformedClasses });
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ success: false, message: 'Lỗi khi tải danh sách lớp học' });
  }
});

// Create new class
router.post('/', authenticate, async (req, res) => {
  try {
    const { tenLop, giaoVien, loaiKhoaHoc, siSoToiDa, lichHoc } = req.body;

    // Generate unique class code
    const loaiMap = {
      'ielts': 'IELTS',
      'toeic': 'TOEIC',
      'comm': 'COMM',
    };
    const loai = loaiMap[loaiKhoaHoc.toLowerCase()] || 'COMM';
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const code = `${loai}-${randomNum}`;

    const newClass = new Class({
      code,
      name: tenLop,
      teacher: giaoVien,
      courseType: loai,
      maxSize: siSoToiDa,
      currentSize: 0,
      schedule: lichHoc,
      status: 'Đang mở',
    });

    await newClass.save();

    res.status(201).json({
      success: true,
      message: 'Tạo lớp học thành công',
      data: {
        maLop: newClass.code,
        tenLop: newClass.name,
        giaoVien: newClass.teacher,
        siSoToiDa: newClass.maxSize,
        lichHoc: newClass.schedule,
      },
    });
  } catch (error) {
    console.error('Error creating class:', error);
    res.status(500).json({ success: false, message: 'Lỗi khi tạo lớp học' });
  }
});

module.exports = router;
