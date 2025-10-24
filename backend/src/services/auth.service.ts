import bcrypt from "bcrypt";
import { User } from "@models/user.model";
import { generateToken } from "@utils/token";

export const registerUser = async (name: string, email: string, password: string) => {
  const existing = await User.findOne({ email });
  if (existing) throw new Error("Email déjà utilisé");

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });
  const token = generateToken(user._id);

  return { user, token };
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Utilisateur introuvable");

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error("Mot de passe incorrect");

  const token = generateToken(user._id);
  return { user, token };
};
