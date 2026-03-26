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
  photo: String
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);