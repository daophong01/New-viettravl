import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sequelize } from "./config/database.js";
import authRoutes from "./routes/auth.js";
import tourRoutes from "./routes/tours.js";
import bookingRoutes from "./routes/bookings.js";
import reviewRoutes from "./routes/reviews.js";
import paymentRoutes from "./routes/payments.js";
import userRoutes from "./routes/users.js";
import adminRoutes from "./routes/admin.js";
import { User } from "./models/User.js";

dotenv.config();
const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/tours", tourRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

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