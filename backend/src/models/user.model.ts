import mongoose, { Schema, Document, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId; // 👈 ajoute explicitement le type ObjectId
  email: string;
  password: string;
  prenom: string;
  nom: string;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    prenom: { type: String, required: true },
    nom: { type: String, required: true },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);
