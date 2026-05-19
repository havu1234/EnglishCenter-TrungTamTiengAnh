const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  maLop: { type: String, required: true, unique: true }, // VD: IELTS-01, TOEIC-05
  tenLop: { type: String, required: true }, // VD: IELTS Foundation
  giaoVien: { type: String, required: true }, // VD: Ms. Taylor
  loaiLop: { type: String, required: true }, // ielts, toeic, comm
  siSoToiDa: { type: Number, required: true, default: 20 },
  siSoHienTai: { type: Number, default: 0 },
  lichHoc: { type: String, required: true }, // VD: Thứ 2-4-6 (18:00)
});

module.exports = mongoose.model("Class", classSchema);
