import { Request } from "express";
import { ResponseUser } from "../types/dtos/auth-response.dto";

// Étendre Express Request pour inclure `user`
export interface AuthRequest extends Request {
  user?: ResponseUser;
}
