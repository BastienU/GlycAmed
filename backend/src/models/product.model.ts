import mongoose, { Schema } from "mongoose";
import { IProduct } from "../types/product.interface";

const NutrimentsSchema = new Schema<IProduct["nutriments"]>({
  sugar: { type: Number, required: true },
  caffeine: { type: Number, required: true },
  calories: { type: Number, required: true },
});

const ProductSchema = new Schema<IProduct>(
  {
    barcode: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    brand: { type: String, required: true },
    imageUrl: { type: String },
    nutriments: { type: NutrimentsSchema, required: true },
  },
  { timestamps: true }
);

export const Product = mongoose.model<IProduct>("Product", ProductSchema);

// ✅ Exporter aussi l'interface
export type { IProduct };
