import { Router } from "express";
import { User } from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

function isAdmin(req: any) {
  return req.user?.role === "admin";
}

router.get("/", requireAuth, async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ error: "Forbidden" });

  const page = Math.max(1, Number(req.query.page) || 1);
  const pageSize = Math.min(50, Math.max(1, Number(req.query.pageSize) || 10));
  const offset = (page - 1) * pageSize;

  const { rows, count } = await User.findAndCountAll({
    attributes: ["id", "name", "email", "role", "status"],
    order: [["id", "ASC"]],
    offset,
    limit: pageSize,
  });
  res.json({ items: rows, total: count, page, pageSize });
});

router.put("/:id", requireAuth, async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ error: "Forbidden" });
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ error: "Not found" });
  const { role, status } = req.body || {};
  if (role && !["user", "admin"].includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }
  if (status && !["active", "blocked"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }
  await user.update({ ...(role ? { role } : {}), ...(status ? { status } : {}) });
  res.json({ id: user.id, name: user.name, email: user.email, role: user.role, status: user.status });
});

router.post("/:id/reset-password", requireAuth, async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ error: "Forbidden" });
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ error: "Not found" });
  const newPass = Math.random().toString(36).slice(2, 10); // simple random 8 chars
  await user.update({ password: newPass });
  res.json({ id: user.id, email: user.email, newPassword: newPass });
});

router.delete("/:id", requireAuth, async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ error: "Forbidden" });
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ error: "Not found" });
  await user.destroy();
  res.json({ ok: true });
});

export default router;