import { Router } from "express";
import Stripe from "stripe";
import { requireAuth } from "../middleware/auth.js";
import { Payment } from "../models/Payment.js";
import { broadcast } from "./events.js";

const router = Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-09-30",
});

router.post("/checkout", requireAuth, async (req, res) => {
  try {
    const { tourId, title, amount } = req.body || {};
    if (!title || !amount) return res.status(400).json({ error: "Missing fields" });

    const base = process.env.FRONTEND_URL || "http://localhost:3000";
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "vnd",
            product_data: { name: title },
            unit_amount: Number(amount),
          },
          quantity: 1,
        },
      ],
      success_url: `${base}/payments/result?status=success&tourId=${encodeURIComponent(tourId)}`,
      cancel_url: `${base}/payments/result?status=cancel&tourId=${encodeURIComponent(tourId)}`,
    });

    // Pre-create payment record as pending
    await Payment.create({
      sessionId: session.id,
      amount: Number(amount),
      status: "pending",
      userId: (req as any).user?.id || null,
      tourId: tourId || null,
      paymentMethod: "stripe",
      currency: "VND",
    });

    res.json({ url: session.url });
  } catch (e: any) {
    res.status(500).json({ error: e.message || "Stripe error" });
  }
});

// Stripe webhook to confirm payment
router.post("/webhook", async (req, res) => {
  const sig = (req.headers["stripe-signature"] as string) || "";
  const secret = process.env.STRIPE_WEBHOOK_SECRET || "";
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(await (req as any).rawBody, sig, secret);
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const payment = await Payment.findOne({ where: { sessionId: session.id } });
    const customerEmail = session.customer_details?.email || null;
    const paymentIntentId =
      typeof session.payment_intent === "string" ? session.payment_intent : (session.payment_intent as any)?.id || null;

    if (payment) {
      await payment.update({ status: "succeeded", customerEmail, paymentIntentId });
      broadcast({ type: "payment_succeeded", sessionId: payment.sessionId, amount: payment.amount, userId: payment.userId, tourId: payment.tourId, method: "stripe" });
    } else {
      const created = await Payment.create({
        sessionId: session.id,
        amount: session.amount_total || 0,
        status: "succeeded",
        userId: null,
        tourId: null,
        customerEmail,
        paymentIntentId,
        paymentMethod: "stripe",
        currency: "VND",
      });
      broadcast({ type: "payment_succeeded", sessionId: created.sessionId, amount: created.amount, userId: created.userId, tourId: created.tourId, method: "stripe" });
    }
  }

  res.json({ received: true });
});

// Current user's orders
router.get("/me", requireAuth, async (req, res) => {
  const userId = (req as any).user?.id;
  const items = await Payment.findAll({ where: { userId }, order: [["id", "DESC"]] });
  res.json(items);
});

export default router;