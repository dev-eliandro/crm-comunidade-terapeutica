import { Router } from "express";
import MedicationLogController from "../controllers/MedicationLogController.js";

const router = Router();

router.get("/", MedicationLogController.list);
router.put("/", MedicationLogController.replaceAll);

export default router;
