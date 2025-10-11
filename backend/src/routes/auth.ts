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

export default router;