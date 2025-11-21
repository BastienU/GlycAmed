import { Response } from "express";
import { AuthRequest } from "../types/auth-request";
import { AuthService } from "../services/auth.service";
import { RegisterDTO } from "../types/dtos/register.dto";
import { LoginDTO } from "../types/dtos/login.dto";

const authService = new AuthService();

export class AuthController {
  async register(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const dto: RegisterDTO = req.body;
      const result = await authService.register(dto);
      return res.status(201).json(result);
    } catch (err) {
      return res.status(400).json({ message: (err as Error).message });
    }
  }

  async login(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const dto: LoginDTO = req.body;
      const result = await authService.login(dto);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(400).json({ message: (err as Error).message });
    }
  }

  async profile(req: AuthRequest, res: Response): Promise<Response> {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    return res.status(200).json(req.user);
  }
}
