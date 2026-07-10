import AuthService from "../services/AuthService.js";

class AuthController {

    async login(req, res) {

        try {

            const { identifier, password } = req.body;

            const user = await AuthService.login(identifier, password);

            return res.json(user);

        } catch (error) {

            return res.status(401).json({
                message: error.message
            });

        }

    }

}

export default new AuthController();