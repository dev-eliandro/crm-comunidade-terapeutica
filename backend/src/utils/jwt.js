import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const EXPIRES_IN = "8h";

if (!JWT_SECRET) {
  // Não derruba o processo (para não quebrar scripts utilitários), mas avisa alto.
  console.warn(
    "[auth] JWT_SECRET não definido no .env — defina uma chave forte antes de ir para produção."
  );
}

export function signToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    JWT_SECRET || "dev-secret-nao-use-em-producao",
    { expiresIn: EXPIRES_IN }
  );
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET || "dev-secret-nao-use-em-producao");
}
