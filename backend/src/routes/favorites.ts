import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { Favorite, Tour } from "../models/index.js";

const router = Router();

// List favorites for current user
router.get("/", requireAuth, async (req: any, res) => {
  const items = await Favorite.findAll({
    where: { userId: req.user.id },
    order: [["id", "DESC"]],
  });
  res.json(items);
});

// List favorite tours (expanded)
router.get("/tours", requireAuth, async (req: any, res) => {
  const favs = await Favorite.findAll({ where: { userId: req.user.id } });
  const tourIds = favs.map((f) => f.tourId);
  const tours = await Tour.findAll({ where: { id: tourIds } as any });
  res.json(tours);
});

// Toggle favorite
router.post("/", requireAuth, async (req: any, res) => {
  const { tourId } = req.body || {};
  if (!tourId) return res.status(400).json({ error: "Missing tourId" });
  const exists = await Favorite.findOne({ where: { userId: req.user.id, tourId } });
  if (exists) {
    await exists.destroy();
    return res.json({ ok: true, favorited: false });
  }
  await Favorite.create({ userId: req.user.id, tourId });
  res.json({ ok: true, favorited: true });
});

// Remove favorite
router.delete("/:tourId", requireAuth, async (req: any, res) => {
  const tourId = Number(req.params.tourId);
  if (!tourId) return res.status(400).json({ error: "Missing tourId" });
  const exists = await Favorite.findOne({ where: { userId: req.user.id, tourId } });
  if (!exists) return res.status(404).json({ error: "Not found" });
  await exists.destroy();
  res.json({ ok: true });
});

export default router;