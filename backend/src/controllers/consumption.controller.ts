import { Response } from "express";
import { AuthRequest } from "../types/auth-request";
import { ConsumptionService } from "../services/consumption.service";
import { CreateConsumptionDTO, UpdateConsumptionDTO } from "../types/dtos/consumption.dto";
import { productService } from "@services/product.service";

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

  // Créer depuis code-barres Open Food Facts
  async createFromBarcode(req: AuthRequest, res: Response): Promise<Response> {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });

      const { barcode, quantity, location, note, consumedAt } = req.body;
      if (!barcode || !quantity) return res.status(400).json({ message: "Missing barcode or quantity" });

      // 1. Récupérer le produit depuis l'API
      const product = await productService.lookupByBarcode(barcode);
      if (!product) return res.status(404).json({ message: "Product not found" });

      // 2. Créer la consommation
      const consumption = await service.createFromProduct(
        product,
        quantity,
        req.user.id,
        location,
        note,
        consumedAt ? new Date(consumedAt) : undefined
      );

      return res.status(201).json(consumption);
    } catch (err) {
      return res.status(500).json({ message: (err as Error).message });
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
