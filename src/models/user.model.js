//IMPORTAMOS DEPENDENCIAS
const { randomUUID } = require("node:crypto"); //DATOS ALEATORIOS
const bcrypt = require("bcryptjs"); //ENCRIPTAR LEL PASSWORD

//ARREGLO LOCAL PARA ALMACENAR LOS USUARIOS
let users = [
  {
    billid: randomUUID(),
    userid: randomUUID(),
    name: "Administrador",
    password: bcrypt.hashSync("admin123", 10), //ENCRIPTAMOS LA CONTRASEÑA
    mail: "admin@example.com",
    role: "admin",
    domicile: "CDMX, México",
    rfc: "ADM010101XXX",
  },
];

//GET ALL
function findAll() {
  return users;
}

//GET ID
function findById(userid) {
  return users.find((u) => u.userid === userid) || null;
}

//FUNCIÓN PARA BUSCAR USUARIOS POR CORREO
function findByMail(mail) {
  return users.find((u) => u.mail === mail) || null;
}

//POST
function addUser(data) {
  const existingUser = users.find((u) => u.mail === data.mail);
  if (existingUser) return null;

  const nuevoUsuario = {
    billid: randomUUID(),
    userid: randomUUID(),
    name: data.name,
    password: data.password,
    mail: data.mail,
    role: data.role || "cliente",
    domicile: data.domicile || "",
    rfc: data.rfc || "",
  };

  users.push(nuevoUsuario);
  return nuevoUsuario;
}

//PUT
async function updateUser(userid, data) {
  const index = users.findIndex((u) => u.userid === userid);
  if (index === -1) return null;

  const updatedData = { ...data };

  if (data.password) {
    updatedData.password = await bcrypt.hash(data.password, 10);
  }

  users[index] = { ...users[index], ...updatedData };
  return users[index];
}

//DELETE
function deleteUser(userid) {
  const index = users.findIndex((u) => u.userid === userid);
  if (index === -1) return false;

  users.splice(index, 1);
  return true;
}

//FUNCIÓN DE FILTRADO
function filterUser(filter = {}) {
  let result = users;

  if (filter.name) {
    const q = String(filter.name).toLowerCase();
    result = result.filter((u) => u.name.toLowerCase().includes(q));
  }

  if (filter.mail) {
    const q = String(filter.mail).toLowerCase();
    result = result.filter((u) => u.mail.toLowerCase().includes(q));
  }

  if (filter.role) {
    const q = String(filter.role).toLowerCase();
    result = result.filter((u) => u.role.toLowerCase().includes(q));
  }

  if (filter.domicile) {
    const q = String(filter.domicile).toLowerCase();
    result = result.filter((u) => u.domicile.toLowerCase().includes(q));
  }

  if (filter.rfc) {
    const q = String(filter.rfc).toLowerCase();
    result = result.filter((u) => u.rfc.toLowerCase().includes(q));
  }

  return result;
}

//EXPORTAMOS LAS DIVERSAS FUNCIONES
module.exports = {
  findAll,
  findById,
  findByMail,
  addUser,
  updateUser,
  deleteUser,
  filterUser,
};
