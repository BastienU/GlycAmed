import { Router, Request, Response } from 'express';
import { ConsumptionService } from '../services/consumption.service';

const router = Router();
const service = new ConsumptionService();

router.post('/add', async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const consumption = await service.addConsumption(data);
    res.status(201).json(consumption);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de l\'ajout de la consommation', error: err });
  }
});

router.get('/all', async (_req: Request, res: Response) => {
  try {
    const consumptions = await service.getAllConsumptions();
    res.json(consumptions);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des consommations', error: err });
  }
});

router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ message: 'Missing userId parameter' });
    }
    const consumptions = await service.getConsumptionsByUser(userId);
    res.json(consumptions);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des consommations de l\'utilisateur', error: err });
  }
});

export default router;