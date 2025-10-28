const express = require("express");

const userRoutes = require("./routes/user.routes");
const productRoutes = require("./routes/product.routes");
const authRoutes = require("./routes/auth.routes"); // 🔹 Rutas de login/register

const { authenticate } = require("./middleware/auth.middleware");

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/users", authenticate, userRoutes);
app.use("/api/products", authenticate, productRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
