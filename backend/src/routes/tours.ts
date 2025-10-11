import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { Tour } from "../models/Tour.js";

const router = Router();

router.get("/", async (_req, res) => {
  const items = await Tour.findAll();
  res.json(items);
});

router.get("/:id", async (req, res) => {
  const item = await Tour.findByPk(req.params.id);
  if (!item) return res.status(404).json({ error: "Not found" });
  res.json(item);
});

router.post("/", requireAuth, async (req, res) => {
  const tour = await Tour.create(req.body || {});
  res.status(201).json(tour);
});

router.put("/:id", requireAuth, async (req, res) => {
  const tour = await Tour.findByPk(req.params.id);
  if (!tour) return res.status(404).json({ error: "Not found" });
  await tour.update(req.body || {});
  res.json(tour);
});

router.delete("/:id", requireAuth, async (req, res) => {
  const tour = await Tour.findByPk(req.params.id);
  if (!tour) return res.status(404).json({ error: "Not found" });
  await tour.destroy();
  res.json({ ok: true });
});

export default router;