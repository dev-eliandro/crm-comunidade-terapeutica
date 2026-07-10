import "dotenv/config";
import { Router } from "express";
import prisma from "../config/prisma.js";

const router = Router();

router.get("/create-resident", async (req, res) => {
  try {
    const resident = await prisma.resident.create({
      data: {
        usuarioNome: "João da Silva",
        usuarioCPF: "12345678900",
        usuarioRG: "1234567",
        status: "Ativo"
      }
    });

    res.json(resident);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

export default router;