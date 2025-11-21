import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { AuthResponse, ResponseUser } from "../types/dtos/auth-response.dto";

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response): Promise<Response> {
    try {
      const result: AuthResponse = await authService.register(req.body);
      return res.status(201).json(result);
    } catch (err) {
      return res.status(400).json({ message: (err as Error).message });
    }
  }

  async login(req: Request, res: Response): Promise<Response> {
    try {
      const result: AuthResponse = await authService.login(req.body);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(400).json({ message: (err as Error).message });
    }
  }
}

