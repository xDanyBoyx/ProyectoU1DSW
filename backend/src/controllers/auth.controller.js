import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import UserModel from "../models/user.model.js";
import { createFacturapiCustomer } from "../services/facturapiService.js";
import { validateUser } from "../utils/validations.js";

const JWT_SECRET = process.env.JWT_SECRET || "1234";

// Registro de usuario
async function register(req, res) {
  const {
    name,
    password,
    mail,
    role,
    domicile,
    rfc,
    rf, // régimen fiscal
    phone,
  } = req.body;

  try {
    // Validación de campos
    const errors = validateUser(req.body);
    if (errors && Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    // Evitar correos duplicados
    const existing = await UserModel.findByEmail(mail);
    if (existing) {
      return res.status(409).json({ message: "El correo ya está registrado" });
    }

    // Crear cliente en Facturapi
    const customerFacturapi = await createFacturapiCustomer(req.body);
    if (!customerFacturapi) {
      return res.status(500).json({ message: "Error al crear cliente en Facturapi" });
    }

    // Hashear la contraseña antes de guardar
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario en Firestore
    const newUser = await UserModel.addUser({
      name,
      password: hashedPassword,
      mail,
      role: role || "cliente",
      domicile,
      rfc,
      rf,
      phone,
      id_facturapi: customerFacturapi.id,
    });

    // Respuesta al cliente
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
        id_facturapi: newUser.id_facturapi,
      },
    });
  } catch (error) {
    console.error(" Error en register:", error.message);
    return res.status(500).json({ message: error.message });
  }
}

// 🔐 Login de usuario
async function login(req, res) {
  const { mail, password } = req.body;

  try {
    if (!mail || !password) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    // Buscar usuario por email
    const user = await UserModel.findByEmail(mail);
    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // Comparar contraseña
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: user.id, mail: user.mail, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Inicio de sesión exitoso",
      token,
      user: {
        id: user.id,
        name: user.name,
        mail: user.mail,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error en login:", error.message);
    return res.status(500).json({ message: error.message });
  }
}

// Middleware para verificar token
export function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Adjunta los datos del usuario al request
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
}

export default { register, login, verifyToken };
