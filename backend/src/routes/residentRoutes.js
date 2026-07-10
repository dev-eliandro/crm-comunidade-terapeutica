import { Router } from "express";
import ResidentController from "../controllers/ResidentController.js";

const router = Router();

router.get("/", ResidentController.list);

router.get("/:id", ResidentController.get);

router.post("/", ResidentController.create);

router.put("/:id", ResidentController.update);

router.delete("/:id", ResidentController.delete);

export default router;