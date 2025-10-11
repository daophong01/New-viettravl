import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { Review } from "../models/Review.js";

const router = Router();

router.get("/", async (_req, res) => {
  const items = await Review.findAll();
  res.json(items);
});

router.post("/", requireAuth, async (req, res) => {
  const userId = (req as any).user?.id;
  const { tourId, rating, comment } = req.body || {};
  if (!tourId || !rating) return res.status(400).json({ error: "Missing fields" });
  const review = await Review.create({ userId, tourId, rating, comment });
  res.status(201).json(review);
});

export default router;