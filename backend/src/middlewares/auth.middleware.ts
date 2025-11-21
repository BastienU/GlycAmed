import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { User } from "../models/user.model";
import { ResponseUser } from "../types/dtos/auth-response.dto";

// Étendre Request pour ajouter req.user
declare module "express-serve-static-core" {
  interface Request {
    user?: ResponseUser;
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = header.slice(7); // supprime "Bearer "
  if (!token) {
    return res.status(401).json({ message: "Invalid token format" });
  }

  try {
    // Vérification et décodage du token
    const decoded = verifyToken(token);

    // Recherche de l'utilisateur
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Préparer l'objet exposé au frontend
    req.user = {
      id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};
