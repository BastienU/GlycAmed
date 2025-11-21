import { Schema, model, Model, Document, Types } from "mongoose";
import { IConsumption } from "../types/consumption.interface";

// Document avec timestamps
export interface IConsumptionDocument extends IConsumption, Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Si tu veux des méthodes statiques, tu peux définir un IConsumptionModel
export interface IConsumptionModel extends Model<IConsumptionDocument> {}

const ConsumptionSchema = new Schema<IConsumptionDocument>(
  {
    productName: { type: String, required: true },
    brand: { type: String },
    quantity: { type: Number, required: true },
    sugar: { type: Number },
    caffeine: { type: Number },
    calories: { type: Number },
    location: { type: String },
    note: { type: String },
    consumedAt: { type: Date, default: Date.now },
    contributor: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Consumption = model<IConsumptionDocument, IConsumptionModel>(
  "Consumption",
  ConsumptionSchema
);
