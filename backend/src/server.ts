import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sequelize } from "./config/database.js";
import authRoutes from "./routes/auth.js";
import tourRoutes from "./routes/tours.js";
import bookingRoutes from "./routes/bookings.js";
import reviewRoutes from "./routes/reviews.js";
import paymentRoutes from "./routes/payments.js";
import vnpayRoutes from "./routes/payments_vnpay.js";
import momoRoutes from "./routes/payments_momo.js";
import paypalRoutes from "./routes/payments_paypal.js";
import userRoutes from "./routes/users.js";
import adminRoutes from "./routes/admin.js";
import docsRoutes from "./routes/docs.js";
import uploadRoutes from "./routes/upload.js";
import supportRoutes from "./routes/support.js";
import favoritesRoutes from "./routes/favorites.js";
import watchlaterRoutes from "./routes/watchlater.js";
import eventsRoutes, { broadcast } from "./routes/events.js";
import reportsRoutes from "./routes/reports.js";
import notificationsRoutes from "./routes/notifications.js";
import { User } from "./models/User.js";
import rateLimit from "express-rate-limit";

dotenv.config();
const app = express();

app.use(cors({ origin: true, credentials: true }));
// raw body for stripe webhook
app.use((req, res, next) => {
  if (req.originalUrl === "/api/payments/webhook") {
    (req as any).rawBody = "";
    req.setEncoding("utf8");
    req.on("data", (chunk) => {
      (req as any).rawBody += chunk;
    });
    req.on("end", () => {
      next();
    });
  } else {
    express.json({ limit: "2mb" })(req, res, next);
  }
});

// Rate limiting for sensitive routes
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, standardHeaders: true, legacyHeaders: false });
const paymentsLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200, standardHeaders: true, legacyHeaders: false });

app.use("/api/auth", authLimiter);
app.use("/api/payments", paymentsLimiter);

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/docs", docsRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/tours", tourRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/payments/vnpay", vnpayRoutes);
app.use("/api/payments/momo", momoRoutes);
app.use("/api/payments/paypal", paypalRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/watchlater", watchlaterRoutes);
app.use("/api/admin/events", eventsRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/admin/notifications", notificationsRoutes);events", eventsRoutes);

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("DB connected");
    await sequelize.sync();

    // Seed admin user if not exists
    const adminEmail = "admin@example.com";
    const exists = await User.findOne({ where: { email: adminEmail } });
    if (!exists) {
      await User.create({
        name: "Admin",
        email: adminEmail,
        password: "admin123",
        role: "admin",
      });
      console.log("Seeded admin user: admin@example.com / admin123");
    }

    app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));
  } catch (e) {
    console.error("Startup error", e);
    process.exit(1);
  }
})();