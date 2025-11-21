import { Types } from "mongoose";
import { Consumption, IConsumptionDocument } from "../models/consumption.model";
import { CreateConsumptionDTO, UpdateConsumptionDTO } from "../types/dtos/consumption.dto";

export class ConsumptionService {
  async create(data: CreateConsumptionDTO, contributorId: string): Promise<IConsumptionDocument> {
    return Consumption.create({
      ...data,
      contributor: new Types.ObjectId(contributorId),
    });
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

  async update(id: string, data: UpdateConsumptionDTO, userId: string): Promise<IConsumptionDocument> {
    const consumption = await Consumption.findById(id);
    if (!consumption) throw new Error("Consumption not found");
    if (consumption.contributor.toString() !== userId) throw new Error("Not authorized");

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
}
