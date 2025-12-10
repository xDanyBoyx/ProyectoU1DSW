//IMPORTAMOS EXPRESS, CONTROLADOR Y MIDDLEWARE DE AUTENTICACIÓN (ESM)
import express from "express";
import controller from "../controllers/product.controller.js";
import { authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

// --- RUTAS DE LECTURA (Disponibles para Admin y Cliente) ---
router.get("/", controller.getAll);
router.get("/:id", controller.getById);

// --- RUTAS ADMINISTRATIVAS (Solo Admin) ---
router.post("/", authorize(['admin']), controller.add);
router.put("/:id", authorize(['admin']), controller.update);
router.delete("/:id", authorize(['admin']), controller.remove);

// EXPORTAMOS EL ROUTER (ESM)
export default router;
