import { validateUser } from "../utils/validations.js";
import UserModel from "../models/user.model.js";
import { createFacturapiCustomer } from "../services/facturapiService.js";

// GET ALL
async function getAll(req, res) {
  const filters = req.query;

  try {
    if (Object.keys(filters).length > 0) {
      const data = await UserModel.filterUser(filters);
      return res.status(200).json(data);
    }

    const data = await UserModel.findAll();
    res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// GET BY ID
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

// POST
async function add(req, res) {
  const { name, password, mail, role, domicile, rfc, rf, phone } = req.body;

  try {
    const errors = validateUser(req.body);
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    const existing = await UserModel.findByMail(mail);
    if (existing) {
      return res.status(409).json({ message: "El correo ya está registrado" });
    }

    const customerFacturapi = await createFacturapiCustomer(req.body);
    if (!customerFacturapi || !customerFacturapi.id) {
      return res.status(502).json({ message: "Error al crear el cliente en Facturapi" });
    }

    const newUser = await UserModel.addUser({
      name,
      password,
      mail,
      role: role || "cliente",
      domicile,
      rfc,
      rf,
      phone,
      id_facturapi: customerFacturapi.id,
    });

    res.status(201).json({
      message: "Usuario registrado correctamente",
      user: newUser,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// PUT
async function update(req, res) {
  const id = req.params.id;

  const errors = validateUser(req.body);
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const updatedUser = await UserModel.updateUser(id, req.body);
    if (!updatedUser) return res.status(404).json({ error: "Usuario no encontrado" });

    res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// DELETE
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

export default {
  getAll,
  getById,
  add,
  update,
  remove,
};