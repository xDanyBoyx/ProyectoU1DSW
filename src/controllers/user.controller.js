<<<<<<< HEAD
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
=======
//IMPORTAMOS EL MODELO DE USUARIOS (ESM)
import UserModel from "../models/user.model.js";

//FUNCIÓN DE VALIDACIONES
// isNew: si true valida campos obligatorios para creación; si false valida sólo los campos presentes
const validateUserData = (data, isNew = true) => {
  const errors = {};

  if ((isNew || data.name !== undefined) && (!data.name || typeof data.name !== "string" || /\d/.test(data.name))) {
    errors.name = "El nombre es requerido y no debe contener números.";
  }

  if ((isNew || data.password !== undefined) && (!data.password || data.password.length < 6)) {
    errors.password = "La contraseña debe tener al menos 6 caracteres.";
  }

  if ((isNew || data.mail !== undefined) && (!data.mail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.mail))) {
    errors.mail = "El formato del correo electrónico es inválido.";
>>>>>>> conexionFirebase
  }

  //DEVOLVEMOS ERRORES SI EXISTEN
  return Object.keys(errors).length > 0 ? errors : null;
};

//GET ALL
<<<<<<< HEAD
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
=======
async function getAll(req, res) {
  const filters = req.query;

  try {
    if (Object.keys(filters).length > 0) {
      const data = await UserModel.filterUser(filters);
      return res.status(200).json(data);
    }

    const data = await UserModel.findAll();
    console.log(data);

    res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

}

//GET ID
async function getById(req, res) {
  try {
    const id = req.params.id;
    const user = await UserModel.findById(id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

//POST
async function add(req, res) {

  const { name, password, mail, role, domicile, rfc } = req.body;

  try {

    const errors = validateUserData(req.body, true);
    if (errors) {
      return res.status(400).json({
        message: "Datos de usuario inválidos",
        errors,
      });
    }

    const existing = await UserModel.findByMail(mail);
    if (existing) {
      return res.status(409).json({ message: "El correo ya está registrado" });
    }

    const newUser = await UserModel.addUser({
      name,
      password,
      mail,
      role,
      domicile,
      rfc,
    });

    res.status(201).json({
      message: "Usuario registrado correctamente",
      user: {
        id: newUser.id,
        name: newUser.name,
        mail: newUser.mail,
        role: newUser.role,
        domicile: newUser.domicile,
        rfc: newUser.rfc,
        billid: newUser.billid
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

}

//PUT
async function update(req, res) {
>>>>>>> conexionFirebase
  const id = req.params.id;

  const errors = validateUserData(req.body, false);
  if (errors) {
    return res.status(400).json({
      message: "Datos de actualización inválidos",
      errors,
    });
  }

<<<<<<< HEAD
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
=======
  try {
    const updatedUser = await UserModel.updateUser(id, req.body);
    if (!updatedUser)
      return res.status(404).json({ error: "Usuario no encontrado" });

    res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

//DELETE
async function remove(req, res) {
  try {
    const id = req.params.id;
    const ok = await UserModel.deleteUser(id);
    if (!ok) return res.status(404).json({ error: "Usuario no encontrado" });
    res.status(200).json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

//EXPORTAMOS LAS FUNCIONES (ESM)
export default {
>>>>>>> conexionFirebase
  getAll,
  getById,
  add,
  update,
<<<<<<< HEAD
  remove,
=======
  remove
>>>>>>> conexionFirebase
};
