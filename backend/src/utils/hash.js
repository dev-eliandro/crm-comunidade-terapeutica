import crypto from "crypto";

// Mantém o mesmo algoritmo (SHA-256) já usado para os usuários existentes
// no banco, para não invalidar os hashes já salvos no Postgres/Supabase.
export function createHash(value) {
  return crypto.createHash("sha256").update(String(value), "utf8").digest("hex");
}
