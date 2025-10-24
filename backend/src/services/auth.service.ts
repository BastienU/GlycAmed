import bcrypt from "bcrypt";
import { User, IUser } from "@models/user.model";
import { generateToken } from "@utils/token";
import { Types } from "mongoose";

/**
 * Register a new user
 */
export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<{ user: IUser; token: string }> => {
  // Vérifie si l'email existe déjà
  const existing = await User.findOne({ email });
  if (existing) throw new Error("Email déjà utilisé");

  // Hash du mot de passe
  const hashed = await bcrypt.hash(password, 10);

  // Création du nouvel utilisateur
  const user = await User.create({ name, email, password: hashed });

  // Génération du token JWT (utilise _id converti en string)
  const token = generateToken(user._id.toString());

  return { user, token };
};

/**
 * Login an existing user
 */
export const loginUser = async (
  email: string,
  password: string
): Promise<{ user: IUser; token: string }> => {
  // Cherche l'utilisateur par email
  const user = await User.findOne({ email });
  if (!user) throw new Error("Utilisateur introuvable");

  // Vérifie le mot de passe
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error("Mot de passe incorrect");

  // Génération du token JWT
  const token = generateToken(user._id.toString());

  return { user, token };
};

