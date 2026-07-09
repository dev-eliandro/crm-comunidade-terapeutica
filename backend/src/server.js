import "dotenv/config";
import app from "./app.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3001;
console.log("DATABASE_URL:", process.env.DATABASE_URL);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});