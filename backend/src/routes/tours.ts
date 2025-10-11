import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { Tour } from "../models/Tour.js";
import { Favorite } from "../models/Favorite.js";
import { Booking } from "../models/Booking.js";
import { Payment } from "../models/Payment.js";
import cloudinary from "cloudinary";
import { fn, col, literal } from "sequelize";

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

  // sort by most favorited (global)
  if (sort === "favorites_desc") {
    const rows = await Tour.findAll({
      attributes: {
        include: [[fn("COUNT", col("favorites.id")), "favCount"]],
      },
      include: [{ model: Favorite, attributes: [], required: false }],
      group: ["tour.id"],
      order: [[literal("favCount"), "DESC"]],
      offset,
      limit: pageSize,
      subQuery: false,
    });
    const total = await Tour.count();
    return res.json({ items: rows, total, page, pageSize });
  }

  // sort by most booked (global)
  if (sort === "bookings_desc") {
    const rows = await Tour.findAll({
      attributes: {
        include: [[fn("COUNT", col("bookings.id")), "bookCount"]],
      },
      include: [{ model: Booking, attributes: [], required: false }],
      group: ["tour.id"],
      order: [[literal("bookCount"), "DESC"]],
      offset,
      limit: pageSize,
      subQuery: false,
    });
    const total = await Tour.count();
    return res.json({ items: rows, total, page, pageSize });
  }

  // sort by highest revenue (global, succeeded payments)
  if (sort === "revenue_desc") {
    const rows = await Tour.findAll({
      attributes: {
        include: [[fn("SUM", col("payments.amount")), "revenueSum"]],
      },
      include: [{ model: Payment, attributes: [], required: false, where: { status: "succeeded" } }],
      group: ["tour.id"],
      order: [[literal("revenueSum"), "DESC"]],
      offset,
      limit: pageSize,
      subQuery: false,
    });
    const total = await Tour.count();
    return res.json({ items: rows, total, page, pageSize });
  }

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

  const { imagePublicId } = req.body || {};
  // If updating imagePublicId and old exists, delete old image from Cloudinary
  if (imagePublicId && tour.imagePublicId && imagePublicId !== tour.imagePublicId) {
    try {
      await cloudinary.v2.uploader.destroy(tour.imagePublicId);
    } catch {}
  }

  await tour.update(req.body || {});
  res.json(tour);
});

router.delete("/:id", requireAuth, async (req, res) => {
  const tour = await Tour.findByPk(req.params.id);
  if (!tour) return res.status(404).json({ error: "Not found" });
  // delete cloudinary image if present
  if (tour.imagePublicId) {
    try {
      await cloudinary.v2.uploader.destroy(tour.imagePublicId);
    } catch {}
  }
  await tour.destroy();
  res.json({ ok: true });
});

export default router;