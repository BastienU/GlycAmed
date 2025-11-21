import { Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { User } from "../models/user.model";
import { AuthRequest } from "../types/auth-request";

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = header.slice(7);
  if (!token) return res.status(401).json({ message: "Invalid token format" });

  try {
    const decoded = verifyToken(token);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "User not found" });

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
