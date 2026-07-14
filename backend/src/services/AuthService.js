import crypto from "crypto";
import UserRepository from "../repositories/UserRepository.js";
import { createHash } from "../utils/hash.js";
import { signToken } from "../utils/jwt.js";

function sanitizeUser(user) {
  return { id: user.id, username: user.username, email: user.email };
}

class AuthService {

  async login(identifier, password) {
    const user = await UserRepository.findByIdentifier(identifier);

    // Mensagem genérica de propósito: não revela se foi o usuário ou a
    // senha que estava errada (evita enumeração de usuários existentes).
    if (!user || user.passwordHash !== createHash(password)) {
      throw new Error("Usuário ou senha incorretos.");
    }

    return { token: signToken(user), user: sanitizeUser(user) };
  }

  async register({ username, email, password }) {
    if (!username || !email || !password) {
      throw new Error("Preencha todos os campos.");
    }

    const existing =
      (await UserRepository.findByIdentifier(username)) ||
      (await UserRepository.findByEmail(email));

    if (existing) {
      throw new Error("Usuário ou e-mail já cadastrados.");
    }

    const user = await UserRepository.create({
      username,
      email,
      passwordHash: createHash(password),
    });

    return { token: signToken(user), user: sanitizeUser(user) };
  }

  async forgotPassword(email) {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new Error("E-mail não encontrado.");
    }

    const resetToken = crypto.randomBytes(8).toString("hex");
    await UserRepository.setResetToken(email, resetToken);

    // TODO: quando houver um provedor de e-mail configurado, enviar o
    // token por e-mail em vez de devolvê-lo na resposta da API.
    return {
      message: "Instruções de recuperação enviadas para o e-mail informado.",
      resetToken,
    };
  }

  async resetPassword(token, newPassword) {
    const user = await UserRepository.findByResetToken(token);
    if (!user) {
      throw new Error("Token inválido ou expirado.");
    }

    await UserRepository.updatePassword(user.id, createHash(newPassword));
    await UserRepository.clearResetToken(user.id);

    return { message: "Senha redefinida com sucesso." };
  }

  async me(userId) {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new Error("Usuário não encontrado.");
    }
    return sanitizeUser(user);
  }

}

export default new AuthService();
