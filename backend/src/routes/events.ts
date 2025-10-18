import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";

const clients: Array<{ id: string; res: any }> = [];

export function broadcast(event: any) {
  const data = `data: ${JSON.stringify(event)}\n\n`;
  for (const c of clients) {
    try {
      c.res.write(data);
    } catch {}
  }
}

const router = Router();

function canStream(req: any) {
  const role = (req.user?.role || "").toLowerCase();
  return ["admin", "superadmin", "tourmanager", "financeadmin", "supportstaff", "contenteditor"].includes(role);
}

router.get("/stream", requireAuth, (req: any, res) => {
  if (!canStream(req)) return res.status(403).json({ error: "Forbidden" });

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();
  const id = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  clients.push({ id, res });
  res.write(`event: ping\ndata: ${Date.now()}\n\n`);

  req.on("close", () => {
    const idx = clients.findIndex((c) => c.id === id);
    if (idx >= 0) clients.splice(idx, 1);
  });
});

export default router;