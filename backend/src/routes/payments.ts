import { Router } from "express";
import Stripe from "stripe";
import { requireAuth } from "../middleware/auth.js";
import { Payment } from "../models/Payment.js";

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
    if (payment) {
      await payment.update({ status: "succeeded" });
    } else {
      await Payment.create({
        sessionId: session.id,
        amount: (session.amount_total || 0),
        status: "succeeded",
        userId: null,
        tourId: null,
      });
    }
  }

  res.json({ received: true });
});

export default router;