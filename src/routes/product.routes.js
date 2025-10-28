//IMPORTAMOS EXPRESS, CONTROLADOR Y MIDDLEWARE DE AUTENTICACIÓN (ESM)
import express from "express";
import controller from "../controllers/product.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

//RUTAS CRUD PARA PRODUCTOS (PROTEGIDAS CON JWT)
router.get("/", authenticate, controller.getAll);
router.get("/:id", authenticate, controller.getById);
router.post("/", authenticate, controller.add);
router.put("/:id", authenticate, controller.update);
router.delete("/:id", authenticate, controller.remove);

// EXPORTAMOS EL ROUTER (ESM)
export default router;
