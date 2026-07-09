import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes.js";
import testRoutes from "./routes/test.routes.js";
import residentRoutes from "./routes/residentRoutes.js";


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

export default app;