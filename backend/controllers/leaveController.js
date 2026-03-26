const Leave = require("../models/Leave");
const User = require("../models/User");

exports.apply = async (req, res) => {
  const user = await User.findById(req.user.id);

  await Leave.create({
    empId: user.empId,
    leaveTypeId: req.body.leave_type_id,
    startDate: req.body.start_date,
    endDate: req.body.end_date,
    days: req.body.days,
    duration: req.body.duration,
    reason: req.body.reason,
    notes: req.body.notes,
    fileUrl: req.file ? `/uploads/${req.file.filename}` : null
  });

  res.json({ message: "Leave applied" });
};

exports.my = async (req, res) => {
  const user = await User.findById(req.user.id);
  const data = await Leave.find({ empId: user.empId }).sort({ createdAt: -1 });
  res.json(data);
};

exports.pending = async (req, res) => {
  const leaves = await Leave.find({ status: "pending" });

  const result = await Promise.all(
    leaves.map(async (l) => {
      const u = await User.findOne({ empId: l.empId });
      return { ...l._doc, user_name: u?.name };
    })
  );

  res.json(result);
};

exports.setStatus = async (req, res) => {
  await Leave.findByIdAndUpdate(req.params.id, {
    status: req.body.status,
    managerComment: req.body.manager_comment
  });

  res.json({ message: "Updated" });
};

exports.approved = async (req, res) => {
  res.json(await Leave.find({ status: "approved" }));
};

exports.rejected = async (req, res) => {
  res.json(await Leave.find({ status: "rejected" }));
};