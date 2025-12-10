import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "1234";

export function authenticate(req, res, next) {
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
    req.userRole = payload.role;
    req.userMail = payload.mail;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
}

export function authorize(allowedRoles) {
  return (req, res, next) => {
    // Verificamos si el rol del usuario está incluido en los roles permitidos
    if (!req.userRole || !allowedRoles.includes(req.userRole)) {
      return res.status(403).json({ message: "Acceso denegado: No tienes permisos para realizar esta acción." });
    }
    next();
  };
}