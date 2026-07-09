import UserRepository from "../repositories/UserRepository.js";
import { createHash } from "../db.js";

class AuthService {

    async login(identifier, password) {

        const user = await UserRepository.findByIdentifier(identifier);

        console.log("Usuário encontrado:", user);

        if (!user) {
            throw new Error("Usuário não encontrado.");
        }

        const hash = createHash(password);

        console.log("Hash digitado :", hash);
        console.log("Hash banco    :", user.passwordHash);
        console.log("São iguais?   :", hash === user.passwordHash);

        if (user.passwordHash !== hash) {
            throw new Error("Senha inválida.");
        }

        return user;

    }

}

export default new AuthService();