const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  empId: String,
  date: { type: Date, default: Date.now },
  loginTime: String,
  logoutTime: String,
  status: String,
  latitude: String,
  longitude: String,
  qrToken: String,
  scannedData: String
}, { timestamps: true });

module.exports = mongoose.model("Attendance", attendanceSchema);