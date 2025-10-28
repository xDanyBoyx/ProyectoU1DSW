//IMPORTAMOS EL MODELO DE USUARIOS
const User = require("../models/user.model");

//FUNCIÓN DE VALIDACIONES
const validateUserData = (data, isNew = true) => {
  const errors = {};

  //VALIDAR NOMBRE
  if (isNew || data.name !== undefined) {
    if (!data.name || typeof data.name !== "string" || /\d/.test(data.name)) {
      errors.name = "El nombre es requerido y no debe contener números.";
    }
  }

  //ALIDAR CONTRASEÑA
  if (isNew || data.password !== undefined) {
    if (!data.password || data.password.length < 6) {
      errors.password = "La contraseña debe tener al menos 6 caracteres.";
    }
  }

  //VALIDAR CORREO
  if (isNew || data.mail !== undefined) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.mail || !emailRegex.test(data.mail)) {
      errors.mail = "El formato del correo electrónico es inválido.";
    }
  }

  //DEVOLVEMOS ERRORES SI EXISTEN
  return Object.keys(errors).length > 0 ? errors : null;
};

//GET ALL
function getAll(req, res) {
  const filters = req.query;

  if (Object.keys(filters).length > 0) {
    const data = User.filterUser(filters);
    return res.status(200).json(data);
  }

  const data = User.findAll();
  res.status(200).json(data);
}

//GET ID
function getById(req, res) {
  const id = req.params.id;
  const user = User.findById(id);
  if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
  res.status(200).json(user);
}

//POST
function add(req, res) {
  const { name, password, mail, role, domicile, rfc } = req.body;

  const errors = validateUserData(req.body, true);
  if (errors) {
    return res.status(400).json({
      message: "Datos de usuario inválidos",
      errors,
    });
  }

  const newUser = User.addUser({
    name,
    password,
    mail,
    role,
    domicile,
    rfc,
  });

  res.status(201).json(newUser);
}

//PUT
function update(req, res) {
  const id = req.params.id;

  const errors = validateUserData(req.body, false);
  if (errors) {
    return res.status(400).json({
      message: "Datos de actualización inválidos",
      errors,
    });
  }

  const updatedUser = User.updateUser(id, req.body);
  if (!updatedUser)
    return res.status(404).json({ error: "Usuario no encontrado" });

  res.status(200).json(updatedUser);
}

//DELETE
function remove(req, res) {
  const id = req.params.id;
  const ok = User.deleteUser(id);

  if (!ok) return res.status(404).json({ error: "Usuario no encontrado" });

  res.status(200).json({ message: "Usuario eliminado correctamente" });
}

//EXPORTAMOS LAS FUNCIONES
module.exports = {
  getAll,
  getById,
  add,
  update,
  remove,
};
