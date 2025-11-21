import mongoose, { Schema, Document, Model, Types } from "mongoose";
import bcrypt from "bcrypt";

// -----------------------------
// Types TS
// -----------------------------
export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface IUserDocument extends IUser, Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

export interface IUserModel extends Model<IUserDocument> {}

// -----------------------------
// Schéma
// -----------------------------
const UserSchema = new Schema<IUserDocument>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
  },
  { timestamps: true }
);

// -----------------------------
// Hash password avant save
// -----------------------------
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err as Error);
  }
});

// -----------------------------
// Compare password
// -----------------------------
UserSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

// -----------------------------
// Export modèle
// -----------------------------
export const User = mongoose.model<IUserDocument, IUserModel>("User", UserSchema);
