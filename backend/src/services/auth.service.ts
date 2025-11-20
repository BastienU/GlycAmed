import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import { IUser } from "../types/user.interface";

interface RegisterData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

interface LoginResult {
  user: IUser;
  token: string;
}

export class AuthService {
  async register(data: RegisterData): Promise<IUser> {
    const existing = await User.findOne({ email: data.email });
    if (existing) throw new Error("Email already in use");

    const user = new User(data);
    return user.save();
  }

  async login(email: string, password: string): Promise<LoginResult> {
    const user = await User.findOne({ email });
    if (!user) throw new Error("Invalid credentials");

    const match = await user.comparePassword(password);
    if (!match) throw new Error("Invalid credentials");

    const token = jwt.sign(
      { id: user._id.toString() },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    return { user, token };
  }
}

