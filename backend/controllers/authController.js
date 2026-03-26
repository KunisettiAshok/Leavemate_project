const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "Exists" });

  const hashed = await bcrypt.hash(password, 10);
  const count = await User.countDocuments();

  const user = new User({
    empId: `EMP${String(count + 1).padStart(4, "0")}`,
    name,
    email,
    password: hashed,
    role: count === 0 ? "admin" : "user"
  });

  await user.save();
  res.json({ message: "Registered" });
};

exports.login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  const ok = await bcrypt.compare(req.body.password, user.password);

  if (!ok) return res.status(401).json({ message: "Invalid" });

  const token = jwt.sign(
    { id: user._id, empId: user.empId, role: user.role },
    process.env.JWT_SECRET
  );

  res.json({ token, user });
};