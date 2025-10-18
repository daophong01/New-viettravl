import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { Notification } from "../models/Notification.js";

const router = Router();

function hasRole(req: any, roles: string[]) {
  const r = (req.user?.role || "").toLowerCase();
  return roles.map((x) => x.toLowerCase()).includes(r);
}

// List notifications (latest first)
router.get("/", requireAuth, async (req: any, res) => {
  if (!hasRole(req, ["admin", "superadmin", "tourmanager", "financeadmin", "supportstaff", "contenteditor"])) {
    return res.status(403).json({ error: "Forbidden" });
  }
  const page = Math.max(1, Number(req.query.page) || 1);
  const pageSize = Math.min(50, Math.max(1, Number(req.query.pageSize) || 20));
  const offset = (page - 1) * pageSize;

  const { rows, count } = await Notification.findAndCountAll({
    order: [["id", "DESC"]],
    offset,
    limit: pageSize,
  });

  res.json({ items: rows, total: count, page, pageSize });
});

// Mark as read
router.post("/mark-read", requireAuth, async (req: any, res) => {
  if (!hasRole(req, ["admin", "superadmin", "tourmanager", "financeadmin", "supportstaff", "contenteditor"])) {
    return res.status(403).json({ error: "Forbidden" });
  }
  const { id } = req.body || {};
  if (!id) return res.status(400).json({ error: "Missing id" });
  const n = await Notification.findByPk(Number(id));
  if (!n) return res.status(404).json({ error: "Not found" });
  await n.update({ read: true });
  res.json({ ok: true });
});

// Clear all
router.post("/clear", requireAuth, async (req: any, res) => {
  if (!hasRole(req, ["admin", "superadmin", "tourmanager", "financeadmin", "supportstaff", "contenteditor"])) {
    return res.status(403).json({ error: "Forbidden" });
  }
  await Notification.destroy({ where: {} });
  res.json({ ok: true });
});

export default router;