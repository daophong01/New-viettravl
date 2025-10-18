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

// AI assistant using Google's Generative Language API (Gemini 1.5 Flash)
router.post("/ai", async (req, res) => {
  const apiKey = process.env.GOOGLE_API_KEY || "";
  if (!apiKey) return res.status(501).json({ error: "GOOGLE_API_KEY not configured" });
  const userQuery = (req.body?.message as string) || "";
  if (!userQuery) return res.status(400).json({ error: "message is required" });

  try {
    const endpoint =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=" +
      encodeURIComponent(apiKey);

    const payload = {
      contents: [
        {
          role: "user",
          parts: [
            { text: "Bạn là trợ lý hỗ trợ khách hàng TravelGo. Trả lời ngắn gọn, tiếng Việt." },
            { text: userQuery },
          ],
        },
      ],
    };

    const resp = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await resp.json();
    const text =
      data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join("\n").trim() ||
      "Xin lỗi, hiện không thể trả lời.";
    res.json({ reply: text });
  } catch (e: any) {
    res.status(500).json({ error: e.message || "AI error" });
  }
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