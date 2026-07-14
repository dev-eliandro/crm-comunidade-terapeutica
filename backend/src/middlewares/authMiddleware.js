import { verifyToken } from "../utils/jwt.js";

// Protege rotas exigindo um Bearer token válido.
// Em caso de sucesso, disponibiliza os dados do usuário em req.user.
export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Não autenticado." });
  }

  try {
    req.user = verifyToken(token);
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Sessão inválida ou expirada." });
  }
}
