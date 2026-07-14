import { Router } from "express";
import ResidentController from "../controllers/ResidentController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(requireAuth);

router.get("/", ResidentController.list);
router.get("/:id", ResidentController.get);
router.post("/", ResidentController.create);
router.put("/:id", ResidentController.update);
router.delete("/:id", ResidentController.delete);

export default router;
