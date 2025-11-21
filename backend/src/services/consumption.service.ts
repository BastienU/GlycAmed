import { Types } from "mongoose";
import { Consumption, IConsumptionDocument } from "../models/consumption.model";
import { CreateConsumptionDTO, UpdateConsumptionDTO } from "../types/dtos/consumption.dto";
import { calculateNutrients } from "../utils/nutrition";

export class ConsumptionService {
  async create(data: CreateConsumptionDTO, contributorId: string): Promise<IConsumptionDocument> {
    const { sugar, caffeine, calories } = calculateNutrients(
      data.quantity,
      {
        sugarsPer100ml: data.sugarsPer100ml ?? 0,
        caffeinePer100ml: data.caffeinePer100ml ?? 0,
        caloriesPer100ml: data.caloriesPer100ml ?? 0,
      }
    );

    return Consumption.create({
      ...data,
      sugar,
      caffeine,
      calories,
      contributor: new Types.ObjectId(contributorId),
      consumedAt: data.consumedAt ?? new Date(),
    });
  }

  async update(id: string, data: UpdateConsumptionDTO, userId: string): Promise<IConsumptionDocument> {
    const consumption = await Consumption.findById(id);
    if (!consumption) throw new Error("Consumption not found");
    if (consumption.contributor.toString() !== userId) throw new Error("Not authorized");

    // Recalculer les nutriments si besoin
    if (
      data.quantity !== undefined ||
      data.sugarsPer100ml !== undefined ||
      data.caffeinePer100ml !== undefined ||
      data.caloriesPer100ml !== undefined
    ) {
      const { sugar, caffeine, calories } = calculateNutrients(
        data.quantity ?? consumption.quantity,
        {
          sugarsPer100ml: data.sugarsPer100ml ?? consumption.sugarsPer100ml ?? 0,
          caffeinePer100ml: data.caffeinePer100ml ?? consumption.caffeinePer100ml ?? 0,
          caloriesPer100ml: data.caloriesPer100ml ?? consumption.caloriesPer100ml ?? 0,
        }
      );

      data.sugar = sugar;
      data.caffeine = caffeine;
      data.calories = calories;
    }

    Object.assign(consumption, data);
    await consumption.save();
    return consumption;
  }

  async delete(id: string, userId: string): Promise<void> {
    const consumption = await Consumption.findById(id);
    if (!consumption) throw new Error("Consumption not found");
    if (consumption.contributor.toString() !== userId) throw new Error("Not authorized");

    await consumption.deleteOne();
  }

  async getAll(): Promise<IConsumptionDocument[]> {
    return Consumption.find()
      .populate("contributor", "firstName lastName email")
      .sort({ consumedAt: -1 });
  }

  async getById(id: string): Promise<IConsumptionDocument | null> {
    return Consumption.findById(id)
      .populate("contributor", "firstName lastName email");
  }
}
