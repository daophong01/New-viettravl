import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { Booking } from "../models/Booking.js";
import { broadcast } from "./events.js";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  const userId = (req as any).user?.id;
  const items = await Booking.findAll({ where: { userId } });
  res.json(items);
});

router.post("/", requireAuth, async (req, res) => {
  const userId = (req as any).user?.id;
  const { tourId, departureDate } = req.body || {};
  if (!tourId) return res.status(400).json({ error: "Missing tourId" });
  const booking = await Booking.create({
    userId,
    tourId,
    status: "pending",
    paymentStatus: "pending",
    departureDate: departureDate ? new Date(departureDate) : null,
  });
  // broadcast event for admin dashboard
  broadcast({ type: "booking_created", id: booking.id, userId, tourId, at: Date.now() });
  res.status(201).json(booking);
});

export default router;