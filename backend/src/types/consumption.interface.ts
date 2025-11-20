import { Types } from "mongoose";
import { INutriments } from "./product.interface";

export interface IConsumption {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  product: Types.ObjectId;
  quantity: number;
  date: string;   // YYYY-MM-DD
  hour: string;   // HH:mm
  location?: string;
  notes?: string;
  nutriments: INutriments;
  createdAt?: Date;
  updatedAt?: Date;
}
