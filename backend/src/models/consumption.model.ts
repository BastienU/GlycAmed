import { Schema, model, Document, Types } from "mongoose";

export interface IConsumption {
  productName: string;
  brand?: string;
  quantity: number;
  location?: string;
  note?: string;

  // nutriments calculés
  sugar: number;
  caffeine: number;
  calories: number;

  // valeurs par 100ml/g pour calcul
  sugarsPer100ml?: number;
  caffeinePer100ml?: number;
  caloriesPer100ml?: number;

  contributor: Types.ObjectId;
  consumedAt: Date;
}

export interface IConsumptionDocument extends IConsumption, Document {}

const consumptionSchema = new Schema<IConsumptionDocument>(
  {
    productName: { type: String, required: true },
    brand: String,
    quantity: { type: Number, required: true },
    location: String,
    note: String,
    sugar: { type: Number, default: 0 },
    caffeine: { type: Number, default: 0 },
    calories: { type: Number, default: 0 },

    sugarsPer100ml: Number,
    caffeinePer100ml: Number,
    caloriesPer100ml: Number,

    contributor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    consumedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Consumption = model<IConsumptionDocument>("Consumption", consumptionSchema);
