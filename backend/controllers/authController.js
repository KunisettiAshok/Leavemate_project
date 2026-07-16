const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { name,
    email,
    password,
    gender,
    phone,
    department } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "Exists" });

  const hashed = await bcrypt.hash(password, 10);
  const count = await User.countDocuments();

  const user = new User({
    empId: `EMP${String(count + 1).padStart(4, "0")}`,
    name,
    email,
    password: hashed,
    gender,
    phone,
    department,
    role: count === 0 ? "admin" : "user"
  });

  await user.save();
  res.json({ message: "Registered" });
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const ok = await bcrypt.compare(password, user.password);

    if (!ok) {
      return res.status(401).json({
        message: "Invalid password"
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        empId: user.empId,
        role: user.role
      },
      process.env.JWT_SECRET
    );

    res.json({ token, user });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};