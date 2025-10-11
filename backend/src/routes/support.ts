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

export default router;