import { Types } from "mongoose";

export interface IUser {
  _id?: Types.ObjectId;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;

  comparePassword(candidate: string): Promise<boolean>;
}
