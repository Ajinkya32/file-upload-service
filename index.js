require("dotenv").config();
const express = require("express");
const authRoutes = require("./src/routes/auth");
const fileRoutes = require("./src/routes/files");
const uploadsRoutes = require("./src/routes/uploads");
const { seedAdmin } = require("./src/services/authService");
const errorHandler = require("./src/middleware/errorHandlerMiddleware");
const { NotFoundException } = require("./src/utils/appError");
const rateLimit = require("express-rate-limit");

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests
  keyGenerator: (req) => req.ip, // Use client IP
  handler: (req, res) => {
    res.status(429).json({ message: "Too many requests. Please try again later." });
  },
});

app.use("/api", limiter);

app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use("/uploads", uploadsRoutes);

app.use((req, res, next) => {
  const err = new NotFoundException(`Cannot ${req.method} ${req.originalUrl}`);
  next(err);
});

app.use(errorHandler);

// Seed admin user
seedAdmin().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
