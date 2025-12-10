// IMPORTAMOS EXPRESS Y EL CONTROLADOR (ESM)
import express from "express";
import controller from "../controllers/user.controller.js";
import { authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authorize(['admin'])); // Solo los usuarios con role = 'admin' pueden operar con los usuarios

// RUTAS CRUD PARA USUARIOS
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.add);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

// EXPORTAMOS EL ROUTER (ESM)
export default router;
