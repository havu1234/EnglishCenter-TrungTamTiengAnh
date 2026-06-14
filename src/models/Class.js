/**
 * Class Model
 * Mongoose schema for class records
 */

const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Mã lớp là bắt buộc'],
    unique: true,
    uppercase: true,
  },
  name: {
    type: String,
    required: [true, 'Tên lớp là bắt buộc'],
    trim: true,
    maxlength: [100, 'Tên lớp không được vượt quá 100 ký tự'],
  },
  courseType: {
    type: String,
    enum: ['IELTS', 'TOEIC', 'Giao tiếp'],
    required: [true, 'Loại khóa học là bắt buộc'],
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  schedule: {
    type: String,
    trim: true,
  },
  maxStudents: {
    type: Number,
    default: 20,
    min: [1, 'Sĩ số tối đa phải ít nhất 1'],
    max: [100, 'Sĩ số tối đa không được vượt quá 100'],
  },
  currentStudents: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['Đang mở', 'Đã kết thúc', 'Tạm dừng'],
    default: 'Đang mở',
  },
}, {
  timestamps: true,
});

// Indexes
classSchema.index({ code: 1 });
classSchema.index({ name: 'text' });
classSchema.index({ courseType: 1 });
classSchema.index({ status: 1 });

// Virtual for checking if class is full
classSchema.virtual('isFull').get(function() {
  return this.currentStudents >= this.maxStudents;
});

const Class = mongoose.model('Class', classSchema);

module.exports = Class;
