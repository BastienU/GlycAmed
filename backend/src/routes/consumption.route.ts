import { Router } from 'express';
import { ConsumptionService } from '../services/consumption.service';

const router = Router();
const service = new ConsumptionService();

router.post('/add', async (req, res) => {
  try {
    const consumption = await service.addConsumption(req.body);
    res.status(201).json(consumption);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de l\'ajout de la consommation', error: err });
  }
});

router.get('/all', async (_req, res) => {
  try {
    const consumptions = await service.getAllConsumptions();
    res.json(consumptions);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des consommations', error: err });
  }
});

export default router;