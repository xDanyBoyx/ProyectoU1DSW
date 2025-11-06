import express from "express";
import CartController from "../controllers/cart.controller.js";
const router = express.Router();

// ========== RUTAS PARA CARRITO ==========

// Obtener todos los carritos o filtrar con querys (?paid=false, etc.)
router.get("/", CartController.getAll);

// Obtener un carrito por ID
router.get("/:id", CartController.getById);

// Crear un nuevo carrito
router.post("/", CartController.add);

// Actualizar un carrito (por ejemplo, marcar como pagado)
router.put("/:id", CartController.updatePaid);

// Eliminar un carrito
router.delete("/:id", CartController.remove);

// routes/order.routes.js
router.put("/:id/paid", CartController.updatePaid);


// Exportar el router para usarlo en server.js o app.js
export default router;
