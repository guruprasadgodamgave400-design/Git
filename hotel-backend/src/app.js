const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const { notFound, errorHandler } = require("./middleware/error");

const authRoutes = require("./routes/auth.routes");
const roomsRoutes = require("./routes/rooms.routes");
const bookingsRoutes = require("./routes/bookings.routes");
const reviewsRoutes = require("./routes/reviews.routes");
const contentRoutes = require("./routes/content.routes");
const adminRoutes = require("./routes/admin.routes");

function createApp() {
  const app = express();

  app.use(helmet());
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));

  const origins = (process.env.CORS_ORIGIN || "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
  app.use(
    cors({
      origin: origins.length ? origins : true,
      credentials: true,
    })
  );

  if (process.env.NODE_ENV !== "test") {
    app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
  }

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, statusCode: 429, message: "Too many auth attempts, please try again later" },
  });

  app.get("/health", (_req, res) => {
    res.json({ success: true, statusCode: 200, message: "ok", data: { uptime: process.uptime() } });
  });

  app.use("/api/auth", authLimiter, authRoutes);
  app.use("/api/rooms", roomsRoutes);
  app.use("/api/bookings", bookingsRoutes);
  app.use("/api/reviews", reviewsRoutes);
  app.use("/api/content", contentRoutes);
  app.use("/api/admin", adminRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = createApp;