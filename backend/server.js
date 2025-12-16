const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
require("dotenv").config();
const connectDB = require("./config/database");
const { apiLimiter } = require("./middleware/security");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Security Middleware
// Set security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// CORS configuration
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = "CORS policy không cho phép truy cập từ origin này.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parser middleware
app.use(express.json({ limit: "50mb" })); // Tăng giới hạn cho Base64 images
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent HTTP Parameter Pollution
app.use(
  hpp({
    whitelist: [
      "category",
      "location",
      "status",
      "requiredVolunteers",
      "sort",
      "fields",
    ],
  })
);

// Apply rate limiting to all routes
app.use("/api", apiLimiter);

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
