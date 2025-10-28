//IMPORTAMOS DEPENDENCIAS
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

const JWT_SECRET = process.env.JWT_SECRET || "1234";

//FUNCIÓN DE REGISTRO
async function register(req, res) {
  const { name, password, mail, role, domicile, rfc } = req.body;

  if (!name || !password || !mail) {
    return res.status(400).json({ message: "Faltan campos obligatorios" });
  }

  const existing = User.findByMail(mail);
  if (existing) {
    return res.status(409).json({ message: "El correo ya está registrado" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = User.addUser({
    name,
    password: hashedPassword,
    mail,
    role,
    domicile,
    rfc,
  });

  res.status(201).json({
    message: "Usuario registrado correctamente",
    user: {
      userid: newUser.userid,
      name: newUser.name,
      mail: newUser.mail,
    },
  });
}

// Login de usuario
async function login(req, res) {
  const { mail, password } = req.body;
  if (!mail || !password) {
    return res.status(400).json({ message: "Faltan campos obligatorios" });
  }

  const user = User.findByMail(mail);
  if (!user) {
    return res.status(401).json({ message: "Credenciales inválidas" });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ message: "Credenciales inválidas" });
  }

  const token = jwt.sign(
    { id: user.userid, mail: user.mail, role: user.role },
    JWT_SECRET,
    { expiresIn: "15m" }
  );

  res.status(200).json({ token });
}

module.exports = { register, login };
