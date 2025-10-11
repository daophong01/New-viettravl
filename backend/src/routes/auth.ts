import { Router } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";
import cloudinary from "cloudinary";

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
    res.json({ ok: true, user: { id: user.id, role: user.role, email: user.email, name: user.name, avatar: user.avatar } });
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
});

// Update profile (name, avatar url/publicId)
router.put("/me", requireAuth, async (req: any, res) => {
  const user = await User.findByPk(req.user.id);
  if (!user) return res.status(404).json({ error: "Not found" });

  const { name, avatar, avatarPublicId } = req.body || {};
  // If updating avatarPublicId and old exists and changed, delete old
  if (avatarPublicId && user.avatarPublicId && avatarPublicId !== user.avatarPublicId) {
    try {
      await cloudinary.v2.uploader.destroy(user.avatarPublicId);
    } catch {}
  }
  await user.update({
    ...(name ? { name } : {}),
    ...(avatar ? { avatar } : {}),
    ...(avatarPublicId ? { avatarPublicId } : {}),
  });
  res.json({ id: user.id, name: user.name, email: user.email, avatar: user.avatar, avatarPublicId: user.avatarPublicId });
});

// Change password
router.post("/change-password", requireAuth, async (req: any, res) => {
  const user = await User.findByPk(req.user.id);
  if (!user) return res.status(404).json({ error: "Not found" });
  const { oldPassword, newPassword } = req.body || {};
  if (!oldPassword || !newPassword) return res.status(400).json({ error: "Missing fields" });
  if (user.password !== oldPassword) return res.status(401).json({ error: "Invalid old password" });
  await user.update({ password: newPassword });
  res.json({ ok: true });
});

// Request email change (send code)
router.post("/request-email-change", requireAuth, async (req: any, res) => {
  const user = await User.findByPk(req.user.id);
  if (!user) return res.status(404).json({ error: "Not found" });
  const { newEmail } = req.body || {};
  if (!newEmail) return res.status(400).json({ error: "Missing newEmail" });
  const exists = await User.findOne({ where: { email: newEmail } });
  if (exists) return res.status(409).json({ error: "Email exists" });
  const code = Math.random().toString(36).slice(2, 8);
  const expires = new Date(Date.now() + 15 * 60 * 1000);
  await user.update({ pendingEmail: newEmail, emailChangeCode: code, emailChangeExpires: expires });
  res.json({ ok: true, code }); // In real app, send via email
});

// Confirm email change
router.post("/confirm-email-change", requireAuth, async (req: any, res) => {
  const user = await User.findByPk(req.user.id);
  if (!user) return res.status(404).json({ error: "Not found" });
  const { code } = req.body || {};
  if (!code) return res.status(400).json({ error: "Missing code" });
  if (!user.emailChangeCode || !user.emailChangeExpires || user.emailChangeExpires < new Date()) {
    return res.status(400).json({ error: "Code expired" });
  }
  if (code !== user.emailChangeCode) return res.status(400).json({ error: "Invalid code" });
  if (!user.pendingEmail) return res.status(400).json({ error: "No pending email" });
  await user.update({ email: user.pendingEmail, pendingEmail: null, emailChangeCode: null, emailChangeExpires: null });
  res.json({ ok: true, email: user.email });
});

// Forgot password: request reset
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ error: "Missing email" });
  const user = await User.findOne({ where: { email } });
  if (!user) return res.json({ ok: true }); // do not reveal existence
  const code = Math.random().toString(36).slice(2, 8);
  const expires = new Date(Date.now() + 15 * 60 * 1000);
  await user.update({ resetCode: code, resetExpires: expires });
  res.json({ ok: true, code }); // In real app, send via email
});

// Reset password with code
router.post("/reset-password", async (req, res) => {
  const { email, code, newPassword } = req.body || {};
  if (!email || !code || !newPassword) return res.status(400).json({ error: "Missing fields" });
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(400).json({ error: "Invalid request" });
  if (!user.resetCode || !user.resetExpires || user.resetExpires < new Date()) {
    return res.status(400).json({ error: "Code expired" });
  }
  if (code !== user.resetCode) return res.status(400).json({ error: "Invalid code" });
  await user.update({ password: newPassword, resetCode: null, resetExpires: null });
  res.json({ ok: true });
});

export default router;