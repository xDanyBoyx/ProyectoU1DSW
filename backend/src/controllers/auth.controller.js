import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import UserModel from "../models/user.model.js";
import {createFacturapiCustomer} from "../services/facturapiService.js";
import { validateUser } from "../utils/validations.js";

const JWT_SECRET = process.env.JWT_SECRET || "1234";

//FUNCIÓN DE REGISTRO
async function register(req, res) {

  const {
    name,
    password,
    mail,
    role,
    domicile,
    rfc,
    rf, // régimen fiscal
    phone
  } = req.body;

  try {

    const errors = validateUser(req.body, true);
    if (errors) {
      return res.status(400).json({
        errors,
      });
    }

    const existing = await UserModel.findByMail(mail);
    if (existing) {
      return res.status(409).json({ message: "El correo ya está registrado" });
    }

    const customerFacturapi = await createFacturapiCustomer(req.body);
    
    if (!customerFacturapi) {
      return res.status(500).json({ message: "Error al crear usuario" });
    }

    console.log(name,
      password,
      mail,
      role || "cliente", // puede haber usuarios tipo 'admin' || 'cliente'
      domicile,
      rfc,
      rf,
      phone,
      customerFacturapi.id);
    

    const newUser = await UserModel.addUser({
      name,
      password,
      mail,
      role: role || "cliente", // puede haber usuarios tipo 'admin' || 'cliente'
      domicile,
      rfc,
      rf,
      phone,
      id_facturapi: customerFacturapi.id
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
        rf: newUser.rf,
        phone: newUser.phone,
        id_facturapi: newUser.id_facturapi
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

}

// Login de usuario
async function login(req, res) {
  const { mail, password } = req.body;
  if (!mail || !password) {
    return res.status(400).json({ message: "Faltan campos obligatorios" });
  }

  const user = await UserModel.findByMail(mail);

  if (!user) {
    return res.status(401).json({ message: "Credenciales inválidas" }); // no se encontró el usuario por email
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.status(401).json({ message: "Credenciales inválidas" });
  }

  const token = jwt.sign(
    { id: user.userid, mail: user.mail, role: user.role },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.status(200).json({ token });
}

export default { register, login };
