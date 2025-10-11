import { Router } from "express";
import Stripe from "stripe";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-09-30",
});

router.post("/checkout", requireAuth, async (req, res) => {
  try {
    const { tourId, title, amount } = req.body || {};
    if (!title || !amount) return res.status(400).json({ error: "Missing fields" });

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
      success_url: (process.env.FRONTEND_URL || "http://localhost:3000") + `/tours/${tourId}?status=success`,
      cancel_url: (process.env.FRONTEND_URL || "http://localhost:3000") + `/tours/${tourId}?status=cancel`,
    });

    res.json({ url: session.url });
  } catch (e: any) {
    res.status(500).json({ error: e.message || "Stripe error" });
  }
});

export default router;