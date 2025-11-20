import mongoose, { Schema } from "mongoose";

export interface IProduct {
  barcode: string;
  name: string;
  brand: string;
  imageUrl?: string | undefined;
  nutriments: {
    sugar: number;
    caffeine: number;
    calories: number;
  };
}

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
