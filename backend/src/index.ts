import express, { Application, Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes";
import consumptionRoutes from "./routes/consumption.routes";
import productRoutes from "./routes/product.routes";

dotenv.config(); // charge les variables du .env

const app: Application = express();

// Vérifier que les variables d'environnement critiques existent
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("❌ MONGO_URI is not defined in .env");
  process.exit(1);
}

// Middleware global
app.use(express.json()); // JSON parsing

// Routes API
app.use("/api/auth", authRoutes);
app.use("/api/consumptions", consumptionRoutes);
app.use("/api/products", productRoutes);

// Health check
app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "OK" });
});

// Middleware global pour les erreurs
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("❌ Global Error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// Connexion à MongoDB et démarrage du serveur
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
