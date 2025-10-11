import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { Tour } from "../models/Tour.js";

const router = Router();

router.get("/", async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const pageSize = Math.min(50, Math.max(1, Number(req.query.pageSize) || 100));
  const offset = (page - 1) * pageSize;
  const sort = (req.query.sort as string) || "id_asc";

  let order: any = [["id", "ASC"]];
  if (sort === "price_asc") order = [["price", "ASC"]];
  else if (sort === "price_desc") order = [["price", "DESC"]];
  else if (sort === "rating_desc") order = [["rating", "DESC"]];

  const { rows, count } = await Tour.findAndCountAll({
    order,
    offset,
    limit: pageSize,
  });
  res.json({ items: rows, total: count, page, pageSize });
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