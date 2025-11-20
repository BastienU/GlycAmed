import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

const authService = new AuthService();

interface RegisterBody {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

interface LoginBody {
  email: string;
  password: string;
}

export class AuthController {
  async register(req: Request<unknown, unknown, RegisterBody>, res: Response): Promise<void> {
    try {
      const user = await authService.register(req.body);
      res.status(201).json({ message: "User created", user });
    } catch (err) {
      if (err instanceof Error) res.status(400).json({ error: err.message });
      else res.status(400).json({ error: "Unknown error" });
    }
  }

  async login(req: Request<unknown, unknown, LoginBody>, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.status(200).json(result);
    } catch (err) {
      if (err instanceof Error) res.status(400).json({ error: err.message });
      else res.status(400).json({ error: "Unknown error" });
    }
  }
}

