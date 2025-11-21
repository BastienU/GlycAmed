import { Request } from "express";
import { ResponseUser } from "../types/dtos/auth-response.dto";

export interface AuthRequest extends Request {
  user?: ResponseUser; // tous les champs requis
}
