const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({
  empName: String,
  empId: String,
  leaveTypeId: String,
  startDate: Date,
  endDate: Date,
  days: Number,
  duration: String,
  reason: String,
  notes: String,
  fileUrl: String,
  status: { type: String, default: "pending" },
  managerComment: String
}, { timestamps: true });

module.exports = mongoose.model("Leave", leaveSchema);