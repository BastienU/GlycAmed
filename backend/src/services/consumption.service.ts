import { ConsumptionModel } from '../models/consumption.model';

interface Nutrients {
  sugar: number;
  caffeine: number;
  calories: number;
}

interface ConsumptionData {
  contributorId: string;
  barcode: string;
  quantityMl: number;
  nutrients: Nutrients;
  location?: string;
  notes?: string;
  consumedAt?: Date;
}

export class ConsumptionService {
  async addConsumption(data: any) {
    const consumption = new ConsumptionModel(data);
    return await consumption.save();
  }

  async getAllConsumptions() {
    return await ConsumptionModel.find().populate('contributorId');
  }

  async getConsumptionsByUser(userId: string) {
    return await ConsumptionModel.find({ contributorId: userId });
  }
}