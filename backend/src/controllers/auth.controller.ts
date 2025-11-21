import { Response } from "express";
import { AuthService } from "../services/auth.service";
import { AuthRequest } from "../types/auth-request";

const authService = new AuthService();

export class AuthController {
  async register(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const result = await authService.register(req.body);
      return res.status(201).json(result);
    } catch (err) {
      return res.status(400).json({ message: (err as Error).message });
    }
  }

  async login(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const result = await authService.login(req.body);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(400).json({ message: (err as Error).message });
    }
  }
}
