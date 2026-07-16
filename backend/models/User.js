const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  empId: String,
  name: String,
  email: { type: String, unique: true },
  password: String,
  gender: String,
  phone: String,
  role: String,
  department: String,
  photo: String,

  // NEW FIELD (LEAVE BALANCE)
  leaveBalance: {
    sick: { type: Number, default: 12 },
    casual: { type: Number, default: 0 },
    earned: { type: Number, default: 0 }
  }

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);