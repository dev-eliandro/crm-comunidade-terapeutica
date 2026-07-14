import { Router } from "express";
import MedicationLogController from "../controllers/MedicationLogController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(requireAuth);

router.get("/", MedicationLogController.list);
router.put("/", MedicationLogController.replaceAll);

export default router;
