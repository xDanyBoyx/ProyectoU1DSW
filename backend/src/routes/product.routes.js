//IMPORTAMOS EXPRESS, CONTROLADOR Y MIDDLEWARE DE AUTENTICACIÓN (ESM)
import express from "express";
import controller from "../controllers/product.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

//RUTAS CRUD PARA PRODUCTOS (PROTEGIDAS CON JWT)
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.add);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

// EXPORTAMOS EL ROUTER (ESM)
export default router;
