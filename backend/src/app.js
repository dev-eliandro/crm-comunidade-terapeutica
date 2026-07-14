import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes.js";
import testRoutes from "./routes/test.routes.js";
import residentRoutes from "./routes/residentRoutes.js";
import medicationLogRoutes from "./routes/medicationLogRoutes.js";


const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/test", testRoutes);

app.get("/", (req, res) => {
    res.json({
        sistema: "CRM Comunidade Terapêutica",
        status: "Online",
        versao: "1.0.0"
    });
});

app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/residents", residentRoutes);
app.use("/api/medication-logs", medicationLogRoutes);

// Middleware de erro do Express: captura qualquer exceção/rejeição que os
// controllers propaguem (inclusive as que escapam do try/catch de algum
// controller específico) e responde com JSON em vez de deixar a conexão
// travada ou o processo cair. Precisa ser o ÚLTIMO app.use().
app.use((error, req, res, next) => {
  console.error("[erro não tratado na rota]", error);
  if (res.headersSent) return next(error);
  res.status(500).json({ message: "Erro interno no servidor." });
});

export default app;