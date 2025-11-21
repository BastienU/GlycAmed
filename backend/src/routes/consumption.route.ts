import { Router } from 'express';
import { ConsumptionService } from '../services/consumption.service';
import { ConsumptionModel } from '../models/consumption.model';

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

router.get('/ranking', async (_req, res) => {
  try {
    const ranking = await ConsumptionModel.aggregate([
      {
        $group: {
          _id: "$contributorId",
          totalConsumptions: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $project: {
          email: "$user.email",
          totalConsumptions: 1
        }
      },
      { $sort: { totalConsumptions: -1 } }
    ]);

    res.json(ranking);

  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération du classement', error: err });
  }
});

export default router;