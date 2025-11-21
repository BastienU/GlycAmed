import jwt from "jsonwebtoken";

interface JwtPayload {
  id: string;
}

export const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is missing");
  return jwt.sign({ id: userId }, secret, { expiresIn: "7d" });
};

export const verifyToken = (token: string): JwtPayload => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is missing");

  const decoded = jwt.verify(token, secret);
  if (typeof decoded !== "object" || decoded === null || !("id" in decoded)) {
    throw new Error("Invalid token");
  }

  return { id: (decoded as { id: string }).id };
};
