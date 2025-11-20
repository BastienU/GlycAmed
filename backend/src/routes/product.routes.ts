import { Router } from "express";
import { ProductService } from "../services/product.service";

const router = Router();
const service = new ProductService();

router.get("/search", async (req, res) => {
    try {
        const name = req.query.name as string;

        if (!name) {
            return res.status(400).json({ message: "Missing name" });
        }

        const url =
            `https://world.openfoodfacts.org/cgi/search.pl?` +
            `search_terms=${encodeURIComponent(name)}` +
            `&search_simple=1` +
            `&action=process` +
            `&json=1` +
            `&page_size=50` +
            `&fields=product_name,code,nutriments`;

        const response = await fetch(url);
        const data = await response.json() as { products?: any[] };

        const products = data.products
            ?.filter((p: any) => p.product_name && p.code)
            ?.map((p: any) => ({
                name: p.product_name,
                barcode: p.code,
            })) ?? [];

        res.json(products);

    } catch (err) {
        res.status(500).json({ message: "OpenFoodFacts error", error: err });
    }
});

export default router;