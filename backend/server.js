require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/leaves", require("./routes/leaveRoutes"));
app.use("/api/attendance", require("./routes/attendanceRoutes"));
app.use("/api/profile", require("./routes/profileRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/announcements", require("./routes/announcementRoutes"));

app.listen(3000, () => console.log("Server running"));