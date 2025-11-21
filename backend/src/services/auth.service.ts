import { User } from "../models/user.model";
import { RegisterDTO } from "../types/dtos/register.dto";
import { LoginDTO } from "../types/dtos/login.dto";
import { generateToken } from "../utils/jwt";
import { AuthResponse, ResponseUser } from "../types/dtos/auth-response.dto";

export class AuthService {
  async register(data: RegisterDTO): Promise<AuthResponse> {
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) throw new Error("Email already in use");

    const user = await User.create(data);
    const token = generateToken(user._id.toString());

    const responseUser: ResponseUser = {
      id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return { user: responseUser, token };
  }

  async login(data: LoginDTO): Promise<AuthResponse> {
    const user = await User.findOne({ email: data.email });
    if (!user) throw new Error("Invalid credentials");

    const match = await user.comparePassword(data.password);
    if (!match) throw new Error("Invalid credentials");

    const token = generateToken(user._id.toString());

    const responseUser: ResponseUser = {
      id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return { user: responseUser, token };
  }
}
