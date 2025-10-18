import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { Payment } from "../models/Payment.js";

const router = Router();

// Mock MoMo checkout
router.post("/checkout", requireAuth, async (req: any, res) => {
  const { tourId, title, amount, currency } = req.body || {};
  if (!tourId || !amount) return res.status(400).json({ error: "Missing fields" });
  const sessionId = `momo_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  await Payment.create({
    sessionId,
    amount,
    status: "pending",
    userId: req.user.id,
    tourId,
    customerEmail: req.user.email || null,
    paymentMethod: "momo",
    currency: currency || "VND",
  });
  const frontend = process.env.FRONTEND_URL || "http://localhost:3000";
  const url = `${frontend}/payments/result?status=success&method=momo&sessionId=${sessionId}`;
  res.json({ url, sessionId });
});

// Mock callback to mark payment succeeded
router.post("/callback", async (req, res) => {
  const { sessionId, status } = req.body || {};
  const p = await Payment.findOne({ where: { sessionId } });
  if (!p) return res.status(404).json({ error: "Not found" });
  await p.update({ status: status === "success" ? "succeeded" : "failed" });
  res.json({ ok: true });
});

export default router;