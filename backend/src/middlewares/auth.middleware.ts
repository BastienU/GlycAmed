import { Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Request } from "express";

/**
 * Interface pour étendre Request avec l'utilisateur décodé
 */
export interface AuthRequest extends Request {
  user?: string | JwtPayload; // JwtPayload contient l'id
}

/**
 * Middleware pour protéger les routes et vérifier le JWT
 */
export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Non autorisé : header manquant" });
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({ message: "Non autorisé : format Bearer invalide" });
    }

    const token = parts[1];
    if (!token) {
      return res.status(401).json({ message: "Non autorisé : token manquant" });
    }

    // Vérifie et décode le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    // Ajoute l'utilisateur à la requête
    req.user = decoded;

    // Passe au middleware suivant / route
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token invalide ou expiré" });
  }
};

