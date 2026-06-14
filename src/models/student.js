/**
 * Student Model
 * Mongoose schema for student records
 */

const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Họ tên là bắt buộc'],
    trim: true,
    maxlength: [100, 'Họ tên không được vượt quá 100 ký tự'],
  },
  dateOfBirth: {
    type: Date,
    required: false,
  },
  gender: {
    type: String,
    enum: ['Nam', 'Nữ', 'Khác'],
    default: 'Khác',
  },
  phone: {
    type: String,
    required: [true, 'Số điện thoại là bắt buộc'],
    match: [/^[0-9]{10}$/, 'Số điện thoại phải có đúng 10 chữ số'],
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Email không hợp lệ'],
  },
  address: {
    type: String,
    trim: true,
  },
  enrollmentDate: {
    type: Date,
    default: Date.now,
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: false,
  },
  status: {
    type: String,
    enum: ['Đang học', 'Bảo lưu', 'Đã nghỉ', 'Hoàn thành'],
    default: 'Đang học',
  },
}, {
  timestamps: true,
});

// Indexes
studentSchema.index({ fullName: 'text' });
studentSchema.index({ phone: 1 });
studentSchema.index({ classId: 1 });
studentSchema.index({ status: 1 });

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
