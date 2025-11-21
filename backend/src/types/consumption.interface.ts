import { Document, Types } from "mongoose";

export interface IConsumption {
  productName: string;
  brand?: string;
  quantity: number;
  location?: string;
  note?: string;

  sugar: number;
  caffeine: number;
  calories: number;

  sugarsPer100ml?: number;
  caffeinePer100ml?: number;
  caloriesPer100ml?: number;

  contributor: Types.ObjectId;
  consumedAt: Date;
}

export interface IConsumptionDocument extends IConsumption, Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
