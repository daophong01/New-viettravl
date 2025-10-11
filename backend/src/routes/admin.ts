import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { User, Tour, Booking, Review, Payment } from "../models/index.js";

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

  const page = Math.max(1, Number(req.query.page) || 1);
  const pageSize = Math.min(50, Math.max(1, Number(req.query.pageSize) || 10));
  const offset = (page - 1) * pageSize;
  const sort = (req.query.sort as string) || "id_desc";

  let order: any = [["id", "DESC"]];
  if (sort === "id_asc") order = [["id", "ASC"]];
  else if (sort === "date_desc") order = [["createdAt", "DESC"]];
  else if (sort === "date_asc") order = [["createdAt", "ASC"]];

  const { rows, count } = await Booking.findAndCountAll({
    order,
    offset,
    limit: pageSize,
  });
  res.json({ items: rows, total: count, page, pageSize });
});

router.get("/reviews", requireAuth, async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ error: "Forbidden" });

  const page = Math.max(1, Number(req.query.page) || 1);
  const pageSize = Math.min(50, Math.max(1, Number(req.query.pageSize) || 10));
  const offset = (page - 1) * pageSize;
  const sort = (req.query.sort as string) || "id_desc";

  let order: any = [["id", "DESC"]];
  if (sort === "id_asc") order = [["id", "ASC"]];
  else if (sort === "date_desc") order = [["createdAt", "DESC"]];
  else if (sort === "date_asc") order = [["createdAt", "ASC"]];
  else if (sort === "rating_desc") order = [["rating", "DESC"]];
  else if (sort === "rating_asc") order = [["rating", "ASC"]];

  const { rows, count } = await Review.findAndCountAll({
    order,
    offset,
    limit: pageSize,
  });
  res.json({ items: rows, total: count, page, pageSize });
});

router.delete("/reviews/:id", requireAuth, async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ error: "Forbidden" });
  const item = await Review.findByPk(req.params.id);
  if (!item) return res.status(404).json({ error: "Not found" });
  await item.destroy();
  res.json({ ok: true });
});

router.get("/payments", requireAuth, async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ error: "Forbidden" });

  const page = Math.max(1, Number(req.query.page) || 1);
  const pageSize = Math.min(50, Math.max(1, Number(req.query.pageSize) || 10));
  const offset = (page - 1) * pageSize;
  const sort = (req.query.sort as string) || "id_desc";
  const status = (req.query.status as string) || "all";
  const tourId = Number(req.query.tourId) || undefined;

  let order: any = [["id", "DESC"]];
  if (sort === "id_asc") order = [["id", "ASC"]];
  else if (sort === "date_desc") order = [["createdAt", "DESC"]];
  else if (sort === "date_asc") order = [["createdAt", "ASC"]];
  else if (sort === "amount_desc") order = [["amount", "DESC"]];
  else if (sort === "amount_asc") order = [["amount", "ASC"]];

  const where: any = {};
  if (status && status !== "all") where.status = status;
  if (tourId) where.tourId = tourId;

  const { rows, count } = await Payment.findAndCountAll({
    where,
    order,
    offset,
    limit: pageSize,
  });
  res.json({ items: rows, total: count, page, pageSize });
});

export default router;