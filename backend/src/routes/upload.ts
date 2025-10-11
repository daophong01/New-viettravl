import { Router } from "express";
import cloudinary from "cloudinary";

const router = Router();

router.get("/sign", async (_req, res) => {
  const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
  const API_KEY = process.env.CLOUDINARY_API_KEY;
  const API_SECRET = process.env.CLOUDINARY_API_SECRET;

  if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    return res.status(501).json({ error: "Cloudinary chưa cấu hình" });
  }

  const timestamp = Math.floor(Date.now() / 1000);
  // You can add more params to sign, e.g. folder
  const signature = cloudinary.v2.utils.api_sign_request(
    { timestamp },
    API_SECRET
  );

  res.json({
    cloudName: CLOUD_NAME,
    apiKey: API_KEY,
    timestamp,
    signature,
  });
});

export default router;