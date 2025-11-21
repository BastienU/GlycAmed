import { Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../models/user.model";
import { AuthRequest } from "../types/auth-request";
import { ResponseUser } from "../types/dtos/auth-response.dto";

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = header.slice(7); // supprime "Bearer "
  if (!token) return res.status(401).json({ message: "Invalid token format" });

  const secret = process.env.JWT_SECRET;
  if (!secret) return res.status(500).json({ message: "Server configuration error" });

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;

    if (!decoded || typeof decoded !== "object" || typeof decoded.id !== "string") {
      return res.status(403).json({ message: "Invalid token payload" });
    }

    const foundUser = await User.findById(decoded.id).select("-password");
    if (!foundUser) return res.status(401).json({ message: "User not found" });

    const user: ResponseUser = {
      id: foundUser._id.toString(),
      firstName: foundUser.firstName,
      lastName: foundUser.lastName,
      email: foundUser.email,
      createdAt: foundUser.createdAt,
      updatedAt: foundUser.updatedAt,
    };

    req.user = user;
    return next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};
