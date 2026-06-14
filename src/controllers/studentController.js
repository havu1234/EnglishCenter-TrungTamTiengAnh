/**
 * Student Controller
 * Handles CRUD operations for students
 */

const Student = require('../models/Student');
const Class = require('../models/Class');

/**
 * Get all students
 * GET /api/students
 */
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate('classId', 'name code')
      .sort({ createdAt: -1 });
    
    // Transform data to match old format
    const transformedStudents = students.map(s => ({
      _id: s._id,
      hoTen: s.fullName,
      lopHoc: s.classId ? s.classId.name : 'Chưa có lớp',
      ngayNhapHoc: s.enrollmentDate,
      soDienThoai: s.phone,
      trangThai: s.status,
    }));
    
    res.json(transformedStudents);
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách học viên',
    });
  }
};

/**
 * Get student by ID
 * GET /api/students/:id
 */
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('classId', 'name code');
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy học viên',
      });
    }
    
    res.json({
      success: true,
      student,
    });
  } catch (error) {
    console.error('Get student error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin học viên',
    });
  }
};

/**
 * Create new student
 * POST /api/students
 */
const createStudent = async (req, res) => {
  try {
    const { hoTen, lopHoc, ngayNhapHoc, soDienThoai } = req.body;
    
    // Validate required fields
    if (!hoTen || !soDienThoai) {
      return res.status(400).json({
        success: false,
        message: 'Họ tên và số điện thoại là bắt buộc',
      });
    }
    
    // Find or create class
    let classId = null;
    if (lopHoc) {
      let classDoc = await Class.findOne({ 
        $or: [
          { name: lopHoc },
          { code: lopHoc.toUpperCase() }
        ]
      });
      
      // If class doesn't exist, create it
      if (!classDoc) {
        const courseTypeMap = {
          'ielts': 'IELTS',
          'toeic': 'TOEIC',
          'comm': 'Giao tiếp',
          'giao tiếp': 'Giao tiếp',
        };
        
        const courseType = courseTypeMap[lopHoc.toLowerCase()] || 'Giao tiếp';
        const code = `${courseType.substring(0, 4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
        
        classDoc = await Class.create({
          code,
          name: lopHoc,
          courseType,
          maxStudents: 20,
          currentStudents: 0,
          status: 'Đang mở',
        });
      }
      
      classId = classDoc._id;
      
      // Update class student count
      await Class.findByIdAndUpdate(classId, {
        $inc: { currentStudents: 1 }
      });
    }
    
    // Create student
    const student = await Student.create({
      fullName: hoTen,
      phone: soDienThoai,
      enrollmentDate: ngayNhapHoc || new Date(),
      classId,
      status: 'Đang học',
    });
    
    res.status(201).json({
      success: true,
      message: 'Thêm học viên thành công',
      student,
    });
  } catch (error) {
    console.error('Create student error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi thêm học viên',
      error: error.message,
    });
  }
};

/**
 * Update student
 * PUT /api/students/:id
 */
const updateStudent = async (req, res) => {
  try {
    const { hoTen, lopHoc, ngayNhapHoc, soDienThoai, trangThai } = req.body;
    
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy học viên',
      });
    }
    
    // Update class if changed
    if (lopHoc) {
      let classDoc = await Class.findOne({ 
        $or: [
          { name: lopHoc },
          { code: lopHoc.toUpperCase() }
        ]
      });
      
      if (!classDoc) {
        const courseTypeMap = {
          'ielts': 'IELTS',
          'toeic': 'TOEIC',
          'comm': 'Giao tiếp',
        };
        
        const courseType = courseTypeMap[lopHoc.toLowerCase()] || 'Giao tiếp';
        const code = `${courseType.substring(0, 4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
        
        classDoc = await Class.create({
          code,
          name: lopHoc,
          courseType,
          maxStudents: 20,
          currentStudents: 1,
          status: 'Đang mở',
        });
      }
      
      // Update class counts
      if (student.classId && student.classId.toString() !== classDoc._id.toString()) {
        await Class.findByIdAndUpdate(student.classId, {
          $inc: { currentStudents: -1 }
        });
        await Class.findByIdAndUpdate(classDoc._id, {
          $inc: { currentStudents: 1 }
        });
      }
      
      student.classId = classDoc._id;
    }
    
    // Update fields
    if (hoTen) student.fullName = hoTen;
    if (soDienThoai) student.phone = soDienThoai;
    if (ngayNhapHoc) student.enrollmentDate = ngayNhapHoc;
    if (trangThai) student.status = trangThai;
    
    await student.save();
    
    res.json({
      success: true,
      message: 'Cập nhật học viên thành công',
      student,
    });
  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật học viên',
      error: error.message,
    });
  }
};

/**
 * Delete student
 * DELETE /api/students/:id
 */
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy học viên',
      });
    }
    
    // Update class student count
    if (student.classId) {
      await Class.findByIdAndUpdate(student.classId, {
        $inc: { currentStudents: -1 }
      });
    }
    
    await Student.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Xóa học viên thành công',
    });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa học viên',
    });
  }
};

/**
 * Search students
 * GET /api/students/search?q=keyword
 */
const searchStudents = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập từ khóa tìm kiếm',
      });
    }
    
    const students = await Student.find({
      $or: [
        { fullName: { $regex: q, $options: 'i' } },
        { phone: { $regex: q, $options: 'i' } },
      ]
    }).populate('classId', 'name code');
    
    res.json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    console.error('Search students error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tìm kiếm học viên',
    });
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  searchStudents,
};
