import { Router } from "express";
import { User } from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

function isAdmin(req: any) {
  return req.user?.role === "admin";
}

router.get("/", requireAuth, async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ error: "Forbidden" });
  const users = await User.findAll({
    attributes: ["id", "name", "email", "role", "status"],
    order: [["id", "ASC"]],
  });
  res.json(users);
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

export default router;