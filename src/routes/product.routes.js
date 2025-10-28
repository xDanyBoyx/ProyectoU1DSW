//IMPORTAMOS EXPRESS, CONTROLADOR Y MIDDLEWARE DE AUTENTICACIÓN
const express = require("express");
const controller = require("../controllers/product.controller");
const { authenticate } = require("../middleware/auth.middleware");

const router = express.Router();

//RUTAS CRUD PARA PRODUCTOS (PROTEGIDAS CON JWT)
router.get("/", authenticate, controller.getAll);
router.get("/:id", authenticate, controller.getById);
router.post("/", authenticate, controller.add);
router.put("/:id", authenticate, controller.update);
router.delete("/:id", authenticate, controller.remove);

// EXPORTAMOS EL ROUTER
module.exports = router;
