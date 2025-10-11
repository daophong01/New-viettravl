import { Router } from "express";
import { SupportMessage } from "../models/SupportMessage.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Public endpoint to submit a support message
router.post("/messages", async (req, res) => {
  const { name, email, message } = req.body || {};
  if (!message) return res.status(400).json({ error: "Message is required" });
  const item = await SupportMessage.create({
    name: name || null,
    email: email || null,
    message,
    userId: (req as any).user?.id || null,
    status: "new",
  });
  res.status(201).json(item);
});

// Admin list
router.get("/admin/messages", requireAuth, async (req, res) => {
  if ((req as any).user?.role !== "admin") return res.status(403).json({ error: "Forbidden" });
  const items = await SupportMessage.findAll({ order: [["id", "DESC"]] });
  res.json(items);
});

// Admin update status
router.put("/admin/messages/:id", requireAuth, async (req, res) => {
  if ((req as any).user?.role !== "admin") return res.status(403).json({ error: "Forbidden" });
  const item = await SupportMessage.findByPk(req.params.id);
  if (!item) return res.status(404).json({ error: "Not found" });
  const { status } = req.body || {};
  if (!["new", "resolved"].includes(status)) return res.status(400).json({ error: "Invalid status" });
  await item.update({ status });
  res.json(item);
});

export default router;