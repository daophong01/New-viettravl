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
    attributes: ["id", "name", "email", "role"],
    order: [["id", "ASC"]],
  });
  res.json(users);
});

export default router;