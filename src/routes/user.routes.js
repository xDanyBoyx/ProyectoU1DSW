// IMPORTAMOS EXPRESS Y EL CONTROLADOR
const express = require("express");
const controller = require("../controllers/user.controller");

const router = express.Router();

// RUTAS CRUD PARA USUARIOS
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.add);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

// EXPORTAMOS EL ROUTER
module.exports = router;
