import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { User, Tour, Booking, Review } from "../models/index.js";

const router = Router();

function isAdmin(req: any) {
  return req.user?.role === "admin";
}

router.get("/dashboard", requireAuth, async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ error: "Forbidden" });

  const [usersCount, toursCount, bookingsCount, reviewsCount] = await Promise.all([
    User.count(),
    Tour.count(),
    Booking.count(),
    Review.count(),
  ]);

  res.json({
    usersCount,
    toursCount,
    bookingsCount,
    reviewsCount,
  });
});

router.get("/bookings", requireAuth, async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ error: "Forbidden" });
  const items = await Booking.findAll({ order: [["id", "DESC"]] });
  res.json(items);
});

router.get("/reviews", requireAuth, async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ error: "Forbidden" });
  const items = await Review.findAll({ order: [["id", "DESC"]] });
  res.json(items);
});

export default router;