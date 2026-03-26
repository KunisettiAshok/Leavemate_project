const Announcement = require("../models/Announcement");

exports.getAllAnnouncements = async (req, res) => {
  res.json(await Announcement.find().sort({ date: -1 }));
};

exports.addAnnouncement = async (req, res) => {
  res.json(await Announcement.create(req.body));
};

exports.deleteAnnouncement = async (req, res) => {
  await Announcement.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};