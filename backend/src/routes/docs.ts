import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import { openapi } from "../docs/openapi.js";

const router = Router();

router.use("/", swaggerUi.serve);
router.get("/", swaggerUi.setup(openapi));

export default router;