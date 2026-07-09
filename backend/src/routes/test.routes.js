import { Router } from "express";
import prisma from "../config/prisma.js";

const router = Router();

router.get("/db", async (req, res) => {
  try {
    const users = await prisma.user.findMany();

    res.json(users);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      erro: err.message,
    });
  }
});

export default router;