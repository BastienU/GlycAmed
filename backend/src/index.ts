import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";

dotenv.config();

const app = express();
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// MongoDB
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("DB connected"))
  .catch((err: unknown) => {
    if (err instanceof Error) console.error(err.message);
  });

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
