const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  title: String,
  message: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Announcement", schema);