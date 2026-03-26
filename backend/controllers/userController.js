const User = require("../models/User");

exports.list = async (req, res) => {
  res.json(await User.find());
};

exports.update = async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: "Updated" });
};

exports.remove = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};