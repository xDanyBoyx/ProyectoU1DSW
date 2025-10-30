// IMPORTAMOS EXPRESS Y EL CONTROLADOR (ESM)
import express from "express";
import controller from "../controllers/user.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

// RUTAS CRUD PARA USUARIOS
router.get("/", authenticate, controller.getAll);
router.get("/:id", authenticate, controller.getById);
router.post("/", authenticate, controller.add);
router.put("/:id", authenticate, controller.update);
router.delete("/:id", authenticate, controller.remove);

// EXPORTAMOS EL ROUTER (ESM)
export default router;
