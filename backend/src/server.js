import "dotenv/config";
import app from "./app.js";

const PORT = process.env.PORT || 3001;

// Rede de segurança: um erro não tratado em qualquer lugar do app (ex.: uma
// Promise rejeitada que escapou de um try/catch) NUNCA deve derrubar o
// processo inteiro. Sem isso, o Node encerra o servidor sozinho a partir
// da v15+, e todo mundo conectado cai até o Render reiniciar o serviço.
process.on("unhandledRejection", (reason) => {
  console.error("[unhandledRejection] Erro não tratado (servidor continua rodando):", reason);
});

process.on("uncaughtException", (error) => {
  console.error("[uncaughtException] Erro não tratado (servidor continua rodando):", error);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});