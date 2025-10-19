const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/database");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" })); // Tăng giới hạn cho Base64 images
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to VolunteerHub API" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Auth routes
app.use("/api/auth", require("./routes/authRoutes"));

// Event routes
app.use("/api/events", require("./routes/eventRoutes"));

// Notification routes
app.use("/api/notifications", require("./routes/notificationRoutes"));

// Post routes (Discussion channel)
app.use("/api/posts", require("./routes/postRoutes"));

// User routes (Admin only)
app.use("/api/users", require("./routes/userRoutes"));

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Đã xảy ra lỗi",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
