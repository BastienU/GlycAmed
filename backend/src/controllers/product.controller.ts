import { Router, Request, Response } from 'express';
import { ProductService } from '../services/product.service';

const router = Router();
const service = new ProductService();

router.get('/products', async (req: Request, res: Response) => {
  try {
    const products = await service.getProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des produits', error: err });
  }
});

export default router;