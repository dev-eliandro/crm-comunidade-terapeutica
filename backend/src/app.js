import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes.js";
import testRoutes from "./routes/test.routes.js";

const app = express();

app.use("/test", testRoutes);
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        sistema: "CRM Comunidade Terapêutica",
        status: "Online",
        versao: "1.0.0"
    });
});

app.use("/api/auth", authRoutes);

export default app;