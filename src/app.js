import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";
import authRoutes from "./routes/auth.routes.js";
import { authenticate } from "./middleware/auth.middleware.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
