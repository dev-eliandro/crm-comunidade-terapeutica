import AuthService from "../services/AuthService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

class AuthController {

  login = asyncHandler(async (req, res) => {
    try {
      const { identifier, password } = req.body;
      const result = await AuthService.login(identifier, password);
      return res.json(result);
    } catch (error) {
      return res.status(401).json({ message: error.message });
    }
  });

  register = asyncHandler(async (req, res) => {
    try {
      const result = await AuthService.register(req.body);
      return res.status(201).json(result);
    } catch (error) {
      return res.status(409).json({ message: error.message });
    }
  });

  forgotPassword = asyncHandler(async (req, res) => {
    try {
      const { email } = req.body;
      const result = await AuthService.forgotPassword(email);
      return res.json(result);
    } catch (error) {
      return res.status(404).json({ message: error.message });
    }
  });

  resetPassword = asyncHandler(async (req, res) => {
    try {
      const { token, newPassword } = req.body;
      const result = await AuthService.resetPassword(token, newPassword);
      return res.json(result);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  });

  me = asyncHandler(async (req, res) => {
    try {
      const user = await AuthService.me(req.user.id);
      return res.json({ user });
    } catch (error) {
      return res.status(401).json({ message: error.message });
    }
  });

}

export default new AuthController();
