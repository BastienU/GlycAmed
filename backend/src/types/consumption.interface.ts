import { Document, Types } from "mongoose";

export interface IConsumption {
  productName: string;
  brand?: string;
  quantity: number; // en ml ou g
  sugar?: number;
  caffeine?: number;
  calories?: number;
  location?: string;
  note?: string;
  consumedAt: Date;
  contributor: Types.ObjectId;
}

export interface IConsumptionDocument extends IConsumption, Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IConsumptionModel extends Document {

  // Vous pouvez ajouter des méthodes statiques ici si nécessaire
}
