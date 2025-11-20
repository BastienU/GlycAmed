import mongoose, { Schema, Types } from "mongoose";

export interface IConsumption {
  user: Types.ObjectId;
  product: Types.ObjectId; // référence au produit
  quantity: number; // quantité consommée (en grammes ou ml)
  date: string; // YYYY-MM-DD
  hour: string; // HH:mm
  location?: string;
  notes?: string;
  nutriments: {
    sugar: number;
    caffeine: number;
    calories: number;
  };
}

const NutrimentsSchema = new Schema<IConsumption["nutriments"]>({
  sugar: { type: Number, required: true },
  caffeine: { type: Number, required: true },
  calories: { type: Number, required: true },
});

const ConsumptionSchema = new Schema<IConsumption>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true },
    date: { type: String, required: true },
    hour: { type: String, required: true },
    location: { type: String },
    notes: { type: String },
    nutriments: { type: NutrimentsSchema, required: true },
  },
  { timestamps: true }
);

export const Consumption = mongoose.model<IConsumption>("Consumption", ConsumptionSchema);
