const Leave = require("../models/Leave");
const User = require("../models/User");

// APPLY LEAVE
exports.applyleave = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const { leave_type_id, start_date, end_date, days, duration, reason, notes } = req.body;

    // MAP TYPE
    let type = "";
    if (leave_type_id == "1") type = "sick";
    if (leave_type_id == "2") type = "casual";
    if (leave_type_id == "3") type = "earned";

    // MONTH RESET LOGIC
    const now = new Date();
    const lastUpdate = new Date(user.updatedAt);

    if (now.getMonth() !== lastUpdate.getMonth()) {
      user.leaveBalance.sick = 12;
      user.leaveBalance.casual = 0;
      user.leaveBalance.earned = 0;
    }

    // CHECK BALANCE
    if (user.leaveBalance[type] < Number(days)) {
      return res.status(400).json({
        message: `Only ${user.leaveBalance[type]} ${type} leaves remaining`
      });
    }

    // CREATE LEAVE
    await Leave.create({
      empName: user.empName,
      empId: user.empId,
      leaveTypeId: leave_type_id,
      startDate: start_date,
      endDate: end_date,
      days,
      duration,
      reason,
      notes,
      fileUrl: req.file ? `/uploads/${req.file.filename}` : null
    });

    // DEDUCT BALANCE
    user.leaveBalance[type] -= Number(days);
    await user.save();

    res.json({
      message: "Leave applied",
      balance: user.leaveBalance
    });

  } catch (err) {
    console.error("Apply error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// MY LEAVES
exports.myleaves = async (req, res) => {
  const user = await User.findById(req.user.id);
  const data = await Leave.find({ empId: user.empId }).sort({ createdAt: -1 });
  res.json(data);
};


// PENDING (ADMIN)
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


// APPROVE / REJECT
exports.setStatus = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id === "undefined") {
      return res.status(400).json({ message: "Invalid leave ID" });
    }

    await Leave.findByIdAndUpdate(id, {
      status: req.body.status,
      managerComment: req.body.manager_comment
    });

    res.json({ message: "Updated successfully" });

  } catch (err) {
    console.error("Leave update error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// APPROVED
exports.approved = async (req, res) => {
  res.json(await Leave.find({ status: "approved" }));
};


// REJECTED
exports.rejected = async (req, res) => {
  res.json(await Leave.find({ status: "rejected" }));
};