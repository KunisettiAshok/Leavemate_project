const Attendance = require("../models/Attendance");
const User = require("../models/User");

exports.login = async (req, res) => {
  const { empId, latitude, longitude } = req.body;

  const today = new Date().toDateString();

  const existing = await Attendance.findOne({
    empId,
    date: { $gte: new Date(today) }
  });

  if (existing) return res.json({ message: "Already logged in" });

  const now = new Date();
  let status = "Absent";

  const hour = now.getHours();
  const minute = now.getMinutes();

  if ((hour >= 6 && hour < 9) || (hour === 9 && minute <= 5)) status = "Present";
  else if (hour === 9 && minute > 5) status = "Late";

  await Attendance.create({
    empId,
    loginTime: now.toLocaleTimeString(),
    status,
    latitude,
    longitude
  });

  res.json({ message: `Login marked ${status}` });
};

exports.logout = async (req, res) => {
  const now = new Date();

  await Attendance.findOneAndUpdate(
    { empId: req.body.empId },
    {
      logoutTime: now.toLocaleTimeString(),
      status: "Normal Logout"
    }
  );

  res.json({ message: "Logout done" });
};

exports.list = async (req, res) => {
  const data = await Attendance.find();

  const result = await Promise.all(
    data.map(async (a) => {
      const u = await User.findOne({ empId: a.empId });
      return { ...a._doc, name: u?.name, department: u?.department };
    })
  );

  res.json(result);
};


exports.listByEmp = async (req, res) => {
  const data = await Attendance.find({ empId: req.params.empId });
  res.json(data);
};


exports.listToday = async (req, res) => {
  const today = new Date().toDateString();

  const data = await Attendance.find({
    date: { $gte: new Date(today) }
  });

  res.json(data);
};

exports.summary = async (req, res) => {
  const total = await User.countDocuments();

  const today = new Date().toDateString();

  const present = await Attendance.countDocuments({
    date: { $gte: new Date(today) },
    status: { $in: ["Present", "Late", "Normal Logout"] }
  });

  res.json({
    total,
    present,
    absent: total - present,
    percentage: total ? Math.round((present / total) * 100) : 0
  });
};


exports.exportExcel = async (req, res) => {
  const data = await Attendance.find();
  res.json(data); // (you can later add ExcelJS)
};

exports.exportPdf = async (req, res) => {
  const data = await Attendance.find();
  res.json(data);
};