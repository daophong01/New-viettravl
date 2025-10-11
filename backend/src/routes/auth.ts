import { Router } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const router = Router();

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ error: "Missing fields" });
  const exists = await User.findOne({ where: { email } });
  if (exists) return res.status(409).json({ error: "Email exists" });
  const user = await User.create({ name, email, password, role: "user" });
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || "supersecret");
  res.json({ user, token });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  const user = await User.findOne({ where: { email } });
  if (!user || user.password !== password) return res.status(401).json({ error: "Invalid credentials" });
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || "supersecret");
  res.json({ user, token });
});

router.get("/verify", async (req, res) => {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "supersecret") as any;
    const user = await User.findByPk(payload.id);
    if (!user) return res.status(401).json({ error: "Invalid token" });
    res.json({ ok: true, user: { id: user.id, role: user.role, email: user.email } });
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
});

export default router;