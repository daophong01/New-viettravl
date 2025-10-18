import { Router } from "express";
import cloudinary from "cloudinary";

const router = Router();

router.get("/sign", async (req, res) => {
  const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
  const API_KEY = process.env.CLOUDINARY_API_KEY;
  const API_SECRET = process.env.CLOUDINARY_API_SECRET;

  if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    return res.status(501).json({ error: "Cloudinary chưa cấu hình" });
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = (req.query.folder as string) || "travelgo";
  const public_id = (req.query.public_id as string) || undefined;

  const paramsToSign: Record<string, any> = { timestamp, folder };
  if (public_id) paramsToSign.public_id = public_id;

  const signature = cloudinary.v2.utils.api_sign_request(paramsToSign, API_SECRET);

  res.json({
    cloudName: CLOUD_NAME,
    apiKey: API_KEY,
    timestamp,
    signature,
    folder,
    public_id: public_id || null,
  });
});

export default router;