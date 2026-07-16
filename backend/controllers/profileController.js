const User = require("../models/User");

exports.me = async (req, res) => {
  const user = await User.findById(req.user.id).lean();

  let photoUrl = null;

  if (user.photo) {
    photoUrl = `${req.protocol}://${req.get("host")}/uploads/${user.photo}`;
  }

  const response = {
    _id: user._id,
    empId: user.empId,
    name: user.name,
    email: user.email,
    phone: user.phone,
    gender: user.gender,
    department: user.department || "",
    role: user.role,
    photo: photoUrl,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    __v: user.__v
  };

  res.json(response);
};

exports.updateMe = async (req, res) => {
  try {
    const { name, phone, gender, department, empId } = req.body;

    let updateData = {
      name,
      phone,
      gender,
      department,
      empId
    };

    // If image uploaded
    if (req.file) {
      updateData.photo = req.file.filename;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    );

    res.json({
      message: "Profile updated",
      user: updatedUser
    });

  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getBalance = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user.leaveBalance);
};