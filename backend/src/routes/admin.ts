import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { User, Tour, Booking, Review, Payment } from "../models/index.js";
import ExcelJS from "exceljs";

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

// Export CSV or Excel
router.get("/export/:type", requireAuth, async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ error: "Forbidden" });
  const type = (req.params.type || "").toLowerCase();
  const format = (req.query.format as string) || "csv";
  let rows: any[] = [];

  if (type === "payments") {
    rows = await Payment.findAll({ order: [["id", "DESC"]] });
  } else if (type === "bookings") {
    rows = await Booking.findAll({ order: [["id", "DESC"]] });
  } else if (type === "reviews") {
    rows = await Review.findAll({ order: [["id", "DESC"]] });
  } else {
    return res.status(400).json({ error: "Invalid type" });
  }

  const plain = rows.map((r) => (r.toJSON ? r.toJSON() : r));

  if (format === "xlsx") {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(type);
    const headers = Object.keys(plain[0] || {});
    sheet.addRow(headers);
    for (const obj of plain) {
      sheet.addRow(headers.map((h) => obj[h] ?? ""));
    }
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=${type}.xlsx`);
    await workbook.xlsx.write(res as any);
    res.end();
  } else {
    const headers = Object.keys(plain[0] || {});
    const lines = [headers.join(",")];
    for (const obj of plain) {
      lines.push(headers.map((h) => JSON.stringify(obj[h] ?? "")).join(","));
    }
    const csv = lines.join("\n");
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename=${type}.csv`);
    res.send(csv);
  }
});

export default router;