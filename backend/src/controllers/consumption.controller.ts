import { Response } from "express";
import { AuthRequest } from "../types/auth-request";
import { ConsumptionService } from "../services/consumption.service";
import { CreateConsumptionDTO, UpdateConsumptionDTO } from "../types/dtos/consumption.dto";

const service = new ConsumptionService();

export class ConsumptionController {
  async create(req: AuthRequest, res: Response): Promise<Response> {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });

      const dto: CreateConsumptionDTO = req.body;
      const consumption = await service.create(dto, req.user.id);
      return res.status(201).json(consumption);
    } catch (err) {
      return res.status(400).json({ message: (err as Error).message });
    }
  }

  async getAll(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const consumptions = await service.getAll();
      return res.status(200).json(consumptions);
    } catch (err) {
      return res.status(500).json({ message: (err as Error).message });
    }
  }

  async getById(req: AuthRequest, res: Response): Promise<Response> {
    const id = req.params.id;
    if (!id) return res.status(400).json({ message: "Missing id parameter" });

    try {
      const consumption = await service.getById(id);
      if (!consumption) return res.status(404).json({ message: "Consumption not found" });
      return res.status(200).json(consumption);
    } catch (err) {
      return res.status(500).json({ message: (err as Error).message });
    }
  }

  async update(req: AuthRequest, res: Response): Promise<Response> {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const id = req.params.id;
    if (!id) return res.status(400).json({ message: "Missing id parameter" });

    try {
      const dto: UpdateConsumptionDTO = req.body;
      const updated = await service.update(id, dto, req.user.id);
      return res.status(200).json(updated);
    } catch (err) {
      return res.status(400).json({ message: (err as Error).message });
    }
  }

  async delete(req: AuthRequest, res: Response): Promise<Response> {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const id = req.params.id;
    if (!id) return res.status(400).json({ message: "Missing id parameter" });

    try {
      await service.delete(id, req.user.id);
      return res.status(204).send();
    } catch (err) {
      return res.status(400).json({ message: (err as Error).message });
    }
  }
}
