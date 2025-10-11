import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { Payment } from "../models/Payment.js";

const router = Router();

// Mock VNPay checkout: create pending payment and return sandbox URL
router.post("/checkout", requireAuth, async (req: any, res) => {
  const { tourId, title, amount, currency } = req.body || {};
  if (!tourId || !amount) return res.status(400).json({ error: "Missing fields" });
  const sessionId = `vnp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  await Payment.create({
    sessionId,
    amount,
    status: "pending",
    userId: req.user.id,
    tourId,
    customerEmail: req.user.email || null,
    paymentMethod: "vnpay",
    currency: currency || "VND",
  });
  // Return a mock VNPay sandbox URL (replace with actual integration)
  const frontend = process.env.FRONTEND_URL || "http://localhost:3000";
  const url = `${frontend}/payments/result?status=success&method=vnpay&sessionId=${sessionId}`;
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