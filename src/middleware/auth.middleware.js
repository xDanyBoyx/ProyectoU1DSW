const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "1234";

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Token no proporcionado o inválido" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.id; // Se puede usar para futuras consultas
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
}

module.exports = { authenticate };
